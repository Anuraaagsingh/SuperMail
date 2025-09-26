'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CustomLoader } from '@supermail/components/ui/custom-loader';

function GmailCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Connecting your Gmail account...');

  useEffect(() => {
    const handleGmailCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessage('Gmail connection was cancelled or failed.');
          return;
        }

        if (!code) {
          setStatus('error');
          setMessage('No authorization code received from Google.');
          return;
        }

        // Get the current redirect URI
        const redirectUri = `${window.location.origin}/auth/gmail/callback`;

        // Send the code to our backend
        const response = await fetch('/api/gmail/connect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            redirectUri,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setStatus('success');
          setMessage('Gmail connected successfully! Redirecting to inbox...');
          
          // Redirect to inbox after a short delay
          setTimeout(() => {
            router.push('/mail/inbox');
          }, 2000);
        } else {
          setStatus('error');
          setMessage(data.error || 'Failed to connect Gmail account.');
        }
      } catch (error) {
        console.error('Gmail connection error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred while connecting Gmail.');
      }
    };

    handleGmailCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <CustomLoader size="lg" className="mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">
          {status === 'loading' && 'Connecting Gmail...'}
          {status === 'success' && 'Gmail Connected!'}
          {status === 'error' && 'Connection Failed'}
        </h2>
        <p className="text-muted-foreground mb-4">{message}</p>
        
        {status === 'error' && (
          <button
            onClick={() => router.push('/mail/inbox')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Back to Inbox
          </button>
        )}
      </div>
    </div>
  );
}

export default function GmailCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <CustomLoader size="lg" className="mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Connecting your Gmail account...</p>
        </div>
      </div>
    }>
      <GmailCallbackContent />
    </Suspense>
  );
}
