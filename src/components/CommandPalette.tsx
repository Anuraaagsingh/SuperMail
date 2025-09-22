'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import {
  Dialog,
  DialogContent,
} from '@supermail/components/ui/dialog';
import { useAuth } from '@supermail/hooks/useAuth';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const [search, setSearch] = useState('');
  
  // Reset search when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSearch('');
    }
  }, [isOpen]);
  
  const handleSelect = (value: string) => {
    onClose();
    
    switch (value) {
      case 'inbox':
        router.push('/mail/inbox');
        break;
      case 'starred':
        router.push('/mail/starred');
        break;
      case 'sent':
        router.push('/mail/sent');
        break;
      case 'snoozed':
        router.push('/mail/snoozed');
        break;
      case 'drafts':
        router.push('/mail/drafts');
        break;
      case 'compose':
        router.push('/mail/compose');
        break;
      case 'settings':
        router.push('/settings');
        break;
      case 'logout':
        logout();
        break;
      default:
        if (value.startsWith('search:')) {
          const query = value.replace('search:', '').trim();
          router.push(`/mail/inbox?q=${encodeURIComponent(query)}`);
        }
        break;
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 gap-0 max-w-[640px]">
        <Command
          className="rounded-lg border shadow-md"
          // Updated filter to match the expected signature
          filter={(value, search) => {
            if (search.startsWith('/')) {
              return value.startsWith(search.slice(1)) ? 1 : 0;
            }
            // Check if the value contains the search term
            return value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
          }}
        >
          <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
            <Command.Input
              value={search}
              onValueChange={setSearch}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Type a command or search..."
              autoFocus
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
            <Command.Empty className="py-6 text-center text-sm">
              No results found.
            </Command.Empty>
            
            {search.startsWith('/') ? (
              <Command.Item
                value={`search:${search.slice(1)}`}
                onSelect={handleSelect}
                className="px-2 py-1.5 rounded-sm text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 aria-selected:bg-slate-100 dark:aria-selected:bg-slate-800"
              >
                Search for: {search.slice(1)}
              </Command.Item>
            ) : (
              <>
                <Command.Group heading="Navigation">
                  <Command.Item
                    value="inbox"
                    onSelect={handleSelect}
                    className="px-2 py-1.5 rounded-sm text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 aria-selected:bg-slate-100 dark:aria-selected:bg-slate-800"
                  >
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
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
                      Go to Inbox
                      <kbd className="ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-slate-100 dark:bg-slate-800 px-1.5 font-mono text-[10px] font-medium opacity-100">
                        g i
                      </kbd>
                    </div>
                  </Command.Item>
                  
                  <Command.Item
                    value="starred"
                    onSelect={handleSelect}
                    className="px-2 py-1.5 rounded-sm text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 aria-selected:bg-slate-100 dark:aria-selected:bg-slate-800"
                  >
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
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
                      Go to Starred
                      <kbd className="ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-slate-100 dark:bg-slate-800 px-1.5 font-mono text-[10px] font-medium opacity-100">
                        g s
                      </kbd>
                    </div>
                  </Command.Item>
                  
                  <Command.Item
                    value="sent"
                    onSelect={handleSelect}
                    className="px-2 py-1.5 rounded-sm text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 aria-selected:bg-slate-100 dark:aria-selected:bg-slate-800"
                  >
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
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
                      Go to Sent
                      <kbd className="ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-slate-100 dark:bg-slate-800 px-1.5 font-mono text-[10px] font-medium opacity-100">
                        g t
                      </kbd>
                    </div>
                  </Command.Item>
                  
                  <Command.Item
                    value="snoozed"
                    onSelect={handleSelect}
                    className="px-2 py-1.5 rounded-sm text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 aria-selected:bg-slate-100 dark:aria-selected:bg-slate-800"
                  >
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
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
                      Go to Snoozed
                      <kbd className="ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-slate-100 dark:bg-slate-800 px-1.5 font-mono text-[10px] font-medium opacity-100">
                        g z
                      </kbd>
                    </div>
                  </Command.Item>
                  
                  <Command.Item
                    value="drafts"
                    onSelect={handleSelect}
                    className="px-2 py-1.5 rounded-sm text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 aria-selected:bg-slate-100 dark:aria-selected:bg-slate-800"
                  >
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
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
                      Go to Drafts
                      <kbd className="ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-slate-100 dark:bg-slate-800 px-1.5 font-mono text-[10px] font-medium opacity-100">
                        g d
                      </kbd>
                    </div>
                  </Command.Item>
                </Command.Group>
                
                <Command.Group heading="Actions">
                  <Command.Item
                    value="compose"
                    onSelect={handleSelect}
                    className="px-2 py-1.5 rounded-sm text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 aria-selected:bg-slate-100 dark:aria-selected:bg-slate-800"
                  >
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
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
                      Compose New Email
                      <kbd className="ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-slate-100 dark:bg-slate-800 px-1.5 font-mono text-[10px] font-medium opacity-100">
                        c
                      </kbd>
                    </div>
                  </Command.Item>
                  
                  <Command.Item
                    value="settings"
                    onSelect={handleSelect}
                    className="px-2 py-1.5 rounded-sm text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 aria-selected:bg-slate-100 dark:aria-selected:bg-slate-800"
                  >
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Settings
                      <kbd className="ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-slate-100 dark:bg-slate-800 px-1.5 font-mono text-[10px] font-medium opacity-100">
                        ,
                      </kbd>
                    </div>
                  </Command.Item>
                </Command.Group>
                
                {isAuthenticated && (
                  <Command.Group heading="Account">
                    <Command.Item
                      value="logout"
                      onSelect={handleSelect}
                      className="px-2 py-1.5 rounded-sm text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 aria-selected:bg-slate-100 dark:aria-selected:bg-slate-800"
                    >
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Logout {user?.email && `(${user.email})`}
                      </div>
                    </Command.Item>
                  </Command.Group>
                )}
              </>
            )}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
