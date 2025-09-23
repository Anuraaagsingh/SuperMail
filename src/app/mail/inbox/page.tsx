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
      {/* Modern Page header */}
      <div className="px-8 py-6 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Inbox</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              All your emails in one place
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
              {searchQuery ? 'Filtered' : 'All emails'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Email list */}
      <div className="flex-1 overflow-auto bg-white/30 dark:bg-slate-900/30">
        <EmailList label="INBOX" searchQuery={searchQuery} />
      </div>
    </div>
  );
}
