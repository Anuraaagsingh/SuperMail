'use client';

import { useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { decodeBase64 } from '@/lib/gmail';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MessageViewProps {
  message: any;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onAction: (action: string, options?: any) => Promise<void>;
}

export function MessageView({ message, isExpanded, onToggleExpand, onAction }: MessageViewProps) {
  const [showOriginal, setShowOriginal] = useState(false);
  
  // Extract message data
  const id = message.id;
  const labelIds = message.labelIds || [];
  const isUnread = labelIds.includes('UNREAD');
  const isStarred = labelIds.includes('STARRED');
  
  // Extract headers
  const headers = message.payload?.headers || [];
  const subject = headers.find((h: any) => h.name === 'Subject')?.value || 'No Subject';
  const from = headers.find((h: any) => h.name === 'From')?.value || '';
  const to = headers.find((h: any) => h.name === 'To')?.value || '';
  const date = headers.find((h: any) => h.name === 'Date')?.value || '';
  
  // Extract sender name and email
  const senderMatch = from.match(/(?:"?([^"]*)"?\s)?(?:<?(.+@[^>]+)>?)/);
  const senderName = senderMatch ? (senderMatch[1] || senderMatch[2]) : from;
  const senderEmail = senderMatch ? senderMatch[2] : '';
  const senderInitial = senderName.charAt(0).toUpperCase();
  
  // Format date
  const messageDate = date ? new Date(date) : new Date();
  const formattedDate = formatDistanceToNow(messageDate, { addSuffix: true });
  const fullDate = format(messageDate, 'PPpp');
  
  // Extract message body
  const getMessageBody = () => {
    if (!message.payload) return '';
    
    // Find HTML part
    const findHtmlPart = (parts: any[]): string | null => {
      if (!parts) return null;
      
      for (const part of parts) {
        if (part.mimeType === 'text/html' && part.body?.data) {
          return decodeBase64(part.body.data);
        }
        
        if (part.parts) {
          const htmlInParts = findHtmlPart(part.parts);
          if (htmlInParts) return htmlInParts;
        }
      }
      
      return null;
    };
    
    // Find plain text part
    const findTextPart = (parts: any[]): string | null => {
      if (!parts) return null;
      
      for (const part of parts) {
        if (part.mimeType === 'text/plain' && part.body?.data) {
          return decodeBase64(part.body.data);
        }
        
        if (part.parts) {
          const textInParts = findTextPart(part.parts);
          if (textInParts) return textInParts;
        }
      }
      
      return null;
    };
    
    // Check if body is directly in the payload
    if (message.payload.body?.data) {
      return decodeBase64(message.payload.body.data);
    }
    
    // Check parts
    if (message.payload.parts) {
      const htmlBody = findHtmlPart(message.payload.parts);
      if (htmlBody) return htmlBody;
      
      const textBody = findTextPart(message.payload.parts);
      if (textBody) {
        return textBody.replace(/\n/g, '<br>');
      }
    }
    
    return '';
  };
  
  const messageBody = getMessageBody();
  
  // Handle actions
  const handleArchive = async () => {
    await onAction('archive');
  };
  
  const handleDelete = async () => {
    await onAction('trash');
  };
  
  const handleMarkRead = async () => {
    await onAction(isUnread ? 'markRead' : 'markUnread');
  };
  
  const handleStar = async () => {
    await onAction(isStarred ? 'unstar' : 'star');
  };
  
  return (
    <Card className="mb-2">
      <CardHeader className="p-4 pb-0 flex flex-row items-center">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-slate-700 dark:text-slate-200 mr-3">
          {senderInitial}
        </div>
        
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{senderName}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {senderEmail}
              </div>
            </div>
            
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
              <span title={fullDate}>{formattedDate}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 ml-2" 
                onClick={handleStar}
              >
                {isStarred ? (
                  <span className="text-yellow-500">★</span>
                ) : (
                  <span className="text-slate-400">☆</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className={`p-4 ${isExpanded ? '' : 'cursor-pointer'}`} onClick={!isExpanded ? onToggleExpand : undefined}>
        {isExpanded ? (
          <>
            <div className="mb-4">
              <h3 className="text-lg font-medium">{subject}</h3>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                To: {to}
              </div>
            </div>
            
            <div 
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: messageBody }}
            />
          </>
        ) : (
          <div className="truncate text-sm">
            {subject} - {message.snippet}
          </div>
        )}
      </CardContent>
      
      {isExpanded && (
        <CardFooter className="p-4 pt-0 flex justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => onAction('reply')}>
              Reply
            </Button>
            
            <Button variant="outline" size="sm" onClick={() => onAction('replyAll')}>
              Reply All
            </Button>
            
            <Button variant="outline" size="sm" onClick={() => onAction('forward')}>
              Forward
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
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
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowOriginal(!showOriginal)}>
                  {showOriginal ? 'Hide Original' : 'Show Original'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleMarkRead}>
                  Mark as {isUnread ? 'Read' : 'Unread'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAction('snooze')}>
                  Snooze
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleArchive}>
                  Archive
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-500">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
