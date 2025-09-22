import { NextRequest, NextResponse } from 'next/server';
import { verifyUserJWT } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get auth token from header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    const userId = verifyUserJWT(token);
    
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    // Get user settings from database
    const supabase = createSupabaseServerClient();
    const { data: user, error } = await supabase
      .from('users')
      .select('settings')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching settings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch settings' }, 
        { status: 500 }
      );
    }
    
    // Return settings or default values
    return NextResponse.json({
      settings: user?.settings || {
        signature: '',
        defaultSnoozePresets: {
          laterToday: 3, // hours
          tomorrow: true,
          weekend: true,
          nextWeek: true,
        },
        keyboardShortcuts: true,
        theme: 'light',
        notificationsEnabled: false,
      },
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get auth token from header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    const userId = verifyUserJWT(token);
    
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    // Get request body
    const body = await request.json();
    const { settings } = body;
    
    if (!settings) {
      return NextResponse.json(
        { error: 'Settings are required' }, 
        { status: 400 }
      );
    }
    
    // Update user settings in database
    const supabase = createSupabaseServerClient();
    const { error } = await supabase
      .from('users')
      .update({ settings })
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating settings:', error);
      return NextResponse.json(
        { error: 'Failed to update settings' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' }, 
      { status: 500 }
    );
  }
}
