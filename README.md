# SuperMail

A Superhuman-inspired email client with speed, UX, and keyboard-first workflows.

## Features

- **OAuth Sign-in with Google**: Secure authentication with Gmail API access
- **Unified Inbox**: View all your emails in one place with virtualized list for performance
- **Threaded Conversation View**: See entire email threads in a clean, organized interface
- **Keyboard-first UX**: Navigate and perform actions quickly with keyboard shortcuts
- **Command Palette**: Press `Cmd/Ctrl+K` to access all commands and actions
- **Snooze Mail**: Hide emails until you need them with customizable snooze times
- **Schedule Send**: Write emails now and send them later at the perfect time
- **Rich Composer**: Create beautiful emails with autosave functionality
- **Settings**: Customize your experience with themes, signatures, and more

## Tech Stack

- **Frontend**: Next.js 14 + TypeScript + React + shadcn/ui components + Tailwind CSS
- **Backend**: Next.js API routes / server actions
- **Auth / Mail**: Google OAuth (OAuth2) + Gmail API
- **Database**: Supabase (Postgres)
- **Scheduler**: Supabase edge functions / serverless cron
- **Storage**: Supabase storage
- **CI/CD**: Vercel automatic deploy

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Google Cloud Platform account with Gmail API enabled
- Vercel account (for deployment)

### Environment Variables

Create a `.env.local` file with the following variables:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# JWT
JWT_SECRET=

# Vercel
VERCEL_URL=
```

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/supermail.git
   cd supermail
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up Supabase
   - Create a new Supabase project
   - Run the schema.sql script in the Supabase SQL editor
   - Add the Supabase URL and keys to your .env.local file

4. Set up Google OAuth
   - Create a new project in Google Cloud Console
   - Enable the Gmail API
   - Create OAuth credentials with the following scopes:
     - https://www.googleapis.com/auth/gmail.readonly
     - https://www.googleapis.com/auth/gmail.modify
     - https://www.googleapis.com/auth/gmail.send
     - https://www.googleapis.com/auth/gmail.compose
     - https://www.googleapis.com/auth/userinfo.email
     - https://www.googleapis.com/auth/userinfo.profile
   - Add the client ID and secret to your .env.local file

5. Run the development server
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database Setup

The database schema is defined in `schema.sql`. Run this in your Supabase SQL editor to create all necessary tables:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  google_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  settings JSONB
);

-- Create tokens table
CREATE TABLE IF NOT EXISTS tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  encrypted_refresh_token TEXT NOT NULL,
  access_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
  to TEXT[] NOT NULL,
  cc TEXT[],
  bcc TEXT[],
  attachments_meta JSONB,
  last_saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create actions_log table
CREATE TABLE IF NOT EXISTS actions_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Deployment

The application is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Add all environment variables in the Vercel project settings
3. Set up Vercel Cron jobs for the following endpoints:
   - `/api/cron/snooze` - Run every 5 minutes to process snoozed emails
   - `/api/cron/schedule` - Run every 5 minutes to process scheduled sends

## Project Structure

- `/src/app` - Next.js app router pages and layouts
- `/src/components` - React components
- `/src/hooks` - Custom React hooks
- `/src/lib` - Utility functions and API clients
- `/Tasks.md` - Project task tracking

## Keyboard Shortcuts

SuperMail includes many keyboard shortcuts for faster navigation:

- `g` then `i` - Go to inbox
- `g` then `s` - Go to starred
- `g` then `t` - Go to sent
- `g` then `z` - Go to snoozed
- `g` then `d` - Go to drafts
- `c` - Compose new email
- `/` - Search
- `,` - Settings
- `Cmd/Ctrl+K` - Open command palette
- `?` - Show keyboard shortcuts

## License

MIT