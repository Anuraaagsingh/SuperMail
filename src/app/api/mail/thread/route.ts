import { NextRequest, NextResponse } from 'next/server';
import { createGmailClient, processGmailMessage } from '@/lib/gmail';
import { auth } from '@clerk/nextjs/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get user from Clerk auth
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get thread ID from query params
    const searchParams = request.nextUrl.searchParams;
    const threadId = searchParams.get('id');
    
    if (!threadId) {
      return NextResponse.json({ error: 'Thread ID is required' }, { status: 400 });
    }
    
    // Create Gmail client
    const gmailClient = createGmailClient(userId);
    
    // Get thread
    const thread = await gmailClient.getThread(threadId);

    const processedMessages = Array.isArray(thread.messages)
      ? thread.messages.map((m: any) => processGmailMessage(m))
      : [];

    return NextResponse.json({
      id: thread.id,
      historyId: thread.historyId,
      messages: processedMessages,
    });
  } catch (error) {
    console.error('Error fetching thread:', error);
    return NextResponse.json(
      { error: 'Failed to fetch thread' }, 
      { status: 500 }
    );
  }
}
