import { getValidAccessToken } from './auth';

// Base URL for Gmail API
const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1/users/me';

// Exponential backoff for API rate limiting
const fetchWithRetry = async (url: string, options: RequestInit, retries = 3, delay = 1000) => {
  try {
    const response = await fetch(url, options);
    
    if (response.status === 429 && retries > 0) {
      // Rate limited, retry with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gmail API error: ${response.status} - ${errorText}`);
    }
    
    return response.json();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw error;
  }
};

// Create Gmail API client
export const createGmailClient = (userId: string) => {
  // Helper to get headers with access token
  const getHeaders = async () => {
    const accessToken = await getValidAccessToken(userId);
    return {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
  };
  
  return {
    // List messages in the user's mailbox
    listMessages: async (
      labelIds: string[] = ['INBOX'], 
      maxResults = 20, 
      pageToken?: string,
      q?: string
    ) => {
      const queryParams = new URLSearchParams();
      
      if (labelIds.length > 0) {
        labelIds.forEach(id => queryParams.append('labelIds', id));
      }
      
      if (maxResults) {
        queryParams.append('maxResults', maxResults.toString());
      }
      
      if (pageToken) {
        queryParams.append('pageToken', pageToken);
      }
      
      if (q) {
        queryParams.append('q', q);
      }
      
      const url = `${GMAIL_API_BASE}/messages?${queryParams.toString()}`;
      const headers = await getHeaders();
      
      return fetchWithRetry(url, { headers });
    },
    
    // Get a specific message with full details
    getMessage: async (messageId: string, format: 'full' | 'metadata' | 'minimal' = 'full') => {
      const url = `${GMAIL_API_BASE}/messages/${messageId}?format=${format}`;
      const headers = await getHeaders();
      
      return fetchWithRetry(url, { headers });
    },
    
    // Get a full thread
    getThread: async (threadId: string) => {
      const url = `${GMAIL_API_BASE}/threads/${threadId}`;
      const headers = await getHeaders();
      
      return fetchWithRetry(url, { headers });
    },
    
    // Modify message labels (used for archiving, marking read/unread, etc.)
    modifyLabels: async (messageId: string, addLabelIds: string[], removeLabelIds: string[]) => {
      const url = `${GMAIL_API_BASE}/messages/${messageId}/modify`;
      const headers = await getHeaders();
      
      return fetchWithRetry(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          addLabelIds,
          removeLabelIds,
        }),
      });
    },
    
    // Trash a message
    trashMessage: async (messageId: string) => {
      const url = `${GMAIL_API_BASE}/messages/${messageId}/trash`;
      const headers = await getHeaders();
      
      return fetchWithRetry(url, {
        method: 'POST',
        headers,
      });
    },
    
    // Send a message
    sendMessage: async (raw: string) => {
      const url = `${GMAIL_API_BASE}/messages/send`;
      const headers = await getHeaders();
      
      return fetchWithRetry(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ raw }),
      });
    },
    
    // Create a draft
    createDraft: async (raw: string) => {
      const url = `${GMAIL_API_BASE}/drafts`;
      const headers = await getHeaders();
      
      return fetchWithRetry(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: { raw } }),
      });
    },
    
    // Get all labels
    getLabels: async () => {
      const url = `${GMAIL_API_BASE}/labels`;
      const headers = await getHeaders();
      
      return fetchWithRetry(url, { headers });
    },
    
    // Create a new label
    createLabel: async (name: string, labelListVisibility = 'labelShow', messageListVisibility = 'show') => {
      const url = `${GMAIL_API_BASE}/labels`;
      const headers = await getHeaders();
      
      return fetchWithRetry(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name,
          labelListVisibility,
          messageListVisibility,
        }),
      });
    },
  };
};

// Helper to decode base64 encoded email content
export const decodeBase64 = (data: string) => {
  // Replace non-url compatible chars with base64 standard chars
  const safeData = data
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  // Add padding if needed
  const paddingLength = safeData.length % 4;
  const paddedData = paddingLength > 0
    ? safeData + '='.repeat(4 - paddingLength)
    : safeData;
  
  try {
    return atob(paddedData);
  } catch (e) {
    console.error('Error decoding base64:', e);
    return '';
  }
};

// Helper to encode content to base64url format for Gmail API
export const encodeBase64Url = (data: string) => {
  const base64 = btoa(data)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  
  return base64;
};
