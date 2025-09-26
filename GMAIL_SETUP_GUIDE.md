# Gmail API Setup Guide for SuperMail

## Current Issue
The Gmail integration is not working because the Google OAuth credentials are not configured. This guide will help you set up Gmail API integration.

## Quick Fix: Use Demo Mode
If you want to test the app immediately without setting up Gmail API, the app will automatically fall back to demo mode and show sample emails.

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Gmail API**
   - **Google+ API** (if available)

## Step 2: Configure OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Set application type to **Web application**
4. Add these authorized redirect URIs:
   - `http://localhost:3000/auth/gmail/callback` (for local development)
   - `https://your-domain.com/auth/gmail/callback` (for production)
5. Copy the **Client ID** and **Client Secret**

## Step 3: Set Up Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-actual-google-client-id
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret

# JWT Secret for token encryption
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Supabase Configuration (if using Supabase)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
SUPABASE_JWT_SECRET=your-supabase-jwt-secret
```

## Step 4: Database Setup

Make sure your database has the required tables. Run this SQL in your database:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  clerk_id TEXT UNIQUE,
  google_id TEXT UNIQUE,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  settings JSONB DEFAULT '{}'::jsonb
);

-- Create tokens table for OAuth tokens
CREATE TABLE IF NOT EXISTS tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  encrypted_refresh_token TEXT,
  access_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Step 5: Test the Setup

1. Restart your development server: `npm run dev`
2. Go to `/mail/inbox`
3. Click "Connect Gmail" button
4. Complete the OAuth flow
5. You should see your real Gmail emails

## Troubleshooting

### Common Issues:

1. **"Gmail API credentials are not configured"**
   - Make sure you've set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in your `.env.local`
   - Restart your development server after updating environment variables

2. **"Invalid redirect URI"**
   - Make sure your redirect URI in Google Console matches exactly: `http://localhost:3000/auth/gmail/callback`
   - Check that there are no extra spaces or characters

3. **"Client ID not found"**
   - Verify your Google Client ID is correct
   - Make sure the OAuth consent screen is configured

4. **"Database errors"**
   - Make sure you've run the SQL schema setup
   - Check that your database connection is working

### Debug Steps:

1. Check browser console for errors
2. Check your environment variables: `console.log(process.env.GOOGLE_CLIENT_ID)`
3. Verify Google Cloud project has Gmail API enabled
4. Test OAuth flow step by step

## Production Deployment

For production deployment:

1. Add all environment variables in your deployment platform (Vercel, Netlify, etc.)
2. Update the redirect URIs in Google Console to include your production domain
3. Make sure your production domain is added to authorized origins

## Alternative: Demo Mode

If you don't want to set up Gmail API, the app will automatically use demo mode and show sample emails. This is perfect for testing the UI and functionality without real Gmail integration.

## Need Help?

If you're still having issues:

1. Check the browser console for detailed error messages
2. Verify all environment variables are set correctly
3. Make sure your Google Cloud project is active
4. Test with a simple OAuth flow first

The app is designed to gracefully fall back to demo mode when Gmail API is not configured, so you can still test all the features!
