'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const handleCallback = async () => {
      // Get authorization code from URL
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      
      if (error) {
        setError(`Authentication error: ${error}`);
        return;
      }
      
      if (!code) {
        setError('No authorization code received');
        return;
      }
      
      try {
        // Exchange code for tokens
        const response = await fetch('/api/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            redirectUri: window.location.origin + '/auth/callback',
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to authenticate');
        }
        
        const data = await response.json();
        
        // Store token in localStorage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to inbox
        router.push('/mail/inbox');
      } catch (err) {
        console.error('Authentication error:', err);
        setError('Failed to complete authentication. Please try again.');
      }
    };
    
    handleCallback();
  }, [searchParams, router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Completing sign in...</CardTitle>
          <CardDescription>
            {error ? 'There was an error signing in' : 'Please wait while we complete your sign in'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="flex items-center justify-center py-4">
              <div className="h-8 w-8 rounded-full border-4 border-t-blue-500 animate-spin"></div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
