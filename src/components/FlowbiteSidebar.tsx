'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Inbox, 
  Star, 
  Send, 
  Clock, 
  FileText, 
  Settings, 
  User,
  ChevronDown,
  LogOut,
  Mail
} from 'lucide-react';
import { Button } from './ui/button';
import { ComposeButton } from './ui/compose-button';

interface FlowbiteSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function FlowbiteSidebar({ isOpen, onToggle }: FlowbiteSidebarProps) {
  const pathname = usePathname();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/mail/inbox', icon: LayoutDashboard },
    { name: 'Inbox', href: '/mail/inbox', icon: Inbox },
    { name: 'Starred', href: '/mail/starred', icon: Star },
    { name: 'Sent', href: '/mail/sent', icon: Send },
    { name: 'Snoozed', href: '/mail/snoozed', icon: Clock },
    { name: 'Drafts', href: '/mail/drafts', icon: FileText },
  ];

  const isActive = (href: string) => {
    if (href === '/mail/inbox' && pathname === '/mail/inbox') return true;
    if (href !== '/mail/inbox' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 z-50 w-64 h-screen transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          {/* Logo */}
          <div className="flex items-center mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">SuperMail</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Modern Email Client</p>
            </div>
          </div>

          {/* Compose Button */}
          <div className="mb-6">
            <ComposeButton 
              onClick={() => {
                // TODO: Navigate to compose
                window.location.href = '/mail/compose';
              }}
              className="w-full"
            />
          </div>

          {/* Navigation */}
          <ul className="space-y-2 font-medium">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center p-2 rounded-lg transition-colors duration-200
                      ${isActive(item.href)
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Labels Section */}
          <div className="mt-8">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Labels
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">No labels yet</p>
          </div>

          {/* Profile Section */}
          <div className="mt-auto pt-6">
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center w-full p-2 text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">john@example.com</p>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showProfileDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              {showProfileDropdown && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
                  <div className="py-2">
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">
                      <User className="w-4 h-4 mr-3" />
                      Profile
                    </button>
                    <hr className="my-2 border-gray-200 dark:border-gray-600" />
                    <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default FlowbiteSidebar;
