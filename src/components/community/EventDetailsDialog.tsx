
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Event {
  title: string;
  date: Date;
  type: string;
  description: string;
  location: string;
}

interface EventDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  events: Event[];
  selectedDate: Date | null;
}

export function EventDetailsDialog({ open, onOpenChange, events, selectedDate }: EventDetailsDialogProps) {
  if (!selectedDate) return null;

  const dayEvents = events.filter(event => 
    event.date.toDateString() === selectedDate.toDateString()
  );

  if (dayEvents.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Events for {format(selectedDate, 'MMMM d, yyyy')}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {dayEvents.map((event, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <Badge variant="secondary" className="capitalize">
                  {event.type}
                </Badge>
              </div>
              
              {event.description && (
                <p className="text-muted-foreground text-sm">
                  {event.description}
                </p>
              )}
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {format(event.date, 'h:mm a')}
                </div>
                {event.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
