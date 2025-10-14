# Preview Environment Fix Guide

## 🎯 **Good News: Your Environment Variables Are Set!**

Looking at your Vercel environment variables, I can see that:

✅ **Clerk variables are set for "All Environments"**  
✅ **Google OAuth variables are set for "All Environments"**  
✅ **Supabase variables have the `supermail_` prefix and are set**  
✅ **Preview-specific variables are configured**

## 🔍 **The Real Issue**

The problem is likely that the environment variables are not being loaded properly during the preview deployment, or there's a caching issue. Let's debug this step by step.

## 🛠️ **Step 1: Test Environment Variables**

### Test the Debug API Endpoint
Visit this URL in your browser to check if environment variables are loaded:
```
https://preview.mastermail.live/api/debug/env
```

This will show you exactly which environment variables are available in your preview deployment.

### Run Local Debug Script
```bash
# In your project directory
node debug-preview-env.js
```

## 🛠️ **Step 2: Force Redeploy**

The most common fix is to force a fresh deployment:

```bash
# Force redeploy with empty commit
git commit --allow-empty -m "Force redeploy to reload environment variables"
git push origin your-preview-branch
```

Or redeploy from Vercel dashboard:
1. Go to Vercel dashboard
2. Go to Deployments tab
3. Click "Redeploy" on your latest preview deployment

## 🛠️ **Step 3: Check Vercel Deployment Logs**

1. **Go to Vercel Dashboard**
2. **Select your project**
3. **Go to Deployments tab**
4. **Click on your latest preview deployment**
5. **Check the logs for any errors**

Look for:
- Environment variable loading errors
- OAuth API errors
- Any 503 or 500 errors

## 🛠️ **Step 4: Verify Environment Variable Names**

Based on your Vercel setup, make sure these exact variable names are set:

### Required Variables (All Environments):
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Supabase Variables (with supermail_ prefix):
```
supermail_NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
supermail_NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
supermail_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
supermail_SUPABASE_JWT_SECRET=your_supabase_jwt_secret
```

### Preview-Specific Variables:
```
NEXT_PUBLIC_APP_URL=https://preview.mastermail.live
NODE_ENV=preview
```

## 🛠️ **Step 5: Test Authentication Flow**

### Test Demo Login
1. Visit: https://preview.mastermail.live
2. Click "Demo Login"
3. Should redirect to inbox with demo emails

### Test Gmail Login
1. Click "Login with Google"
2. Should redirect to Google OAuth (no client_id error)
3. After authorization, should redirect back to inbox

## 🔧 **Common Issues & Solutions**

### Issue 1: Environment Variables Not Loading
**Symptoms:** Debug API shows variables as "NOT SET"
**Solution:** 
- Force redeploy
- Check Vercel deployment logs
- Verify variable names are exact

### Issue 2: OAuth Still Shows "client_id" Error
**Symptoms:** Google OAuth still fails with client_id error
**Solution:**
- Check that `GOOGLE_CLIENT_ID` is set for "All Environments"
- Verify the value is not empty or placeholder
- Force redeploy

### Issue 3: Demo Login Still Fails
**Symptoms:** Demo login button doesn't work
**Solution:**
- Check that Clerk variables are set
- Verify `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is correct
- Check browser console for errors

### Issue 4: Supabase Connection Issues
**Symptoms:** Database operations fail
**Solution:**
- Verify `supermail_` prefixed variables are set
- Check that values are not placeholder text
- Test Supabase connection

## 🧪 **Testing Checklist**

- [ ] Debug API endpoint shows all variables as "Set"
- [ ] Demo login works and redirects to inbox
- [ ] Gmail login redirects to Google OAuth (no client_id error)
- [ ] OAuth flow completes successfully
- [ ] Inbox loads with emails
- [ ] No console errors in browser
- [ ] No errors in Vercel deployment logs

## 📞 **If Still Having Issues**

1. **Check the debug API**: https://preview.mastermail.live/api/debug/env
2. **Check Vercel logs** for any deployment errors
3. **Verify variable values** are not placeholder text
4. **Test with fresh browser session** (incognito mode)
5. **Check browser console** for any JavaScript errors

## 🎯 **Expected Results**

After completing these steps:
- ✅ Demo login should work immediately
- ✅ Gmail login should redirect to Google OAuth without errors
- ✅ OAuth flow should complete successfully
- ✅ Inbox should load with emails
- ✅ All app features should work

The key is ensuring that the environment variables are properly loaded in the preview deployment. Since they're set in Vercel, a force redeploy usually fixes the issue.
