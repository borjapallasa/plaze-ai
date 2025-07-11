
import React, { useState } from 'react';
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
import { EditEventDialog } from './EditEventDialog';

interface Event {
  title: string;
  date: Date;
  type: string;
  description: string;
  location: string;
  event_uuid: string; // Make this required, not optional
  // Add other database fields we might receive
  name?: string;
}

interface EventDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  events: Event[];
  selectedDate: Date | null;
  isOwner?: boolean;
  onEditEvent?: (event: Event) => void;
  onDeleteEvent?: (eventId: string) => void;
  communityId?: string;
}

export function EventDetailsDialog({ 
  open, 
  onOpenChange, 
  events, 
  selectedDate,
  isOwner = false,
  onEditEvent,
  onDeleteEvent,
  communityId = ""
}: EventDetailsDialogProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);

  if (!selectedDate) return null;

  const dayEvents = events.filter(event => 
    event.date.toDateString() === selectedDate.toDateString()
  );

  if (dayEvents.length === 0) return null;

  const handleEditEvent = (event: Event) => {
    console.log('EventDetailsDialog - handling edit for event:', event);
    console.log('Event has event_uuid:', event.event_uuid);
    
    // Normalize the event object to ensure consistent field names
    const normalizedEvent = {
      ...event,
      title: event.title || event.name || '',
      event_uuid: event.event_uuid
    };
    
    console.log('Normalized event:', normalizedEvent);
    setEventToEdit(normalizedEvent);
    setEditDialogOpen(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    console.log('Attempting to delete event with ID:', eventId);
    onDeleteEvent?.(eventId);
    onOpenChange(false);
  };

  return (
    <>
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
              <div key={event.event_uuid || index} className="border rounded-lg p-4 space-y-3 relative">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{event.title || event.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="capitalize">
                          {event.type}
                        </Badge>
                        
                        {/* Show buttons to everyone */}
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 hover:bg-blue-50"
                            onClick={() => handleEditEvent(event)}
                            title="Edit event"
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 hover:bg-red-50"
                            onClick={() => event.event_uuid ? handleDeleteEvent(event.event_uuid) : console.log('No event UUID available')}
                            title="Delete event"
                            disabled={!event.event_uuid}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
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

      <EditEventDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        event={eventToEdit}
        communityId={communityId}
      />
    </>
  );
}
