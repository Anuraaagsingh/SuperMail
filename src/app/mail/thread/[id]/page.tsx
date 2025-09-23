'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@supermail/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@supermail/components/ui/card';
import { Badge } from '@supermail/components/ui/badge';
import { useAuth } from '@supermail/hooks/useAuth';
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

// Demo email data
const demoEmails = {
  '1': {
    id: '1',
    subject: 'Welcome to SuperMail! This is your demo inbox.',
    from: 'SuperMail Team',
    fromEmail: 'team@supermail.app',
    to: 'demo@supermail.app',
    date: new Date().toISOString(),
    isRead: false,
    isStarred: false,
    body: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2563eb; margin-bottom: 16px;">Welcome to SuperMail! 🎉</h2>
        
        <p>Thank you for trying SuperMail! This is your demo inbox where you can explore all the features of our modern email client.</p>
        
        <h3 style="color: #374151; margin-top: 24px; margin-bottom: 12px;">What you can do:</h3>
        <ul style="margin-left: 20px; margin-bottom: 20px;">
          <li>📧 Read and manage your emails</li>
          <li>⭐ Star important messages</li>
          <li>📝 Compose new emails</li>
          <li>🔍 Search through your inbox</li>
          <li>⚙️ Customize your settings</li>
        </ul>
        
        <p>Feel free to explore the interface and try out all the features. This is a demo environment, so no real emails will be sent or received.</p>
        
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-weight: 500; color: #374151;">💡 Pro Tip:</p>
          <p style="margin: 8px 0 0 0; color: #6b7280;">Use the keyboard shortcuts (⌘+K) to quickly navigate and perform actions.</p>
        </div>
        
        <p>Happy emailing!</p>
        <p style="margin-top: 20px;">
          <strong>The SuperMail Team</strong><br>
          <span style="color: #6b7280;">team@supermail.app</span>
        </p>
      </div>
    `,
    snippet: 'Welcome to SuperMail! This is your demo inbox. Feel free to explore the features of SuperMail.'
  },
  '2': {
    id: '2',
    subject: 'Meeting Reminder',
    from: 'Calendar',
    fromEmail: 'calendar@supermail.app',
    to: 'demo@supermail.app',
    date: new Date(Date.now() - 86400000).toISOString(),
    isRead: false,
    isStarred: true,
    body: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #dc2626; margin-bottom: 16px;">📅 Meeting Reminder</h2>
        
        <p>Your meeting with the Product Team is scheduled for tomorrow at 10:00 AM.</p>
        
        <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #dc2626; margin: 0 0 8px 0;">Meeting Details:</h3>
          <p style="margin: 4px 0; color: #374151;"><strong>Date:</strong> Tomorrow, 10:00 AM</p>
          <p style="margin: 4px 0; color: #374151;"><strong>Duration:</strong> 1 hour</p>
          <p style="margin: 4px 0; color: #374151;"><strong>Location:</strong> Conference Room A</p>
          <p style="margin: 4px 0; color: #374151;"><strong>Attendees:</strong> Product Team, Engineering Team</p>
        </div>
        
        <h3 style="color: #374151; margin-top: 24px; margin-bottom: 12px;">Agenda:</h3>
        <ul style="margin-left: 20px; margin-bottom: 20px;">
          <li>Review Q3 roadmap</li>
          <li>Discuss new feature priorities</li>
          <li>Address technical challenges</li>
          <li>Plan next sprint</li>
        </ul>
        
        <p>Please prepare your updates and questions in advance. Looking forward to a productive meeting!</p>
        
        <p style="margin-top: 20px;">
          <strong>Calendar System</strong><br>
          <span style="color: #6b7280;">calendar@supermail.app</span>
        </p>
      </div>
    `,
    snippet: 'Your meeting with the Product Team is scheduled for tomorrow at 10:00 AM.'
  },
  '3': {
    id: '3',
    subject: 'Invoice #INV-2023-001',
    from: 'Billing',
    fromEmail: 'billing@supermail.app',
    to: 'demo@supermail.app',
    date: new Date(Date.now() - 172800000).toISOString(),
    isRead: true,
    isStarred: false,
    body: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #059669; margin-bottom: 16px;">💰 Invoice #INV-2023-001</h2>
        
        <p>Your invoice #INV-2023-001 for $199.99 is due in 7 days.</p>
        
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #059669; margin: 0 0 12px 0;">Invoice Summary:</h3>
          <div style="display: flex; justify-content: space-between; margin: 8px 0;">
            <span>SuperMail Pro Plan</span>
            <span>$199.99</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 8px 0;">
            <span>Tax (8.5%)</span>
            <span>$17.00</span>
          </div>
          <hr style="border: none; border-top: 1px solid #d1d5db; margin: 12px 0;">
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px;">
            <span>Total</span>
            <span>$216.99</span>
          </div>
        </div>
        
        <h3 style="color: #374151; margin-top: 24px; margin-bottom: 12px;">Payment Options:</h3>
        <ul style="margin-left: 20px; margin-bottom: 20px;">
          <li>💳 Credit Card (Visa, MasterCard, American Express)</li>
          <li>🏦 Bank Transfer</li>
          <li>💻 PayPal</li>
          <li>₿ Bitcoin (crypto payments accepted)</li>
        </ul>
        
        <div style="background: #fef3c7; border: 1px solid #fde68a; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e;"><strong>⚠️ Important:</strong> Payment is due within 7 days to avoid service interruption.</p>
        </div>
        
        <p>If you have any questions about this invoice, please don't hesitate to contact our billing team.</p>
        
        <p style="margin-top: 20px;">
          <strong>Billing Department</strong><br>
          <span style="color: #6b7280;">billing@supermail.app</span>
        </p>
      </div>
    `,
    snippet: 'Your invoice #INV-2023-001 for $199.99 is due in 7 days.'
  },
  '4': {
    id: '4',
    subject: 'Product Newsletter - July 2023',
    from: 'Product Updates',
    fromEmail: 'updates@supermail.app',
    to: 'demo@supermail.app',
    date: new Date(Date.now() - 259200000).toISOString(),
    isRead: true,
    isStarred: false,
    body: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #7c3aed; margin-bottom: 16px;">🚀 Product Newsletter - July 2023</h2>
        
        <p>Check out our latest product updates and new features!</p>
        
        <h3 style="color: #374151; margin-top: 24px; margin-bottom: 12px;">✨ New Features:</h3>
        <ul style="margin-left: 20px; margin-bottom: 20px;">
          <li><strong>Smart Filters:</strong> AI-powered email categorization</li>
          <li><strong>Quick Actions:</strong> Swipe gestures for mobile users</li>
          <li><strong>Dark Mode:</strong> Beautiful dark theme for night owls</li>
          <li><strong>Offline Support:</strong> Read emails without internet</li>
        </ul>
        
        <h3 style="color: #374151; margin-top: 24px; margin-bottom: 12px;">🔧 Improvements:</h3>
        <ul style="margin-left: 20px; margin-bottom: 20px;">
          <li>50% faster email loading</li>
          <li>Improved search accuracy</li>
          <li>Better mobile experience</li>
          <li>Enhanced security features</li>
        </ul>
        
        <div style="background: #e0e7ff; border: 1px solid #c7d2fe; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #3730a3; margin: 0 0 8px 0;">🎯 Coming Soon:</h3>
          <p style="margin: 4px 0; color: #374151;">• Advanced email analytics</p>
          <p style="margin: 4px 0; color: #374151;">• Team collaboration features</p>
          <p style="margin: 4px 0; color: #374151;">• Custom email templates</p>
        </div>
        
        <p>We're constantly working to make SuperMail the best email experience for you. Thank you for being part of our community!</p>
        
        <p style="margin-top: 20px;">
          <strong>Product Team</strong><br>
          <span style="color: #6b7280;">updates@supermail.app</span>
        </p>
      </div>
    `,
    snippet: 'Check out our latest product updates and new features.'
  }
};

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
    
    // Simulate loading
    const timer = setTimeout(() => {
      const demoEmail = demoEmails[threadId as keyof typeof demoEmails];
      if (demoEmail) {
        setEmail(demoEmail);
      }
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
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