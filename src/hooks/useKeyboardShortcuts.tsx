'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface KeyboardShortcutsOptions {
  enableGlobalShortcuts?: boolean;
  enableListShortcuts?: boolean;
  enableThreadShortcuts?: boolean;
  onOpenCommandPalette?: () => void;
  onOpenShortcutsDialog?: () => void;
}

export function useKeyboardShortcuts({
  enableGlobalShortcuts = true,
  enableListShortcuts = false,
  enableThreadShortcuts = false,
  onOpenCommandPalette,
  onOpenShortcutsDialog,
}: KeyboardShortcutsOptions = {}) {
  const router = useRouter();
  const [keys, setKeys] = useState<string[]>([]);
  
  useEffect(() => {
    const keyMap = new Map<string, boolean>();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcuts when typing in input fields
      if (
        e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }
      
      const key = e.key.toLowerCase();
      
      // Track keys for multi-key shortcuts
      keyMap.set(key, true);
      setKeys(Array.from(keyMap.keys()));
      
      // Command palette (Cmd/Ctrl+K)
      if ((e.metaKey || e.ctrlKey) && key === 'k' && onOpenCommandPalette) {
        e.preventDefault();
        onOpenCommandPalette();
        return;
      }
      
      // Shortcuts help dialog
      if (key === '?' && enableGlobalShortcuts && onOpenShortcutsDialog) {
        e.preventDefault();
        onOpenShortcutsDialog();
        return;
      }
      
      // Global navigation shortcuts
      if (enableGlobalShortcuts) {
        // Navigation with g prefix
        if (keys.includes('g')) {
          switch (key) {
            case 'i':
              e.preventDefault();
              router.push('/mail/inbox');
              break;
            case 's':
              e.preventDefault();
              router.push('/mail/starred');
              break;
            case 't':
              e.preventDefault();
              router.push('/mail/sent');
              break;
            case 'z':
              e.preventDefault();
              router.push('/mail/snoozed');
              break;
            case 'd':
              e.preventDefault();
              router.push('/mail/drafts');
              break;
          }
        } else {
          // Single key shortcuts
          switch (key) {
            case 'c':
              e.preventDefault();
              router.push('/mail/compose');
              break;
            case ',':
              e.preventDefault();
              router.push('/settings');
              break;
            case '/':
              e.preventDefault();
              // Focus search input
              const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
              if (searchInput) {
                searchInput.focus();
              }
              break;
          }
        }
      }
      
      // Email list shortcuts
      if (enableListShortcuts) {
        // TODO: Implement email list shortcuts (j, k, x, o)
      }
      
      // Thread shortcuts
      if (enableThreadShortcuts) {
        // TODO: Implement thread shortcuts (r, a, f, e, #, s, l, m)
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keyMap.delete(key);
      setKeys(Array.from(keyMap.keys()));
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    enableGlobalShortcuts, 
    enableListShortcuts, 
    enableThreadShortcuts, 
    onOpenCommandPalette, 
    onOpenShortcutsDialog, 
    router,
    keys,
  ]);
  
  return { activeKeys: keys };
}
