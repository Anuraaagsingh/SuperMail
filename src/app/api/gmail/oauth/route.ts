import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/lib/supabase';
import { GMAIL_SCOPES } from '@/lib/auth';
import { getGmailCallbackURL } from '@/lib/urls';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('🔗 Gmail OAuth API called');
    console.log('🔗 Request URL:', request.url);
    console.log('🔗 Environment check:');
    console.log('  GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Set (' + process.env.GOOGLE_CLIENT_ID.substring(0, 20) + '...)' : 'NOT SET');
    console.log('  GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'NOT SET');
    
    // Get user from Supabase auth
    const supabase = createSupabaseServiceClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.log('❌ No user ID from Supabase auth');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('✅ User ID from Supabase:', user.id);

    // Check if Gmail API credentials are configured
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.log('❌ Gmail API credentials not configured');
      return NextResponse.json(
        { 
          error: 'Gmail not configured',
          message: 'Gmail API credentials are not configured. Please set up Google OAuth credentials to connect Gmail.',
          debug: {
            hasClientId: !!process.env.GOOGLE_CLIENT_ID,
            hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
            clientIdPreview: process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.substring(0, 20) + '...' : 'undefined'
          }
        },
        { status: 503 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const redirectUri = searchParams.get('redirect_uri') || getGmailCallbackURL();
    
    console.log('🔗 Redirect URI:', redirectUri);
    console.log('🔗 Gmail scopes:', GMAIL_SCOPES);

    // Build Google OAuth URL
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID!);
    googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
    googleAuthUrl.searchParams.set('response_type', 'code');
    googleAuthUrl.searchParams.set('scope', GMAIL_SCOPES.join(' '));
    googleAuthUrl.searchParams.set('access_type', 'offline');
    googleAuthUrl.searchParams.set('prompt', 'consent');
    googleAuthUrl.searchParams.set('state', user.id); // Pass Supabase user ID as state
    googleAuthUrl.searchParams.set('include_granted_scopes', 'true');

    const finalUrl = googleAuthUrl.toString();
    console.log('🔗 Generated OAuth URL:', finalUrl);
    console.log('🔗 OAuth URL parameters:');
    console.log('  client_id:', googleAuthUrl.searchParams.get('client_id') ? 'Present' : 'Missing');
    console.log('  redirect_uri:', googleAuthUrl.searchParams.get('redirect_uri'));
    console.log('  response_type:', googleAuthUrl.searchParams.get('response_type'));
    console.log('  scope:', googleAuthUrl.searchParams.get('scope')?.substring(0, 50) + '...');

    return NextResponse.json({
      authUrl: finalUrl,
      debug: {
        hasClientId: !!process.env.GOOGLE_CLIENT_ID,
        redirectUri,
        scopes: GMAIL_SCOPES,
        urlGenerated: true
      }
    });
  } catch (error) {
    console.error('❌ Error generating OAuth URL:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate OAuth URL',
        debug: {
          error: error instanceof Error ? error.message : 'Unknown error',
          hasClientId: !!process.env.GOOGLE_CLIENT_ID,
          hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET
        }
      },
      { status: 500 }
    );
  }
}
