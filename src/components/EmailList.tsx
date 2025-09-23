'use client';

import { useState } from 'react';
import { Button } from '@supermail/components/ui/button';
import { Badge } from '@supermail/components/ui/badge';
import { 
  Star, 
  StarOff, 
  Archive, 
  Trash2, 
  Clock,
  MoreHorizontal,
  Mail,
  MailOpen
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

interface EmailListProps {
  emails: Email[];
  onEmailClick: (email: Email) => void;
}

export function EmailList({ emails, onEmailClick }: EmailListProps) {
  const [hoveredEmail, setHoveredEmail] = useState<string | null>(null);

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

  const getLabelColor = (label: string) => {
    const colors = {
      'IMPORTANT': 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
      'STARRED': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
      'INBOX': 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    };
    return colors[label as keyof typeof colors] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
  };

  return (
    <div className="space-y-2 sm:space-y-1">
      {emails.map((email) => (
        <div
          key={email.id}
          className={`group relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-3 sm:p-4 cursor-pointer transition-all duration-200 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:shadow-lg hover:border-slate-300/50 dark:hover:border-slate-600/50 ${
            !email.isRead ? 'ring-2 ring-blue-500/20 dark:ring-blue-400/20' : ''
          }`}
          onMouseEnter={() => setHoveredEmail(email.id)}
          onMouseLeave={() => setHoveredEmail(null)}
          onClick={() => onEmailClick(email)}
        >
          <div className="flex items-start gap-3 sm:gap-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-medium text-xs sm:text-sm">
                {email.from.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-medium truncate text-sm sm:text-base ${
                      !email.isRead 
                        ? 'text-slate-900 dark:text-white' 
                        : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {email.from}
                    </h3>
                    {!email.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                    )}
                  </div>
                  
                  <p className={`text-sm mb-2 line-clamp-1 sm:line-clamp-none ${
                    !email.isRead 
                      ? 'text-slate-900 dark:text-white font-medium' 
                      : 'text-slate-600 dark:text-slate-400'
                  }`}>
                    {email.subject}
                  </p>
                  
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 hidden sm:block">
                    {email.snippet}
                  </p>
                </div>

                {/* Time and Actions */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {formatTime(email.time)}
                  </span>
                  
                  {/* Labels - Hidden on mobile */}
                  {email.labels.length > 0 && (
                    <div className="flex gap-1 hidden sm:flex">
                      {email.labels.slice(0, 1).map((label) => (
                        <Badge
                          key={label}
                          variant="secondary"
                          className={`text-xs px-2 py-0.5 ${getLabelColor(label)}`}
                        >
                          {label}
                        </Badge>
                      ))}
                      {email.labels.length > 1 && (
                        <Badge variant="secondary" className="text-xs px-2 py-0.5">
                          +{email.labels.length - 1}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons - Hidden on mobile, shown on hover */}
            <div className={`hidden sm:flex items-center gap-1 transition-opacity duration-200 ${
              hoveredEmail === email.id ? 'opacity-100' : 'opacity-0'
            }`}>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle star toggle
                }}
              >
                {email.isStarred ? (
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                ) : (
                  <StarOff className="w-4 h-4 text-slate-400" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle archive
                }}
              >
                <Archive className="w-4 h-4 text-slate-400" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle more actions
                }}
              >
                <MoreHorizontal className="w-4 h-4 text-slate-400" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
