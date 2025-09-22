'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@supermail/hooks/useAuth';

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
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
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
