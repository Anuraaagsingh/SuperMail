'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@supermail/components/ui/card';
import { useAuth } from '@supermail/hooks/useAuth';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
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
        // Use the auth context login method
        await login(code, window.location.origin + '/auth/callback');
        
        // Redirect to inbox
        router.push('/mail/inbox');
      } catch (err) {
        console.error('Authentication error:', err);
        setError('Failed to complete authentication. Please try again.');
      }
    };
    
    handleCallback();
  }, [searchParams, router, login]);
  
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

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
            <CardDescription>Please wait while we complete your sign in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-4">
              <div className="h-8 w-8 rounded-full border-4 border-t-blue-500 animate-spin"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
