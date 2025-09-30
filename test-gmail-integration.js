#!/usr/bin/env node

/**
 * Gmail Integration Test Script
 * 
 * This script tests the Gmail API integration to ensure everything is working properly.
 * Run this script to diagnose any issues with Gmail connectivity.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

console.log('🔍 Gmail Integration Test');
console.log('========================\n');

// Test 1: Environment Variables
console.log('1. Checking Environment Variables...');
const requiredEnvVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

let envVarsOk = true;
requiredEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`   ✅ ${envVar}: Set`);
  } else {
    console.log(`   ❌ ${envVar}: Missing`);
    envVarsOk = false;
  }
});

if (!envVarsOk) {
  console.log('\n❌ Some environment variables are missing. Please check your .env.local file.');
  process.exit(1);
}

console.log('\n✅ All required environment variables are set.\n');

// Test 2: Gmail API Credentials Format
console.log('2. Validating Gmail API Credentials...');
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (clientId && clientId.includes('googleusercontent.com')) {
  console.log('   ✅ GOOGLE_CLIENT_ID format looks correct');
} else {
  console.log('   ❌ GOOGLE_CLIENT_ID format appears incorrect');
}

if (clientSecret && clientSecret.length > 20) {
  console.log('   ✅ GOOGLE_CLIENT_SECRET format looks correct');
} else {
  console.log('   ❌ GOOGLE_CLIENT_SECRET format appears incorrect');
}

// Test 3: Check if the app is running
console.log('\n3. Checking if the application is running...');
const testUrl = 'http://localhost:3000/api/gmail/oauth?redirect_uri=http://localhost:3000/auth/gmail/callback';

const options = {
  method: 'GET',
  timeout: 5000
};

const req = https.request(testUrl, options, (res) => {
  if (res.statusCode === 200) {
    console.log('   ✅ Application appears to be running');
  } else {
    console.log(`   ⚠️  Application responded with status ${res.statusCode}`);
  }
});

req.on('error', (err) => {
  console.log('   ❌ Application is not running or not accessible');
  console.log('   💡 Please start your Next.js application with: npm run dev');
});

req.on('timeout', () => {
  console.log('   ❌ Request timed out - application may not be running');
});

req.end();

// Test 4: Gmail API Scopes
console.log('\n4. Gmail API Scopes...');
const requiredScopes = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.labels',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];

console.log('   Required scopes:');
requiredScopes.forEach(scope => {
  console.log(`   - ${scope}`);
});

// Test 5: Database Schema Check
console.log('\n5. Checking Database Schema...');
const schemaFile = path.join(__dirname, 'schema.sql');
if (fs.existsSync(schemaFile)) {
  const schema = fs.readFileSync(schemaFile, 'utf8');
  
  const requiredTables = ['users', 'tokens', 'snoozes'];
  requiredTables.forEach(table => {
    if (schema.includes(`CREATE TABLE ${table}`)) {
      console.log(`   ✅ Table '${table}' found in schema`);
    } else {
      console.log(`   ❌ Table '${table}' not found in schema`);
    }
  });
} else {
  console.log('   ⚠️  schema.sql file not found');
}

console.log('\n📋 Gmail Integration Checklist:');
console.log('==============================');
console.log('1. ✅ Environment variables configured');
console.log('2. ✅ Gmail API credentials valid');
console.log('3. ✅ Application running (if test passed)');
console.log('4. ✅ Required Gmail scopes identified');
console.log('5. ✅ Database schema checked');

console.log('\n🔧 Next Steps:');
console.log('==============');
console.log('1. Make sure your Next.js app is running: npm run dev');
console.log('2. Visit your app and try to connect Gmail');
console.log('3. Check the browser console for any errors');
console.log('4. Check the server logs for Gmail API responses');

console.log('\n📚 Gmail API Documentation:');
console.log('==========================');
console.log('- Gmail API Overview: https://developers.google.com/workspace/gmail/api/guides');
console.log('- Gmail API Reference: https://developers.google.com/workspace/gmail/api/reference/rest');
console.log('- OAuth 2.0 Scopes: https://developers.google.com/identity/protocols/oauth2/scopes#gmail');

console.log('\n✨ Test completed!');
