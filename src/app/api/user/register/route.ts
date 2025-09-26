import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createSupabaseServiceClient } from '@/lib/supabase';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Get user from Clerk auth
    const { userId } = await auth();

    console.log('User registration attempt for Clerk ID:', userId);

    if (!userId) {
      console.log('No Clerk user ID found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, name, avatarUrl } = body;

    console.log('Registration data:', { email, name, avatarUrl });

    if (!email || !name) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    console.log('Creating Supabase service client...');
    const supabase = createSupabaseServiceClient();
    console.log('Supabase client created successfully');

    // Check if user already exists
    console.log('Checking for existing user with clerk_id:', userId);
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing user:', checkError);
      return NextResponse.json(
        { 
          error: 'Failed to check existing user',
          details: checkError.message,
          code: checkError.code,
          hint: checkError.hint
        },
        { status: 500 }
      );
    }

    if (existingUser) {
      console.log('User already exists:', existingUser);
      return NextResponse.json({ 
        success: true, 
        message: 'User already exists',
        user: existingUser 
      });
    }

    // Create new user in Supabase
    console.log('Creating new user in Supabase...');
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
        { 
          error: 'Failed to create user', 
          details: error.message,
          code: error.code,
          hint: error.hint
        },
        { status: 500 }
      );
    }

    console.log('User created successfully:', newUser);

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
