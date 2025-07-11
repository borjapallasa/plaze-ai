
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Event {
  title: string;
  date: Date;
  type: string;
  description: string;
}

interface CommunityCalendarProps {
  events?: Event[];
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
}

export function CommunityCalendar({ events = [], selectedDate, onDateSelect }: CommunityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

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
    return events.some(event => isSameDay(event.date, date));
  };

  const getDayClasses = (date: Date) => {
    const baseClasses = "h-20 w-full flex items-center justify-center text-sm cursor-pointer rounded-md transition-colors";
    const isSelected = selectedDate && isSameDay(date, selectedDate);
    const isToday = isSameDay(date, new Date());
    const eventExists = hasEvent(date);
    
    if (isSelected) {
      return cn(baseClasses, "bg-primary text-primary-foreground");
    }
    
    if (isToday) {
      return cn(baseClasses, "bg-accent text-accent-foreground font-medium");
    }
    
    if (eventExists) {
      return cn(baseClasses, "bg-blue-100 text-blue-800 font-medium hover:bg-blue-200");
    }
    
    return cn(baseClasses, "hover:bg-accent hover:text-accent-foreground");
  };

  return (
    <div className="w-full max-w-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
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
        {days.map((date) => (
          <div
            key={date.toISOString()}
            className={getDayClasses(date)}
            onClick={() => onDateSelect?.(date)}
          >
            {format(date, 'd')}
          </div>
        ))}
      </div>
    </div>
  );
}
