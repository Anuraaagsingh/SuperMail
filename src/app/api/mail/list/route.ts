import { NextRequest, NextResponse } from 'next/server';
import { createGmailClient } from '@/lib/gmail';
import { verifyUserJWT } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase';

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
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const label = searchParams.get('label') || 'INBOX';
    const pageToken = searchParams.get('pageToken') || undefined;
    const maxResults = parseInt(searchParams.get('maxResults') || '20', 10);
    const q = searchParams.get('q') || undefined;
    
    // Create Gmail client
    const gmailClient = createGmailClient(userId);
    
    // List messages
    const response = await gmailClient.listMessages(
      [label],
      maxResults,
      pageToken,
      q
    );
    
    // If no messages, return empty array
    if (!response.messages) {
      return NextResponse.json({ 
        messages: [], 
        nextPageToken: null,
        resultSizeEstimate: 0
      });
    }
    
    // Get message details in parallel
    const messagePromises = response.messages.map(async (message: any) => {
      const messageDetails = await gmailClient.getMessage(message.id, 'metadata');
      return messageDetails;
    });
    
    const messages = await Promise.all(messagePromises);
    
    // Check for snoozed messages in Supabase
    const supabase = createSupabaseServerClient();
    const { data: snoozedMessages } = await supabase
      .from('snoozes')
      .select('message_id, snoozed_until')
      .eq('user_id', userId)
      .gt('snoozed_until', new Date().toISOString());
    
    // Create a map of snoozed message IDs
    const snoozedMap = new Map();
    if (snoozedMessages) {
      snoozedMessages.forEach((snooze) => {
        snoozedMap.set(snooze.message_id, snooze.snoozed_until);
      });
    }
    
    // Enrich messages with snooze data
    const enrichedMessages = messages.map((message: any) => {
      return {
        ...message,
        snoozedUntil: snoozedMap.get(message.id) || null,
      };
    });
    
    return NextResponse.json({
      messages: enrichedMessages,
      nextPageToken: response.nextPageToken || null,
      resultSizeEstimate: response.resultSizeEstimate || 0,
    });
  } catch (error) {
    console.error('Error listing messages:', error);
    return NextResponse.json(
      { error: 'Failed to list messages' }, 
      { status: 500 }
    );
  }
}
