import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createSupabaseServerClient } from '@/lib/supabase';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Get user from Clerk auth
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, name, avatarUrl } = body;

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single();

    if (existingUser) {
      return NextResponse.json({ 
        success: true, 
        message: 'User already exists',
        user: existingUser 
      });
    }

    // Create new user in Supabase
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        clerk_id: userId,
        email,
        name,
        avatar_url: avatarUrl,
        settings: {
          signature: '',
          defaultSnoozePresets: {
            laterToday: 3,
            tomorrow: true,
            weekend: true,
            nextWeek: true,
          },
          keyboardShortcuts: true,
          theme: 'light',
          notificationsEnabled: false,
        },
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      user: newUser 
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
