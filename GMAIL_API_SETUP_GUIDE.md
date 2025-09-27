# Gmail API Setup Guide - Complete Configuration

## 🔍 Current Issue Analysis

You have the OAuth client configured in Google Cloud Console, but there are several missing pieces that prevent Gmail API from working:

### **Missing in Google Cloud Console:**

1. **Gmail API Not Enabled** ❌
2. **OAuth Consent Screen Not Configured** ❌  
3. **Redirect URIs Not Set** ❌
4. **Required Scopes Not Added** ❌

## 🚀 Step-by-Step Google Cloud Console Setup

### **Step 1: Enable Gmail API**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your "Master Mail" project
3. Go to **APIs & Services** → **Library**
4. Search for "Gmail API"
5. Click on **Gmail API**
6. Click **"Enable"**

### **Step 2: Configure OAuth Consent Screen**

1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **"External"** (for development)
3. Fill in the required fields:
   - **App name**: "SuperMail" or "MasterMail"
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Click **"Save and Continue"**
5. On **Scopes** page, click **"Add or Remove Scopes"**
6. Add these scopes:
   ```
   https://www.googleapis.com/auth/gmail.readonly
   https://www.googleapis.com/auth/gmail.modify
   https://www.googleapis.com/auth/gmail.send
   https://www.googleapis.com/auth/gmail.compose
   https://www.googleapis.com/auth/userinfo.email
   https://www.googleapis.com/auth/userinfo.profile
   ```
7. Click **"Save and Continue"**
8. Add test users (your email address)
9. Click **"Save and Continue"**

### **Step 3: Configure OAuth Client**

1. Go to **APIs & Services** → **Credentials**
2. Click on your existing OAuth 2.0 Client ID
2. Add **Authorized redirect URIs**:
   ```
   http://localhost:3000/auth/gmail/callback
   https://super-mail-8owr0onq4-anuraaag-singhs-projects.vercel.app/auth/gmail/callback
   ```
3. Add **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   https://super-mail-8owr0onq4-anuraaag-singhs-projects.vercel.app
   ```
4. Click **"Save"**

### **Step 4: Verify Environment Variables**

Make sure your `.env.local` has:
```bash
GOOGLE_CLIENT_ID=484801309947-vde9jt4brfqnm5p3au2g3kc32o245b0q.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

## 🔐 Authentication Flow

### **Current Issue: User Not Authenticated**

The Gmail API requires a **two-step authentication**:

1. **Clerk Authentication** (User must be logged in)
2. **Gmail OAuth** (User must connect Gmail account)

### **Complete Flow:**
```
User Login → Clerk Auth → User Registration → Gmail OAuth → Gmail API Access
```

## 🧪 Testing the Setup

### **Test 1: Check Gmail API Status**
```bash
curl "http://localhost:3000/api/gmail/oauth?redirect_uri=http://localhost:3000/auth/gmail/callback"
```
**Expected**: Should return OAuth URL (not "Unauthorized")

### **Test 2: Check User Authentication**
1. Go to `http://localhost:3000`
2. Click **"Demo Login"** or **"Login with Google"**
3. Should redirect to `/mail/inbox`

### **Test 3: Connect Gmail**
1. After authentication, look for "Connect Gmail" button
2. Click it to start Gmail OAuth flow
3. Complete Google authorization
4. Should see real Gmail emails

## 🔧 Missing Permissions Analysis

### **Required Gmail API Scopes:**
```javascript
const GMAIL_SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',    // Read emails
  'https://www.googleapis.com/auth/gmail.modify',     // Modify emails (mark read, etc.)
  'https://www.googleapis.com/auth/gmail.send',       // Send emails
  'https://www.googleapis.com/auth/gmail.compose',    // Compose emails
  'https://www.googleapis.com/auth/userinfo.email',   // Get user email
  'https://www.googleapis.com/auth/userinfo.profile', // Get user profile
];
```

### **Google Cloud Console Requirements:**

1. **Gmail API Enabled** ✅ (You need to enable this)
2. **OAuth Consent Screen** ✅ (You need to configure this)
3. **Redirect URIs** ✅ (You need to add these)
4. **Scopes Added** ✅ (You need to add the scopes)

## 🚨 Common Issues & Solutions

### **Issue 1: "Gmail API not enabled"**
**Solution**: Enable Gmail API in Google Cloud Console

### **Issue 2: "Invalid redirect URI"**
**Solution**: Add correct redirect URIs to OAuth client

### **Issue 3: "Access blocked: This app's request is invalid"**
**Solution**: Configure OAuth consent screen properly

### **Issue 4: "Insufficient permissions"**
**Solution**: Add all required scopes to OAuth consent screen

### **Issue 5: "User not authenticated"**
**Solution**: User must login with Clerk first

## 📋 Complete Checklist

### **Google Cloud Console:**
- [ ] Gmail API enabled
- [ ] OAuth consent screen configured
- [ ] All required scopes added
- [ ] Redirect URIs configured
- [ ] Test users added

### **Application:**
- [ ] Environment variables set
- [ ] User authenticated with Clerk
- [ ] Gmail OAuth flow working
- [ ] Gmail API calls successful

## 🎯 Next Steps

1. **Enable Gmail API** in Google Cloud Console
2. **Configure OAuth consent screen** with all scopes
3. **Add redirect URIs** to your OAuth client
4. **Test authentication flow** with demo login
5. **Connect Gmail account** via OAuth
6. **Verify email fetching** works

The main issue is that Gmail API is not enabled in your Google Cloud Console, and the OAuth consent screen is not properly configured with the required scopes.
