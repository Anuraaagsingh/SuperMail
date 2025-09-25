-- Updated schema to support both Clerk and Google OAuth
-- Add clerk_id column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS clerk_id TEXT UNIQUE;

-- Make google_id optional (for users who only use Clerk)
ALTER TABLE users ALTER COLUMN google_id DROP NOT NULL;

-- Add index for clerk_id lookups
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);

-- Update the users table structure
-- Note: This is the new structure for new installations
-- For existing installations, the ALTER statements above will update the schema

-- Create users table (for new installations)
CREATE TABLE IF NOT EXISTS users_new (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  clerk_id TEXT UNIQUE,
  google_id TEXT UNIQUE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  settings JSONB DEFAULT '{}'::jsonb
);

-- Create tokens table (updated to support both auth methods)
CREATE TABLE IF NOT EXISTS tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  encrypted_refresh_token TEXT,
  access_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create snoozes table
CREATE TABLE IF NOT EXISTS snoozes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message_id TEXT NOT NULL,
  snoozed_until TIMESTAMP WITH TIME ZONE NOT NULL,
  original_labels JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scheduled_sends table
CREATE TABLE IF NOT EXISTS scheduled_sends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  draft_id UUID NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create drafts table
CREATE TABLE IF NOT EXISTS drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  recipients_to TEXT[] NOT NULL,
  recipients_cc TEXT[],
  recipients_bcc TEXT[],
  attachments_meta JSONB,
  last_saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create actions_log table
CREATE TABLE IF NOT EXISTS actions_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tokens_user_id ON tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_snoozes_user_id ON snoozes(user_id);
CREATE INDEX IF NOT EXISTS idx_snoozes_snoozed_until ON snoozes(snoozed_until);
CREATE INDEX IF NOT EXISTS idx_scheduled_sends_user_id ON scheduled_sends(user_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_sends_scheduled_at ON scheduled_sends(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_drafts_user_id ON drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_actions_log_user_id ON actions_log(user_id);
CREATE INDEX IF NOT EXISTS idx_actions_log_created_at ON actions_log(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE snoozes ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (these will be created by Supabase Auth, but we can add custom ones)
-- Note: These policies assume you're using Supabase Auth. For Clerk integration,
-- you'll need to create custom policies or use service role for API calls.

-- Example RLS policy for users table
CREATE POLICY "Users can view their own data" ON users
  FOR ALL USING (auth.uid()::text = id::text);

-- Example RLS policy for tokens table  
CREATE POLICY "Users can view their own tokens" ON tokens
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Example RLS policy for snoozes table
CREATE POLICY "Users can view their own snoozes" ON snoozes
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Example RLS policy for scheduled_sends table
CREATE POLICY "Users can view their own scheduled sends" ON scheduled_sends
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Example RLS policy for drafts table
CREATE POLICY "Users can view their own drafts" ON drafts
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Example RLS policy for actions_log table
CREATE POLICY "Users can view their own actions" ON actions_log
  FOR ALL USING (auth.uid()::text = user_id::text);
