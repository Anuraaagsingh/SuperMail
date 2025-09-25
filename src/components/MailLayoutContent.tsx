'use client';

import { ReactNode, useState } from 'react';
import { CommandPalette } from '@supermail/components/CommandPalette';
import { KeyboardShortcutsDialog } from '@supermail/components/KeyboardShortcutsDialog';
import { useKeyboardShortcuts } from '@supermail/hooks/useKeyboardShortcuts';
import { useAuth } from '@supermail/hooks/useAuth';
import { Sidebar } from '@supermail/components/Sidebar';
import { ThemeToggle } from '@supermail/components/theme-toggle';
import { SettingsOverlay } from '@supermail/components/SettingsOverlay';
import { Button } from '@supermail/components/ui/button';
import { Menu, X, Mail, RefreshCw, Plus, Settings, Search } from 'lucide-react';

interface MailLayoutContentProps {
  children: ReactNode;
}

export function MailLayoutContent({ children }: MailLayoutContentProps) {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useKeyboardShortcuts({
    onCommandPalette: () => setShowCommandPalette(true),
    onKeyboardShortcuts: () => setShowKeyboardShortcuts(true),
  });

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>

            {/* Search only - branding moved to sidebar */}

            {/* Search */}
            <div className="hidden md:block md:flex-1 md:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search emails... (⌘K for more)"
                  className="w-full rounded-lg border bg-background pl-10 pr-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  onKeyDown={(e) => {
                    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      setShowCommandPalette(true);
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            
            {/* User Menu */}
            {user && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                  {user.name?.charAt(0)}
                </div>
              </div>
            )}
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
      />

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsDialog
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />

      {/* Settings Overlay */}
      <SettingsOverlay
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}