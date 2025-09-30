import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createSupabaseServiceClient } from '@/lib/supabase';
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

    // Check if Gmail API credentials are configured
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.log('Gmail API credentials not configured');
      return NextResponse.json({
        messages: [],
        nextPageToken: null,
        resultSizeEstimate: 0,
        error: 'Gmail not configured',
        message: 'Gmail API credentials are not configured. Please set up Google OAuth credentials to connect Gmail.'
      });
    }

    const searchParams = request.nextUrl.searchParams;
    const pageToken = searchParams.get('pageToken') || undefined;
    const maxResults = parseInt(searchParams.get('maxResults') || '20');
    const labelIds = searchParams.get('labelIds')?.split(',') || ['INBOX'];
    const q = searchParams.get('q') || undefined;

    // Check if user has Gmail connected
    const supabase = createSupabaseServiceClient();
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, google_id')
      .eq('clerk_id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user data:', userError);
      return NextResponse.json({
        messages: [],
        nextPageToken: null,
        resultSizeEstimate: 0,
        error: 'Database error',
        message: 'Failed to fetch user data. Please try again.'
      });
    }

    if (!userData?.google_id) {
      console.log('User has not connected Gmail yet');
      return NextResponse.json({
        messages: [],
        nextPageToken: null,
        resultSizeEstimate: 0,
        error: 'Gmail not connected',
        message: 'Gmail not connected. Please connect your Gmail account to see real emails.'
      });
    }

    // Check if user has Gmail tokens
    const { data: tokenData, error: tokenError } = await supabase
      .from('tokens')
      .select('id')
      .eq('user_id', userData.id)
      .single();

    if (tokenError || !tokenData) {
      console.log('User has not connected Gmail tokens yet');
      return NextResponse.json({
        messages: [],
        nextPageToken: null,
        resultSizeEstimate: 0,
        error: 'Gmail not connected',
        message: 'Gmail not connected. Please connect your Gmail account to see real emails.'
      });
    }

    // Create Gmail client and fetch messages
    const gmailClient = createGmailClient(userId);
    
    try {
      // List messages from Gmail API
      const response = await gmailClient.listMessages(labelIds, maxResults, pageToken, q);
      
      console.log('Gmail API response:', { 
        messageCount: response.messages?.length || 0, 
        hasMessages: !!response.messages,
        nextPageToken: response.nextPageToken 
      });

      if (!response.messages || response.messages.length === 0) {
        return NextResponse.json({
          messages: [],
          nextPageToken: response.nextPageToken,
          resultSizeEstimate: response.resultSizeEstimate || 0,
        });
      }

      // Fetch detailed message data for each message
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

      return NextResponse.json({
        messages: validMessages,
        nextPageToken: response.nextPageToken,
        resultSizeEstimate: response.resultSizeEstimate,
      });

    } catch (error) {
      console.error('Gmail API error:', error);
      
      // Handle specific Gmail API errors
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          return NextResponse.json({
            messages: [],
            nextPageToken: null,
            resultSizeEstimate: 0,
            error: 'Gmail not connected',
            message: 'Gmail authentication expired. Please reconnect your Gmail account.'
          });
        } else if (error.message.includes('403')) {
          return NextResponse.json({
            messages: [],
            nextPageToken: null,
            resultSizeEstimate: 0,
            error: 'Gmail access denied',
            message: 'Gmail access denied. Please check your Gmail permissions.'
          });
        } else if (error.message.includes('429')) {
          return NextResponse.json({
            messages: [],
            nextPageToken: null,
            resultSizeEstimate: 0,
            error: 'Rate limited',
            message: 'Gmail API rate limit exceeded. Please try again later.'
          });
        }
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch messages from Gmail',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error fetching Gmail messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}