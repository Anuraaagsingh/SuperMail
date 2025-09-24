#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 SuperMail Environment Setup\n');

const envPath = path.join(__dirname, '.env.local');
const examplePath = path.join(__dirname, '.env.example');

// Check if .env.local exists
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found');
  console.log('📝 Creating .env.local from template...\n');
  
  const template = `# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Google OAuth Configuration
# Get these from Google Cloud Console: https://console.cloud.google.com/
# 1. Go to Google Cloud Console
# 2. Create a new project or select existing one
# 3. Enable Gmail API
# 4. Go to "Credentials" > "Create Credentials" > "OAuth 2.0 Client IDs"
# 5. Set application type to "Web application"
# 6. Add authorized redirect URIs:
#    - http://localhost:3000/auth/callback (for local development)
#    - https://your-domain.com/auth/callback (for production)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Supabase Configuration (REQUIRED for Google OAuth)
# Get these from your Supabase project dashboard: https://supabase.com/dashboard
# 1. Create a new Supabase project
# 2. Go to Settings > API
# 3. Copy the Project URL and anon public key
# 4. Go to Authentication > Providers
# 5. Enable Google provider and add your Google OAuth credentials
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
`;

  fs.writeFileSync(envPath, template);
  console.log('✅ Created .env.local file');
} else {
  console.log('✅ .env.local file exists');
}

// Check current configuration
console.log('\n📋 Current Configuration Status:\n');

const envContent = fs.readFileSync(envPath, 'utf8');

const checks = [
  {
    name: 'JWT Secret',
    pattern: /JWT_SECRET=(?!your-super-secret-jwt-key-change-this-in-production)/,
    required: true
  },
  {
    name: 'Google Client ID',
    pattern: /GOOGLE_CLIENT_ID=(?!your-google-client-id)/,
    required: false
  },
  {
    name: 'Google Client Secret',
    pattern: /GOOGLE_CLIENT_SECRET=(?!your-google-client-secret)/,
    required: false
  },
  {
    name: 'Supabase URL',
    pattern: /supermail_NEXT_PUBLIC_SUPABASE_URL=(?!your-supabase-project-url)/,
    required: false
  },
  {
    name: 'Supabase Anon Key',
    pattern: /supermail_NEXT_PUBLIC_SUPABASE_ANON_KEY=(?!your-supabase-anon-key)/,
    required: false
  },
  {
    name: 'Supabase Service Key',
    pattern: /supermail_SUPABASE_SERVICE_ROLE_KEY=(?!your-supabase-service-role-key)/,
    required: false
  }
];

checks.forEach(check => {
  const isConfigured = check.pattern.test(envContent);
  const status = isConfigured ? '✅' : '❌';
  const required = check.required ? ' (Required)' : ' (Optional)';
  console.log(`${status} ${check.name}${required}`);
});

console.log('\n📖 Next Steps:');
console.log('1. For Demo Authentication: You can use the app immediately');
console.log('2. For Google OAuth: Follow the instructions in GOOGLE_OAUTH_SETUP.md');
console.log('3. Update your .env.local file with actual values');
console.log('4. Restart your development server: npm run dev\n');

console.log('🚀 Ready to start SuperMail!');
