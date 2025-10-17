import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/lib/supabase';
import { GMAIL_SCOPES } from '@/lib/auth';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get user from Supabase auth
    const supabase = createSupabaseServiceClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if Gmail API credentials are configured
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return NextResponse.json(
        { 
          error: 'Gmail not configured',
          message: 'Gmail API credentials are not configured. Please set up Google OAuth credentials to connect Gmail.'
        },
        { status: 503 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const redirectUri = searchParams.get('redirect_uri');

    if (!redirectUri) {
      return NextResponse.json(
        { error: 'Redirect URI is required' },
        { status: 400 }
      );
    }

    // Build Google OAuth URL
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID!);
    googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
    googleAuthUrl.searchParams.set('response_type', 'code');
    googleAuthUrl.searchParams.set('scope', GMAIL_SCOPES.join(' '));
    googleAuthUrl.searchParams.set('access_type', 'offline');
    googleAuthUrl.searchParams.set('prompt', 'consent');
    googleAuthUrl.searchParams.set('state', user.id); // Pass Supabase user ID as state

    return NextResponse.json({
      authUrl: googleAuthUrl.toString(),
    });
  } catch (error) {
    console.error('Error generating OAuth URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate OAuth URL' },
      { status: 500 }
    );
  }
}
