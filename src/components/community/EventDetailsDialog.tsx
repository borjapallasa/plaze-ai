
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface Event {
  title: string;
  date: Date;
  type: string;
  description: string;
  location: string;
  event_uuid?: string;
}

interface EventDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  events: Event[];
  selectedDate: Date | null;
  isOwner?: boolean;
  onEditEvent?: (event: Event) => void;
  onDeleteEvent?: (eventId: string) => void;
}

export function EventDetailsDialog({ 
  open, 
  onOpenChange, 
  events, 
  selectedDate,
  isOwner = false,
  onEditEvent,
  onDeleteEvent
}: EventDetailsDialogProps) {
  if (!selectedDate) return null;

  const dayEvents = events.filter(event => 
    event.date.toDateString() === selectedDate.toDateString()
  );

  if (dayEvents.length === 0) return null;

  const handleEditEvent = (event: Event) => {
    onEditEvent?.(event);
    onOpenChange(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    onDeleteEvent?.(eventId);
    onOpenChange(false);
  };

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
            <div key={index} className="border rounded-lg p-4 space-y-3 relative group hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {event.type}
                  </Badge>
                </div>
              </div>
              
              {/* Owner Actions - visible on hover */}
              {isOwner && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1 bg-white rounded-md shadow-md p-1 border">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-blue-50"
                    onClick={() => handleEditEvent(event)}
                    title="Edit event"
                  >
                    <Edit className="h-4 w-4 text-blue-600" />
                  </Button>
                  {event.event_uuid && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-red-50"
                      onClick={() => handleDeleteEvent(event.event_uuid!)}
                      title="Delete event"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  )}
                </div>
              )}
              
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
