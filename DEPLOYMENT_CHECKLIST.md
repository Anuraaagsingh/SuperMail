# MasterMail.live Deployment Checklist

## 🚀 Pre-Deployment Checklist

### ✅ Domain Configuration
- [ ] Domain `mastermail.live` is connected to Vercel
- [ ] SSL certificate is active and valid
- [ ] DNS records are properly configured
- [ ] Preview domain `preview.mastermail.live` is set up (optional)

### ✅ Clerk Authentication
- [ ] Clerk application is configured with new domain
- [ ] Production keys are obtained (`pk_live_*` and `sk_live_*`)
- [ ] Domain is added to Clerk dashboard
- [ ] Environment variables are set in Vercel

### ✅ Google OAuth Configuration
- [ ] Google Cloud Console project is updated
- [ ] Authorized redirect URIs are added:
  - `https://mastermail.live/auth/gmail/callback`
  - `https://mastermail.live/api/gmail/oauth`
  - `https://preview.mastermail.live/auth/gmail/callback` (if using preview)
  - `https://preview.mastermail.live/api/gmail/oauth` (if using preview)
- [ ] Authorized JavaScript origins are added:
  - `https://mastermail.live`
  - `https://preview.mastermail.live` (if using preview)
- [ ] OAuth consent screen is configured

### ✅ Environment Variables
- [ ] Production environment variables are set in Vercel:
  ```bash
  NEXT_PUBLIC_APP_URL=https://mastermail.live
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_key
  CLERK_SECRET_KEY=sk_live_your_secret
  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
  GOOGLE_CLIENT_ID=your_google_client_id
  GOOGLE_CLIENT_SECRET=your_google_client_secret
  JWT_SECRET=your_jwt_secret
  ```

### ✅ Code Changes
- [ ] `vercel.json` is updated with new domain
- [ ] Middleware is updated for proper routing
- [ ] URL utilities are implemented
- [ ] Gmail OAuth routes are updated

## 🧪 Testing Checklist

### ✅ Production Testing
- [ ] Visit `https://mastermail.live` - loads correctly
- [ ] Sign up/Sign in works with Clerk
- [ ] Gmail OAuth connection works
- [ ] Email fetching works
- [ ] All app features function properly

### ✅ Preview Testing (if applicable)
- [ ] Preview deployment works
- [ ] Preview domain loads correctly
- [ ] Authentication works on preview
- [ ] Gmail integration works on preview

### ✅ Development Testing
- [ ] Local development works (`npm run dev`)
- [ ] All environment variables are set locally
- [ ] Gmail OAuth works locally

## 🔧 Post-Deployment Tasks

### ✅ Monitoring
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Set up analytics (Vercel Analytics, Google Analytics)
- [ ] Monitor deployment logs
- [ ] Set up uptime monitoring

### ✅ SEO & Performance
- [ ] Update meta tags and descriptions
- [ ] Configure sitemap
- [ ] Set up robots.txt
- [ ] Test page load speeds
- [ ] Configure caching headers

### ✅ Security
- [ ] Verify HTTPS is working
- [ ] Check security headers
- [ ] Test authentication flows
- [ ] Verify API endpoints are protected

## 🚨 Troubleshooting

### Common Issues & Solutions

#### Domain Not Loading
1. Check DNS propagation (can take 24-48 hours)
2. Verify Vercel domain configuration
3. Check SSL certificate status
4. Clear browser cache and try incognito mode

#### Authentication Issues
1. Verify Clerk domain configuration
2. Check environment variables are set correctly
3. Ensure SSL certificate is valid
4. Test with a fresh browser session

#### Gmail OAuth Issues
1. Verify redirect URIs in Google Console
2. Check that domains match exactly
3. Ensure OAuth consent screen is configured
4. Check for typos in environment variables

#### Environment Variable Issues
1. Ensure variables are set in correct Vercel environment
2. Check for typos in variable names
3. Verify values are not truncated
4. Restart deployment after changes

## 📞 Support Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Clerk Documentation**: https://clerk.com/docs
- **Google OAuth Documentation**: https://developers.google.com/identity/protocols/oauth2
- **Next.js Documentation**: https://nextjs.org/docs

## 🎯 Success Criteria

Your deployment is successful when:
- ✅ Domain loads without errors
- ✅ Users can sign up and sign in
- ✅ Gmail integration works
- ✅ All app features function properly
- ✅ No console errors or warnings
- ✅ Fast page load times
- ✅ Secure HTTPS connection
