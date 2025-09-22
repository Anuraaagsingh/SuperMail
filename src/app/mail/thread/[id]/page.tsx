'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MessageView } from '@/components/mail/thread/MessageView';
import { useThread } from '@/hooks/useThread';
import { useAuth } from '@/hooks/useAuth';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export default function ThreadPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const threadId = params.id as string;
  
  const { thread, isLoading, error, performAction } = useThread(threadId);
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());
  const [isSnoozeDialogOpen, setIsSnoozeDialogOpen] = useState(false);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeMode, setComposeMode] = useState<'reply' | 'replyAll' | 'forward' | null>(null);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  
  // Expand the last message by default
  useEffect(() => {
    if (thread && thread.messages && thread.messages.length > 0) {
      const lastMessage = thread.messages[thread.messages.length - 1];
      setExpandedMessages(new Set([lastMessage.id]));
    }
  }, [thread]);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [authLoading, isAuthenticated, router]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-8 w-8 rounded-full border-4 border-t-blue-500 animate-spin"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Error: {error}
      </div>
    );
  }
  
  if (!thread || !thread.messages) {
    return (
      <div className="flex items-center justify-center h-full">
        Thread not found
      </div>
    );
  }
  
  const toggleMessageExpand = (messageId: string) => {
    setExpandedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };
  
  const handleAction = async (messageId: string, action: string, options: any = {}) => {
    setActiveMessageId(messageId);
    
    if (action === 'reply' || action === 'replyAll' || action === 'forward') {
      setComposeMode(action as any);
      setIsComposeOpen(true);
      return;
    }
    
    if (action === 'snooze') {
      setIsSnoozeDialogOpen(true);
      return;
    }
    
    await performAction(action, messageId, options);
  };
  
  const handleSnooze = async (snoozeUntil: Date) => {
    if (activeMessageId) {
      await performAction('snooze', activeMessageId, { snoozeUntil: snoozeUntil.toISOString() });
      setIsSnoozeDialogOpen(false);
      router.push('/mail/inbox');
    }
  };
  
  // Get subject from first message
  const subject = thread.messages[0]?.payload?.headers?.find(
    (h: any) => h.name === 'Subject'
  )?.value || 'No Subject';
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.back()}
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Button>
          <h1 className="text-xl font-semibold truncate max-w-md">{subject}</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              const lastMessage = thread.messages[thread.messages.length - 1];
              handleAction(lastMessage.id, 'archive');
              router.push('/mail/inbox');
            }}
          >
            Archive
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              const lastMessage = thread.messages[thread.messages.length - 1];
              handleAction(lastMessage.id, 'trash');
              router.push('/mail/inbox');
            }}
          >
            Delete
          </Button>
        </div>
      </header>
      
      {/* Thread messages */}
      <div className="flex-1 overflow-auto p-4">
        {thread.messages.map((message: any) => (
          <MessageView
            key={message.id}
            message={message}
            isExpanded={expandedMessages.has(message.id)}
            onToggleExpand={() => toggleMessageExpand(message.id)}
            onAction={(action, options) => handleAction(message.id, action, options)}
          />
        ))}
      </div>
      
      {/* Snooze dialog */}
      <Dialog open={isSnoozeDialogOpen} onOpenChange={setIsSnoozeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Snooze until</DialogTitle>
            <DialogDescription>
              Choose when this message should return to your inbox.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Button 
              variant="outline" 
              onClick={() => {
                const later = new Date();
                later.setHours(later.getHours() + 3);
                handleSnooze(later);
              }}
            >
              Later today
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(9, 0, 0, 0);
                handleSnooze(tomorrow);
              }}
            >
              Tomorrow morning
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => {
                const weekend = new Date();
                weekend.setDate(weekend.getDate() + (6 - weekend.getDay()));
                weekend.setHours(9, 0, 0, 0);
                handleSnooze(weekend);
              }}
            >
              This weekend
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => {
                const nextWeek = new Date();
                nextWeek.setDate(nextWeek.getDate() + 7);
                nextWeek.setHours(9, 0, 0, 0);
                handleSnooze(nextWeek);
              }}
            >
              Next week
            </Button>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSnoozeDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Compose dialog - placeholder for now */}
      <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {composeMode === 'reply' && 'Reply'}
              {composeMode === 'replyAll' && 'Reply All'}
              {composeMode === 'forward' && 'Forward'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p>Compose functionality will be implemented in the next phase.</p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
