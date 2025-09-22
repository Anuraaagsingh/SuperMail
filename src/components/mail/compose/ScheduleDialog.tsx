'use client';

import { useState } from 'react';
import { addDays, addHours, set, format } from 'date-fns';
import { Calendar } from '@supermail/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@supermail/components/ui/dialog';
import { Button } from '@supermail/components/ui/button';
import { Input } from '@supermail/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@supermail/components/ui/popover';

interface ScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (scheduleAt: Date) => Promise<void>;
}

export function ScheduleDialog({ isOpen, onClose, onSchedule }: ScheduleDialogProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState('09:00');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const handleSchedulePreset = (getDate: () => Date) => {
    const scheduleDate = getDate();
    onSchedule(scheduleDate);
  };
  
  const handleCustomSchedule = () => {
    if (!date) return;
    
    const [hours, minutes] = time.split(':').map(Number);
    const scheduleDate = set(date, { hours, minutes, seconds: 0, milliseconds: 0 });
    
    onSchedule(scheduleDate);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule send</DialogTitle>
          <DialogDescription>
            Choose when to send this email.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <Button 
            variant="outline" 
            onClick={() => handleSchedulePreset(() => addHours(new Date(), 1))}
            className="justify-between"
          >
            <span>In 1 hour</span>
            <span className="text-slate-500 text-xs">
              {format(addHours(new Date(), 1), 'h:mm a')}
            </span>
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => handleSchedulePreset(() => {
              const tomorrow = addDays(new Date(), 1);
              return set(tomorrow, { hours: 8, minutes: 0, seconds: 0, milliseconds: 0 });
            })}
            className="justify-between"
          >
            <span>Tomorrow morning</span>
            <span className="text-slate-500 text-xs">
              {format(
                set(addDays(new Date(), 1), { hours: 8, minutes: 0, seconds: 0, milliseconds: 0 }),
                'EEE, h:mm a'
              )}
            </span>
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => handleSchedulePreset(() => {
              const tomorrow = addDays(new Date(), 1);
              return set(tomorrow, { hours: 18, minutes: 0, seconds: 0, milliseconds: 0 });
            })}
            className="justify-between"
          >
            <span>Tomorrow evening</span>
            <span className="text-slate-500 text-xs">
              {format(
                set(addDays(new Date(), 1), { hours: 18, minutes: 0, seconds: 0, milliseconds: 0 }),
                'EEE, h:mm a'
              )}
            </span>
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => handleSchedulePreset(() => {
              const monday = new Date();
              const daysUntilMonday = monday.getDay() === 0 ? 1 : 8 - monday.getDay();
              const nextMonday = addDays(monday, daysUntilMonday);
              return set(nextMonday, { hours: 8, minutes: 0, seconds: 0, milliseconds: 0 });
            })}
            className="justify-between"
          >
            <span>Next Monday</span>
            <span className="text-slate-500 text-xs">
              {format(
                set(
                  addDays(
                    new Date(), 
                    new Date().getDay() === 0 ? 1 : 8 - new Date().getDay()
                  ), 
                  { hours: 8, minutes: 0, seconds: 0, milliseconds: 0 }
                ),
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
              onClick={handleCustomSchedule}
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
