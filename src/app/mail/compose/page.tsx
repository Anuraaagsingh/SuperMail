'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { EmailComposer } from '@/components/mail/compose/EmailComposer';
import { useAuth } from '@/hooks/useAuth';

function ComposeContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get query parameters
  const mode = searchParams.get('mode') as 'new' | 'reply' | 'replyAll' | 'forward' || 'new';
  const to = searchParams.get('to') || '';
  const cc = searchParams.get('cc') || '';
  const subject = searchParams.get('subject') || '';
  const threadId = searchParams.get('threadId') || undefined;
  const messageId = searchParams.get('messageId') || undefined;
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-8 w-8 rounded-full border-4 border-t-blue-500 animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-b p-4">
        <h1 className="text-xl font-semibold">Compose</h1>
      </header>
      
      {/* Composer */}
      <div className="flex-1 overflow-auto p-4">
        <EmailComposer
          mode={mode}
          initialTo={to}
          initialCc={cc}
          initialSubject={subject}
          threadId={threadId}
          messageId={messageId}
          onClose={() => router.push('/mail/inbox')}
          onSent={() => router.push('/mail/inbox')}
        />
      </div>
    </div>
  );
}

export default function ComposePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 rounded-full border-4 border-t-blue-500 animate-spin"></div>
      </div>
    }>
      <ComposeContent />
    </Suspense>
  );
}
