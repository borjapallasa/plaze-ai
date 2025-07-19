
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { EventDetailsDialog } from './EventDetailsDialog';
import { useCommunityEvents } from '@/hooks/use-community-events';

interface Event {
  title: string;
  date: Date;
  type: string;
  description: string;
  location: string;
  event_uuid?: string;
  name?: string;
}

interface CommunityCalendarProps {
  events?: Event[];
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  onAddEvent?: () => void;
  showAddEventButton?: boolean;
  isOwner?: boolean;
  onEditEvent?: (event: Event) => void;
  onDeleteEvent?: (eventId: string) => void;
  communityId?: string;
}

export function CommunityCalendar({ 
  events: propEvents, 
  selectedDate, 
  onDateSelect,
  onAddEvent,
  showAddEventButton = false,
  isOwner = false,
  onEditEvent,
  onDeleteEvent,
  communityId = ""
}: CommunityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [selectedEventDate, setSelectedEventDate] = useState<Date | null>(null);

  // Fetch events from database if communityId is provided
  const { data: fetchedEvents, isLoading } = useCommunityEvents(communityId);
  
  // Use fetched events if available, otherwise use prop events
  // Make sure to normalize the events to have consistent field names
  const events = (fetchedEvents || propEvents || []).map(event => ({
    ...event,
    title: event.title || event.name || '',
    event_uuid: event.event_uuid // Keep the original event_uuid (can be undefined)
  }));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const hasEvent = (date: Date) => {
    return events.some(event => isSameDay(new Date(event.date), date));
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  const handleDateClick = (date: Date) => {
    onDateSelect?.(date);
    const dayEvents = getEventsForDate(date);
    if (dayEvents.length > 0) {
      setSelectedEventDate(date);
      setEventDialogOpen(true);
    }
  };

  const handleEditEvent = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Calendar - Editing event:', event);
    onEditEvent?.(event);
  };

  const handleDeleteEvent = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteEvent?.(eventId);
  };

  const getDayClasses = (date: Date) => {
    const baseClasses = "h-20 w-full flex flex-col items-center justify-center text-sm cursor-pointer rounded-md transition-colors relative";
    const isSelected = selectedDate && isSameDay(date, selectedDate);
    const isToday = isSameDay(date, new Date());
    const eventExists = hasEvent(date);
    
    if (isSelected) {
      return cn(baseClasses, "bg-gray-100 text-gray-800 border border-gray-300");
    }
    
    if (isToday) {
      return cn(baseClasses, "bg-accent text-accent-foreground font-medium");
    }
    
    if (eventExists) {
      return cn(baseClasses, "bg-gray-50 text-gray-700 font-medium hover:bg-gray-100 border border-gray-200");
    }
    
    return cn(baseClasses, "hover:bg-accent hover:text-accent-foreground");
  };

  if (isLoading) {
    return <div className="flex justify-center p-4">Loading events...</div>;
  }

  return (
    <>
      <div className="w-full max-w-full">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousMonth}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextMonth}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            {showAddEventButton && (
              <Button
                onClick={onAddEvent}
                size="sm"
                className="ml-2"
              >
                Add Event
              </Button>
            )}
          </div>
        </div>

        {/* Day Labels */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before month start */}
          {Array.from({ length: monthStart.getDay() }).map((_, index) => (
            <div key={`empty-${index}`} className="h-20" />
          ))}
          
          {/* Month days */}
          {days.map((date) => {
            const dayEvents = getEventsForDate(date);
            const eventsCount = dayEvents.length;
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const isToday = isSameDay(date, new Date());
            const eventExists = hasEvent(date);
            
            const baseClasses = "h-20 w-full flex flex-col items-center justify-center text-sm cursor-pointer rounded-md transition-colors relative";
            
            let dayClasses = baseClasses;
            if (isSelected) {
              dayClasses = cn(baseClasses, "bg-gray-100 text-gray-800 border border-gray-300");
            } else if (isToday) {
              dayClasses = cn(baseClasses, "bg-accent text-accent-foreground font-medium");
            } else if (eventExists) {
              dayClasses = cn(baseClasses, "bg-gray-50 text-gray-700 font-medium hover:bg-gray-100 border border-gray-200");
            } else {
              dayClasses = cn(baseClasses, "hover:bg-accent hover:text-accent-foreground");
            }
            
            return (
              <div
                key={date.toISOString()}
                className={dayClasses}
                onClick={() => handleDateClick(date)}
              >
                <span className="mb-1">{format(date, 'd')}</span>
                {eventsCount > 0 && (
                  <div className="flex items-center justify-center relative group">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    {eventsCount > 1 && (
                      <span className="ml-1 text-xs font-medium text-gray-600">
                        +{eventsCount - 1}
                      </span>
                    )}
                    
                    {/* Event Actions for Owner */}
                    {isOwner && dayEvents.length > 0 && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <div className="flex gap-1 bg-white border rounded-md shadow-lg p-1">
                          {dayEvents.map((event, index) => (
                            <div key={event.event_uuid || index} className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 hover:bg-blue-50"
                                onClick={(e) => handleEditEvent(event, e)}
                                title="Edit event"
                              >
                                <Edit className="h-3 w-3 text-blue-600" />
                              </Button>
                              {event.event_uuid && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 hover:bg-red-50"
                                  onClick={(e) => handleDeleteEvent(event.event_uuid!, e)}
                                  title="Delete event"
                                >
                                  <Trash2 className="h-3 w-3 text-red-600" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <EventDetailsDialog
        open={eventDialogOpen}
        onOpenChange={setEventDialogOpen}
        events={events}
        selectedDate={selectedEventDate}
        isOwner={isOwner}
        onEditEvent={onEditEvent}
        onDeleteEvent={onDeleteEvent}
        communityId={communityId}
      />
    </>
  );
}
