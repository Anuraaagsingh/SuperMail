-- Migration script to add Clerk support to existing Supabase database
-- Run this in your Supabase SQL editor

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

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for tokens table
DROP TRIGGER IF EXISTS update_tokens_updated_at ON tokens;
CREATE TRIGGER update_tokens_updated_at
    BEFORE UPDATE ON tokens
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add updated_at column to tokens table if it doesn't exist
ALTER TABLE tokens ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing tokens to have updated_at timestamp
UPDATE tokens SET updated_at = NOW() WHERE updated_at IS NULL;
