# Supabase Connection Fix Guide

## 🚨 **Critical Issue: No Supabase Requests**

Your Supabase dashboard shows **0 requests** across all services, which means your application is not connecting to Supabase at all. This is why authentication and data operations are failing.

## 🔍 **Root Cause Analysis**

The issue is likely one of these:

1. **Environment Variables Not Loaded** - Supabase credentials not available in preview environment
2. **Incorrect Variable Names** - Mismatch between code and Vercel environment variables
3. **Supabase Client Not Initialized** - Application not creating Supabase clients properly
4. **Network/Connection Issues** - Firewall or network blocking Supabase requests

## 🛠️ **Step 1: Test Supabase Connection**

### Test the Debug API Endpoint
Visit this URL to check Supabase connection:
```
https://preview.mastermail.live/api/debug/supabase
```

This will show you:
- Whether environment variables are loaded
- If Supabase client can be created
- If database queries work

### Run Local Connection Test
```bash
# In your project directory
node test-supabase-connection.js
```

## 🛠️ **Step 2: Verify Environment Variables**

Based on your Vercel setup, ensure these exact variables are set:

### Required Supabase Variables (All Environments):
```
supermail_NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
supermail_NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
supermail_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
supermail_SUPABASE_JWT_SECRET=your_supabase_jwt_secret
```

### Fallback Variables (if needed):
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 🛠️ **Step 3: Fix Supabase Client Configuration**

Your Supabase client configuration looks correct, but let me create an enhanced version with better error handling:

```typescript
// Enhanced Supabase client with better error handling
export const createSupabaseServiceClient = () => {
  const supabaseUrl = process.env.supermail_NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.supermail_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl) {
    throw new Error('Supabase URL not configured. Please set supermail_NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL');
  }
  
  if (!supabaseServiceKey) {
    throw new Error('Supabase service key not configured. Please set supermail_SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_ROLE_KEY');
  }
  
  console.log('🔗 Creating Supabase client with URL:', supabaseUrl);
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};
```

## 🛠️ **Step 4: Test Database Operations**

Create a simple test to verify database connectivity:

```typescript
// Test database connection
export async function testSupabaseConnection() {
  try {
    const supabase = createSupabaseServiceClient();
    
    // Test simple query
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase query error:', error);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Supabase connection successful');
    return { success: true, data };
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return { success: false, error: error.message };
  }
}
```

## 🛠️ **Step 5: Fix RLS Policies (Performance Issues)**

The 96 performance warnings are due to duplicate Row Level Security (RLS) policies. Here's how to fix them:

### Clean Up Duplicate Policies
Run this SQL in your Supabase SQL editor:

```sql
-- Remove duplicate policies and keep only one per table/role/action
-- This will fix the performance warnings

-- For users table
DROP POLICY IF EXISTS "Service role can access all data" ON public.users;
DROP POLICY IF EXISTS "Service role can manage all data" ON public.users;

-- Create single comprehensive policy
CREATE POLICY "Service role full access" ON public.users
FOR ALL TO service_role
USING (true)
WITH CHECK (true);

-- Repeat for other tables...
-- actions_log, drafts, scheduled_sends, snoozes, tokens
```

## 🛠️ **Step 6: Force Redeploy**

After fixing environment variables:

```bash
git commit --allow-empty -m "Fix Supabase connection and environment variables"
git push origin your-preview-branch
```

## 🧪 **Testing Checklist**

- [ ] Debug API endpoint shows Supabase connection working
- [ ] Environment variables are loaded correctly
- [ ] Supabase client can be created
- [ ] Database queries execute successfully
- [ ] Supabase dashboard shows requests
- [ ] Authentication works with Supabase
- [ ] Demo login works (uses Supabase)

## 🔧 **Common Issues & Solutions**

### Issue 1: Environment Variables Not Set
**Symptoms:** Debug API shows "Environment variables not configured"
**Solution:** 
- Set variables in Vercel dashboard
- Make sure "Preview" is checked
- Redeploy

### Issue 2: Supabase Client Creation Fails
**Symptoms:** "Failed to create Supabase client"
**Solution:**
- Check URL format (should start with https://)
- Verify service key is correct
- Check Supabase project status

### Issue 3: Database Queries Fail
**Symptoms:** "Supabase query failed"
**Solution:**
- Check RLS policies
- Verify table exists
- Check service key permissions

### Issue 4: No Requests in Supabase Dashboard
**Symptoms:** Dashboard shows 0 requests
**Solution:**
- Verify environment variables are loaded
- Check network connectivity
- Test with debug API endpoint

## 📞 **If Still Having Issues**

1. **Check the debug API**: https://preview.mastermail.live/api/debug/supabase
2. **Run connection test**: `node test-supabase-connection.js`
3. **Check Vercel logs** for any errors
4. **Verify Supabase project** is active and accessible
5. **Test with fresh browser session**

## 🎯 **Expected Results**

After completing these steps:
- ✅ Supabase dashboard shows requests
- ✅ Debug API endpoint works
- ✅ Database operations succeed
- ✅ Authentication works
- ✅ Demo login works
- ✅ Performance warnings reduced

The key issue is that your application isn't connecting to Supabase at all. Once the connection is established, you should see requests in your Supabase dashboard and all functionality should work.
