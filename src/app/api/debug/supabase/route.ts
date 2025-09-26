import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/lib/supabase';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('=== Supabase Debug Info ===');
    
    // Check environment variables
    const supabaseUrl = process.env.supermail_NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.supermail_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Not set');
    console.log('Service Key:', supabaseServiceKey ? 'Set' : 'Not set');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        error: 'Environment variables not configured',
        supabaseUrl: !!supabaseUrl,
        supabaseServiceKey: !!supabaseServiceKey,
        envVars: {
          supermail_NEXT_PUBLIC_SUPABASE_URL: !!process.env.supermail_NEXT_PUBLIC_SUPABASE_URL,
          NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          supermail_SUPABASE_SERVICE_ROLE_KEY: !!process.env.supermail_SUPABASE_SERVICE_ROLE_KEY,
          SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        }
      });
    }

    // Test Supabase connection
    const supabase = createSupabaseServiceClient();
    
    // Try a simple query
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({
        error: 'Supabase query failed',
        details: error.message,
        code: error.code,
        hint: error.hint
      });
    }

    console.log('Supabase connection successful');
    
    return NextResponse.json({
      success: true,
      message: 'Supabase connection working',
      data: data
    });

  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({
      error: 'Debug endpoint failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
