'use client';

import { ReactNode, useState } from 'react';
import { Button } from '@supermail/components/ui/button';
import { CommandPalette } from '@supermail/components/CommandPalette';
import { KeyboardShortcutsDialog } from '@supermail/components/KeyboardShortcutsDialog';
import { useKeyboardShortcuts } from '@supermail/hooks/useKeyboardShortcuts';
import { SearchBar } from '@supermail/components/SearchBar';
import { useAuth } from '@supermail/hooks/useAuth';
import { FlowbiteSidebar } from '@supermail/components/FlowbiteSidebar';
import { Menu, X } from 'lucide-react';

interface MailLayoutContentProps {
  children: ReactNode;
}

export function MailLayoutContent({ children }: MailLayoutContentProps) {
  const { user } = useAuth();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsDialogOpen, setIsShortcutsDialogOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Set up keyboard shortcuts
  useKeyboardShortcuts({
    onOpenCommandPalette: () => setIsCommandPaletteOpen(true),
    onOpenShortcutsDialog: () => setIsShortcutsDialogOpen(true),
  });
  
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Mobile menu button */}
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 lg:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <span className="sr-only">Open sidebar</span>
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Flowbite Sidebar */}
      <FlowbiteSidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      
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