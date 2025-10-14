#!/usr/bin/env node

/**
 * Preview Environment Debug Script
 * This script helps debug environment variable issues in preview deployments
 */

console.log('🔍 Preview Environment Debug Script\n');

// Check all environment variables
console.log('📋 Environment Variables Status:');
console.log('');

// Clerk Variables
console.log('🔐 Clerk Authentication:');
console.log('  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:', process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? '✅ Set' : '❌ NOT SET');
console.log('  CLERK_SECRET_KEY:', process.env.CLERK_SECRET_KEY ? '✅ Set' : '❌ NOT SET');
console.log('');

// Google OAuth Variables
console.log('📧 Google OAuth:');
console.log('  GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ NOT SET');
console.log('  GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ NOT SET');
console.log('');

// Supabase Variables (with supermail_ prefix)
console.log('🗄️ Supabase Database (with supermail_ prefix):');
console.log('  supermail_NEXT_PUBLIC_SUPABASE_URL:', process.env.supermail_NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ NOT SET');
console.log('  supermail_NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.supermail_NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ NOT SET');
console.log('  supermail_SUPABASE_SERVICE_ROLE_KEY:', process.env.supermail_SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ NOT SET');
console.log('  supermail_SUPABASE_JWT_SECRET:', process.env.supermail_SUPABASE_JWT_SECRET ? '✅ Set' : '❌ NOT SET');
console.log('');

// App Configuration
console.log('⚙️ App Configuration:');
console.log('  NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL || '❌ NOT SET');
console.log('  NODE_ENV:', process.env.NODE_ENV || '❌ NOT SET');
console.log('');

// Check if we're in preview environment
const isPreview = process.env.NODE_ENV === 'preview' || process.env.VERCEL_ENV === 'preview';
console.log('🌐 Environment Detection:');
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  VERCEL_ENV:', process.env.VERCEL_ENV);
console.log('  Is Preview Environment:', isPreview ? '✅ Yes' : '❌ No');
console.log('');

// Test Supabase connection
if (process.env.supermail_NEXT_PUBLIC_SUPABASE_URL && process.env.supermail_NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.log('🔗 Supabase Configuration:');
  console.log('  URL:', process.env.supermail_NEXT_PUBLIC_SUPABASE_URL);
  console.log('  Anon Key:', process.env.supermail_NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20) + '...');
  console.log('  Service Key:', process.env.supermail_SUPABASE_SERVICE_ROLE_KEY ? 'Present' : 'Missing');
} else {
  console.log('❌ Supabase configuration incomplete');
}

console.log('');

// Test Google OAuth configuration
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  console.log('🔗 Google OAuth Configuration:');
  console.log('  Client ID:', process.env.GOOGLE_CLIENT_ID.substring(0, 20) + '...');
  console.log('  Client Secret:', process.env.GOOGLE_CLIENT_SECRET.substring(0, 10) + '...');
  
  // Generate test OAuth URL
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
  
  console.log('  Test OAuth URL:', oauthUrl.toString());
  console.log('  OAuth URL has client_id:', oauthUrl.searchParams.get('client_id') ? '✅ Yes' : '❌ No');
} else {
  console.log('❌ Google OAuth configuration incomplete');
}

console.log('');

// Test Clerk configuration
if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY) {
  console.log('🔗 Clerk Configuration:');
  console.log('  Publishable Key:', process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.substring(0, 20) + '...');
  console.log('  Secret Key:', process.env.CLERK_SECRET_KEY.substring(0, 10) + '...');
} else {
  console.log('❌ Clerk configuration incomplete');
}

console.log('\n🔧 Troubleshooting Steps:');
console.log('1. If variables are missing, check Vercel dashboard');
console.log('2. Make sure variables are enabled for Preview environment');
console.log('3. Redeploy your preview branch');
console.log('4. Check Vercel deployment logs for errors');
console.log('5. Test the OAuth API endpoint: https://preview.mastermail.live/api/gmail/oauth');

console.log('\n📞 If you still have issues:');
console.log('- Check Vercel deployment logs');
console.log('- Verify all environment variables are set correctly');
console.log('- Make sure the preview deployment is using the latest code');
console.log('- Test with a fresh browser session');
