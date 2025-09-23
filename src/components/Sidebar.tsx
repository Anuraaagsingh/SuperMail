'use client';

import { useState } from 'react';
import { Button } from '@supermail/components/ui/button';
import { Input } from '@supermail/components/ui/input';
import { Separator } from '@supermail/components/ui/separator';
import { 
  Mail, 
  Star, 
  Send, 
  Clock, 
  FileText, 
  Plus, 
  Search,
  Menu,
  X,
  Settings,
  Command
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onCompose: () => void;
  onSettings: () => void;
}

export function Sidebar({ isCollapsed, onToggle, onCompose, onSettings }: SidebarProps) {
  const [activeItem, setActiveItem] = useState('inbox');

  const navigationItems = [
    { id: 'inbox', label: 'Inbox', icon: Mail, count: 4 },
    { id: 'starred', label: 'Starred', icon: Star, count: 0 },
    { id: 'sent', label: 'Sent', icon: Send, count: 1 },
    { id: 'snoozed', label: 'Snoozed', icon: Clock, count: 0 },
    { id: 'drafts', label: 'Drafts', icon: FileText, count: 0 },
  ];

  return (
    <div className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-slate-900 dark:text-white">SuperMail</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Modern Email Client</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="w-8 h-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search emails..."
              className="pl-10 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="px-4 pb-4">
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 h-10 ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                onClick={() => setActiveItem(item.id)}
              >
                <Icon className="w-4 h-4" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.count > 0 && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </>
                )}
              </Button>
            );
          })}
        </nav>
      </div>

      <Separator className="mx-4" />

      {/* Labels */}
      {!isCollapsed && (
        <div className="px-4 py-4">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Labels
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">No labels yet</p>
        </div>
      )}

      <Separator className="mx-4" />

      {/* Actions */}
      <div className="p-4 space-y-2">
        <Button
          onClick={onCompose}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
        >
          {!isCollapsed ? (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Compose
            </>
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </Button>

        {!isCollapsed && (
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={onSettings}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Command className="w-4 h-4 mr-2" />
              Shortcuts
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
