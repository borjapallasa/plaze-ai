
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from "date-fns";
import { cn } from "@/lib/utils";

interface CommunityCalendarViewProps {
  events?: any[];
  className?: string;
}

export function CommunityCalendarView({ events = [], className }: CommunityCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the first day of the week for the first day of the month
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  // Get all days to display (including previous/next month days for complete weeks)
  const endDate = new Date(monthEnd);
  endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()));
  
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className={cn("w-full", className)}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center gap-2">
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
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="h-8 px-3"
          >
            Today
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="w-full">
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-0 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="h-10 flex items-center justify-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-0 border border-border rounded-lg overflow-hidden">
          {allDays.map((day, dayIdx) => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isTodayDate = isToday(day);
            
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "min-h-[80px] p-2 border-r border-b border-border last:border-r-0",
                  !isCurrentMonth && "bg-muted/30",
                  isTodayDate && "bg-primary/5",
                  dayIdx >= 35 && "border-b-0" // Remove bottom border for last row
                )}
              >
                <div className={cn(
                  "text-sm font-medium mb-1",
                  !isCurrentMonth && "text-muted-foreground",
                  isTodayDate && "text-primary font-semibold"
                )}>
                  {format(day, 'd')}
                </div>
                {/* Events for this day would go here */}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
