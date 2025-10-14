# Fix Gmail OAuth for Preview Domain

## 🚨 Current Issue
You're getting "Missing required parameter: client_id" when trying to login via Gmail on `preview.mastermail.live`. This means your Google OAuth configuration is not set up for the preview domain.

## 🔧 Step-by-Step Fix

### Step 1: Update Google Cloud Console

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your project

2. **Navigate to OAuth Configuration**
   - Go to **APIs & Services** → **Credentials**
   - Click on your OAuth 2.0 Client ID

3. **Add Preview Domain Redirect URIs**
   In the "Authorized redirect URIs" section, add:
   ```
   https://preview.mastermail.live/auth/gmail/callback
   https://preview.mastermail.live/api/gmail/oauth
   ```

4. **Add Preview Domain JavaScript Origins**
   In the "Authorized JavaScript origins" section, add:
   ```
   https://preview.mastermail.live
   ```

5. **Save Changes**
   - Click "Save" at the bottom

### Step 2: Set Environment Variables in Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your SuperMail project

2. **Navigate to Environment Variables**
   - Go to **Settings** → **Environment Variables**

3. **Add Google OAuth Credentials for Preview**
   Add these variables and make sure they're enabled for **Preview** environment:
   ```
   GOOGLE_CLIENT_ID=your_actual_google_client_id
   GOOGLE_CLIENT_SECRET=your_actual_google_client_secret
   ```

4. **Verify Environment Selection**
   - Make sure "Preview" is checked for these variables
   - Click "Save"

### Step 3: Redeploy Preview

1. **Trigger New Deployment**
   - Push a new commit to your preview branch, OR
   - Go to Vercel dashboard → Deployments → Redeploy the latest preview

2. **Wait for Deployment**
   - Wait for the deployment to complete
   - Check that environment variables are loaded

### Step 4: Test Gmail OAuth

1. **Visit Preview Domain**
   - Go to: https://preview.mastermail.live

2. **Try Gmail Login**
   - Click on Gmail login/connect
   - Should redirect to Google OAuth without the "client_id" error

## 🔍 Troubleshooting

### If you still get "client_id" error:

1. **Check Environment Variables**
   ```bash
   # Run this in your project directory
   node check-oauth-config.js
   ```

2. **Verify Vercel Environment Variables**
   - Go to Vercel dashboard
   - Check that variables are set for "Preview" environment
   - Make sure there are no typos

3. **Check Google Console Configuration**
   - Verify redirect URIs are exactly: `https://preview.mastermail.live/auth/gmail/callback`
   - Verify JavaScript origins include: `https://preview.mastermail.live`

4. **Clear Browser Cache**
   - Try in incognito/private mode
   - Clear browser cache and cookies

### If you get other OAuth errors:

1. **"redirect_uri_mismatch"**
   - Double-check the redirect URI in Google Console
   - Make sure it matches exactly: `https://preview.mastermail.live/auth/gmail/callback`

2. **"invalid_client"**
   - Verify your Google Client ID and Secret are correct
   - Make sure they're set in Vercel for Preview environment

3. **"access_denied"**
   - User cancelled the OAuth flow
   - This is normal if user clicks "Cancel"

## 📋 Complete Configuration Checklist

### Google Cloud Console ✅
- [ ] OAuth 2.0 Client ID created
- [ ] Gmail API enabled
- [ ] Redirect URIs added:
  - [ ] `https://mastermail.live/auth/gmail/callback`
  - [ ] `https://mastermail.live/api/gmail/oauth`
  - [ ] `https://preview.mastermail.live/auth/gmail/callback`
  - [ ] `https://preview.mastermail.live/api/gmail/oauth`
  - [ ] `http://localhost:3000/auth/gmail/callback`
  - [ ] `http://localhost:3000/api/gmail/oauth`
- [ ] JavaScript origins added:
  - [ ] `https://mastermail.live`
  - [ ] `https://preview.mastermail.live`
  - [ ] `http://localhost:3000`

### Vercel Configuration ✅
- [ ] Domain `preview.mastermail.live` added to project
- [ ] Environment variables set for Preview:
  - [ ] `GOOGLE_CLIENT_ID`
  - [ ] `GOOGLE_CLIENT_SECRET`
  - [ ] `NEXT_PUBLIC_APP_URL=https://preview.mastermail.live`

### Testing ✅
- [ ] Preview domain loads correctly
- [ ] Gmail OAuth redirects to Google
- [ ] No "client_id" error
- [ ] OAuth flow completes successfully
- [ ] Gmail integration works

## 🎯 Expected Result

After completing these steps:
1. Visit `https://preview.mastermail.live`
2. Click Gmail login/connect
3. Should redirect to Google OAuth page (not error page)
4. After authorization, should redirect back to your app
5. Gmail integration should work

## 📞 Still Having Issues?

If you're still experiencing problems:
1. Check Vercel deployment logs for errors
2. Verify all environment variables are set correctly
3. Test with a fresh browser session
4. Make sure your preview branch is properly deployed

The key issue was that your Google OAuth configuration didn't include the preview domain. Once you add `https://preview.mastermail.live` to your Google Console and set the environment variables in Vercel, the OAuth flow should work correctly.
