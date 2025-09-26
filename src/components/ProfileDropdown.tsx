'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@supermail/components/ui/button';
import { Separator } from '@supermail/components/ui/separator';
import { Switch } from '@supermail/components/ui/switch';
import { useAuth } from '@supermail/hooks/useAuth';
import { useTheme } from '@supermail/hooks/useTheme';
import { 
  User, 
  Settings, 
  Sun, 
  Moon, 
  LogOut,
  ChevronDown
} from 'lucide-react';

interface ProfileDropdownProps {
  onSettingsClick: () => void;
}

export function ProfileDropdown({ onSettingsClick }: ProfileDropdownProps) {
  const { user, logout } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  const handleThemeToggle = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Avatar Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 h-8 px-2 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
          {user.name?.charAt(0) || 'U'}
        </div>
        <ChevronDown className="h-3 w-3" />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-background border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
          {/* Profile Section */}
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {user.name || 'User'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Menu Items */}
          <div className="py-2">
            {/* Profile */}
            <button
              onClick={() => {
                onSettingsClick();
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <User className="h-4 w-4 mr-3" />
              Profile
            </button>

            {/* Dark/Light Mode Toggle */}
            <div className="flex items-center justify-between px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">
              <div className="flex items-center">
                {resolvedTheme === 'dark' ? (
                  <Moon className="h-4 w-4 mr-3 text-slate-600 dark:text-slate-400" />
                ) : (
                  <Sun className="h-4 w-4 mr-3 text-slate-600 dark:text-slate-400" />
                )}
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {resolvedTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>
              <Switch
                checked={resolvedTheme === 'dark'}
                onCheckedChange={handleThemeToggle}
                size="sm"
              />
            </div>

            {/* Settings */}
            <button
              onClick={() => {
                onSettingsClick();
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Settings className="h-4 w-4 mr-3" />
              Settings
            </button>
          </div>

          <Separator />

          {/* Logout */}
          <div className="py-2">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
