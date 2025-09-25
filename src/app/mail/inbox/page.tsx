'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@supermail/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@supermail/components/ui/button';
import { Input } from '@supermail/components/ui/input';
import { Badge } from '@supermail/components/ui/badge';
import { SettingsOverlay } from '@supermail/components/SettingsOverlay';
import { EmailList } from '@supermail/components/EmailList';
import { CustomLoader } from '@supermail/components/ui/custom-loader';
import { ComposeButton } from '@supermail/components/ui/compose-button';
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
          <CustomLoader size="lg" className="mx-auto mb-4" />
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
    <div className="h-full flex">
      {/* Email List Panel */}
      <div className="w-1/2 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Inbox</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{emails.length} emails</p>
        </div>
        
        <div className="flex-1 overflow-auto">
          {isLoadingEmails && emails.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <CustomLoader size="lg" className="mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Loading your emails...</p>
              </div>
            </div>
          ) : emails.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400">No emails found. Your inbox is empty or try a different search.</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEmails.map((email) => (
                <div
                  key={email.id}
                  onClick={() => handleEmailClick(email)}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {email.from.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {email.from}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(email.date).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-sm text-gray-900 dark:text-white font-medium mt-1">
                        {email.subject}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {email.snippet}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Load More Button */}
          {hasMoreEmails && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={loadMoreEmails}
                disabled={isLoadingEmails}
                variant="outline"
                className="w-full"
              >
                {isLoadingEmails ? (
                  <>
                    <CustomLoader size="sm" className="mr-2" />
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Email Content Panel */}
      <div className="w-1/2">
        <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800">
          <div className="text-center">
            <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No message selected
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Choose an email from the list to read it
            </p>
            <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <p>Press C to compose</p>
              <p>Press ⌘K for commands</p>
              <p>Press ? for help</p>
            </div>
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