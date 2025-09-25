'use client';

import { useState } from 'react';
import { Button } from '@supermail/components/ui/button';
import { Input } from '@supermail/components/ui/input';
import { Label } from '@supermail/components/ui/label';
import { Calendar } from '@supermail/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@supermail/components/ui/popover';
import { 
  X, 
  Calendar as CalendarIcon,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';

interface ScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email?: any;
}

export function ScheduleDialog({ isOpen, onClose, email }: ScheduleDialogProps) {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('09:00');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleSchedule = () => {
    if (!date) return;
    
    // TODO: Implement schedule functionality
    console.log('Scheduling email:', {
      email,
      date: date.toISOString(),
      time
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Schedule Dialog */}
      <div className="relative bg-background rounded-lg shadow-xl border w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">Schedule Email</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {email && (
            <div className="text-sm text-muted-foreground">
              <p><strong>To:</strong> {email.from}</p>
              <p><strong>Subject:</strong> {email.subject}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                      setDate(selectedDate);
                      setIsCalendarOpen(false);
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-2 p-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSchedule}
            disabled={!date}
            className="flex items-center space-x-2"
          >
            <Clock className="h-4 w-4" />
            <span>Schedule</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
