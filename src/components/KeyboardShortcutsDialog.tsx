'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ShortcutItemProps {
  keys: string[];
  description: string;
}

const ShortcutItem = ({ keys, description }: ShortcutItemProps) => (
  <div className="flex justify-between items-center py-2">
    <div className="text-sm">{description}</div>
    <div className="flex gap-1">
      {keys.map((key, index) => (
        <kbd
          key={index}
          className="inline-flex h-5 select-none items-center gap-1 rounded border bg-slate-100 dark:bg-slate-800 px-1.5 font-mono text-[10px] font-medium opacity-100"
        >
          {key}
        </kbd>
      ))}
    </div>
  </div>
);

interface KeyboardShortcutsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsDialog({ isOpen, onClose }: KeyboardShortcutsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            SuperMail keyboard shortcuts to help you navigate faster
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">Navigation</h3>
            <div className="space-y-1 border-b pb-2">
              <ShortcutItem keys={['g', 'i']} description="Go to Inbox" />
              <ShortcutItem keys={['g', 's']} description="Go to Starred" />
              <ShortcutItem keys={['g', 't']} description="Go to Sent" />
              <ShortcutItem keys={['g', 'z']} description="Go to Snoozed" />
              <ShortcutItem keys={['g', 'd']} description="Go to Drafts" />
            </div>
            
            <h3 className="text-lg font-semibold mb-2 mt-4">Actions</h3>
            <div className="space-y-1">
              <ShortcutItem keys={['c']} description="Compose new email" />
              <ShortcutItem keys={['/']} description="Search" />
              <ShortcutItem keys={[',']} description="Open settings" />
              <ShortcutItem keys={['Cmd/Ctrl', 'K']} description="Open command palette" />
              <ShortcutItem keys={['?']} description="Show keyboard shortcuts" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Email List</h3>
            <div className="space-y-1 border-b pb-2">
              <ShortcutItem keys={['j']} description="Next email" />
              <ShortcutItem keys={['k']} description="Previous email" />
              <ShortcutItem keys={['x']} description="Select email" />
              <ShortcutItem keys={['o']} description="Open email" />
              <ShortcutItem keys={['Enter']} description="Open email" />
            </div>
            
            <h3 className="text-lg font-semibold mb-2 mt-4">Email Actions</h3>
            <div className="space-y-1">
              <ShortcutItem keys={['e']} description="Archive" />
              <ShortcutItem keys={['#']} description="Delete" />
              <ShortcutItem keys={['r']} description="Reply" />
              <ShortcutItem keys={['a']} description="Reply all" />
              <ShortcutItem keys={['f']} description="Forward" />
              <ShortcutItem keys={['s']} description="Snooze" />
              <ShortcutItem keys={['l']} description="Label" />
              <ShortcutItem keys={['m']} description="Mark as read/unread" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
