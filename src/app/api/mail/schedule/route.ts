import { NextRequest, NextResponse } from 'next/server';
import { verifyUserJWT } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase';

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
    const { draft_id, scheduled_at } = body;
    
    if (!draft_id || !scheduled_at) {
      return NextResponse.json(
        { error: 'Draft ID and scheduled time are required' }, 
        { status: 400 }
      );
    }
    
    const supabase = createSupabaseServerClient();
    
    // Verify draft exists and belongs to user
    const { data: draft, error: draftError } = await supabase
      .from('drafts')
      .select('id')
      .eq('id', draft_id)
      .eq('user_id', userId)
      .single();
    
    if (draftError || !draft) {
      return NextResponse.json(
        { error: 'Draft not found or access denied' }, 
        { status: 404 }
      );
    }
    
    // Create scheduled send record
    const { data, error } = await supabase
      .from('scheduled_sends')
      .insert({
        user_id: userId,
        draft_id,
        scheduled_at,
        status: 'pending',
      })
      .select('id')
      .single();
    
    if (error || !data) {
      console.error('Error scheduling email:', error);
      return NextResponse.json(
        { error: 'Failed to schedule email' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      id: data.id,
      scheduled_at,
    });
  } catch (error) {
    console.error('Error scheduling email:', error);
    return NextResponse.json(
      { error: 'Failed to schedule email' }, 
      { status: 500 }
    );
  }
}

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
    
    const supabase = createSupabaseServerClient();
    
    // Get all scheduled sends for user
    const { data, error } = await supabase
      .from('scheduled_sends')
      .select(`
        id,
        scheduled_at,
        status,
        created_at,
        drafts (
          id,
          subject,
          to,
          cc,
          bcc
        )
      `)
      .eq('user_id', userId)
      .order('scheduled_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching scheduled sends:', error);
      return NextResponse.json(
        { error: 'Failed to fetch scheduled sends' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ scheduled_sends: data });
  } catch (error) {
    console.error('Error fetching scheduled sends:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scheduled sends' }, 
      { status: 500 }
    );
  }
}
