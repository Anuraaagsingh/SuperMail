# Dynamic URI Setup for Vercel Deployments

## Problem
Vercel generates new URLs for each deployment (e.g., `super-mail-abc123.vercel.app`), but Google OAuth requires exact URI matches. This means you'd need to update Google Console every time you deploy.

## Solutions

### 🎯 **Solution 1: Use Vercel's Production Domain (Recommended)**

This is the **best approach** - use Vercel's stable production domain instead of auto-generated URLs.

#### Step 1: Set up Production Domain
1. **In Vercel Dashboard:**
   - Go to your project settings
   - Add a custom domain: `super-mail.vercel.app` (or your preferred domain)
   - This URL never changes

#### Step 2: Update Google Console
Add these **permanent URIs** to Google Console:
```
https://super-mail.vercel.app/auth/gmail/callback
http://localhost:3000/auth/gmail/callback
```

#### Step 3: Update Your Code
The code now automatically detects Vercel deployments and uses the stable domain:

```typescript
const getRedirectUri = () => {
  const hostname = window.location.hostname;
  
  // Check if we're on Vercel production
  if (hostname.includes('vercel.app') && !hostname.includes('localhost')) {
    // Use the stable production domain
    return 'https://super-mail.vercel.app/auth/gmail/callback';
  }
  
  // For localhost and other environments, use current origin
  return `${window.location.origin}/auth/gmail/callback`;
};
```

### 🔧 **Solution 2: Custom Domain (Most Stable)**

For maximum stability, use a custom domain:

#### Step 1: Buy a Domain
- Purchase a domain (e.g., `supermail.app`)
- Or use a subdomain of an existing domain

#### Step 2: Configure in Vercel
1. Go to Vercel Dashboard → Project Settings → Domains
2. Add your custom domain: `supermail.app`
3. Configure DNS records as instructed by Vercel

#### Step 3: Update Google Console
```
https://supermail.app/auth/gmail/callback
http://localhost:3000/auth/gmail/callback
```

### 🚀 **Solution 3: Environment Variables**

Use environment variables for different environments:

#### Step 1: Create Environment Variables
```env
# .env.local
NEXT_PUBLIC_APP_URL=https://super-mail.vercel.app
NEXT_PUBLIC_APP_URL_LOCAL=http://localhost:3000
```

#### Step 2: Update Code
```typescript
const redirectUri = process.env.NODE_ENV === 'production' 
  ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/gmail/callback`
  : `${window.location.origin}/auth/gmail/callback`;
```

### 🔄 **Solution 4: Multiple URI Patterns**

Add multiple URI patterns to Google Console to cover all scenarios:

```
# Production (stable)
https://super-mail.vercel.app/auth/gmail/callback

# Development
http://localhost:3000/auth/gmail/callback

# Preview deployments (optional)
https://*.vercel.app/auth/gmail/callback
```

**Note:** Google doesn't support wildcards in redirect URIs, so this approach has limitations.

## 🎯 **Recommended Setup**

### For Production Apps:
1. **Use Solution 1** (Vercel Production Domain)
2. **Set up a custom domain** for maximum stability
3. **Add both URIs** to Google Console

### For Development:
1. **Use localhost** for local development
2. **Use production domain** for all Vercel deployments

## 📋 **Google Console Configuration**

### Authorized JavaScript Origins:
```
https://super-mail.vercel.app
http://localhost:3000
```

### Authorized Redirect URIs:
```
https://super-mail.vercel.app/auth/gmail/callback
http://localhost:3000/auth/gmail/callback
```

## 🔍 **Testing Your Setup**

### 1. Test Local Development:
```bash
npm run dev
# Visit: http://localhost:3000
# Try connecting Gmail
```

### 2. Test Production:
```bash
vercel --prod
# Visit: https://super-mail.vercel.app
# Try connecting Gmail
```

### 3. Debug URI Issues:
```javascript
// Add this to your browser console
console.log('Current hostname:', window.location.hostname);
console.log('Redirect URI:', getRedirectUri());
```

## 🚨 **Common Issues & Solutions**

### Issue: Still getting URI mismatch
**Solution:** 
1. Check that you're using the stable domain in production
2. Verify Google Console has the exact URI
3. Clear browser cache and cookies

### Issue: Localhost not working
**Solution:**
1. Make sure `http://localhost:3000/auth/gmail/callback` is in Google Console
2. Check that you're running on port 3000
3. Try `http://127.0.0.1:3000/auth/gmail/callback` as backup

### Issue: Production domain not working
**Solution:**
1. Verify the domain is properly configured in Vercel
2. Check DNS propagation (can take up to 24 hours)
3. Use the Vercel-provided domain as fallback

## 🎉 **Benefits of This Setup**

✅ **No more manual URI updates**  
✅ **Works with all Vercel deployments**  
✅ **Stable for production**  
✅ **Easy local development**  
✅ **Scalable for team development**

## 📝 **Next Steps**

1. **Choose your preferred solution** (I recommend Solution 1)
2. **Update Google Console** with the stable URIs
3. **Deploy your changes** to Vercel
4. **Test both local and production** environments
5. **Enjoy never having to update URIs again!** 🎉
