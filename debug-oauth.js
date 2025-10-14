#!/usr/bin/env node

/**
 * OAuth Debug Script for SuperMail
 * This script helps debug OAuth configuration issues
 */

console.log('🔍 SuperMail OAuth Debug Script\n');

// Check environment variables
console.log('📋 Environment Variables Check:');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ NOT SET');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ NOT SET');
console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL || '❌ NOT SET');
console.log('');

// Check if credentials look valid
if (process.env.GOOGLE_CLIENT_ID) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  console.log('🔍 GOOGLE_CLIENT_ID Analysis:');
  console.log('  Length:', clientId.length);
  console.log('  Starts with:', clientId.substring(0, 10) + '...');
  console.log('  Contains .apps.googleusercontent.com:', clientId.includes('.apps.googleusercontent.com'));
  console.log('  Contains .googleusercontent.com:', clientId.includes('.googleusercontent.com'));
  
  if (clientId.includes('.apps.googleusercontent.com') || clientId.includes('.googleusercontent.com')) {
    console.log('  ✅ Format looks correct');
  } else {
    console.log('  ⚠️  Format might be incorrect - should contain .apps.googleusercontent.com');
  }
} else {
  console.log('❌ GOOGLE_CLIENT_ID is not set!');
}

console.log('');

// Generate test OAuth URL
if (process.env.GOOGLE_CLIENT_ID) {
  console.log('🔗 Test OAuth URL Generation:');
  
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
  oauthUrl.searchParams.set('state', 'test-state');
  oauthUrl.searchParams.set('include_granted_scopes', 'true');
  
  console.log('  Generated OAuth URL:');
  console.log('  ' + oauthUrl.toString());
  console.log('');
  
  // Check each parameter
  console.log('  OAuth Parameters:');
  console.log('    client_id:', oauthUrl.searchParams.get('client_id') ? '✅ Present' : '❌ Missing');
  console.log('    redirect_uri:', oauthUrl.searchParams.get('redirect_uri') ? '✅ Present' : '❌ Missing');
  console.log('    response_type:', oauthUrl.searchParams.get('response_type') ? '✅ Present' : '❌ Missing');
  console.log('    scope:', oauthUrl.searchParams.get('scope') ? '✅ Present' : '❌ Missing');
  console.log('    access_type:', oauthUrl.searchParams.get('access_type') ? '✅ Present' : '❌ Missing');
  console.log('    prompt:', oauthUrl.searchParams.get('prompt') ? '✅ Present' : '❌ Missing');
  console.log('    state:', oauthUrl.searchParams.get('state') ? '✅ Present' : '❌ Missing');
} else {
  console.log('❌ Cannot generate OAuth URL - GOOGLE_CLIENT_ID is missing');
}

console.log('\n🔧 Troubleshooting Steps:');
console.log('1. Verify environment variables are set in Vercel dashboard');
console.log('2. Check that variables are enabled for Preview environment');
console.log('3. Redeploy your preview branch after setting variables');
console.log('4. Check Vercel deployment logs for any errors');
console.log('5. Verify Google Cloud Console OAuth configuration');

console.log('\n📝 Required Google Cloud Console Configuration:');
console.log('Authorized Redirect URIs:');
console.log('  https://preview.mastermail.live/auth/gmail/callback');
console.log('  https://preview.mastermail.live/api/gmail/oauth');
console.log('');
console.log('Authorized JavaScript Origins:');
console.log('  https://preview.mastermail.live');

console.log('\n🚨 Common Issues:');
console.log('- Environment variables not set in Vercel');
console.log('- Variables not enabled for Preview environment');
console.log('- Incorrect Google Client ID format');
console.log('- Missing redirect URI in Google Console');
console.log('- Deployment not picking up new environment variables');
