'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@supermail/components/ui/button';
import { cn } from '@supermail/lib/utils';
import { CommandPalette } from '@supermail/components/CommandPalette';
import { KeyboardShortcutsDialog } from '@supermail/components/KeyboardShortcutsDialog';
import { useKeyboardShortcuts } from '@supermail/hooks/useKeyboardShortcuts';
import { SearchBar } from '@supermail/components/SearchBar';
import { ThemeToggle } from '@supermail/components/ThemeToggle';
import { useAuth } from '@supermail/hooks/useAuth';

interface MailLayoutContentProps {
  children: ReactNode;
}

export function MailLayoutContent({ children }: MailLayoutContentProps) {
  const pathname = usePathname();
  const { user } = useAuth();
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
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Modern Sidebar */}
      <div className="w-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">SuperMail</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Modern Email Client</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {/* Primary Navigation */}
            <div className="space-y-1">
              <Link href="/mail/inbox">
                <Button
                  variant={isActive('/mail/inbox') ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start h-12 px-4 rounded-xl transition-all duration-200",
                    isActive('/mail/inbox') 
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" 
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
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
                  {isActive('/mail/inbox') && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              <Link href="/mail/starred">
                <Button
                  variant={isActive('/mail/starred') ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start h-12 px-4 rounded-xl transition-all duration-200",
                    isActive('/mail/starred') 
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" 
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
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
                  {isActive('/mail/starred') && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              <Link href="/mail/sent">
                <Button
                  variant={isActive('/mail/sent') ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start h-12 px-4 rounded-xl transition-all duration-200",
                    isActive('/mail/sent') 
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" 
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
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
                  {isActive('/mail/sent') && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              <Link href="/mail/snoozed">
                <Button
                  variant={isActive('/mail/snoozed') ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start h-12 px-4 rounded-xl transition-all duration-200",
                    isActive('/mail/snoozed') 
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" 
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
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
                  {isActive('/mail/snoozed') && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              <Link href="/mail/drafts">
                <Button
                  variant={isActive('/mail/drafts') ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start h-12 px-4 rounded-xl transition-all duration-200",
                    isActive('/mail/drafts') 
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" 
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
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
                  {isActive('/mail/drafts') && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </Button>
              </Link>
            </div>
            
            {/* Labels Section */}
            <div className="pt-6 mt-6 border-t border-slate-200/50 dark:border-slate-800/50">
              <h2 className="px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                Labels
              </h2>
              <div className="space-y-1">
                {/* Add dynamic labels here */}
                <div className="px-4 py-2 text-sm text-slate-500 dark:text-slate-400">
                  No labels yet
                </div>
              </div>
            </div>
          </div>
        </nav>
        
        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 space-y-3">
          <Link href="/mail/compose">
            <Button className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg transition-all duration-200">
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Compose
            </Button>
          </Link>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 text-xs h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
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
              className="flex-1 text-xs h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
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
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z"
                />
              </svg>
              Shortcuts
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Modern Header */}
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-2xl">
              <SearchBar 
                placeholder="Search emails..." 
                className="w-full"
              />
            </div>
            
            <div className="flex items-center space-x-4 ml-6">
              <ThemeToggle />
              
              {user && (
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {user.email}
                    </p>
                  </div>
                  <div 
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-medium text-white shadow-lg"
                    style={{ backgroundImage: user.picture ? `url(${user.picture})` : 'none' }}
                  >
                    {!user.picture && user.name?.charAt(0)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-hidden bg-white/50 dark:bg-slate-900/50">
          {children}
        </div>
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
  );
}