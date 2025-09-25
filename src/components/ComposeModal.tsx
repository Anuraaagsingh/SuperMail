'use client';

import { useState, useEffect } from 'react';
import { Button } from '@supermail/components/ui/button';
import { Input } from '@supermail/components/ui/input';
import { Textarea } from '@supermail/components/ui/textarea';
import { 
  X, 
  Maximize2, 
  Paperclip, 
  Image, 
  Smile, 
  Link,
  Send,
  Clock
} from 'lucide-react';

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ComposeModal({ isOpen, onClose }: ComposeModalProps) {
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [showCcBcc, setShowCcBcc] = useState(false);

  const handleSend = () => {
    // TODO: Implement send email functionality
    console.log('Sending email:', { to, cc, bcc, subject, message });
    onClose();
  };

  const handleSendLater = () => {
    // TODO: Implement send later functionality
    console.log('Scheduling email:', { to, cc, bcc, subject, message });
    onClose();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'Enter') {
        e.preventDefault();
        handleSend();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, to, cc, bcc, subject, message]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Compose Modal */}
      <div className="relative bg-background rounded-lg shadow-xl border w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">New message</h2>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Compose Form */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {/* Recipients */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <label className="w-12 text-sm font-medium">To</label>
              <Input
                placeholder="Recipients"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCcBcc(!showCcBcc)}
                className="text-sm"
              >
                Cc Bcc
              </Button>
            </div>
            
            {showCcBcc && (
              <>
                <div className="flex items-center space-x-2">
                  <label className="w-12 text-sm font-medium">Cc</label>
                  <Input
                    placeholder="Cc recipients"
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <label className="w-12 text-sm font-medium">Bcc</label>
                  <Input
                    placeholder="Bcc recipients"
                    value={bcc}
                    onChange={(e) => setBcc(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </>
            )}
          </div>

          {/* Subject */}
          <div className="flex items-center space-x-2">
            <label className="w-12 text-sm font-medium">Subject</label>
            <Input
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="flex-1"
            />
          </div>

          {/* Formatting Toolbar */}
          <div className="flex items-center space-x-2 py-2 border-b">
            <Button variant="ghost" size="sm" className="font-bold">B</Button>
            <Button variant="ghost" size="sm" className="italic">I</Button>
            <Button variant="ghost" size="sm" className="underline">U</Button>
            <div className="w-px h-4 bg-border mx-1" />
            <Button variant="ghost" size="sm">
              <Link className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Image className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Smile className="h-4 w-4" />
            </Button>
          </div>

          {/* Message Body */}
          <Textarea
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[300px] resize-none"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t">
          <div className="flex items-center space-x-2">
            <Button onClick={handleSend} className="flex items-center space-x-2">
              <Send className="h-4 w-4" />
              <span>Send</span>
            </Button>
            <Button variant="outline" onClick={handleSendLater} className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Send later</span>
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Press ⌘Enter to send
          </div>
        </div>
      </div>
    </div>
  );
}
