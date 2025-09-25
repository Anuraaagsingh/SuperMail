# Database Setup Guide

## Step 1: Create the Complete Database Schema

Copy and paste the entire contents of `complete-database-setup.sql` into your Supabase SQL Editor and run it.

This will create:
- ✅ `users` table with Clerk and Google OAuth support
- ✅ `tokens` table for Google OAuth tokens
- ✅ `snoozes` table for snoozed emails
- ✅ `scheduled_sends` table for scheduled emails
- ✅ `drafts` table for email drafts
- ✅ `actions_log` table for user actions
- ✅ `labels` table for email labels
- ✅ All necessary indexes and triggers
- ✅ Row Level Security (RLS) policies

## Step 2: Verify the Setup

After running the script, you should see:
```
Database setup completed successfully!
```

## Step 3: Check Your Tables

In Supabase Dashboard → Table Editor, you should now see:
- `users`
- `tokens` 
- `snoozes`
- `scheduled_sends`
- `drafts`
- `actions_log`
- `labels`

## Step 4: Test User Registration

Once your database is set up, the application will automatically:
1. Register users in Supabase when they sign up with Clerk
2. Store their Clerk ID for authentication
3. Allow them to connect Gmail for real email fetching

## Database Schema Overview

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  clerk_id TEXT UNIQUE,     -- For Clerk authentication
  google_id TEXT UNIQUE,    -- For Google OAuth (optional)
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  settings JSONB
);
```

### Key Features
- ✅ Supports both Clerk and Google OAuth
- ✅ Automatic user registration
- ✅ Gmail integration ready
- ✅ All email features supported

## Troubleshooting

### If you get "relation does not exist" errors:
1. Make sure you're running the complete setup script
2. Check that you're in the correct Supabase project
3. Verify the script ran without errors

### If RLS policies cause issues:
The service role policies allow your API to access all data. This is necessary for the application to work properly.

## Next Steps

After the database is set up:
1. ✅ Users can sign up with Clerk
2. ✅ Users are automatically registered in Supabase
3. ✅ Users can connect Gmail for real emails
4. ✅ All email features will work (snooze, schedule, etc.)

Your SuperMail application is now ready to use! 🚀
