'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EmailList } from '@/components/mail/EmailList';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export default function SnoozedPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  
  // Handle search input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The EmailList component will update based on the searchQuery state
  };
  
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
      {/* Page header */}
      <div className="px-6 py-4 border-b bg-slate-50 dark:bg-slate-900">
        <h1 className="text-xl font-semibold">Snoozed</h1>
      </div>
      
      {/* Email list */}
      <div className="flex-1 overflow-auto">
        <EmailList label="SNOOZED" searchQuery={searchQuery} />
      </div>
    </div>
  );
}
