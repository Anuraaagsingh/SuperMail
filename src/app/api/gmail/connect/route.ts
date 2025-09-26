import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createSupabaseServiceClient } from '@/lib/supabase';
import { encryptToken } from '@/lib/auth';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Get user from Clerk auth
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { code, redirectUri } = body;

    if (!code || !redirectUri) {
      return NextResponse.json(
        { error: 'Authorization code and redirect URI are required' },
        { status: 400 }
      );
    }

    // Exchange code for tokens
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const params = new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });

    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Google OAuth error:', errorData);
      return NextResponse.json(
        { error: 'Failed to exchange code for tokens' },
        { status: 400 }
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokenData;

    // Get user profile from Google
    const profileResponse = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      }
    );

    if (!profileResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to get user profile' },
        { status: 400 }
      );
    }

    const profile = await profileResponse.json();

    // Store user and token in Supabase
    const supabase = createSupabaseServiceClient();
    
    // Get the user from the users table
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single();

    if (!userData) {
      return NextResponse.json(
        { error: 'User not found. Please register first.' },
        { status: 404 }
      );
    }

    // Update user's google_id
    await supabase
      .from('users')
      .update({ google_id: profile.id })
      .eq('clerk_id', userId);

    // Store the tokens
    const encryptedRefreshToken = encryptToken(refresh_token);
    const expiresAt = new Date(Date.now() + expires_in * 1000);

    await supabase
      .from('tokens')
      .upsert({
        user_id: userData.id,
        encrypted_refresh_token: encryptedRefreshToken,
        access_token: access_token,
        expires_at: expiresAt.toISOString(),
      }, {
        onConflict: 'user_id',
      });

    return NextResponse.json({
      success: true,
      message: 'Gmail connected successfully',
      userId: userData.id,
    });
  } catch (error) {
    console.error('Error connecting Gmail:', error);
    return NextResponse.json(
      { error: 'Failed to connect Gmail' },
      { status: 500 }
    );
  }
}
