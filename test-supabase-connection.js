#!/usr/bin/env node

/**
 * Supabase Connection Test Script
 * This script tests the Supabase connection and environment variables
 */

const { createClient } = require('@supabase/supabase-js');

console.log('🔍 Supabase Connection Test\n');

// Check environment variables
console.log('📋 Environment Variables Check:');
console.log('');

// Supabase Variables (with supermail_ prefix)
console.log('🗄️ Supabase Configuration:');
console.log('  supermail_NEXT_PUBLIC_SUPABASE_URL:', process.env.supermail_NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ NOT SET');
console.log('  supermail_NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.supermail_NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ NOT SET');
console.log('  supermail_SUPABASE_SERVICE_ROLE_KEY:', process.env.supermail_SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ NOT SET');
console.log('');

// Fallback variables
console.log('🔄 Fallback Variables:');
console.log('  NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ NOT SET');
console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ NOT SET');
console.log('  SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ NOT SET');
console.log('');

// Get the actual values
const supabaseUrl = process.env.supermail_NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.supermail_NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.supermail_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔗 Configuration Values:');
if (supabaseUrl) {
  console.log('  URL:', supabaseUrl);
} else {
  console.log('  URL: ❌ Not configured');
}

if (supabaseAnonKey) {
  console.log('  Anon Key:', supabaseAnonKey.substring(0, 20) + '...');
} else {
  console.log('  Anon Key: ❌ Not configured');
}

if (supabaseServiceKey) {
  console.log('  Service Key:', supabaseServiceKey.substring(0, 20) + '...');
} else {
  console.log('  Service Key: ❌ Not configured');
}

console.log('');

// Test Supabase connection
if (supabaseUrl && supabaseServiceKey) {
  console.log('🧪 Testing Supabase Connection...');
  
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    console.log('  ✅ Supabase client created successfully');
    
    // Test a simple query
    supabase
      .from('users')
      .select('count')
      .limit(1)
      .then(({ data, error }) => {
        if (error) {
          console.log('  ❌ Query failed:', error.message);
          console.log('  Error code:', error.code);
          console.log('  Error hint:', error.hint);
        } else {
          console.log('  ✅ Query successful');
          console.log('  Data:', data);
        }
      })
      .catch((err) => {
        console.log('  ❌ Connection failed:', err.message);
      });
      
  } catch (error) {
    console.log('  ❌ Failed to create Supabase client:', error.message);
  }
} else {
  console.log('❌ Cannot test connection - missing environment variables');
}

console.log('\n🔧 Troubleshooting Steps:');
console.log('1. Check that environment variables are set in Vercel');
console.log('2. Verify variables are enabled for Preview environment');
console.log('3. Check that Supabase project is active');
console.log('4. Verify the URL and keys are correct');
console.log('5. Test the debug API endpoint: https://preview.mastermail.live/api/debug/supabase');

console.log('\n📞 If connection fails:');
console.log('- Check Vercel deployment logs');
console.log('- Verify Supabase project status');
console.log('- Test with a fresh deployment');
console.log('- Check browser network tab for API calls');
