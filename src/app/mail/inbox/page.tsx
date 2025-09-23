'use client';

import { useState } from 'react';
import { EmailList } from '@/components/mail/EmailList';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function InboxPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  
  // Handle search input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The EmailList component will update based on the searchQuery state
  };
  
  // Redirect to login if not authenticated
  if (!isLoading && !isAuthenticated) {
    router.push('/auth/login');
    return null;
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="px-6 py-4 border-b bg-slate-50 dark:bg-slate-900">
        <h1 className="text-xl font-semibold">Inbox</h1>
      </div>
      
      {/* Email list */}
      <div className="flex-1 overflow-auto">
        <EmailList label="INBOX" searchQuery={searchQuery} />
      </div>
    </div>
  );
}
