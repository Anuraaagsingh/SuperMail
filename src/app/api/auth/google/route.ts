import { NextRequest, NextResponse } from 'next/server';
import { 
  exchangeCodeForTokens, 
  getUserProfile, 
  storeUserAndToken, 
  generateUserJWT,
  GMAIL_SCOPES
} from '@/lib/auth';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { code, redirectUri } = await request.json();
    
    if (!code || !redirectUri) {
      return NextResponse.json(
        { error: 'Missing required parameters' }, 
        { status: 400 }
      );
    }

    // Exchange authorization code for tokens
    const tokenResponse = await exchangeCodeForTokens(code, redirectUri);
    
    if (!tokenResponse.access_token || !tokenResponse.refresh_token) {
      return NextResponse.json(
        { error: 'Invalid token response' }, 
        { status: 400 }
      );
    }

    // Get user profile
    const profile = await getUserProfile(tokenResponse.access_token);
    
    // Calculate token expiration
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + tokenResponse.expires_in);
    
    // Store user and token in database
    const userId = await storeUserAndToken(
      profile, 
      tokenResponse.refresh_token, 
      tokenResponse.access_token, 
      expiresAt
    );
    
    // Generate JWT for client
    const userJwt = generateUserJWT(userId);
    
    return NextResponse.json({
      token: userJwt,
      user: {
        id: userId,
        email: profile.email,
        name: profile.name,
        picture: profile.picture,
      }
    });
  } catch (error) {
    console.error('OAuth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' }, 
      { status: 500 }
    );
  }
}

// Helper endpoint to get the authorization URL
export async function GET(request: NextRequest) {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  
  if (!GOOGLE_CLIENT_ID) {
    return NextResponse.json(
      { error: 'Missing Google client ID' }, 
      { status: 500 }
    );
  }
  
  const scopes = encodeURIComponent(GMAIL_SCOPES.join(' '));
  const origin = request.headers.get('origin') || request.headers.get('host');
  const protocol = request.headers.get('x-forwarded-proto') || 'http';
  const baseUrl = `${protocol}://${origin}`;
  const redirectUri = encodeURIComponent(`${baseUrl}/auth/callback`);
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes}&access_type=offline&prompt=consent`;
  
  return NextResponse.json({ authUrl });
}
