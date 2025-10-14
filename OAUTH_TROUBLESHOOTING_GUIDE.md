# OAuth 400 Error Troubleshooting Guide

## 🚨 Current Issue: Error 400: invalid_request
**Error Details:** "Missing required parameter: client_id"  
**Flow:** GeneralOAuthFlow  
**Domain:** preview.mastermail.live

Based on the [Google OAuth 2.0 documentation](https://developers.google.com/identity/protocols/oauth2), this error indicates that the `client_id` parameter is not being included in the OAuth request.

## 🔍 Root Cause Analysis

The "Missing required parameter: client_id" error occurs when:

1. **Environment variables are not set** in Vercel for the preview environment
2. **Environment variables are not loaded** during deployment
3. **Incorrect Google Client ID format**
4. **OAuth request is malformed**

## 🛠️ Step-by-Step Fix

### Step 1: Verify Environment Variables in Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your SuperMail project

2. **Check Environment Variables**
   - Go to **Settings** → **Environment Variables**
   - Look for these variables:
     ```
     GOOGLE_CLIENT_ID
     GOOGLE_CLIENT_SECRET
     ```

3. **Verify Environment Selection**
   - Make sure **Preview** is checked for these variables
   - If not checked, edit the variable and check "Preview"

### Step 2: Test Environment Variables

Run the debug script to check if variables are loaded:

```bash
# In your project directory
node debug-oauth.js
```

This will show you:
- Whether environment variables are set
- If the Google Client ID format is correct
- Generated OAuth URL with all parameters

### Step 3: Check Vercel Deployment Logs

1. **Go to Vercel Dashboard**
2. **Select your project**
3. **Go to Deployments tab**
4. **Click on your latest preview deployment**
5. **Check the logs for any errors**

Look for:
- Environment variable loading errors
- OAuth API call logs
- Any 503 errors indicating missing credentials

### Step 4: Verify Google Cloud Console Configuration

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your project

2. **Check OAuth 2.0 Client ID**
   - Go to **APIs & Services** → **Credentials**
   - Click on your OAuth 2.0 Client ID
   - Verify it's a **Web application** type

3. **Verify Authorized Redirect URIs**
   ```
   https://preview.mastermail.live/auth/gmail/callback
   https://preview.mastermail.live/api/gmail/oauth
   ```

4. **Verify Authorized JavaScript Origins**
   ```
   https://preview.mastermail.live
   ```

### Step 5: Test OAuth API Endpoint

Test your OAuth API endpoint directly:

```bash
# Test the OAuth endpoint
curl -X GET "https://preview.mastermail.live/api/gmail/oauth" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN"
```

This should return a JSON response with the OAuth URL or an error message.

## 🔧 Common Solutions

### Solution 1: Environment Variables Not Set

**Problem:** Variables not set in Vercel for Preview environment

**Fix:**
1. Go to Vercel dashboard
2. Settings → Environment Variables
3. Add/Edit variables and check "Preview"
4. Redeploy

### Solution 2: Incorrect Client ID Format

**Problem:** Google Client ID doesn't contain `.apps.googleusercontent.com`

**Fix:**
1. Go to Google Cloud Console
2. Create new OAuth 2.0 Client ID
3. Select "Web application"
4. Copy the correct Client ID
5. Update in Vercel

### Solution 3: Deployment Not Picking Up Variables

**Problem:** Variables set but not loaded in deployment

**Fix:**
1. Redeploy the preview branch
2. Check deployment logs
3. Verify variables are set for correct environment

### Solution 4: OAuth Request Malformed

**Problem:** Frontend not calling OAuth API correctly

**Fix:**
1. Check browser network tab
2. Verify OAuth API is being called
3. Check for CORS issues

## 🧪 Testing Steps

### Test 1: Environment Variables
```bash
node debug-oauth.js
```

### Test 2: OAuth API Endpoint
```bash
curl -X GET "https://preview.mastermail.live/api/gmail/oauth"
```

### Test 3: Browser Network Tab
1. Open browser dev tools
2. Go to Network tab
3. Try Gmail login
4. Check for OAuth API calls
5. Look for 503 or 500 errors

### Test 4: Vercel Logs
1. Check Vercel deployment logs
2. Look for OAuth API logs
3. Check for environment variable errors

## 📋 Debugging Checklist

- [ ] Environment variables set in Vercel
- [ ] Variables enabled for Preview environment
- [ ] Google Client ID format is correct
- [ ] Google Cloud Console OAuth configured
- [ ] Redirect URIs added to Google Console
- [ ] JavaScript origins added to Google Console
- [ ] Preview deployment completed
- [ ] OAuth API endpoint accessible
- [ ] No CORS errors in browser
- [ ] Vercel logs show no errors

## 🚨 Emergency Fix

If you need a quick fix:

1. **Set Environment Variables in Vercel:**
   ```
   GOOGLE_CLIENT_ID=your_actual_client_id
   GOOGLE_CLIENT_SECRET=your_actual_client_secret
   ```

2. **Redeploy Preview:**
   ```bash
   git commit --allow-empty -m "Force redeploy for OAuth fix"
   git push origin your-preview-branch
   ```

3. **Test OAuth:**
   - Visit https://preview.mastermail.live
   - Try Gmail login
   - Check browser console for errors

## 📞 Still Having Issues?

If you're still getting the error:

1. **Check the enhanced OAuth API logs** (now with detailed debugging)
2. **Run the debug script** to verify environment variables
3. **Check Vercel deployment logs** for any errors
4. **Verify Google Cloud Console** configuration
5. **Test with a fresh browser session**

The enhanced OAuth API now includes detailed logging that will help identify exactly where the issue is occurring.
