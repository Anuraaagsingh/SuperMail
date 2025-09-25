'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@supermail/lib/utils';
import { Button } from '@supermail/components/ui/button';
import { Badge } from '@supermail/components/ui/badge';
import { 
  Inbox, 
  Star, 
  Send, 
  FileText, 
  Clock, 
  Archive, 
  AlertTriangle, 
  Trash2, 
  Settings,
  User,
  Briefcase,
  Circle
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Inbox', href: '/mail/inbox', icon: Inbox, count: 12 },
    { name: 'Starred', href: '/mail/starred', icon: Star, count: 3 },
    { name: 'Sent', href: '/mail/sent', icon: Send },
    { name: 'Drafts', href: '/mail/drafts', icon: FileText, count: 2 },
    { name: 'Snoozed', href: '/mail/snoozed', icon: Clock, count: 1 },
    { name: 'Scheduled', href: '/mail/scheduled', icon: Clock },
    { name: 'Archive', href: '/mail/archive', icon: Archive },
    { name: 'Spam', href: '/mail/spam', icon: AlertTriangle },
    { name: 'Trash', href: '/mail/trash', icon: Trash2 },
  ];

  const splits = [
    { name: 'Primary', href: '/mail/primary', count: 8, color: 'bg-blue-500' },
    { name: 'Social', href: '/mail/social', count: 2, color: 'bg-green-500' },
    { name: 'Updates', href: '/mail/updates', count: 2, color: 'bg-yellow-500' },
  ];

  const other = [
    { name: 'Team', href: '/mail/team', icon: User },
    { name: 'Work', href: '/mail/work', icon: Briefcase },
  ];

  const isActive = (href: string) => {
    if (href === '/mail/inbox' && pathname === '/mail/inbox') return true;
    if (href !== '/mail/inbox' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <div className={cn("flex h-full w-64 flex-col bg-background border-r", className)}>
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Inbox className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">MasterMail</h1>
            <p className="text-xs text-muted-foreground">Built for Speed</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive(item.href)
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </div>
                {item.count && (
                  <Badge variant="secondary" className="ml-auto">
                    {item.count}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* SPLITS Section */}
        <div className="mt-6">
          <h3 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            SPLITS
          </h3>
          <nav className="space-y-1">
            {splits.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive(item.href)
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                <div className="flex items-center space-x-3">
                  <div className={cn("h-2 w-2 rounded-full", item.color)} />
                  <span>{item.name}</span>
                </div>
                <Badge variant="secondary" className="ml-auto">
                  {item.count}
                </Badge>
              </Link>
            ))}
          </nav>
        </div>

        {/* Other Section */}
        <div className="mt-6">
          <nav className="space-y-1">
            {other.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive(item.href)
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Settings */}
      <div className="border-t p-3">
        <Link
          href="/settings"
          className={cn(
            "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
            isActive('/settings')
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground"
          )}
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );
}