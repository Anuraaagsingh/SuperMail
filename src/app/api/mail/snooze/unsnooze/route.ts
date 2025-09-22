import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@supermail/lib/supabase';
import { getValidAccessToken } from '@supermail/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Get auth token from request
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token and get user ID
    const supabase = createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get request body
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Missing snooze ID' }, { status: 400 });
    }
    
    // Get snoozed email
    const { data: snooze, error: fetchError } = await supabase
      .from('snoozes')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    if (fetchError || !snooze) {
      return NextResponse.json({ error: 'Snoozed email not found' }, { status: 404 });
    }
    
    // Get Gmail access token
    const accessToken = await getValidAccessToken(user.id);
    
    // Restore original labels
    const originalLabels = snooze.original_labels || [];
    
    // Modify labels in Gmail (remove SNOOZED label, add back original labels)
    const modifyLabelsResponse = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${snooze.message_id}/modify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        removeLabelIds: ['SNOOZED'],
        addLabelIds: originalLabels,
      }),
    });
    
    if (!modifyLabelsResponse.ok) {
      const errorData = await modifyLabelsResponse.json();
      return NextResponse.json({ error: 'Failed to modify labels', details: errorData }, { status: 500 });
    }
    
    // Delete snooze record
    const { error: deleteError } = await supabase
      .from('snoozes')
      .delete()
      .eq('id', id);
    
    if (deleteError) {
      console.error('Error deleting snooze record:', deleteError);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error unsnoozing email:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
