'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@supermail/hooks/useAuth';
import { getDemoEmails } from '@supermail/lib/demoAuth';
import { getErrorMessage } from '@supermail/lib/utils';

interface MailHookOptions {
  label?: string;
  maxResults?: number;
  q?: string;
}

export function useMail({ label = 'INBOX', maxResults = 20, q }: MailHookOptions = {}) {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [resultSizeEstimate, setResultSizeEstimate] = useState(0);
  const { isAuthenticated } = useAuth();

  const fetchMessages = useCallback(async (pageToken?: string) => {
    if (!isAuthenticated) {
      setError('Not authenticated');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No auth token found');
      }

      // Check if using demo account
      const user = localStorage.getItem('user');
      const isDemo = user && JSON.parse(user).id === 'demo-user-id';
      
      if (isDemo) {
        // Use demo data
        const data = await getDemoEmails(label);
        setMessages(data.messages);
        setNextPageToken(data.nextPageToken);
        setResultSizeEstimate(data.resultSizeEstimate);
      } else {
        // Use real Gmail API
        // Build query params
        const params = new URLSearchParams();
        params.append('label', label);
        params.append('maxResults', maxResults.toString());
        if (pageToken) params.append('pageToken', pageToken);
        if (q) params.append('q', q);

        const response = await fetch(`/api/mail/list?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch messages');
        }

        const data = await response.json();
        
        if (pageToken) {
          // Append messages for pagination
          setMessages(prev => [...prev, ...data.messages]);
        } else {
          // Replace messages for new queries
          setMessages(data.messages);
        }
        
        setNextPageToken(data.nextPageToken);
        setResultSizeEstimate(data.resultSizeEstimate);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, label, maxResults, q]);

  const loadMore = useCallback(() => {
    if (nextPageToken && !isLoading) {
      fetchMessages(nextPageToken);
    }
  }, [nextPageToken, isLoading, fetchMessages]);

  const refresh = useCallback(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMessages();
    }
  }, [isAuthenticated, fetchMessages]);

  return {
    messages,
    isLoading,
    error,
    hasMore: !!nextPageToken,
    resultSizeEstimate,
    loadMore,
    refresh,
  };
}
