import { createSupabaseServerClient } from './supabase';
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const JWT_SECRET = process.env.SUPABASE_JWT_SECRET || process.env.supermail_SUPABASE_JWT_SECRET || process.env.JWT_SECRET || 'fallback-jwt-secret-for-development-only';

// Required Gmail API scopes
export const GMAIL_SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

// Encrypt refresh token for storage
export const encryptToken = (token: string): string => {
  return CryptoJS.AES.encrypt(token, JWT_SECRET).toString();
};

// Decrypt refresh token
export const decryptToken = (encryptedToken: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedToken, JWT_SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Generate a JWT for the user
export const generateUserJWT = (userId: string): string => {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Verify a JWT and return the user ID
export const verifyUserJWT = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: string };
    return decoded.sub;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
};

// Exchange authorization code for tokens
export const exchangeCodeForTokens = async (code: string, redirectUri: string) => {
  const tokenUrl = 'https://oauth2.googleapis.com/token';
  
  const params = new URLSearchParams({
    code,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to exchange code: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    throw error;
  }
};

// Refresh access token using refresh token
export const refreshAccessToken = async (refreshToken: string) => {
  const tokenUrl = 'https://oauth2.googleapis.com/token';
  
  const params = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    grant_type: 'refresh_token',
  });

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to refresh token: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

// Get user profile from Google
export const getUserProfile = async (accessToken: string) => {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Store user and token in Supabase
export const storeUserAndToken = async (
  profile: any, 
  refreshToken: string, 
  accessToken: string, 
  expiresAt: Date
) => {
  const supabase = createSupabaseServerClient();
  
  // Encrypt refresh token
  const encryptedRefreshToken = encryptToken(refreshToken);
  
  // Check if user exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('google_id', profile.id)
    .single();
  
  let userId;
  
  if (existingUser) {
    // Update existing user
    userId = existingUser.id;
    await supabase
      .from('users')
      .update({
        email: profile.email,
        name: profile.name,
        avatar_url: profile.picture,
      })
      .eq('id', userId);
  } else {
    // Create new user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        email: profile.email,
        google_id: profile.id,
        name: profile.name,
        avatar_url: profile.picture,
        settings: {},
      })
      .select('id')
      .single();
    
    if (error || !newUser) {
      throw new Error(`Failed to create user: ${error?.message}`);
    }
    
    userId = newUser.id;
  }
  
  // Store token
  const { error: tokenError } = await supabase
    .from('tokens')
    .upsert({
      user_id: userId,
      encrypted_refresh_token: encryptedRefreshToken,
      access_token: accessToken,
      expires_at: expiresAt.toISOString(),
    }, {
      onConflict: 'user_id',
    });
  
  if (tokenError) {
    throw new Error(`Failed to store token: ${tokenError.message}`);
  }
  
  return userId;
};

// Get valid access token for a user
export const getValidAccessToken = async (userId: string) => {
  const supabase = createSupabaseServerClient();
  
  // Get token from database
  const { data: tokenData, error } = await supabase
    .from('tokens')
    .select('encrypted_refresh_token, access_token, expires_at')
    .eq('user_id', userId)
    .single();
  
  if (error || !tokenData) {
    throw new Error('No token found for user');
  }
  
  const now = new Date();
  const expiresAt = new Date(tokenData.expires_at);
  
  // Check if token is still valid
  if (tokenData.access_token && expiresAt > now) {
    return tokenData.access_token;
  }
  
  // Token expired, refresh it
  const refreshToken = decryptToken(tokenData.encrypted_refresh_token);
  const tokenResponse = await refreshAccessToken(refreshToken);
  
  // Calculate new expiration time
  const newExpiresAt = new Date();
  newExpiresAt.setSeconds(newExpiresAt.getSeconds() + tokenResponse.expires_in);
  
  // Update token in database
  await supabase
    .from('tokens')
    .update({
      access_token: tokenResponse.access_token,
      expires_at: newExpiresAt.toISOString(),
    })
    .eq('user_id', userId);
  
  return tokenResponse.access_token;
};
