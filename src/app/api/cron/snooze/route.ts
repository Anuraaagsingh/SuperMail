import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { createGmailClient } from '@/lib/gmail';

// This endpoint should be called by a cron job every few minutes
export async function GET() {
  try {
    const supabase = createSupabaseServerClient();
    
    // Get expired snoozes
    const now = new Date().toISOString();
    const { data: expiredSnoozes, error } = await supabase
      .from('snoozes')
      .select('id, user_id, message_id, original_labels')
      .lte('snoozed_until', now);
    
    if (error) {
      console.error('Error fetching expired snoozes:', error);
      return NextResponse.json(
        { error: 'Failed to fetch expired snoozes' }, 
        { status: 500 }
      );
    }
    
    if (!expiredSnoozes || expiredSnoozes.length === 0) {
      return NextResponse.json({ message: 'No expired snoozes' });
    }
    
    // Group snoozes by user for efficiency
    const snoozesByUser: Record<string, any[]> = {};
    expiredSnoozes.forEach(snooze => {
      if (!snoozesByUser[snooze.user_id]) {
        snoozesByUser[snooze.user_id] = [];
      }
      snoozesByUser[snooze.user_id].push(snooze);
    });
    
    // Process each user's snoozes
    const results = await Promise.all(
      Object.entries(snoozesByUser).map(async ([userId, snoozes]) => {
        const gmailClient = createGmailClient(userId);
        
        // Process each snooze for this user
        const snoozeResults = await Promise.all(
          snoozes.map(async (snooze) => {
            try {
              // Add INBOX label back and remove SNOOZED label
              await gmailClient.modifyLabels(
                snooze.message_id,
                ['INBOX'],
                ['SNOOZED']
              );
              
              // Delete the snooze record
              await supabase
                .from('snoozes')
                .delete()
                .eq('id', snooze.id);
              
              return { 
                messageId: snooze.message_id, 
                success: true 
              };
            } catch (err) {
              console.error(`Error processing snooze ${snooze.id}:`, err);
              return { 
                messageId: snooze.message_id, 
                success: false, 
                error: err instanceof Error ? err.message : 'Unknown error' 
              };
            }
          })
        );
        
        return {
          userId,
          processed: snoozeResults.length,
          successful: snoozeResults.filter(r => r.success).length,
          failed: snoozeResults.filter(r => !r.success).length,
        };
      })
    );
    
    return NextResponse.json({
      processed: expiredSnoozes.length,
      results,
    });
  } catch (error) {
    console.error('Error processing snoozes:', error);
    return NextResponse.json(
      { error: 'Failed to process snoozes' }, 
      { status: 500 }
    );
  }
}
