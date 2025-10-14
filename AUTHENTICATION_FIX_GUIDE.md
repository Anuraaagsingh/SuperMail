# Authentication Fix Guide for Preview Domain

## 🚨 Current Issues
Based on the [preview.mastermail.live login page](https://preview.mastermail.live/auth/login?redirect_url=https://preview.mastermail.live/mail/inbox):

1. **Gmail Login Failing** - "Error 400: invalid_request" with missing client_id
2. **Demo Login Failing** - Not working due to Clerk authentication issues
3. **Cannot Access Inbox** - Authentication is completely broken

## 🔍 Root Cause Analysis

The authentication is failing because:

1. **Missing Clerk Environment Variables** - Clerk keys not set for preview environment
2. **Missing Google OAuth Credentials** - Google Client ID/Secret not configured for preview
3. **Environment Variables Not Loaded** - Vercel not loading the correct environment variables

## 🛠️ Complete Fix Solution

### Step 1: Set Clerk Environment Variables in Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your SuperMail project

2. **Add Clerk Variables for Preview Environment**
   - Go to **Settings** → **Environment Variables**
   - Add these variables and **check "Preview"**:
     ```
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key_here
     CLERK_SECRET_KEY=sk_test_your_clerk_secret_here
     ```

3. **Configure Clerk Dashboard**
   - Go to [Clerk Dashboard](https://clerk.com/dashboard)
   - Select your application
   - Go to **Configure** → **Domains**
   - Add: `preview.mastermail.live`

### Step 2: Set Google OAuth Environment Variables

1. **Add Google OAuth Variables for Preview**
   In Vercel dashboard, add these variables and **check "Preview"**:
   ```
   GOOGLE_CLIENT_ID=your_actual_google_client_id
   GOOGLE_CLIENT_SECRET=your_actual_google_client_secret
   ```

2. **Update Google Cloud Console**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to **APIs & Services** → **Credentials**
   - Edit your OAuth 2.0 Client ID
   - Add these **Authorized redirect URIs**:
     ```
     https://preview.mastermail.live/auth/gmail/callback
     https://preview.mastermail.live/api/gmail/oauth
     ```
   - Add this **Authorized JavaScript origin**:
     ```
     https://preview.mastermail.live
     ```

### Step 3: Set Other Required Environment Variables

Add these variables in Vercel for **Preview** environment:

```bash
# App Configuration
NEXT_PUBLIC_APP_URL=https://preview.mastermail.live
NODE_ENV=preview

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Secret
JWT_SECRET=your_jwt_secret
```

### Step 4: Redeploy Preview

1. **Force Redeploy**
   ```bash
   git commit --allow-empty -m "Fix authentication for preview domain"
   git push origin your-preview-branch
   ```

2. **Or Redeploy from Vercel Dashboard**
   - Go to Deployments tab
   - Click "Redeploy" on your latest preview deployment

### Step 5: Test Authentication

1. **Visit Preview Domain**
   - Go to: https://preview.mastermail.live

2. **Test Demo Login**
   - Click "Demo Login" button
   - Should redirect to inbox with demo emails

3. **Test Gmail Login**
   - Click "Login with Google"
   - Should redirect to Google OAuth (no more client_id error)
   - After authorization, should redirect back to inbox

## 🔧 Quick Debug Commands

### Check Environment Variables
```bash
# Run this in your project directory
node debug-oauth.js
```

### Test OAuth API
```bash
# Test the OAuth endpoint directly
curl -X GET "https://preview.mastermail.live/api/gmail/oauth"
```

## 📋 Environment Variables Checklist

### Required for Preview Environment:
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (Preview enabled)
- [ ] `CLERK_SECRET_KEY` (Preview enabled)
- [ ] `GOOGLE_CLIENT_ID` (Preview enabled)
- [ ] `GOOGLE_CLIENT_SECRET` (Preview enabled)
- [ ] `NEXT_PUBLIC_APP_URL=https://preview.mastermail.live` (Preview enabled)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` (Preview enabled)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Preview enabled)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (Preview enabled)
- [ ] `JWT_SECRET` (Preview enabled)

## 🚨 Common Issues & Solutions

### Issue 1: "Demo Login Failed"
**Cause:** Clerk environment variables not set
**Solution:** Set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` in Vercel

### Issue 2: "Error 400: invalid_request"
**Cause:** Google OAuth credentials not set
**Solution:** Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in Vercel

### Issue 3: "Cannot Access Inbox"
**Cause:** Authentication completely broken
**Solution:** Set all required environment variables and redeploy

### Issue 4: Environment Variables Not Loading
**Cause:** Variables not enabled for Preview environment
**Solution:** Check "Preview" checkbox for all variables in Vercel

## 🎯 Expected Results After Fix

1. **Demo Login Works**
   - Click "Demo Login" → Redirects to inbox
   - Shows 5 demo emails
   - No authentication errors

2. **Gmail Login Works**
   - Click "Login with Google" → Redirects to Google OAuth
   - No "client_id" error
   - After authorization → Redirects to inbox with real Gmail emails

3. **Inbox Accessible**
   - Can access `/mail/inbox` after login
   - Emails load correctly
   - All app features work

## 📞 Still Having Issues?

If authentication is still not working:

1. **Check Vercel Deployment Logs**
   - Look for environment variable errors
   - Check for OAuth API errors

2. **Verify Clerk Configuration**
   - Make sure domain is added to Clerk dashboard
   - Check that keys are correct

3. **Test with Fresh Browser Session**
   - Clear browser cache and cookies
   - Try in incognito mode

4. **Run Debug Script**
   ```bash
   node debug-oauth.js
   ```

The key issue is that your preview environment is missing the essential authentication environment variables. Once you set them in Vercel and redeploy, both demo login and Gmail login should work correctly!
