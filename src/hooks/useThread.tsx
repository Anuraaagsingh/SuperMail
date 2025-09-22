'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@supermail/hooks/useAuth';
import { getDemoThread } from '@supermail/lib/demoAuth';

export function useThread(threadId: string) {
  const [thread, setThread] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchThread = useCallback(async () => {
    if (!isAuthenticated || !threadId) {
      setError('Not authenticated or missing thread ID');
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
      
      let data;
      if (isDemo) {
        // Use demo data
        data = await getDemoThread(threadId);
      } else {
        // Use real Gmail API
        const response = await fetch(`/api/mail/thread?id=${threadId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch thread');
        }

        data = await response.json();
      }
      
      setThread(data);
    } catch (err) {
      console.error('Error fetching thread:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch thread');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, threadId]);

  const performAction = useCallback(async (
    action: string, 
    messageId: string, 
    options: any = {}
  ) => {
    if (!isAuthenticated) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No auth token found');
      }

      // Check if using demo account
      const user = localStorage.getItem('user');
      const isDemo = user && JSON.parse(user).id === 'demo-user-id';
      
      if (isDemo) {
        // Simulate successful action for demo account
        // In a real app, you might want to update the demo data state
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Refresh thread data
        fetchThread();
        
        return { success: true, result: { status: 'success' } };
      } else {
        // Use real Gmail API
        const response = await fetch('/api/mail/action', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action,
            messageId,
            threadId,
            ...options,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to perform action');
        }

        const result = await response.json();
        
        // Refresh thread data after action
        fetchThread();
        
        return { success: true, result };
      }
    } catch (err) {
      console.error(`Error performing ${action}:`, err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Action failed' 
      };
    }
  }, [isAuthenticated, threadId, fetchThread]);

  useEffect(() => {
    if (isAuthenticated && threadId) {
      fetchThread();
    }
  }, [isAuthenticated, threadId, fetchThread]);

  return {
    thread,
    isLoading,
    error,
    refresh: fetchThread,
    performAction,
  };
}
