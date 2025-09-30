# URI Mismatch Error Fix

## Problem
You're getting a `redirect_uri_mismatch` error when trying to connect Gmail. This happens when the redirect URI your app sends doesn't match what's configured in Google Cloud Console.

## Current Error Details
- **App is sending:** `https://super-mail-hza1mup3e-anuraaag-singhs-projects.vercel.app/auth/gmail/callback`
- **Google Console has:** `https://super-mail-cmjmaqp91-anuraaag-singhs-projects.vercel.app/al` (old/truncated)

## Solution Steps

### 1. Update Google Cloud Console

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com
   - Select your "Master Mail" project

2. **Navigate to Credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click on your OAuth 2.0 Client ID: `484801309947-vde9jt4brfqnm5p3au2g3kc320245b0q.apps.googleusercontent.com`

3. **Update Authorized Redirect URIs:**
   Add these URIs to the "Authorized redirect URIs" section:
   ```
   https://super-mail-hza1mup3e-anuraaag-singhs-projects.vercel.app/auth/gmail/callback
   http://localhost:3000/auth/gmail/callback
   ```

4. **Remove old/incorrect URIs:**
   Remove or update these if they exist:
   - `https://super-mail-cmjmaqp91-anuraaag-singhs-projects.vercel.app/al` (truncated)
   - `https://super-mail-8owr0onq4-anuraaag-singhs-projects.vercel.app/au` (truncated)

5. **Save Changes:**
   - Click "Save" at the bottom of the page

### 2. Verify Your Current Deployment URL

Check your current Vercel deployment URL:
1. Go to your Vercel dashboard
2. Find your "super-mail" project
3. Copy the current deployment URL
4. Make sure it matches what you added to Google Console

### 3. Test the Fix

1. **Clear browser cache** and cookies for your app
2. **Redeploy your app** (if needed): `vercel --prod`
3. **Try connecting Gmail again**

### 4. Debug Steps (if still not working)

1. **Check the console log:**
   - Open browser dev tools
   - Look for the "Using redirect URI:" log message
   - Verify it matches what you added to Google Console

2. **Verify Google Console:**
   - Make sure the URI is exactly the same (no trailing slashes, correct protocol)
   - Check that the OAuth client is enabled

3. **Test with localhost:**
   - Try running locally: `npm run dev`
   - Test the Gmail connection on `http://localhost:3000`

## Common URI Mismatch Issues

### Issue 1: Trailing Slash
❌ Wrong: `https://your-app.vercel.app/auth/gmail/callback/`
✅ Correct: `https://your-app.vercel.app/auth/gmail/callback`

### Issue 2: HTTP vs HTTPS
❌ Wrong: `http://your-app.vercel.app/auth/gmail/callback`
✅ Correct: `https://your-app.vercel.app/auth/gmail/callback`

### Issue 3: Case Sensitivity
❌ Wrong: `https://your-app.vercel.app/Auth/Gmail/Callback`
✅ Correct: `https://your-app.vercel.app/auth/gmail/callback`

### Issue 4: Missing Path Segments
❌ Wrong: `https://your-app.vercel.app/auth/gmail`
✅ Correct: `https://your-app.vercel.app/auth/gmail/callback`

## Why This Happens

1. **Vercel URL Changes:** Vercel generates new URLs for each deployment
2. **Environment Differences:** Local vs production URLs
3. **Copy-Paste Errors:** Manual entry mistakes
4. **Caching Issues:** Browser or Google Console caching old configurations

## Prevention for Future

1. **Use Environment Variables:**
   ```env
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

2. **Add Multiple URIs:**
   - Production URL
   - Localhost URL
   - Staging URL (if you have one)

3. **Regular Updates:**
   - Update Google Console when deploying to new URLs
   - Keep a list of all your deployment URLs

## Quick Fix Commands

If you need to quickly check your current URL:
```bash
# Check your current Vercel deployment
vercel ls

# Get your current deployment URL
vercel inspect --prod
```

## Still Having Issues?

1. **Double-check the exact URL** your app is sending (check browser console)
2. **Verify Google Console** has the exact same URL
3. **Wait 5-10 minutes** after updating Google Console (propagation delay)
4. **Try in incognito mode** to avoid caching issues

The key is making sure the URIs match **exactly** - even a single character difference will cause this error.
