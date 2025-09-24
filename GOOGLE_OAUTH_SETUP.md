# Google OAuth Setup Guide for SuperMail

## Current Issue
The Gmail login is failing because the application is using placeholder Supabase URLs and Google OAuth credentials. This guide will help you set up the proper configuration.

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready (usually takes 2-3 minutes)
3. Go to Settings > API in your Supabase dashboard
4. Copy the following values:
   - **Project URL** (looks like: `https://your-project-ref.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

## Step 2: Configure Google OAuth

### In Google Cloud Console:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Gmail API
   - Google+ API (if available)
4. Go to "Credentials" > "Create Credentials" > "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add these authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (for local development)
   - `https://your-project-ref.supabase.co/auth/v1/callback` (for Supabase)
   - `https://your-domain.com/auth/callback` (for production)
7. Copy the **Client ID** and **Client Secret**

### In Supabase Dashboard:
1. Go to Authentication > Providers in your Supabase dashboard
2. Enable Google provider
3. Add your Google Client ID and Client Secret
4. The redirect URL should be: `https://your-project-ref.supabase.co/auth/v1/callback`

## Step 3: Update Environment Variables

Update your `.env.local` file with the actual values:

```bash
# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-actual-google-client-id
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret

# Supabase Configuration (REQUIRED - using supermail_ prefix to match Vercel)
supermail_NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
supermail_NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-supabase-anon-key
supermail_SUPABASE_SERVICE_ROLE_KEY=your-actual-supabase-service-role-key
supermail_SUPABASE_JWT_SECRET=your-actual-supabase-jwt-secret

# Alternative naming (for compatibility)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-actual-supabase-service-role-key
```

## Step 4: Database Setup

Run this SQL in your Supabase SQL editor:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
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
  encrypted_refresh_token TEXT NOT NULL,
  access_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create other required tables
CREATE TABLE IF NOT EXISTS snoozes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message_id TEXT NOT NULL,
  snoozed_until TIMESTAMP WITH TIME ZONE NOT NULL,
  original_labels JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scheduled_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  draft_id TEXT NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  recipients_to TEXT[] NOT NULL,
  recipients_cc TEXT[],
  recipients_bcc TEXT[],
  attachments_meta JSONB,
  last_saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS actions_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE snoozes ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own tokens" ON tokens
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own snoozes" ON snoozes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own scheduled sends" ON scheduled_sends
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own drafts" ON drafts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own actions log" ON actions_log
  FOR ALL USING (auth.uid() = user_id);
```

## Step 5: Test the Setup

1. Restart your development server: `npm run dev`
2. Go to `/auth/login`
3. Click "Sign in with Google"
4. Complete the OAuth flow
5. You should be redirected to `/mail/inbox`

## Troubleshooting

### Common Issues:

1. **"Invalid redirect URI"**: 
   - Make sure your redirect URI in Google Console matches exactly
   - Check that the Supabase redirect URL is correct

2. **"Client ID not found"**: 
   - Verify your environment variables are set correctly
   - Restart your development server after updating .env.local

3. **"Supabase environment variables not configured"**:
   - Make sure you've set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
   - Check that the values are correct (no extra spaces, correct format)

4. **Database errors**:
   - Make sure you've run the SQL schema setup
   - Check that RLS policies are created correctly

### Debug Steps:

1. Check browser console for errors
2. Check your environment variables: `console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)`
3. Verify Supabase project is active and accessible
4. Test OAuth flow step by step

## Production Deployment

For production deployment (Vercel, Netlify, etc.):

1. Add all environment variables in your deployment platform
2. Update the redirect URIs in Google Console to include your production domain
3. Make sure your Supabase project allows your production domain

## Alternative: Use Demo Authentication

If you want to test the app without setting up Google OAuth, you can use the demo authentication which is already configured and working.
