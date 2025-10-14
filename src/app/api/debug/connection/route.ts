import { NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/lib/supabase';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('🔍 Comprehensive Connection Debug Started');
    
    const results = {
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
        appUrl: process.env.NEXT_PUBLIC_APP_URL,
      },
      supabase: {
        configured: false,
        connection: false,
        query: false,
        error: null,
        details: {}
      },
      clerk: {
        configured: false,
        publishableKey: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        secretKey: !!process.env.CLERK_SECRET_KEY,
      },
      google: {
        configured: false,
        clientId: !!process.env.GOOGLE_CLIENT_ID,
        clientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      }
    };
    
    // Test Supabase Configuration
    console.log('🔍 Testing Supabase configuration...');
    
    const supabaseUrl = process.env.supermail_NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.supermail_NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.supermail_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    results.supabase.details = {
      url: !!supabaseUrl,
      anonKey: !!supabaseAnonKey,
      serviceKey: !!supabaseServiceKey,
      urlValue: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'Not set',
      envVars: {
        supermail_NEXT_PUBLIC_SUPABASE_URL: !!process.env.supermail_NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        supermail_NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.supermail_NEXT_PUBLIC_SUPABASE_ANON_KEY,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        supermail_SUPABASE_SERVICE_ROLE_KEY: !!process.env.supermail_SUPABASE_SERVICE_ROLE_KEY,
        SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      }
    };
    
    if (supabaseUrl && supabaseServiceKey) {
      results.supabase.configured = true;
      console.log('✅ Supabase environment variables configured');
      
      try {
        // Test Supabase client creation
        console.log('🔍 Testing Supabase client creation...');
        const supabase = createSupabaseServiceClient();
        results.supabase.connection = true;
        console.log('✅ Supabase client created successfully');
        
        // Test database query
        console.log('🔍 Testing database query...');
        const { data, error } = await supabase
          .from('users')
          .select('count')
          .limit(1);
        
        if (error) {
          results.supabase.error = {
            message: error.message,
            code: error.code,
            hint: error.hint,
            details: error.details
          };
          console.error('❌ Supabase query failed:', error);
        } else {
          results.supabase.query = true;
          results.supabase.details.queryResult = data;
          console.log('✅ Supabase query successful');
        }
        
      } catch (error) {
        results.supabase.error = {
          message: error instanceof Error ? error.message : 'Unknown error',
          type: 'client_creation_error'
        };
        console.error('❌ Supabase client creation failed:', error);
      }
    } else {
      results.supabase.error = {
        message: 'Missing required environment variables',
        type: 'configuration_error'
      };
      console.error('❌ Supabase not configured - missing environment variables');
    }
    
    // Test Clerk Configuration
    if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY) {
      results.clerk.configured = true;
      console.log('✅ Clerk environment variables configured');
    } else {
      console.error('❌ Clerk not configured - missing environment variables');
    }
    
    // Test Google OAuth Configuration
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      results.google.configured = true;
      console.log('✅ Google OAuth environment variables configured');
    } else {
      console.error('❌ Google OAuth not configured - missing environment variables');
    }
    
    // Summary
    const summary = {
      allConfigured: results.supabase.configured && results.clerk.configured && results.google.configured,
      supabaseWorking: results.supabase.configured && results.supabase.connection && results.supabase.query,
      readyForAuth: results.supabase.configured && results.clerk.configured,
      readyForGmail: results.google.configured && results.supabase.configured,
    };
    
    console.log('🔍 Connection test completed:', summary);
    
    return NextResponse.json({
      success: true,
      summary,
      results,
      recommendations: generateRecommendations(results)
    });
    
  } catch (error) {
    console.error('❌ Connection debug failed:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

function generateRecommendations(results: any): string[] {
  const recommendations = [];
  
  if (!results.supabase.configured) {
    recommendations.push('Set Supabase environment variables in Vercel dashboard');
  }
  
  if (!results.clerk.configured) {
    recommendations.push('Set Clerk environment variables in Vercel dashboard');
  }
  
  if (!results.google.configured) {
    recommendations.push('Set Google OAuth environment variables in Vercel dashboard');
  }
  
  if (results.supabase.configured && !results.supabase.connection) {
    recommendations.push('Check Supabase URL and service key format');
  }
  
  if (results.supabase.connection && !results.supabase.query) {
    recommendations.push('Check Supabase RLS policies and database permissions');
  }
  
  if (results.supabase.error) {
    recommendations.push('Check Vercel deployment logs for detailed error information');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('All systems configured correctly! Try testing authentication.');
  }
  
  return recommendations;
}
