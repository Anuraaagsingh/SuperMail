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
      return NextResponse.json({ error: 'Missing scheduled email ID' }, { status: 400 });
    }
    
    // Get scheduled email
    const { data: scheduledEmail, error: fetchError } = await supabase
      .from('scheduled_sends')
      .select('*, drafts(*)')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    if (fetchError || !scheduledEmail) {
      return NextResponse.json({ error: 'Scheduled email not found' }, { status: 404 });
    }
    
    // Get draft
    const draft = scheduledEmail.drafts;
    if (!draft) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
    }
    
    // Get Gmail access token
    const accessToken = await getValidAccessToken(user.id);
    
    // Prepare email
    const email = {
      to: draft.to,
      cc: draft.cc || [],
      bcc: draft.bcc || [],
      subject: draft.subject,
      bodyHtml: draft.body_html,
    };
    
    // Send email via Gmail API
    const gmailResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: btoa(
          `To: ${email.to.join(', ')}\r\n` +
          (email.cc.length ? `Cc: ${email.cc.join(', ')}\r\n` : '') +
          (email.bcc.length ? `Bcc: ${email.bcc.join(', ')}\r\n` : '') +
          `Subject: ${email.subject}\r\n` +
          'Content-Type: text/html; charset=utf-8\r\n\r\n' +
          email.bodyHtml
        ).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
      }),
    });
    
    if (!gmailResponse.ok) {
      const errorData = await gmailResponse.json();
      return NextResponse.json({ error: 'Failed to send email', details: errorData }, { status: 500 });
    }
    
    // Update scheduled email status
    const { error: updateError } = await supabase
      .from('scheduled_sends')
      .update({ status: 'sent' })
      .eq('id', id);
    
    if (updateError) {
      console.error('Error updating scheduled email status:', updateError);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending scheduled email:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
