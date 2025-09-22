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
      {/* Header */}
      <header className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold">Inbox</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="search"
              placeholder="Search emails..."
              className="w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-0 h-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </Button>
          </form>
          
          {user && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {user.name}
              </span>
              <div 
                className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center"
                style={{ backgroundImage: user.picture ? `url(${user.picture})` : 'none' }}
              >
                {!user.picture && user.name?.charAt(0)}
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Email list */}
      <div className="flex-1 overflow-auto">
        <EmailList label="INBOX" searchQuery={searchQuery} />
      </div>
    </div>
  );
}
