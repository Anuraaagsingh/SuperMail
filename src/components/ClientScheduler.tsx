'use client';

import { useEffect } from 'react';
import { initClientScheduler } from '@supermail/lib/clientScheduler';
import { useAuth } from '@supermail/hooks/useAuth';

/**
 * Client component that initializes the scheduler
 * This is rendered in the app layout to ensure it's always active
 */
export function ClientScheduler() {
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    // Only initialize scheduler when user is authenticated
    if (isAuthenticated) {
      const cleanup = initClientScheduler();
      return cleanup;
    }
  }, [isAuthenticated]);
  
  // This component doesn't render anything
  return null;
}
