import { NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('🔍 Environment Debug API called');
    
    // Check all environment variables
    const envStatus = {
      // Clerk Variables
      clerk: {
        publishableKey: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        secretKey: !!process.env.CLERK_SECRET_KEY,
        publishableKeyPreview: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.substring(0, 20) + '...' || 'undefined',
      },
      
      // Google OAuth Variables
      google: {
        clientId: !!process.env.GOOGLE_CLIENT_ID,
        clientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        clientIdPreview: process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + '...' || 'undefined',
      },
      
      // Supabase Variables (with supermail_ prefix)
      supabase: {
        url: !!process.env.supermail_NEXT_PUBLIC_SUPABASE_URL,
        anonKey: !!process.env.supermail_NEXT_PUBLIC_SUPABASE_ANON_KEY,
        serviceKey: !!process.env.supermail_SUPABASE_SERVICE_ROLE_KEY,
        jwtSecret: !!process.env.supermail_SUPABASE_JWT_SECRET,
        urlPreview: process.env.supermail_NEXT_PUBLIC_SUPABASE_URL || 'undefined',
      },
      
      // App Configuration
      app: {
        appUrl: process.env.NEXT_PUBLIC_APP_URL || 'undefined',
        nodeEnv: process.env.NODE_ENV || 'undefined',
        vercelEnv: process.env.VERCEL_ENV || 'undefined',
      },
      
      // Environment Detection
      environment: {
        isPreview: process.env.NODE_ENV === 'preview' || process.env.VERCEL_ENV === 'preview',
        isProduction: process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production',
        isDevelopment: process.env.NODE_ENV === 'development',
      }
    };
    
    console.log('🔍 Environment Status:', JSON.stringify(envStatus, null, 2));
    
    // Test OAuth URL generation
    let oauthTest = null;
    if (process.env.GOOGLE_CLIENT_ID) {
      try {
        const testRedirectUri = 'https://preview.mastermail.live/auth/gmail/callback';
        const scopes = [
          'https://www.googleapis.com/auth/gmail.readonly',
          'https://www.googleapis.com/auth/gmail.modify',
          'https://www.googleapis.com/auth/gmail.send',
          'https://www.googleapis.com/auth/gmail.compose',
          'https://www.googleapis.com/auth/gmail.labels',
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile',
        ];
        
        const oauthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        oauthUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID);
        oauthUrl.searchParams.set('redirect_uri', testRedirectUri);
        oauthUrl.searchParams.set('response_type', 'code');
        oauthUrl.searchParams.set('scope', scopes.join(' '));
        oauthUrl.searchParams.set('access_type', 'offline');
        oauthUrl.searchParams.set('prompt', 'consent');
        
        oauthTest = {
          success: true,
          hasClientId: !!oauthUrl.searchParams.get('client_id'),
          redirectUri: testRedirectUri,
          url: oauthUrl.toString(),
        };
      } catch (error) {
        oauthTest = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      environment: envStatus,
      oauthTest,
      summary: {
        clerkConfigured: envStatus.clerk.publishableKey && envStatus.clerk.secretKey,
        googleConfigured: envStatus.google.clientId && envStatus.google.clientSecret,
        supabaseConfigured: envStatus.supabase.url && envStatus.supabase.anonKey,
        allConfigured: envStatus.clerk.publishableKey && 
                      envStatus.clerk.secretKey && 
                      envStatus.google.clientId && 
                      envStatus.google.clientSecret && 
                      envStatus.supabase.url && 
                      envStatus.supabase.anonKey,
      }
    });
  } catch (error) {
    console.error('❌ Environment debug error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
