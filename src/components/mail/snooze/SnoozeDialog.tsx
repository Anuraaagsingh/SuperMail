'use client';

import { useState } from 'react';
import { addDays, addHours, set, format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface SnoozeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSnooze: (snoozeUntil: Date) => Promise<void>;
}

export function SnoozeDialog({ isOpen, onClose, onSnooze }: SnoozeDialogProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState('09:00');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const handleSnoozePreset = (getDate: () => Date) => {
    const snoozeDate = getDate();
    onSnooze(snoozeDate);
  };
  
  const handleCustomSnooze = () => {
    if (!date) return;
    
    const [hours, minutes] = time.split(':').map(Number);
    const snoozeDate = set(date, { hours, minutes, seconds: 0, milliseconds: 0 });
    
    onSnooze(snoozeDate);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Snooze until</DialogTitle>
          <DialogDescription>
            Choose when this message should return to your inbox.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <Button 
            variant="outline" 
            onClick={() => handleSnoozePreset(() => addHours(new Date(), 3))}
            className="justify-between"
          >
            <span>Later today</span>
            <span className="text-slate-500 text-xs">
              {format(addHours(new Date(), 3), 'h:mm a')}
            </span>
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => handleSnoozePreset(() => {
              const tomorrow = addDays(new Date(), 1);
              return set(tomorrow, { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 });
            })}
            className="justify-between"
          >
            <span>Tomorrow morning</span>
            <span className="text-slate-500 text-xs">
              {format(
                set(addDays(new Date(), 1), { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 }),
                'EEE, h:mm a'
              )}
            </span>
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => handleSnoozePreset(() => {
              const today = new Date();
              const daysUntilWeekend = today.getDay() === 6 ? 7 : 6 - today.getDay();
              const weekend = addDays(today, daysUntilWeekend);
              return set(weekend, { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 });
            })}
            className="justify-between"
          >
            <span>This weekend</span>
            <span className="text-slate-500 text-xs">
              {format(
                set(
                  addDays(
                    new Date(), 
                    new Date().getDay() === 6 ? 7 : 6 - new Date().getDay()
                  ), 
                  { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 }
                ),
                'EEE, MMM d'
              )}
            </span>
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => handleSnoozePreset(() => {
              const nextWeek = addDays(new Date(), 7);
              return set(nextWeek, { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 });
            })}
            className="justify-between"
          >
            <span>Next week</span>
            <span className="text-slate-500 text-xs">
              {format(
                set(addDays(new Date(), 7), { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 }),
                'EEE, MMM d'
              )}
            </span>
          </Button>
          
          <div className="flex space-x-2 items-center">
            <div className="flex-grow">
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left font-normal"
                  >
                    {date ? format(date, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate);
                      setIsCalendarOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="w-24">
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={handleCustomSnooze}
              disabled={!date}
            >
              Set
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
