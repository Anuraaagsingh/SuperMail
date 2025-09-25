'use client';

import { ReactNode, useState } from 'react';
import { Button } from '@supermail/components/ui/button';
import { CommandPalette } from '@supermail/components/CommandPalette';
import { KeyboardShortcutsDialog } from '@supermail/components/KeyboardShortcutsDialog';
import { useKeyboardShortcuts } from '@supermail/hooks/useKeyboardShortcuts';
import { SearchBar } from '@supermail/components/SearchBar';
import { useAuth } from '@supermail/hooks/useAuth';
import { FlowbiteSidebar } from '@supermail/components/FlowbiteSidebar';
import { Menu, X, Mail, RefreshCw, Plus, Settings } from 'lucide-react';

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
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* MasterMail Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Search */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">MasterMail</h1>
              </div>
              
            <div className="flex-1 max-w-2xl">
              <SearchBar 
                  placeholder="Search emails... (⌘K for more)" 
                className="w-full"
              />
              </div>
            </div>
            
            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">
                <Plus className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">
                <Settings className="w-4 h-4" />
              </Button>
              
              {/* User Menu */}
              {user && (
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-medium text-white">
                    {user.name?.charAt(0)}
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