#!/usr/bin/env node

/**
 * OAuth Configuration Checker for SuperMail
 * This script helps diagnose OAuth configuration issues
 */

const https = require('https');
const { URL } = require('url');

console.log('🔍 SuperMail OAuth Configuration Checker\n');

// Check environment variables
console.log('📋 Environment Variables:');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Not set');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Not set');
console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL || '❌ Not set');
console.log('');

// Check if credentials look valid
if (process.env.GOOGLE_CLIENT_ID) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (clientId.startsWith('48480') || clientId.includes('googleusercontent.com')) {
    console.log('✅ GOOGLE_CLIENT_ID format looks correct');
  } else {
    console.log('⚠️  GOOGLE_CLIENT_ID format might be incorrect');
  }
}

if (process.env.GOOGLE_CLIENT_SECRET) {
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (clientSecret.startsWith('GOCSP') || clientSecret.length > 20) {
    console.log('✅ GOOGLE_CLIENT_SECRET format looks correct');
  } else {
    console.log('⚠️  GOOGLE_CLIENT_SECRET format might be incorrect');
  }
}

console.log('\n🌐 Required Google Cloud Console Configuration:');
console.log('');

console.log('📝 Authorized Redirect URIs (add these to Google Console):');
console.log('   https://mastermail.live/auth/gmail/callback');
console.log('   https://mastermail.live/api/gmail/oauth');
console.log('   https://preview.mastermail.live/auth/gmail/callback');
console.log('   https://preview.mastermail.live/api/gmail/oauth');
console.log('   http://localhost:3000/auth/gmail/callback');
console.log('   http://localhost:3000/api/gmail/oauth');

console.log('\n📝 Authorized JavaScript Origins (add these to Google Console):');
console.log('   https://mastermail.live');
console.log('   https://preview.mastermail.live');
console.log('   http://localhost:3000');

console.log('\n🔧 Vercel Environment Variables:');
console.log('Make sure these are set in your Vercel dashboard:');
console.log('   GOOGLE_CLIENT_ID=your_actual_google_client_id');
console.log('   GOOGLE_CLIENT_SECRET=your_actual_google_client_secret');

console.log('\n🚀 Next Steps:');
console.log('1. Update Google Cloud Console with the redirect URIs above');
console.log('2. Set environment variables in Vercel dashboard');
console.log('3. Redeploy your preview branch');
console.log('4. Test Gmail OAuth on preview.mastermail.live');

console.log('\n📞 If you still have issues:');
console.log('- Check Vercel deployment logs');
console.log('- Verify the domain is properly configured in Vercel');
console.log('- Make sure SSL certificate is active');
console.log('- Test with a fresh browser session');
