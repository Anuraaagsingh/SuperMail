# MasterMail.live Domain Setup Guide

## 🎯 Overview
This guide will help you configure your `mastermail.live` domain for production and preview environments with Clerk authentication and Google OAuth.

## 📋 Prerequisites
- ✅ Domain `mastermail.live` purchased via GoDaddy
- ✅ Domain connected to Vercel
- ✅ SSL certificate obtained
- ✅ Clerk account with domain configured

## 🔧 Step 1: Vercel Domain Configuration

### 1.1 Add Domain to Vercel Project
1. Go to your Vercel dashboard
2. Select your SuperMail project
3. Go to **Settings** → **Domains**
4. Add `mastermail.live` as the primary domain
5. Add `preview.mastermail.live` as a preview domain (optional)

### 1.2 Configure DNS Records
In your GoDaddy DNS settings, ensure you have:
```
Type: A
Name: @
Value: 76.76.19.61 (Vercel's IP)

Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: CNAME
Name: preview
Value: cname.vercel-dns.com
```

## 🔐 Step 2: Clerk Configuration

### 2.1 Update Clerk Domain Settings
1. Go to [Clerk Dashboard](https://clerk.com/dashboard)
2. Select your application
3. Go to **Configure** → **Domains**
4. Add the following domains:
   - `mastermail.live` (Production)
   - `preview.mastermail.live` (Preview)
   - `localhost:3000` (Development)

### 2.2 Update Environment Variables
Set these in your Vercel environment variables:

```bash
# Production Environment
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_production_key
CLERK_SECRET_KEY=sk_live_your_production_secret

# Preview Environment (if using separate Clerk app)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_preview_key
CLERK_SECRET_KEY=sk_test_your_preview_secret
```

## 🔗 Step 3: Google OAuth Configuration

### 3.1 Update Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Edit your OAuth 2.0 Client ID
5. Add these authorized redirect URIs:

```
# Production
https://mastermail.live/auth/gmail/callback
https://mastermail.live/api/gmail/oauth

# Preview
https://preview.mastermail.live/auth/gmail/callback
https://preview.mastermail.live/api/gmail/oauth

# Development
http://localhost:3000/auth/gmail/callback
http://localhost:3000/api/gmail/oauth
```

6. Add these authorized JavaScript origins:
```
https://mastermail.live
https://preview.mastermail.live
http://localhost:3000
```

## 🌍 Step 4: Environment-Specific Configuration

### 4.1 Production Environment Variables
Set these in Vercel for production:

```bash
NEXT_PUBLIC_APP_URL=https://mastermail.live
NODE_ENV=production
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_key
CLERK_SECRET_KEY=sk_live_your_secret
```

### 4.2 Preview Environment Variables
Set these in Vercel for preview branches:

```bash
NEXT_PUBLIC_APP_URL=https://preview.mastermail.live
NODE_ENV=preview
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key
CLERK_SECRET_KEY=sk_test_your_secret
```

### 4.3 Development Environment Variables
Create `.env.local` for local development:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_dev_key
CLERK_SECRET_KEY=sk_test_your_dev_secret
```

## 🚀 Step 5: Deployment Strategy

### 5.1 Branch-Based Deployment
- **Production**: `main` branch → `mastermail.live`
- **Preview**: `develop` or feature branches → `preview.mastermail.live`
- **Development**: Local development → `localhost:3000`

### 5.2 Vercel Configuration
Your `vercel.json` has been updated to:
- Set the primary domain to `mastermail.live`
- Redirect old Vercel URLs to the new domain
- Configure proper function timeouts

## 🔍 Step 6: Testing Your Setup

### 6.1 Test Production
1. Visit `https://mastermail.live`
2. Try signing up/signing in
3. Test Gmail OAuth connection
4. Verify email fetching works

### 6.2 Test Preview
1. Create a preview branch
2. Push to trigger preview deployment
3. Visit the preview URL
4. Test authentication and Gmail integration

### 6.3 Test Development
1. Run `npm run dev`
2. Visit `http://localhost:3000`
3. Test all functionality locally

## 🛠️ Troubleshooting

### Common Issues:

1. **Clerk Authentication Errors**
   - Verify domain is added to Clerk dashboard
   - Check environment variables are set correctly
   - Ensure SSL certificate is valid

2. **Google OAuth Errors**
   - Verify redirect URIs are added to Google Console
   - Check that domains match exactly
   - Ensure OAuth consent screen is configured

3. **Domain Not Loading**
   - Check DNS propagation (can take 24-48 hours)
   - Verify Vercel domain configuration
   - Check SSL certificate status

4. **Environment Variable Issues**
   - Ensure variables are set in correct Vercel environment
   - Check for typos in variable names
   - Verify values are not truncated

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Test with a fresh browser session

## 🎉 Next Steps

After successful setup:
1. Update your app's metadata and branding
2. Configure custom email addresses if needed
3. Set up monitoring and analytics
4. Consider setting up staging environment
