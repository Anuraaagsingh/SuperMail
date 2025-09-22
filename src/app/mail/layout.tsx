'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@supermail/hooks/useAuth';
import { Button } from '@supermail/components/ui/button';
import { cn } from '@supermail/lib/utils';
import { CommandPalette } from '@supermail/components/CommandPalette';
import { KeyboardShortcutsDialog } from '@supermail/components/KeyboardShortcutsDialog';
import { useKeyboardShortcuts } from '@supermail/hooks/useKeyboardShortcuts';
import { ClientScheduler } from '@supermail/components/ClientScheduler';

interface MailLayoutProps {
  children: ReactNode;
}

export default function MailLayout({ children }: MailLayoutProps) {
  const pathname = usePathname();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsDialogOpen, setIsShortcutsDialogOpen] = useState(false);
  
  // Set up keyboard shortcuts
  useKeyboardShortcuts({
    onOpenCommandPalette: () => setIsCommandPaletteOpen(true),
    onOpenShortcutsDialog: () => setIsShortcutsDialogOpen(true),
  });
  
  const isActive = (path: string) => {
    return pathname?.startsWith(path);
  };
  
  return (
    <AuthProvider>
      {/* Client-side scheduler for handling scheduled emails and snoozed emails */}
      <ClientScheduler />
      
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r bg-slate-50 dark:bg-slate-900 flex flex-col">
          <div className="p-4">
            <h1 className="text-xl font-bold">SuperMail</h1>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              <Link href="/mail/inbox">
                <Button
                  variant={isActive('/mail/inbox') ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive('/mail/inbox') && "font-medium"
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  Inbox
                </Button>
              </Link>
              
              <Link href="/mail/starred">
                <Button
                  variant={isActive('/mail/starred') ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive('/mail/starred') && "font-medium"
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  Starred
                </Button>
              </Link>
              
              <Link href="/mail/sent">
                <Button
                  variant={isActive('/mail/sent') ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive('/mail/sent') && "font-medium"
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  Sent
                </Button>
              </Link>
              
              <Link href="/mail/snoozed">
                <Button
                  variant={isActive('/mail/snoozed') ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive('/mail/snoozed') && "font-medium"
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Snoozed
                </Button>
              </Link>
              
              <Link href="/mail/drafts">
                <Button
                  variant={isActive('/mail/drafts') ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive('/mail/drafts') && "font-medium"
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Drafts
                </Button>
              </Link>
            </div>
            
            <div className="pt-4 mt-4 border-t">
              <h2 className="px-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Labels
              </h2>
              
              {/* Add dynamic labels here */}
            </div>
          </nav>
          
          <div className="p-4 border-t">
            <Link href="/mail/compose">
              <Button className="w-full">
                Compose
              </Button>
            </Link>
            
            <div className="mt-4 flex justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs"
                onClick={() => setIsCommandPaletteOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                Commands
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs"
                onClick={() => setIsShortcutsDialogOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                Shortcuts
              </Button>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {children}
        </div>
        
        {/* Command palette */}
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
        />
        
        {/* Keyboard shortcuts dialog */}
        <KeyboardShortcutsDialog
          isOpen={isShortcutsDialogOpen}
          onClose={() => setIsShortcutsDialogOpen(false)}
        />
      </div>
    </AuthProvider>
  );
}