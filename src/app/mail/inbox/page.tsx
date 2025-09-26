'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@supermail/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@supermail/components/ui/button';
import { Badge } from '@supermail/components/ui/badge';
import { SettingsOverlay } from '@supermail/components/SettingsOverlay';
import { ScheduleDialog } from '@supermail/components/ScheduleDialog';
import { CustomLoader } from '@supermail/components/ui/custom-loader';
import { useIsMobile } from '@supermail/hooks/use-mobile';
import { 
  Search, 
  Filter, 
  RefreshCw,
  Plus,
  Menu,
  Settings,
  User,
  Loader2,
  Mail,
  Star,
  Archive,
  Trash2,
  Clock,
  Reply,
  Forward
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
  const isMobile = useIsMobile();
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoadingEmails, setIsLoadingEmails] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [hasMoreEmails, setHasMoreEmails] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [showEmailView, setShowEmailView] = useState(!isMobile);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [gmailMessage, setGmailMessage] = useState('');
  const [deletedEmails, setDeletedEmails] = useState<Set<string>>(new Set());

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
        return false;
      }
      
      console.log('User registered successfully');
      return true;
    } catch (error) {
      console.error('Error registering user:', error);
      return false;
    } finally {
      setIsRegistering(false);
    }
  };

  // Fetch Gmail messages
  const fetchEmails = async (pageToken?: string, append = false) => {
    setIsLoadingEmails(true);
    try {
      const params = new URLSearchParams();
      if (pageToken) params.append('pageToken', pageToken);
      
      const response = await fetch(`/api/gmail/messages?${params.toString()}`);
      const data = await response.json();
      
      console.log('Frontend received data:', { 
        hasMessages: !!data.messages, 
        messageCount: data.messages?.length || 0,
        data: data 
      });
      
      if (data.messages && Array.isArray(data.messages)) {
        const newEmails: Email[] = data.messages.map((msg: any) => ({
          id: msg.id,
          threadId: msg.threadId,
          from: msg.from,
          to: msg.to,
          subject: msg.subject,
          snippet: msg.snippet,
          date: msg.date,
          body: msg.body,
          isRead: msg.isRead || false,
          isStarred: msg.isStarred || false,
          labels: msg.labels || [],
        }));
        
        if (append) {
          setEmails(prev => [...prev, ...newEmails]);
        } else {
          setEmails(newEmails);
        }
        
        setNextPageToken(data.nextPageToken);
        setHasMoreEmails(!!data.nextPageToken);
        setGmailConnected(true);
        setGmailMessage('');
      } else {
        console.error('Failed to fetch emails:', data.error);
        setGmailConnected(false);
        setGmailMessage(data.message || 'Failed to fetch emails');
        
        if (data.error === 'Gmail not configured') {
          // Show demo emails when Gmail API is not configured
          loadDemoEmails();
        } else if (data.error?.includes('Gmail not connected')) {
          // Show demo emails for users who haven't connected Gmail
          loadDemoEmails();
        }
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
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

  // Load demo emails for demo users
  const loadDemoEmails = async () => {
    setIsLoadingEmails(true);
    try {
      const { getDemoEmails } = await import('@supermail/lib/demoAuth');
      const result = await getDemoEmails('INBOX');
      
      const demoEmails: Email[] = result.messages.map((email: any) => {
        const fromHeader = email.payload.headers.find((h: any) => h.name === 'From');
        const subjectHeader = email.payload.headers.find((h: any) => h.name === 'Subject');
        const dateHeader = email.payload.headers.find((h: any) => h.name === 'Date');
        
        return {
          id: email.id,
          threadId: email.threadId,
          from: fromHeader?.value || 'Unknown',
          subject: subjectHeader?.value || 'No Subject',
          snippet: email.snippet,
          date: dateHeader?.value || new Date().toISOString(),
          isRead: false,
          isStarred: email.labelIds.includes('STARRED'),
          labels: email.labelIds,
        };
      });
      
      setEmails(demoEmails);
      setHasMoreEmails(false);
    } catch (error) {
      console.error('Error loading demo emails:', error);
    } finally {
      setIsLoadingEmails(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.id === 'demo-user-id') {
        // Load demo emails for demo user
        loadDemoEmails();
      } else {
        // Register real user first, then fetch emails
        const initializeUser = async () => {
          const registered = await registerUser();
          if (registered) {
            // Wait a bit for the database to be ready
            setTimeout(() => {
              fetchEmails();
            }, 1000);
          }
        };
        initializeUser();
      }
    }
  }, [isAuthenticated, user]);

  // Redirect to login if not authenticated
  if (!isLoading && !isAuthenticated) {
    router.push('/auth/login');
    return null;
  }

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <CustomLoader size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isRegistering) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <CustomLoader size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">
            Setting up your account...
          </p>
        </div>
      </div>
    );
  }

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    if (isMobile) {
      // On mobile, navigate to the thread page instead of showing inline view
      router.push(`/mail/thread/${email.threadId || email.id}`);
    }
  };

  const handleReply = (email: Email) => {
    // TODO: Implement reply functionality
    console.log('Replying to:', email);
  };

  const handleForward = (email: Email) => {
    // TODO: Implement forward functionality
    console.log('Forwarding:', email);
  };

  const handleStar = (email: Email) => {
    // TODO: Implement star/unstar functionality
    console.log('Toggling star for:', email);
  };

  const handleSchedule = (email: Email) => {
    setSelectedEmail(email);
    setShowScheduleDialog(true);
  };

  const handleDelete = (email: Email) => {
    setDeletedEmails(prev => new Set([...Array.from(prev), email.id]));
    // If the deleted email was selected, clear the selection
    if (selectedEmail?.id === email.id) {
      setSelectedEmail(null);
    }
  };

  const handleRestore = (emailId: string) => {
    setDeletedEmails(prev => {
      const newSet = new Set(prev);
      newSet.delete(emailId);
      return newSet;
    });
  };

  const handleConnectGmail = async () => {
    try {
      const redirectUri = `${window.location.origin}/auth/gmail/callback`;
      
      // Get the OAuth URL from our API
      const response = await fetch(`/api/gmail/oauth?redirect_uri=${encodeURIComponent(redirectUri)}`);
      const data = await response.json();
      
      if (data.authUrl) {
        // Redirect to Google OAuth
        window.location.href = data.authUrl;
      } else {
        console.error('Failed to get OAuth URL:', data.error);
        if (data.error === 'Gmail not configured') {
          setGmailMessage('Gmail API is not configured. Please set up Google OAuth credentials to connect Gmail.');
        } else {
          setGmailMessage(data.message || 'Failed to initiate Gmail connection. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error connecting Gmail:', error);
      setGmailMessage('Failed to connect Gmail. Please try again.');
    }
  };

  const filteredEmails = emails.filter(email => 
    !deletedEmails.has(email.id) && (
      email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.snippet.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="flex h-full">
      {/* Email List Panel */}
      <div className={`${showEmailView && !isMobile ? 'w-1/2' : 'w-full'} border-r bg-background transition-all duration-300`}>
        <div className="flex h-16 items-center justify-between border-b px-6">
            <div>
            <h2 className="text-lg font-semibold">Inbox</h2>
            <p className="text-sm text-muted-foreground">
              {gmailConnected ? `${emails.length} emails` : 'Gmail not connected'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
            {!isMobile && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowEmailView(!showEmailView)}
                title={showEmailView ? "Hide email view" : "Show email view"}
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          {isLoadingEmails && emails.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <CustomLoader size="lg" className="mx-auto mb-4" />
                <p className="text-muted-foreground">Loading your emails...</p>
              </div>
            </div>
          ) : emails.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                {!gmailConnected && gmailMessage ? (
                  <>
                    <p className="text-muted-foreground mb-2">Gmail not connected</p>
                    <p className="text-sm text-muted-foreground mb-4">{gmailMessage}</p>
                    <Button onClick={handleConnectGmail} className="mb-2">
                      Connect Gmail
                    </Button>
                    <p className="text-xs text-muted-foreground">Or use demo emails below</p>
                  </>
                ) : (
                  <>
                    <p className="text-muted-foreground">No emails found</p>
                    <p className="text-sm text-muted-foreground">Your inbox is empty or try a different search</p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="divide-y">
              {filteredEmails.map((email) => (
                <div
                  key={email.id}
                  onClick={() => handleEmailClick(email)}
                  className={`group flex items-start space-x-4 p-4 hover:bg-accent cursor-pointer transition-colors ${
                    selectedEmail?.id === email.id ? 'bg-accent border-r-2 border-primary' : ''
                  }`}
                >
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                      {email.from.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{email.from}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(email.date).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-foreground mt-1 truncate">
                      {email.subject}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {email.snippet}
                    </p>
                    {email.labels.length > 0 && (
                      <div className="flex items-center space-x-1 mt-2">
                        {email.labels.slice(0, 2).map((label) => (
                          <Badge key={label} variant="secondary" className="text-xs">
                            {label}
                          </Badge>
                        ))}
                        {email.labels.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{email.labels.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    {email.isStarred && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                    {!email.isRead && (
                      <div className="h-2 w-2 bg-primary rounded-full" />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(email);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                      title="Delete email"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Load More Button */}
          {hasMoreEmails && (
            <div className="p-4 border-t">
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
          
          {/* Trash Section - Show deleted emails */}
          {deletedEmails.size > 0 && (
            <div className="border-t">
              <div className="p-4 bg-muted/50">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Trash ({deletedEmails.size})</h3>
                <div className="space-y-2">
                  {emails
                    .filter(email => deletedEmails.has(email.id))
                    .map((email) => (
                      <div
                        key={`trash-${email.id}`}
                        className="flex items-center justify-between p-3 bg-background rounded-lg border"
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                            {email.from.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{email.from}</p>
                            <p className="text-xs text-muted-foreground truncate">{email.subject}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRestore(email.id)}
                          className="text-xs"
                        >
                          Restore
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
            </div>
            
      {/* Email Content Panel - Only show on desktop */}
      {showEmailView && !isMobile && (
        <div className="w-1/2 bg-muted/50">
          {selectedEmail ? (
            <div className="h-full flex flex-col">
              {/* Email Header */}
              <div className="border-b p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{selectedEmail.subject}</h3>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleReply(selectedEmail)}
                      title="Reply"
                    >
                      <Reply className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleForward(selectedEmail)}
                      title="Forward"
                    >
                      <Forward className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleStar(selectedEmail)}
                      title="Star"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleSchedule(selectedEmail)}
                      title="Schedule"
                    >
                      <Clock className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Archive className="h-4 w-4" />
            </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(selectedEmail)}
                      title="Delete email"
                    >
                      <Trash2 className="h-4 w-4" />
            </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>From: {selectedEmail.from}</span>
                  <span>•</span>
                  <span>{new Date(selectedEmail.date).toLocaleString()}</span>
          </div>
        </div>

              {/* Email Body */}
              <div className="flex-1 overflow-auto p-6">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {selectedEmail.body ? (
                    <div 
                      className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground dark:prose-headings:text-white prose-p:text-foreground dark:prose-p:text-slate-300 prose-strong:text-foreground dark:prose-strong:text-white"
                      dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
                    />
                  ) : (
                    <div className="whitespace-pre-wrap text-foreground">
                      {selectedEmail.snippet}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Mail className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No message selected</h3>
                <p className="text-muted-foreground mb-6">
                  Choose an email from the list to read it
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Press C to compose</p>
                  <p>Press ⌘K for commands</p>
                  <p>Press ? for help</p>
          </div>
        </div>
      </div>
          )}
        </div>
      )}

      {/* Settings Overlay */}
      <SettingsOverlay 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />

      {/* Schedule Dialog */}
      <ScheduleDialog
        isOpen={showScheduleDialog}
        onClose={() => setShowScheduleDialog(false)}
        email={selectedEmail}
      />
    </div>
  );
}