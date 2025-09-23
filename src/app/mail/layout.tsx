'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@supermail/hooks/useAuth';
import { ClientScheduler } from '@supermail/components/ClientScheduler';
import { MailLayoutContent } from '@supermail/components/MailLayoutContent';

interface MailLayoutProps {
  children: ReactNode;
}

export default function MailLayout({ children }: MailLayoutProps) {
  return (
    <AuthProvider>
      {/* Client-side scheduler for handling scheduled emails and snoozed emails */}
      <ClientScheduler />
      
      <MailLayoutContent>
        {children}
      </MailLayoutContent>
    </AuthProvider>
  );
}