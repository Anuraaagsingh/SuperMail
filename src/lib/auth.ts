import { createSupabaseServerClient } from './supabase';
import CryptoJS from 'crypto-js';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const JWT_SECRET = process.env.supermail_SUPABASE_JWT_SECRET || process.env.SUPABASE_JWT_SECRET || process.env.JWT_SECRET || 'fallback-jwt-secret-for-development-only';

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