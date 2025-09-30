# Gmail Integration Debug Guide

## 🔍 **Debugging Steps**

### 1. **Check Browser Console**
Open browser dev tools (F12) and look for these logs:
- `🔄 Starting to fetch emails...`
- `📡 Making request to: /api/gmail/messages`
- `📡 Response status: 200`
- `📦 Response data: {...}`

### 2. **Check Network Tab**
1. Open Network tab in dev tools
2. Click "Connect Gmail" or refresh
3. Look for requests to `/api/gmail/messages`
4. Check the response status and data

### 3. **Use Debug Panel**
In development mode, you'll see a debug panel with:
- Connection status
- Email count
- Error messages
- Refresh button

### 4. **Test Gmail Connection Flow**

#### Step 1: Check Authentication
```javascript
// In browser console
console.log('User:', user);
console.log('Authenticated:', isAuthenticated);
```

#### Step 2: Test OAuth Flow
1. Click "Connect Gmail"
2. Check if redirect URI is correct in console
3. Complete Google OAuth
4. Check if you're redirected back to `/auth/gmail/callback`

#### Step 3: Check API Response
```javascript
// Test the API directly
fetch('/api/gmail/messages')
  .then(r => r.json())
  .then(console.log);
```

## 🚨 **Common Issues & Solutions**

### Issue 1: "Gmail not connected" but OAuth completed
**Symptoms:**
- OAuth flow completes successfully
- But still shows "Gmail not connected"
- No emails appear

**Debug Steps:**
1. Check if user has `google_id` in database
2. Check if tokens are stored in `tokens` table
3. Check if `getValidAccessToken` is working

**Solution:**
```sql
-- Check user data
SELECT id, google_id FROM users WHERE clerk_id = 'your-clerk-id';

-- Check tokens
SELECT * FROM tokens WHERE user_id = 'user-id';
```

### Issue 2: API returns empty messages
**Symptoms:**
- API call succeeds (status 200)
- But `messages` array is empty
- No error message

**Debug Steps:**
1. Check Gmail API response in Network tab
2. Verify Gmail account has emails
3. Check if Gmail API scopes are correct

**Solution:**
- Ensure Gmail account has emails in inbox
- Check Gmail API quotas in Google Console
- Verify OAuth scopes include `gmail.readonly`

### Issue 3: "Gmail not configured" error
**Symptoms:**
- Error message: "Gmail API credentials are not configured"
- No OAuth flow starts

**Debug Steps:**
1. Check environment variables
2. Verify Google Console setup
3. Check API credentials

**Solution:**
```bash
# Check environment variables
echo $GOOGLE_CLIENT_ID
echo $GOOGLE_CLIENT_SECRET
```

### Issue 4: URI Mismatch Error
**Symptoms:**
- OAuth redirect fails
- Error: "redirect_uri_mismatch"
- Can't complete Gmail connection

**Debug Steps:**
1. Check current URL in browser
2. Compare with Google Console URIs
3. Verify redirect URI logic

**Solution:**
- Update Google Console with correct URIs
- Use stable domain instead of auto-generated URLs

## 🔧 **Debug Commands**

### Check Gmail API Status
```bash
# Test Gmail API directly
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  "https://gmail.googleapis.com/gmail/v1/users/me/messages"
```

### Check Database Connection
```sql
-- Check if user exists
SELECT * FROM users WHERE clerk_id = 'your-clerk-id';

-- Check if tokens exist
SELECT * FROM tokens WHERE user_id = 'user-id';

-- Check token expiration
SELECT access_token, expires_at FROM tokens WHERE user_id = 'user-id';
```

### Check Environment Variables
```bash
# In your terminal
node -e "console.log(process.env.GOOGLE_CLIENT_ID)"
node -e "console.log(process.env.GOOGLE_CLIENT_SECRET)"
```

## 📊 **Debug Panel Features**

The debug panel shows:
- **Status**: Connected/Not Connected/Error
- **Emails**: Number of emails loaded
- **Loading**: Whether currently fetching
- **Error**: Any error messages
- **Message**: Status messages

### Debug Panel Actions:
1. **Refresh**: Manually trigger email fetch
2. **Log to Console**: Output debug info to console
3. **Show/Hide Details**: Toggle detailed information

## 🎯 **Step-by-Step Debugging**

### 1. **Initial Check**
```javascript
// Open browser console and run:
console.log('Debug Info:', {
  user: user,
  isAuthenticated: isAuthenticated,
  gmailConnected: gmailConnected,
  emails: emails.length
});
```

### 2. **Test Gmail Connection**
1. Click "Connect Gmail"
2. Check console for redirect URI
3. Complete OAuth flow
4. Check if redirected back successfully

### 3. **Test Email Fetching**
1. After Gmail connection, check console logs
2. Look for API request/response
3. Check if emails are processed correctly

### 4. **Check Server Logs**
```bash
# If running locally
npm run dev

# Check server console for:
# - Database connection errors
# - Gmail API errors
# - Token refresh issues
```

## 🚀 **Quick Fixes**

### Fix 1: Clear Browser Data
```javascript
// Clear localStorage and cookies
localStorage.clear();
// Then refresh the page
```

### Fix 2: Reset Gmail Connection
1. Go to Google Account settings
2. Revoke app access
3. Try connecting again

### Fix 3: Check Google Console
1. Verify OAuth client is enabled
2. Check redirect URIs are correct
3. Ensure Gmail API is enabled

### Fix 4: Database Reset
```sql
-- Clear user tokens (be careful!)
DELETE FROM tokens WHERE user_id = 'user-id';
-- User will need to reconnect Gmail
```

## 📝 **Debug Checklist**

- [ ] User is authenticated with Clerk
- [ ] Gmail OAuth flow completes
- [ ] User has `google_id` in database
- [ ] Tokens are stored in database
- [ ] Gmail API credentials are configured
- [ ] Redirect URIs match in Google Console
- [ ] Gmail API is enabled in Google Console
- [ ] User's Gmail account has emails
- [ ] No rate limiting issues
- [ ] Network requests are successful

## 🎉 **Success Indicators**

You'll know it's working when:
- ✅ "Connect Gmail" button works without errors
- ✅ OAuth flow completes successfully
- ✅ Emails appear in the inbox
- ✅ Debug panel shows "Connected" status
- ✅ Console shows successful API calls
- ✅ No error messages in UI

If you're still having issues, check the browser console and server logs for specific error messages!
