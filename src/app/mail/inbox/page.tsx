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
  User,
  Loader2
} from 'lucide-react';

interface Email {
  id: string;
  threadId?: string;
  from: string;
  to?: string;
  subject: string;
  snippet: string;
  date: string;
  body?: string;
  isRead: boolean;
  isStarred: boolean;
  labels: string[];
}

export default function InboxPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoadingEmails, setIsLoadingEmails] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [hasMoreEmails, setHasMoreEmails] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  // Register user in Supabase when they first login
  const registerUser = async () => {
    if (!user || isRegistering) return;
    
    setIsRegistering(true);
    try {
      const response = await fetch('/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          name: user.name,
          avatarUrl: user.picture,
        }),
      });

      if (!response.ok) {
        console.error('Failed to register user');
      }
    } catch (error) {
      console.error('Error registering user:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  // Fetch Gmail messages
  const fetchEmails = async (pageToken?: string, append = false) => {
    setIsLoadingEmails(true);
    try {
      const url = new URL('/api/gmail/messages', window.location.origin);
      if (pageToken) {
        url.searchParams.set('pageToken', pageToken);
      }
      url.searchParams.set('maxResults', '10');

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error('Failed to fetch emails');
      }

      const data = await response.json();
      
      if (append) {
        setEmails(prev => [...prev, ...data.messages]);
      } else {
        setEmails(data.messages);
      }
      
      setNextPageToken(data.nextPageToken || null);
      setHasMoreEmails(!!data.nextPageToken);
    } catch (error) {
      console.error('Error fetching emails:', error);
      // Fallback to demo emails if Gmail fails
      if (!append) {
        setEmails([
          {
            id: 'demo-1',
            from: 'SuperMail Team',
            subject: 'Welcome to SuperMail!',
            snippet: 'This is a demo email. Connect your Gmail account to see real emails.',
            date: new Date().toISOString(),
            isRead: false,
            isStarred: false,
            labels: ['INBOX']
          },
          {
            id: 'demo-2',
            from: 'Gmail Integration',
            subject: 'Connect Your Gmail Account',
            snippet: 'Click the "Connect Gmail" button to fetch your real emails from Gmail.',
            date: new Date(Date.now() - 3600000).toISOString(),
            isRead: false,
            isStarred: false,
            labels: ['INBOX']
          }
        ]);
      }
    } finally {
      setIsLoadingEmails(false);
    }
  };

  // Load more emails
  const loadMoreEmails = () => {
    if (nextPageToken && !isLoadingEmails) {
      fetchEmails(nextPageToken, true);
    }
  };

  // Initial load
  useEffect(() => {
    if (isAuthenticated && user) {
      registerUser();
      fetchEmails();
    }
  }, [isAuthenticated, user]);

  // Redirect to login if not authenticated
  if (!isLoading && !isAuthenticated) {
    router.push('/auth/login');
    return null;
  }

  if (isLoading || isRegistering) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            {isRegistering ? 'Setting up your account...' : 'Loading...'}
          </p>
        </div>
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
                variant="outline"
                size="sm"
                className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                onClick={() => {
                  // TODO: Implement Gmail connection flow
                  alert('Gmail connection coming soon!');
                }}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h3.819v9.273L12 8.183l6.545 4.91V3.82h3.819c.904 0 1.636.732 1.636 1.636z"/>
                </svg>
                Connect Gmail
              </Button>
              
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <User className="w-4 h-4" />
                <span>{user?.name || 'Demo User'}</span>
              </div>
              
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
            {isLoadingEmails && emails.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                  <p className="text-slate-600 dark:text-slate-400">Loading your emails...</p>
                </div>
              </div>
            ) : (
              <>
                <EmailList 
                  emails={filteredEmails} 
                  onEmailClick={handleEmailClick}
                />
                
                {/* Load More Button */}
                {hasMoreEmails && (
                  <div className="flex justify-center mt-6">
                    <Button
                      onClick={loadMoreEmails}
                      disabled={isLoadingEmails}
                      variant="outline"
                      className="border-slate-200 dark:border-slate-700"
                    >
                      {isLoadingEmails ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        'Load More'
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
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