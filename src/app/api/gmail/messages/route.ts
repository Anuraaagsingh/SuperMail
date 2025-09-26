import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createSupabaseServiceClient } from '@/lib/supabase';
import { getValidAccessToken } from '@/lib/auth';

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
    const maxResults = parseInt(searchParams.get('maxResults') || '10');

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

    // Get user's Gmail access token
    let accessToken;
    try {
      accessToken = await getValidAccessToken(userId);
    } catch (error) {
      console.error('Error getting Gmail access token:', error);
      return NextResponse.json({
        messages: [],
        nextPageToken: null,
        resultSizeEstimate: 0,
        error: 'Gmail not connected',
        message: 'Gmail not connected. Please connect your Gmail account to see real emails.'
      });
    }

    // Fetch messages from Gmail API
    const gmailUrl = new URL('https://gmail.googleapis.com/gmail/v1/users/me/messages');
    if (pageToken) {
      gmailUrl.searchParams.set('pageToken', pageToken);
    }
    gmailUrl.searchParams.set('maxResults', maxResults.toString());

    const response = await fetch(gmailUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gmail API error:', errorData);
      return NextResponse.json(
        { 
          error: 'Failed to fetch messages from Gmail',
          details: errorData.error?.message || 'Unknown Gmail API error'
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log('Gmail API response:', { 
      messageCount: data.messages?.length || 0, 
      hasMessages: !!data.messages,
      nextPageToken: data.nextPageToken 
    });

    // Fetch detailed message data for each message
    const messages = await Promise.all(
      data.messages?.map(async (message: any) => {
        const messageResponse = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!messageResponse.ok) {
          return null;
        }

        const messageData = await messageResponse.json();
        
        // Extract headers
        const headers = messageData.payload?.headers || [];
        const getHeader = (name: string) => 
          headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value || '';

        // Extract body
        let body = '';
        if (messageData.payload?.body?.data) {
          body = Buffer.from(messageData.payload.body.data, 'base64').toString();
        } else if (messageData.payload?.parts) {
          const textPart = messageData.payload.parts.find((part: any) => 
            part.mimeType === 'text/plain' || part.mimeType === 'text/html'
          );
          if (textPart?.body?.data) {
            body = Buffer.from(textPart.body.data, 'base64').toString();
          }
        }

        return {
          id: message.id,
          threadId: message.threadId,
          from: getHeader('From'),
          to: getHeader('To'),
          subject: getHeader('Subject'),
          date: getHeader('Date'),
          snippet: messageData.snippet || '',
          body: body,
          labels: messageData.labelIds || [],
          isRead: !messageData.labelIds?.includes('UNREAD'),
          isStarred: messageData.labelIds?.includes('STARRED') || false,
        };
      }) || []
    );

    // Filter out null messages
    const validMessages = messages.filter(msg => msg !== null);

    return NextResponse.json({
      messages: validMessages,
      nextPageToken: data.nextPageToken,
      resultSizeEstimate: data.resultSizeEstimate,
    });
  } catch (error) {
    console.error('Error fetching Gmail messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
