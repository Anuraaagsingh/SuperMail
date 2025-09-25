# Clerk + Supabase Integration Setup

## Overview
This guide will help you set up Clerk authentication with Supabase database integration for your SuperMail application.

## Prerequisites
- Clerk account and application set up
- Supabase project with database
- Gmail API credentials (for email fetching)

## Step 1: Database Migration

Run the migration script in your Supabase SQL editor:

```sql
-- Add clerk_id column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS clerk_id TEXT UNIQUE;

-- Make google_id optional (for users who only use Clerk)
ALTER TABLE users ALTER COLUMN google_id DROP NOT NULL;

-- Add index for clerk_id lookups
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);

-- Add updated_at column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing users to have updated_at timestamp
UPDATE users SET updated_at = NOW() WHERE updated_at IS NULL;
```

## Step 2: Environment Variables

Make sure you have these environment variables set in Vercel:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google OAuth (for Gmail API)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# JWT Secret (for demo tokens)
JWT_SECRET=your_jwt_secret
```

## Step 3: Gmail API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Gmail API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized origins
6. Download the credentials and add to environment variables

## Step 4: Test the Integration

1. **User Registration**: When a user signs up with Clerk, they'll automatically be registered in Supabase
2. **Gmail Integration**: Users can connect their Gmail account to fetch real emails
3. **Email Loading**: The inbox will show 10 recent emails with a "Load More" button

## Features Implemented

### ✅ User Registration
- Automatic user registration in Supabase when Clerk user signs up
- User data stored with Clerk ID for authentication

### ✅ Gmail Integration
- Fetch real Gmail messages via Gmail API
- Pagination support with "Load More" functionality
- Fallback to demo emails if Gmail connection fails

### ✅ Dashboard Features
- Real-time email loading
- Email search and filtering
- Responsive design for mobile and desktop

## API Endpoints

### User Registration
- `POST /api/user/register` - Register Clerk user in Supabase

### Gmail Integration
- `GET /api/gmail/messages` - Fetch Gmail messages with pagination

## Database Schema

The users table now supports both Clerk and Google OAuth:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  clerk_id TEXT UNIQUE,           -- For Clerk authentication
  google_id TEXT UNIQUE,          -- For Google OAuth (optional)
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  settings JSONB DEFAULT '{}'::jsonb
);
```

## Troubleshooting

### Common Issues

1. **"Missing publishableKey" error**
   - Make sure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set in Vercel
   - Check that the key starts with `pk_test_` or `pk_live_`

2. **Gmail API errors**
   - Verify Google OAuth credentials are correct
   - Check that Gmail API is enabled in Google Cloud Console
   - Ensure domain is added to authorized origins

3. **Database connection issues**
   - Verify Supabase credentials are correct
   - Check that the migration script was run successfully
   - Ensure RLS policies allow your service role to access data

### Testing

1. **Demo Login**: Should work without any setup
2. **Clerk Login**: Requires Clerk keys to be set
3. **Gmail Integration**: Requires Google OAuth setup and user to connect Gmail

## Next Steps

1. Set up Gmail OAuth credentials
2. Run the database migration
3. Deploy with environment variables
4. Test user registration and email fetching

The application will now:
- ✅ Register users in Supabase when they sign up with Clerk
- ✅ Fetch real Gmail messages (when Gmail is connected)
- ✅ Show paginated emails with "Load More" functionality
- ✅ Fallback to demo emails if Gmail is not connected
