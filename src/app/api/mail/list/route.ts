import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { createGmailClient, processGmailMessage } from '@/lib/gmail';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get user from Clerk auth
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
      try {
        const messageDetails = await gmailClient.getMessage(message.id, 'full');
        return processGmailMessage(messageDetails);
      } catch (error) {
        console.error(`Error fetching message ${message.id}:`, error);
        return null;
      }
    });
    
    const messages = await Promise.all(messagePromises);
    
    // Filter out null messages (failed fetches)
    const validMessages = messages.filter(msg => msg !== null);
    
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
    const enrichedMessages = validMessages.map((message) => ({
      ...message,
      isSnoozed: snoozedMap.has(message.id),
      snoozedUntil: snoozedMap.get(message.id) || null,
    }));
    
    return NextResponse.json({
      messages: enrichedMessages,
      nextPageToken: response.nextPageToken,
      resultSizeEstimate: response.resultSizeEstimate,
    });
  } catch (error) {
    console.error('Error fetching mail:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mail' },
      { status: 500 }
    );
  }
}