'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@supermail/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@supermail/components/ui/card';
import { Badge } from '@supermail/components/ui/badge';
import { useAuth } from '@supermail/hooks/useAuth';
import { getDemoThread } from '@supermail/lib/demoAuth';
import { 
  ArrowLeft, 
  Reply, 
  ReplyAll, 
  Forward, 
  Archive, 
  Trash2, 
  Star,
  MoreHorizontal,
  Clock,
  User
} from 'lucide-react';


export default function ThreadPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const threadId = params.id as string;
  
  const [email, setEmail] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    // Fetch demo thread
    const fetchThread = async () => {
      try {
        const result = await getDemoThread(threadId);
        if (result.messages && result.messages.length > 0) {
          const email = result.messages[0]; // Get the first message in the thread
          
          // Extract headers
          const headers = email.payload?.headers || [];
          const subject = headers.find((h: any) => h.name === 'Subject')?.value || 'No Subject';
          const from = headers.find((h: any) => h.name === 'From')?.value || '';
          const to = headers.find((h: any) => h.name === 'To')?.value || '';
          const date = headers.find((h: any) => h.name === 'Date')?.value || '';
          
          // Extract sender name and email
          const senderMatch = from.match(/(?:"?([^"]*)"?\s)?(?:<?(.+@[^>]+)>?)/);
          const senderName = senderMatch ? (senderMatch[1] || senderMatch[2]) : from;
          const senderEmail = senderMatch ? senderMatch[2] : from;
          
          // Extract body
          const body = email.payload?.body?.data || email.snippet;
          
          setEmail({
            id: email.id,
            threadId: email.threadId,
            subject,
            from: senderName,
            fromEmail: senderEmail,
            to,
            date,
            isRead: !email.labelIds.includes('UNREAD'),
            isStarred: email.labelIds.includes('STARRED'),
            body,
            snippet: email.snippet
          });
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching thread:', error);
        setIsLoading(false);
      }
    };
    
    fetchThread();
  }, [authLoading, isAuthenticated, router, threadId]);
  
  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!email) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Email not found</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-4">The email you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/mail/inbox')}>
            Back to Inbox
          </Button>
        </div>
      </div>
    );
  }
  
  const formatTime = (time: string) => {
    const now = new Date();
    const emailTime = new Date(time);
    const diffInHours = (now.getTime() - emailTime.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Less than a minute ago';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) === 1 ? '' : 's'} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 px-4 sm:px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/mail/inbox')}
            className="w-8 h-8 p-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white truncate">
              {email.subject}
            </h1>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Clock className="w-4 h-4" />
              <span>{formatTime(email.date)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0"
            >
              {email.isStarred ? (
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              ) : (
                <Star className="w-4 h-4 text-slate-400" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Email Content */}
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
            <CardHeader className="pb-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-medium text-lg flex-shrink-0">
                  {email.from.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {email.from}
                    </h3>
                    {!email.isRead && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                        Unread
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {email.fromEmail}
                  </p>
                  
                  <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                    to {email.to}
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div 
                className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-700 dark:prose-p:text-slate-300"
                dangerouslySetInnerHTML={{ __html: email.body }}
              />
            </CardContent>
            
            <CardFooter className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <Reply className="w-4 h-4 mr-2" />
                  Reply
                </Button>
                
                <Button variant="outline" size="sm">
                  <ReplyAll className="w-4 h-4 mr-2" />
                  Reply All
                </Button>
                
                <Button variant="outline" size="sm">
                  <Forward className="w-4 h-4 mr-2" />
                  Forward
                </Button>
                
                <div className="flex-1" />
                
                <Button variant="outline" size="sm" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </Button>
                
                <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}