import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createGmailClient, processGmailMessage } from '@/lib/gmail';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const label = searchParams.get('label') || 'INBOX';
    const pageToken = searchParams.get('pageToken') || undefined;
    const maxResults = parseInt(searchParams.get('maxResults') || '20', 10);
    const q = searchParams.get('q') || undefined;

    const gmailClient = createGmailClient(userId);

    // List threads
    const response = await gmailClient.listThreads([label], maxResults, pageToken, q);

    if (!response.threads || response.threads.length === 0) {
      return NextResponse.json({
        messages: [],
        nextPageToken: response.nextPageToken || null,
        resultSizeEstimate: response.resultSizeEstimate || 0,
      });
    }

    // Fetch full thread details and build summaries
    const summariesPromises = response.threads.map(async (thread: any) => {
      try {
        const fullThread = await gmailClient.getThread(thread.id);
        const messages = fullThread.messages || [];
        if (messages.length === 0) return null;

        const lastMsg = messages[messages.length - 1];
        const processed = processGmailMessage(lastMsg);

        const labelsSet = new Set<string>();
        messages.forEach((m: any) => (m.labelIds || []).forEach((l: string) => labelsSet.add(l)));

        return {
          id: thread.id,
          threadId: thread.id,
          from: processed.from,
          to: processed.to,
          subject: processed.subject,
          snippet: processed.snippet,
          date: processed.date,
          body: processed.htmlBody || processed.body,
          labels: Array.from(labelsSet),
          isRead: !lastMsg.labelIds?.includes('UNREAD'),
          isStarred: messages.some((m: any) => m.labelIds?.includes('STARRED')),
        };
      } catch (error) {
        console.error(`Error processing thread ${thread.id}:`, error);
        return null;
      }
    });

    const summaries = await Promise.all(summariesPromises);
    const validSummaries = summaries.filter((s) => s !== null);

    return NextResponse.json({
      messages: validSummaries,
      nextPageToken: response.nextPageToken,
      resultSizeEstimate: response.resultSizeEstimate,
    });
  } catch (error) {
    console.error('Error fetching threads:', error);
    return NextResponse.json({ error: 'Failed to fetch threads' }, { status: 500 });
  }
}


