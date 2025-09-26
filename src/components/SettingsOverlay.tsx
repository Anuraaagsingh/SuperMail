'use client';

import { useState, useEffect } from 'react';
import { Button } from '@supermail/components/ui/button';
import { Switch } from '@supermail/components/ui/switch';
import { Separator } from '@supermail/components/ui/separator';
import { useAuth } from '@supermail/hooks/useAuth';
import { 
  X, 
  Sun, 
  Moon, 
  Bell, 
  Shield, 
  Palette,
  Mail,
  Keyboard,
  User,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface SettingsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsOverlay({ isOpen, onClose }: SettingsOverlayProps) {
  const { user } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [gmailConnected, setGmailConnected] = useState(false);

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      // Get current theme
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
      setTheme(currentTheme);
      
      // Check Gmail connection status
      // For demo purposes, we'll simulate this
      // In a real app, you'd check the actual connection status
      const hasGmailToken = localStorage.getItem('gmail_token');
      setGmailConnected(!!hasGmailToken);
    }
  }, [isOpen]);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      if (newTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.setItem('theme', newTheme);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Settings Panel */}
      <div className="relative bg-background rounded-lg shadow-xl border w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Settings</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-8 h-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Settings Content */}
        <div className="p-6 space-y-6">
          {/* Profile Section */}
          {user && (
            <>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <h3 className="font-medium text-slate-900 dark:text-white">Profile</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {user.name || 'User'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Gmail Connected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {gmailConnected ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-green-600 dark:text-green-400">Connected</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span className="text-xs text-red-600 dark:text-red-400">Not Connected</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />
            </>
          )}

          {/* Appearance */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <h3 className="font-medium text-slate-900 dark:text-white">Appearance</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {theme === 'light' ? (
                    <Sun className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  )}
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                  </span>
                </div>
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) => handleThemeChange(checked ? 'dark' : 'light')}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Notifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <h3 className="font-medium text-slate-900 dark:text-white">Notifications</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-300">Email Notifications</span>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Email */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <h3 className="font-medium text-slate-900 dark:text-white">Email</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-300">Auto-save Drafts</span>
                <Switch
                  checked={autoSave}
                  onCheckedChange={setAutoSave}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Shortcuts */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Keyboard className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <h3 className="font-medium text-slate-900 dark:text-white">Keyboard Shortcuts</h3>
            </div>
            
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Compose new email</span>
                <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs">⌘ + N</kbd>
              </div>
              <div className="flex justify-between">
                <span>Search emails</span>
                <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs">⌘ + K</kbd>
              </div>
              <div className="flex justify-between">
                <span>Toggle sidebar</span>
                <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs">⌘ + B</kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              SuperMail v1.0.0
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="border-slate-200 dark:border-slate-700"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
