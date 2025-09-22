import { NextRequest, NextResponse } from 'next/server';
import { createGmailClient } from '@/lib/gmail';
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
    const { id, subject, body_html, to, cc, bcc } = body;
    
    if (!subject || !to || !Array.isArray(to)) {
      return NextResponse.json({ error: 'Invalid draft data' }, { status: 400 });
    }
    
    const supabase = createSupabaseServerClient();
    
    // Create or update draft
    if (id) {
      // Update existing draft
      const { error } = await supabase
        .from('drafts')
        .update({
          subject,
          body_html,
          to,
          cc: cc || [],
          bcc: bcc || [],
          last_saved_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error updating draft:', error);
        return NextResponse.json(
          { error: 'Failed to update draft' }, 
          { status: 500 }
        );
      }
      
      return NextResponse.json({ id });
    } else {
      // Create new draft
      const { data, error } = await supabase
        .from('drafts')
        .insert({
          user_id: userId,
          subject,
          body_html,
          to,
          cc: cc || [],
          bcc: bcc || [],
          last_saved_at: new Date().toISOString(),
        })
        .select('id')
        .single();
      
      if (error || !data) {
        console.error('Error creating draft:', error);
        return NextResponse.json(
          { error: 'Failed to create draft' }, 
          { status: 500 }
        );
      }
      
      return NextResponse.json({ id: data.id });
    }
  } catch (error) {
    console.error('Error saving draft:', error);
    return NextResponse.json(
      { error: 'Failed to save draft' }, 
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
    
    // Get draft ID from query params
    const searchParams = request.nextUrl.searchParams;
    const draftId = searchParams.get('id');
    
    if (!draftId) {
      // List all drafts
      const supabase = createSupabaseServerClient();
      const { data, error } = await supabase
        .from('drafts')
        .select('*')
        .eq('user_id', userId)
        .order('last_saved_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching drafts:', error);
        return NextResponse.json(
          { error: 'Failed to fetch drafts' }, 
          { status: 500 }
        );
      }
      
      return NextResponse.json({ drafts: data });
    } else {
      // Get specific draft
      const supabase = createSupabaseServerClient();
      const { data, error } = await supabase
        .from('drafts')
        .select('*')
        .eq('id', draftId)
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching draft:', error);
        return NextResponse.json(
          { error: 'Failed to fetch draft' }, 
          { status: 500 }
        );
      }
      
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Error fetching draft:', error);
    return NextResponse.json(
      { error: 'Failed to fetch draft' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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
    
    // Get draft ID from query params
    const searchParams = request.nextUrl.searchParams;
    const draftId = searchParams.get('id');
    
    if (!draftId) {
      return NextResponse.json(
        { error: 'Draft ID is required' }, 
        { status: 400 }
      );
    }
    
    // Delete draft
    const supabase = createSupabaseServerClient();
    const { error } = await supabase
      .from('drafts')
      .delete()
      .eq('id', draftId)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error deleting draft:', error);
      return NextResponse.json(
        { error: 'Failed to delete draft' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting draft:', error);
    return NextResponse.json(
      { error: 'Failed to delete draft' }, 
      { status: 500 }
    );
  }
}
