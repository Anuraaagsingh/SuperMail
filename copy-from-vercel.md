# Copy Environment Variables from Vercel

Based on your Vercel dashboard, you need to copy these values to your local `.env.local` file:

## From Vercel Dashboard → Local .env.local

1. **Google OAuth** (already configured in Vercel):
   ```
   GOOGLE_CLIENT_ID=your-actual-google-client-id
   GOOGLE_CLIENT_SECRET=your-actual-google-client-secret
   ```

2. **Supabase Configuration** (already configured in Vercel):
   ```
   supermail_NEXT_PUBLIC_SUPABASE_URL=your-actual-supabase-url
   supermail_NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-supabase-anon-key
   supermail_SUPABASE_SERVICE_ROLE_KEY=your-actual-supabase-service-role-key
   supermail_SUPABASE_JWT_SECRET=your-actual-supabase-jwt-secret
   ```

## Quick Setup Steps:

1. **Copy from Vercel Dashboard:**
   - Go to your Vercel project settings
   - Click on "Environment Variables"
   - Copy the values for each variable (click the eye icon to reveal them)

2. **Update Local .env.local:**
   ```bash
   # Open the file
   nano .env.local
   
   # Or use your preferred editor
   code .env.local
   ```

3. **Replace the placeholder values** with the actual values from Vercel

4. **Test the configuration:**
   ```bash
   npm run setup
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

## What Each Variable Does:

- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Enable Google OAuth login
- `supermail_NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `supermail_NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public key for Supabase client
- `supermail_SUPABASE_SERVICE_ROLE_KEY`: Service role key for server operations
- `supermail_SUPABASE_JWT_SECRET`: JWT secret for token verification

Once you've updated these values, the Google OAuth login should work perfectly!
