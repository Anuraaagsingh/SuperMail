'use client';

import { useState, useEffect } from 'react';
import { Button } from '@supermail/components/ui/button';
import { Switch } from '@supermail/components/ui/switch';
import { Separator } from '@supermail/components/ui/separator';
import { 
  X, 
  Sun, 
  Moon, 
  Bell, 
  Shield, 
  Palette,
  Mail,
  Keyboard
} from 'lucide-react';

interface SettingsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsOverlay({ isOpen, onClose }: SettingsOverlayProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // Get current theme
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
      setTheme(currentTheme);
    }
  }, [isOpen]);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', newTheme);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Settings Panel */}
      <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-700/50">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Settings</h2>
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
