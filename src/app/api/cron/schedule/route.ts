import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { createGmailClient } from '@/lib/gmail';
import { encodeBase64Url } from '@/lib/gmail';

// This endpoint should be called by a cron job every few minutes
export async function GET() {
  try {
    const supabase = createSupabaseServerClient();
    
    // Get due scheduled sends
    const now = new Date().toISOString();
    const { data: dueSchedules, error } = await supabase
      .from('scheduled_sends')
      .select(`
        id,
        user_id,
        draft_id,
        scheduled_at,
        drafts (
          id,
          subject,
          body_html,
          to,
          cc,
          bcc
        )
      `)
      .eq('status', 'pending')
      .lte('scheduled_at', now);
    
    if (error) {
      console.error('Error fetching due schedules:', error);
      return NextResponse.json(
        { error: 'Failed to fetch due schedules' }, 
        { status: 500 }
      );
    }
    
    if (!dueSchedules || dueSchedules.length === 0) {
      return NextResponse.json({ message: 'No due schedules' });
    }
    
    // Group schedules by user for efficiency
    const schedulesByUser: Record<string, any[]> = {};
    dueSchedules.forEach(schedule => {
      if (!schedulesByUser[schedule.user_id]) {
        schedulesByUser[schedule.user_id] = [];
      }
      schedulesByUser[schedule.user_id].push(schedule);
    });
    
    // Process each user's schedules
    const results = await Promise.all(
      Object.entries(schedulesByUser).map(async ([userId, schedules]) => {
        const gmailClient = createGmailClient(userId);
        
        // Process each schedule for this user
        const scheduleResults = await Promise.all(
          schedules.map(async (schedule) => {
            try {
              const draft = schedule.drafts;
              
              if (!draft) {
                throw new Error('Draft not found');
              }
              
              // Create email content
              const to = draft.to.join(', ');
              const cc = draft.cc?.join(', ') || '';
              const bcc = draft.bcc?.join(', ') || '';
              
              // Create MIME message
              const message = [
                'Content-Type: text/html; charset=utf-8',
                'MIME-Version: 1.0',
                `To: ${to}`,
                cc ? `Cc: ${cc}` : '',
                bcc ? `Bcc: ${bcc}` : '',
                `Subject: ${draft.subject}`,
                '',
                draft.body_html,
              ].filter(Boolean).join('\r\n');
              
              // Encode message
              const encodedMessage = encodeBase64Url(message);
              
              // Send email
              await gmailClient.sendMessage(encodedMessage);
              
              // Update schedule status
              await supabase
                .from('scheduled_sends')
                .update({ status: 'sent' })
                .eq('id', schedule.id);
              
              // Delete draft
              await supabase
                .from('drafts')
                .delete()
                .eq('id', draft.id);
              
              return { 
                scheduleId: schedule.id, 
                success: true 
              };
            } catch (err) {
              console.error(`Error processing schedule ${schedule.id}:`, err);
              
              // Update schedule status to failed
              await supabase
                .from('scheduled_sends')
                .update({ 
                  status: 'failed'
                })
                .eq('id', schedule.id);
              
              return { 
                scheduleId: schedule.id, 
                success: false, 
                error: err instanceof Error ? err.message : 'Unknown error' 
              };
            }
          })
        );
        
        return {
          userId,
          processed: scheduleResults.length,
          successful: scheduleResults.filter(r => r.success).length,
          failed: scheduleResults.filter(r => !r.success).length,
        };
      })
    );
    
    return NextResponse.json({
      processed: dueSchedules.length,
      results,
    });
  } catch (error) {
    console.error('Error processing scheduled sends:', error);
    return NextResponse.json(
      { error: 'Failed to process scheduled sends' }, 
      { status: 500 }
    );
  }
}
