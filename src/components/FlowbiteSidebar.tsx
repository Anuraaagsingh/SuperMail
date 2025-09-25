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
    { name: 'Inbox', href: '/mail/inbox', icon: Inbox, count: 12 },
    { name: 'Starred', href: '/mail/starred', icon: Star, count: 3 },
    { name: 'Sent', href: '/mail/sent', icon: Send },
    { name: 'Drafts', href: '/mail/drafts', icon: FileText, count: 2 },
    { name: 'Snoozed', href: '/mail/snoozed', icon: Clock, count: 1 },
    { name: 'Scheduled', href: '/mail/scheduled', icon: Clock },
    { name: 'Archive', href: '/mail/archive', icon: FileText },
    { name: 'Spam', href: '/mail/spam', icon: FileText },
    { name: 'Trash', href: '/mail/trash', icon: FileText },
  ];

  const splits = [
    { name: 'Primary', href: '/mail/primary', count: 8, color: 'bg-blue-500' },
    { name: 'Social', href: '/mail/social', count: 2, color: 'bg-green-500' },
    { name: 'Updates', href: '/mail/updates', count: 2, color: 'bg-yellow-500' },
  ];

  const other = [
    { name: 'Team', href: '/mail/team', icon: User },
    { name: 'Work', href: '/mail/work', icon: FileText },
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
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-900 text-white">
          {/* Logo */}
          <div className="flex items-center mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">MasterMail</h1>
              <p className="text-xs text-gray-400">Built for Speed</p>
            </div>
          </div>

          {/* Main Navigation */}
          <ul className="space-y-1 font-medium mb-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center justify-between p-2 rounded-lg transition-colors duration-200
                      ${isActive(item.href)
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }
                    `}
                  >
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 mr-3" />
                      <span>{item.name}</span>
                    </div>
                    {item.count && (
                      <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded-full">
                        {item.count}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* SPLITS Section */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
              SPLITS
            </h3>
            <ul className="space-y-1">
              {splits.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center justify-between p-2 rounded-lg transition-colors duration-200
                      ${isActive(item.href)
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }
                    `}
                  >
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full ${item.color} mr-3`}></div>
                      <span>{item.name}</span>
                    </div>
                    <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded-full">
                      {item.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Other Section */}
          <ul className="space-y-1 mb-6">
            {other.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="flex items-center p-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Settings Button */}
          <div className="mt-auto pt-6">
            <Link
              href="/settings"
              className="flex items-center p-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
            >
              <Settings className="w-5 h-5 mr-3" />
              <span>Settings</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

export default FlowbiteSidebar;
