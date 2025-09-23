'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@supermail/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@supermail/components/ui/button';
import { Input } from '@supermail/components/ui/input';
import { Badge } from '@supermail/components/ui/badge';
import { Sidebar } from '@supermail/components/Sidebar';
import { SettingsOverlay } from '@supermail/components/SettingsOverlay';
import { EmailList } from '@supermail/components/EmailList';
import { 
  Search, 
  Filter, 
  RefreshCw,
  Plus,
  Menu,
  Settings,
  User
} from 'lucide-react';

interface Email {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  time: string;
  isRead: boolean;
  isStarred: boolean;
  labels: string[];
}

export default function InboxPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Demo emails data
  const [emails] = useState<Email[]>([
    {
      id: '1',
      from: 'SuperMail Team',
      subject: 'Welcome to SuperMail! This is your demo inbox.',
      snippet: 'Welcome to SuperMail! This is your demo inbox. Feel free to explore the features of SuperMail.',
      time: new Date().toISOString(),
      isRead: false,
      isStarred: false,
      labels: ['INBOX']
    },
    {
      id: '2',
      from: 'Calendar',
      subject: 'Meeting Reminder',
      snippet: 'Your meeting with the Product Team is scheduled for tomorrow at 10:00 AM.',
      time: new Date(Date.now() - 86400000).toISOString(),
      isRead: false,
      isStarred: true,
      labels: ['INBOX', 'IMPORTANT']
    },
    {
      id: '3',
      from: 'Billing',
      subject: 'Invoice #INV-2023-001',
      snippet: 'Your invoice #INV-2023-001 for $199.99 is due in 7 days.',
      time: new Date(Date.now() - 172800000).toISOString(),
      isRead: true,
      isStarred: false,
      labels: ['INBOX']
    },
    {
      id: '4',
      from: 'Product Updates',
      subject: 'Product Newsletter - July 2023',
      snippet: 'Check out our latest product updates and new features.',
      time: new Date(Date.now() - 259200000).toISOString(),
      isRead: true,
      isStarred: false,
      labels: ['INBOX']
    }
  ]);


  // Redirect to login if not authenticated
  if (!isLoading && !isAuthenticated) {
    router.push('/auth/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleEmailClick = (email: Email) => {
    router.push(`/mail/thread/${email.id}`);
  };

  const handleCompose = () => {
    router.push('/mail/compose');
  };

  const filteredEmails = emails.filter(email => 
    email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.snippet.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full">
      {/* Main Content */}
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Inbox</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">All your emails in one place</p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hidden sm:inline-flex">
                All emails
              </Badge>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="w-8 h-8 p-0"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50 px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
              />
            </div>
            
            <Button variant="outline" size="sm" className="border-slate-200 dark:border-slate-700 hidden sm:flex">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            
            <Button variant="outline" size="sm" className="border-slate-200 dark:border-slate-700">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-4xl mx-auto">
            <EmailList 
              emails={filteredEmails} 
              onEmailClick={handleEmailClick}
            />
          </div>
        </div>
      </div>

      {/* Settings Overlay */}
      <SettingsOverlay 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </div>
  );
}