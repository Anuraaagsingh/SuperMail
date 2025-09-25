import { NextRequest, NextResponse } from 'next/server';
import { createGmailClient } from '@/lib/gmail';
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
    
    // Get request body
    const body = await request.json();
    const { action, messageId, threadId, addLabelIds, removeLabelIds, snoozeUntil } = body;
    
    if (!action || !messageId) {
      return NextResponse.json({ error: 'Action and message ID are required' }, { status: 400 });
    }
    
    // Create Gmail client
    const gmailClient = createGmailClient(userId);
    
    // Log action
    const supabase = createSupabaseServerClient();
    await supabase.from('actions_log').insert({
      user_id: userId,
      action_type: action,
      payload: { messageId, threadId, addLabelIds, removeLabelIds, snoozeUntil },
    });
    
    // Perform action
    let result;
    
    switch (action) {
      case 'archive':
        result = await gmailClient.modifyLabels(messageId, [], ['INBOX']);
        break;
        
      case 'trash':
        result = await gmailClient.trashMessage(messageId);
        break;
        
      case 'markRead':
        result = await gmailClient.modifyLabels(messageId, [], ['UNREAD']);
        break;
        
      case 'markUnread':
        result = await gmailClient.modifyLabels(messageId, ['UNREAD'], []);
        break;
        
      case 'star':
        result = await gmailClient.modifyLabels(messageId, ['STARRED'], []);
        break;
        
      case 'unstar':
        result = await gmailClient.modifyLabels(messageId, [], ['STARRED']);
        break;
        
      case 'modifyLabels':
        if (!addLabelIds && !removeLabelIds) {
          return NextResponse.json(
            { error: 'Add or remove label IDs are required' }, 
            { status: 400 }
          );
        }
        result = await gmailClient.modifyLabels(
          messageId, 
          addLabelIds || [], 
          removeLabelIds || []
        );
        break;
        
      case 'snooze':
        if (!snoozeUntil) {
          return NextResponse.json(
            { error: 'Snooze until date is required' }, 
            { status: 400 }
          );
        }
        
        // Get message to save original labels
        const message = await gmailClient.getMessage(messageId, 'metadata');
        const originalLabels = message.labelIds || [];
        
        // Remove from inbox and add SNOOZED label
        await gmailClient.modifyLabels(messageId, ['SNOOZED'], ['INBOX']);
        
        // Store snooze in database
        await supabase.from('snoozes').insert({
          user_id: userId,
          message_id: messageId,
          snoozed_until: snoozeUntil,
          original_labels: originalLabels,
        });
        
        result = { success: true, snoozed: true };
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' }, 
          { status: 400 }
        );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error performing action:', error);
    return NextResponse.json(
      { error: 'Failed to perform action' }, 
      { status: 500 }
    );
  }
}
