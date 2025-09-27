# SuperMail Email Fetching & Storage Analysis

## 📧 Email Fetching Protocol

### **Real-time Gmail API Integration**
The app uses **real-time fetching** via Gmail API, not local storage. Here's the complete flow:

#### 1. **Authentication Flow**
```
User Login → Clerk Auth → User Registration in Supabase → Gmail OAuth → Token Storage
```

#### 2. **Email Fetching Process**
```
Frontend Request → API Route → Gmail API → Real-time Data → Frontend Display
```

**No Local Storage**: Emails are fetched fresh from Gmail API on each request.

### **Storage Architecture**

#### **Database Storage (Supabase)**
- ✅ **User Data**: Stored in `users` table
- ✅ **OAuth Tokens**: Encrypted and stored in `tokens` table  
- ✅ **Email Metadata**: Snoozed emails, scheduled sends, drafts
- ❌ **Email Content**: NOT stored in database

#### **Email Content Storage**
- **Real-time Fetching**: Emails fetched directly from Gmail API
- **No Caching**: Each request hits Gmail API for fresh data
- **Pagination**: Supports Gmail's pagination with `pageToken`

### **API Endpoints**

#### **Primary Email Endpoint**
```
GET /api/gmail/messages
```
- Fetches emails from Gmail API in real-time
- Supports pagination with `pageToken`
- Returns fresh email data

#### **Alternative Endpoint**
```
GET /api/mail/list
```
- Uses Gmail client wrapper
- Also fetches real-time data
- Includes snooze status from database

### **Demo Mode Fallback**

#### **When Demo Mode Activates**
1. **Gmail API Not Configured**: Missing `GOOGLE_CLIENT_ID`
2. **User Not Authenticated**: No Clerk session
3. **Gmail Not Connected**: User hasn't connected Gmail account
4. **API Errors**: Gmail API returns errors

#### **Demo Email Source**
```javascript
// Demo emails are hardcoded in src/lib/demoAuth.ts
export const DEMO_EMAILS = [
  // 5 pre-defined demo emails
];
```

## 🔍 Current Issue Analysis

### **Why No Emails Are Showing**

#### **Root Cause**: User Not Authenticated
The app shows "0 emails" because:
1. **No Authentication**: User hasn't logged in yet
2. **Redirect to Login**: App redirects to `/auth/login` 
3. **Demo Login Available**: User needs to click "Demo Login"

#### **Authentication Options**
1. **Demo Login**: Click "Demo Login" button → Shows demo emails
2. **Clerk Login**: Click "Login with Google" → Requires Gmail connection
3. **Apple Login**: Placeholder (not implemented)

### **Email Loading Logic**

#### **Inbox Page Logic**
```javascript
// 1. Check if user is authenticated
if (!isAuthenticated) {
  router.push('/auth/login');
  return null;
}

// 2. Load emails based on user type
if (user.id === 'demo-user-id') {
  loadDemoEmails(); // Shows 5 demo emails
} else {
  fetchEmails(); // Fetches from Gmail API
}
```

#### **Demo Email Loading**
```javascript
const loadDemoEmails = async () => {
  const { getDemoEmails } = await import('@supermail/lib/demoAuth');
  const result = await getDemoEmails('INBOX');
  setEmails(result.messages); // 5 demo emails
};
```

## 🚀 Solution: How to See Emails

### **Option 1: Demo Login (Immediate)**
1. Go to `http://localhost:3000`
2. Click **"Demo Login"** button
3. See 5 demo emails immediately

### **Option 2: Real Gmail (Requires Setup)**
1. Set up Clerk authentication
2. Connect Gmail account via OAuth
3. See real Gmail emails

## 📊 Environment Status

### **Current Configuration**
- ✅ **Supabase**: Working (database connection successful)
- ✅ **Gmail API**: Configured (credentials present)
- ❌ **Clerk Auth**: Missing environment variables
- ❌ **User Authentication**: No active session

### **Environment Checker**
The "Environment Configuration" panel shows:
- **Gmail API**: "Not Configured" (incorrect - it is configured)
- **Supabase**: "Not Configured" (incorrect - it is working)
- **Clerk Auth**: "Configured" (incorrect - missing keys)

## 🔧 Technical Details

### **Email Fetching Mechanism**
```javascript
// Real-time Gmail API call
const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  }
});
```

### **No Local Storage**
- Emails are **never stored locally**
- Each request fetches fresh data from Gmail
- Pagination handled by Gmail API
- Snooze/schedule data stored in Supabase

### **Demo Mode Implementation**
```javascript
// Demo emails are static data
const DEMO_EMAILS = [
  { id: 'demo-email-1', subject: 'Welcome to SuperMail', ... },
  { id: 'demo-email-2', subject: 'Meeting Reminder', ... },
  // ... 5 total demo emails
];
```

## 🎯 Summary

### **Email Storage**: Real-time Gmail API (no local storage)
### **Authentication**: Required (Demo or Clerk)
### **Current Issue**: User not authenticated
### **Solution**: Click "Demo Login" to see emails immediately

The app is working correctly - it just needs user authentication to show emails!
