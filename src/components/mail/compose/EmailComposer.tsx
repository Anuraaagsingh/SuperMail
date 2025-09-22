'use client';

import { useState, useEffect } from 'react';
import { Button } from '@supermail/components/ui/button';
import { Input } from '@supermail/components/ui/input';
import { Textarea } from '@supermail/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader } from '@supermail/components/ui/card';
import { ScheduleDialog } from './ScheduleDialog';
import { useAuth } from '@supermail/hooks/useAuth';

interface EmailComposerProps {
  mode?: 'new' | 'reply' | 'replyAll' | 'forward';
  initialTo?: string;
  initialCc?: string;
  initialBcc?: string;
  initialSubject?: string;
  initialBody?: string;
  threadId?: string;
  messageId?: string;
  onClose?: () => void;
  onSent?: () => void;
}

export function EmailComposer({
  mode = 'new',
  initialTo = '',
  initialCc = '',
  initialBcc = '',
  initialSubject = '',
  initialBody = '',
  threadId,
  messageId,
  onClose,
  onSent,
}: EmailComposerProps) {
  const [to, setTo] = useState(initialTo);
  const [cc, setCc] = useState(initialCc);
  const [bcc, setBcc] = useState(initialBcc);
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [isSending, setIsSending] = useState(false);
  const [showCc, setShowCc] = useState(!!initialCc);
  const [showBcc, setShowBcc] = useState(!!initialBcc);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { user } = useAuth();
  
  // Auto-save draft every 30 seconds
  useEffect(() => {
    const autosaveInterval = setInterval(() => {
      if (to || subject || body) {
        saveDraft();
      }
    }, 30000);
    
    return () => clearInterval(autosaveInterval);
  }, [to, subject, body, draftId]);
  
  const saveDraft = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      
      const response = await fetch('/api/mail/draft', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: draftId,
          subject,
          body_html: body,
          to: to.split(',').map(email => email.trim()).filter(Boolean),
          cc: cc ? cc.split(',').map(email => email.trim()).filter(Boolean) : [],
          bcc: bcc ? bcc.split(',').map(email => email.trim()).filter(Boolean) : [],
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save draft');
      }
      
      const data = await response.json();
      setDraftId(data.id);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };
  
  const handleSend = async () => {
    if (!to || !subject) return;
    
    setIsSending(true);
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Not authenticated');
      
      const response = await fetch('/api/mail/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          body_html: body,
          to: to.split(',').map(email => email.trim()).filter(Boolean),
          cc: cc ? cc.split(',').map(email => email.trim()).filter(Boolean) : [],
          bcc: bcc ? bcc.split(',').map(email => email.trim()).filter(Boolean) : [],
          threadId,
          messageId,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send email');
      }
      
      // Delete draft if it exists
      if (draftId) {
        await fetch(`/api/mail/draft?id=${draftId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      
      if (onSent) onSent();
      if (onClose) onClose();
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again.');
    } finally {
      setIsSending(false);
    }
  };
  
  const handleSchedule = async (scheduleAt: Date) => {
    if (!to || !subject) return;
    
    setIsSending(true);
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Not authenticated');
      
      // Save as draft first if not already saved
      let currentDraftId = draftId;
      
      if (!currentDraftId) {
        const draftResponse = await fetch('/api/mail/draft', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subject,
            body_html: body,
            to: to.split(',').map(email => email.trim()).filter(Boolean),
            cc: cc ? cc.split(',').map(email => email.trim()).filter(Boolean) : [],
            bcc: bcc ? bcc.split(',').map(email => email.trim()).filter(Boolean) : [],
          }),
        });
        
        if (!draftResponse.ok) {
          throw new Error('Failed to save draft');
        }
        
        const draftData = await draftResponse.json();
        currentDraftId = draftData.id;
      }
      
      // Schedule the draft
      const scheduleResponse = await fetch('/api/mail/schedule', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          draft_id: currentDraftId,
          scheduled_at: scheduleAt.toISOString(),
        }),
      });
      
      if (!scheduleResponse.ok) {
        const errorData = await scheduleResponse.json();
        throw new Error(errorData.error || 'Failed to schedule email');
      }
      
      setIsScheduleDialogOpen(false);
      if (onSent) onSent();
      if (onClose) onClose();
    } catch (error) {
      console.error('Error scheduling email:', error);
      alert('Failed to schedule email. Please try again.');
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">
            {mode === 'new' && 'New Message'}
            {mode === 'reply' && 'Reply'}
            {mode === 'replyAll' && 'Reply All'}
            {mode === 'forward' && 'Forward'}
          </h3>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <div className="flex items-center">
              <label className="w-16 text-sm font-medium">To:</label>
              <Input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="recipient@example.com"
                className="flex-1"
              />
            </div>
          </div>
          
          {showCc && (
            <div className="flex items-center">
              <label className="w-16 text-sm font-medium">Cc:</label>
              <Input
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                placeholder="cc@example.com"
                className="flex-1"
              />
            </div>
          )}
          
          {showBcc && (
            <div className="flex items-center">
              <label className="w-16 text-sm font-medium">Bcc:</label>
              <Input
                value={bcc}
                onChange={(e) => setBcc(e.target.value)}
                placeholder="bcc@example.com"
                className="flex-1"
              />
            </div>
          )}
          
          {!showCc || !showBcc ? (
            <div className="flex space-x-2">
              {!showCc && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowCc(true)}
                  className="text-xs"
                >
                  Add Cc
                </Button>
              )}
              
              {!showBcc && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowBcc(true)}
                  className="text-xs"
                >
                  Add Bcc
                </Button>
              )}
            </div>
          ) : null}
          
          <div className="flex items-center">
            <label className="w-16 text-sm font-medium">Subject:</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="flex-1"
            />
          </div>
          
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your message here..."
            className="min-h-[200px]"
          />
          
          {lastSaved && (
            <div className="text-xs text-slate-500">
              Last saved: {lastSaved.toLocaleTimeString()}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 flex justify-between">
        <div className="flex space-x-2">
          <Button
            variant="default"
            onClick={handleSend}
            disabled={isSending || !to || !subject}
          >
            {isSending ? 'Sending...' : 'Send'}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setIsScheduleDialogOpen(true)}
            disabled={isSending || !to || !subject}
          >
            Schedule
          </Button>
        </div>
        
        <Button variant="ghost" onClick={saveDraft}>
          Save Draft
        </Button>
      </CardFooter>
      
      <ScheduleDialog
        isOpen={isScheduleDialogOpen}
        onClose={() => setIsScheduleDialogOpen(false)}
        onSchedule={handleSchedule}
      />
    </Card>
  );
}
