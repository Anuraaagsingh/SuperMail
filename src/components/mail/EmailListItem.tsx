'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@supermail/components/ui/badge';
import { cn } from '@supermail/lib/utils';

interface EmailListItemProps {
  message: any;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function EmailListItem({ message, isSelected, onSelect }: EmailListItemProps) {
  // Extract message data
  const id = message.id;
  const threadId = message.threadId;
  const labelIds = message.labelIds || [];
  const isUnread = labelIds.includes('UNREAD');
  const isStarred = labelIds.includes('STARRED');
  const isImportant = labelIds.includes('IMPORTANT');
  
  // Extract headers
  const headers = message.payload?.headers || [];
  const subject = headers.find((h: any) => h.name === 'Subject')?.value || 'No Subject';
  const from = headers.find((h: any) => h.name === 'From')?.value || '';
  const date = headers.find((h: any) => h.name === 'Date')?.value || '';
  
  // Extract sender name and email
  const senderMatch = from.match(/(?:"?([^"]*)"?\s)?(?:<?(.+@[^>]+)>?)/);
  const senderName = senderMatch ? (senderMatch[1] || senderMatch[2]) : from;
  const senderInitial = senderName.charAt(0).toUpperCase();
  
  // Format date
  const formattedDate = date ? formatDistanceToNow(new Date(date), { addSuffix: true }) : '';
  
  // Extract snippet
  const snippet = message.snippet || '';
  
  // Handle click
  const handleClick = () => {
    onSelect(id);
  };
  
  return (
    <Link 
      href={`/mail/thread/${threadId}`}
      onClick={handleClick}
      className={cn(
        "flex items-center px-4 py-2 border-b hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer",
        isSelected && "bg-slate-100 dark:bg-slate-800",
        isUnread ? "font-medium" : "font-normal"
      )}
    >
      <div className="flex items-center space-x-4 w-full">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-slate-700 dark:text-slate-200">
          {senderInitial}
        </div>
        
        <div className="flex-grow min-w-0">
          <div className="flex items-center justify-between">
            <div className="font-medium truncate max-w-[180px] sm:max-w-[250px]">
              {senderName}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
              {formattedDate}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="truncate max-w-[220px] sm:max-w-[300px] text-sm">
              {subject}
            </div>
            <div className="flex items-center space-x-1">
              {isStarred && (
                <Badge variant="outline" className="h-5 px-1 text-yellow-500 border-yellow-500">
                  ★
                </Badge>
              )}
              {isImportant && (
                <Badge variant="outline" className="h-5 px-1 text-red-500 border-red-500">
                  !
                </Badge>
              )}
            </div>
          </div>
          
          <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[300px] sm:max-w-[400px]">
            {snippet}
          </div>
        </div>
      </div>
    </Link>
  );
}
