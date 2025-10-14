#!/usr/bin/env node

/**
 * Domain Setup Script for MasterMail.live
 * This script helps configure environment variables for different environments
 */

const fs = require('fs');
const path = require('path');

const environments = {
  development: {
    NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
    NODE_ENV: 'development',
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: 'pk_test_your_dev_key_here',
    CLERK_SECRET_KEY: 'sk_test_your_dev_secret_here',
  },
  preview: {
    NEXT_PUBLIC_APP_URL: 'https://preview.mastermail.live',
    NODE_ENV: 'preview',
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: 'pk_test_your_preview_key_here',
    CLERK_SECRET_KEY: 'sk_test_your_preview_secret_here',
  },
  production: {
    NEXT_PUBLIC_APP_URL: 'https://mastermail.live',
    NODE_ENV: 'production',
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: 'pk_live_your_production_key_here',
    CLERK_SECRET_KEY: 'sk_live_your_production_secret_here',
  }
};

const commonVariables = {
  // Supabase (replace with your actual values)
  NEXT_PUBLIC_SUPABASE_URL: 'https://your-project.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'your_supabase_anon_key',
  SUPABASE_SERVICE_ROLE_KEY: 'your_supabase_service_role_key',
  
  // Google OAuth (replace with your actual values)
  GOOGLE_CLIENT_ID: 'your_google_client_id',
  GOOGLE_CLIENT_SECRET: 'your_google_client_secret',
  
  // JWT Secret
  JWT_SECRET: 'your_jwt_secret_here',
};

function generateEnvFile(environment) {
  const envConfig = environments[environment];
  if (!envConfig) {
    console.error(`❌ Unknown environment: ${environment}`);
    process.exit(1);
  }

  const envContent = [
    '# ===========================================',
    `# SuperMail ${environment.toUpperCase()} Environment`,
    '# ===========================================',
    '',
    '# Domain Configuration',
    `NEXT_PUBLIC_APP_URL=${envConfig.NEXT_PUBLIC_APP_URL}`,
    `NODE_ENV=${envConfig.NODE_ENV}`,
    '',
    '# Clerk Authentication',
    `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${envConfig.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}`,
    `CLERK_SECRET_KEY=${envConfig.CLERK_SECRET_KEY}`,
    '',
    '# Supabase Database',
    `NEXT_PUBLIC_SUPABASE_URL=${commonVariables.NEXT_PUBLIC_SUPABASE_URL}`,
    `NEXT_PUBLIC_SUPABASE_ANON_KEY=${commonVariables.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    `SUPABASE_SERVICE_ROLE_KEY=${commonVariables.SUPABASE_SERVICE_ROLE_KEY}`,
    '',
    '# Google OAuth & Gmail API',
    `GOOGLE_CLIENT_ID=${commonVariables.GOOGLE_CLIENT_ID}`,
    `GOOGLE_CLIENT_SECRET=${commonVariables.GOOGLE_CLIENT_SECRET}`,
    '',
    '# JWT Secret',
    `JWT_SECRET=${commonVariables.JWT_SECRET}`,
    '',
    '# ===========================================',
    '# IMPORTANT: Replace placeholder values above',
    '# with your actual credentials!',
    '# ===========================================',
  ].join('\n');

  const fileName = environment === 'development' ? '.env.local' : `.env.${environment}`;
  const filePath = path.join(process.cwd(), fileName);

  fs.writeFileSync(filePath, envContent);
  console.log(`✅ Generated ${fileName} for ${environment} environment`);
  console.log(`📝 Please update the placeholder values in ${fileName}`);
}

function showUsage() {
  console.log(`
🚀 MasterMail.live Domain Setup Script

Usage:
  node setup-domain.js <environment>

Environments:
  development  - Local development (generates .env.local)
  preview      - Preview environment (generates .env.preview)
  production   - Production environment (generates .env.production)

Examples:
  node setup-domain.js development
  node setup-domain.js preview
  node setup-domain.js production

📋 Next Steps:
1. Run this script for your desired environment
2. Update the generated .env file with your actual credentials
3. For Vercel deployment, set these variables in your Vercel dashboard
4. Follow the DOMAIN_SETUP_GUIDE.md for complete configuration

🔗 Important URLs to configure:
- Clerk Dashboard: https://clerk.com/dashboard
- Google Cloud Console: https://console.cloud.google.com/
- Vercel Dashboard: https://vercel.com/dashboard
`);
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showUsage();
    return;
  }

  const environment = args[0].toLowerCase();
  
  if (!environments[environment]) {
    console.error(`❌ Invalid environment: ${environment}`);
    showUsage();
    process.exit(1);
  }

  console.log(`🔧 Setting up ${environment} environment...`);
  generateEnvFile(environment);
  
  console.log(`
🎉 Environment setup complete!

📋 Next steps:
1. Update the generated .env file with your actual credentials
2. For Vercel deployment, add these variables to your Vercel dashboard
3. Configure your domains in Clerk and Google Cloud Console
4. Follow the DOMAIN_SETUP_GUIDE.md for complete setup

🔗 Quick Links:
- Clerk Dashboard: https://clerk.com/dashboard
- Google Cloud Console: https://console.cloud.google.com/
- Vercel Dashboard: https://vercel.com/dashboard
`);
}

if (require.main === module) {
  main();
}

module.exports = { generateEnvFile, environments, commonVariables };
