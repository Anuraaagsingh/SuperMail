# SuperMail Setup Guide

## Quick Start

### 1. Demo Authentication (Ready to use)
The demo authentication is now configured and ready to use. You can sign in with the demo account to explore SuperMail features.

### 2. Google OAuth Setup (Optional)
To enable Google OAuth authentication:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Gmail API
4. Create OAuth 2.0 credentials
5. Update your `.env.local` file with the credentials:

```bash
GOOGLE_CLIENT_ID=your-actual-google-client-id
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret
```

## Environment Variables

The following environment variables are configured in `.env.local`:

- `JWT_SECRET`: Used for JWT token generation (demo authentication)
- `GOOGLE_CLIENT_ID`: Google OAuth client ID (for Google authentication)
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret (for Google authentication)

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Authentication Options

- **Demo Account**: Click "Sign in with Demo Account" to explore the app with pre-populated data
- **Google Account**: Click "Sign in with Google" to connect your Gmail (requires Google OAuth setup)

## Troubleshooting

- If you see "secretOrPrivateKey must have a value" error, make sure `JWT_SECRET` is set in `.env.local`
- If you see "Missing Google client ID" error, either set up Google OAuth or use the demo account
- Make sure to restart your development server after updating environment variables
