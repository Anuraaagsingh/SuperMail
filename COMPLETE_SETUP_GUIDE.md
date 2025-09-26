# Complete Setup Guide for SuperMail

## Current Issues
The app is showing "Supabase: Not Configured" and "Gmail API: Not Configured" because the environment variables are not set up properly. This guide will help you configure both services.

## Quick Start: Demo Mode
If you want to test the app immediately, it will automatically use demo mode and show sample emails without any configuration.

## Step 1: Set Up Supabase (Required for User Management)

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready (usually takes 2-3 minutes)
3. Go to **Settings** > **API** in your Supabase dashboard
4. Copy these values:
   - **Project URL** (looks like: `https://your-project-ref.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)
   - **service_role** key (for server-side operations)

### 1.2 Set Up Database Schema
Run this SQL in your Supabase SQL editor:

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

-- Create RLS policies (for service role access)
CREATE POLICY "Service role can manage all data" ON users FOR ALL USING (true);
CREATE POLICY "Service role can manage all tokens" ON tokens FOR ALL USING (true);
CREATE POLICY "Service role can manage all snoozes" ON snoozes FOR ALL USING (true);
CREATE POLICY "Service role can manage all scheduled sends" ON scheduled_sends FOR ALL USING (true);
CREATE POLICY "Service role can manage all drafts" ON drafts FOR ALL USING (true);
CREATE POLICY "Service role can manage all actions" ON actions_log FOR ALL USING (true);
```

## Step 2: Set Up Gmail API (Optional - for Real Emails)

### 2.1 Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Gmail API**
   - **Google+ API** (if available)

### 2.2 Configure OAuth 2.0 Credentials
1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Set application type to **Web application**
4. Add these authorized redirect URIs:
   - `http://localhost:3000/auth/gmail/callback` (for local development)
   - `https://your-domain.com/auth/gmail/callback` (for production)
5. Copy the **Client ID** and **Client Secret**

## Step 3: Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
SUPABASE_JWT_SECRET=your-supabase-jwt-secret

# Alternative naming (for compatibility)
supermail_NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
supermail_NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
supermail_SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
supermail_SUPABASE_JWT_SECRET=your-supabase-jwt-secret

# Google OAuth Configuration (OPTIONAL - for Gmail integration)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# JWT Secret for token encryption
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Clerk Configuration (should already be set)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
```

## Step 4: Test the Setup

1. **Restart your development server**: `npm run dev`
2. **Check the environment status**: Look for the "Environment Status" button in the bottom right
3. **Test the user flow**:
   - Go to `/auth/login`
   - Sign in with Clerk
   - You should be redirected to `/mail/inbox`
   - The app should show demo emails (if Gmail not configured) or real emails (if Gmail is configured)

## Expected User Flow

1. **User logs in via Clerk** → Authentication successful
2. **App creates user in Supabase** → User record created in database
3. **App attempts to fetch Gmail emails** → If Gmail API configured, fetches real emails; otherwise shows demo emails
4. **User sees inbox** → Either real Gmail emails or demo emails

## Troubleshooting

### Common Issues:

1. **"Supabase: Not Configured"**
   - Make sure you've set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Check that the values are correct (no extra spaces, correct format)
   - Restart your development server after updating environment variables

2. **"Gmail API: Not Configured"**
   - This is expected if you haven't set up Gmail API
   - The app will automatically use demo emails
   - To enable real Gmail integration, set up Google OAuth credentials

3. **"Database connection failed"**
   - Check your Supabase project is active and accessible
   - Verify the service role key is correct
   - Make sure you've run the database schema setup

4. **"User registration failed"**
   - Check Supabase configuration
   - Verify the database schema is set up correctly
   - Check browser console for detailed error messages

### Debug Steps:

1. **Check environment variables**: Look at the "Environment Status" button
2. **Check browser console**: Look for detailed error messages
3. **Check Supabase logs**: Go to your Supabase dashboard > Logs
4. **Test database connection**: Try creating a user manually in Supabase

## Production Deployment

For production deployment (Vercel, Netlify, etc.):

1. **Add all environment variables** in your deployment platform
2. **Update redirect URIs** in Google Console to include your production domain
3. **Update Supabase settings** to allow your production domain
4. **Test the complete flow** in production

## Alternative: Demo Mode Only

If you don't want to set up Supabase or Gmail API:

1. **The app will automatically use demo mode**
2. **All features work with sample data**
3. **Perfect for testing the UI and functionality**
4. **No external services required**

## Need Help?

If you're still having issues:

1. **Check the environment status** in the app (bottom right button)
2. **Look at browser console** for detailed error messages
3. **Verify all environment variables** are set correctly
4. **Test with demo mode first** to ensure the app works

The app is designed to work in demo mode even without external services configured!
