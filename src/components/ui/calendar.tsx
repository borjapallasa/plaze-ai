
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, type DayPickerSingleProps } from "react-day-picker";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type CalendarProps = {
  mode?: "single";
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  className?: string;
  classNames?: Record<string, string>;
  showOutsideDays?: boolean;
} & Omit<DayPickerSingleProps, "mode" | "selected" | "onSelect" | "className" | "classNames" | "showOutsideDays">;

function Calendar({
  mode = "single",
  selected,
  onSelect,
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [month, setMonth] = React.useState<Date>(new Date());

  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={onSelect}
      showOutsideDays={showOutsideDays}
      month={month}
      onMonthChange={setMonth}
      className={cn("p-3 w-full", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
        month: "space-y-4 w-full",
        caption: "flex justify-between pt-1 pb-4 items-center px-2 relative",
        caption_label: "text-base font-semibold",
        nav: "space-x-1 flex items-center gap-2",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 hover:opacity-75 flex items-center justify-center border border-input"
        ),
        nav_button_previous: "mr-1",
        nav_button_next: "ml-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex w-full",
        head_cell: cn(
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] h-9",
          "lg:w-[14.28%] lg:h-[40px]"
        ),
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 lg:h-[120px]",
          "first:[&:not(:empty)]:rounded-l-md last:[&:not(:empty)]:rounded-r-md",
          "lg:w-[14.28%] lg:border-b lg:border-r lg:border-border lg:first:border-l",
          "[&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50",
          "[&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-range-start)]:rounded-l-md"
        ),
        day: cn(
          "h-9 w-9 p-0 font-normal lg:h-[inherit] lg:w-[inherit] aria-selected:opacity-100",
          "lg:absolute lg:top-2 lg:left-2 lg:text-sm",
          "hover:bg-transparent"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-[#FDE1D3] text-[#1A1F2C] hover:bg-[#FDE1D3] hover:text-[#1A1F2C] focus:bg-[#FDE1D3] focus:text-[#1A1F2C]",
        day_today: cn(
          "text-[#1A1F2C] font-semibold",
          "before:absolute before:w-7 before:h-7 before:bg-[#FDE1D3] before:rounded-full before:-z-10 before:-translate-x-1/2 before:-translate-y-1/2"
        ),
        day_outside: "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
        Caption: ({ displayMonth }) => (
          <div className="flex w-full justify-between items-center">
            <span className="text-xl font-semibold">
              {format(displayMonth, 'MMMM yyyy')}
            </span>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    const prevMonth = new Date(month);
                    prevMonth.setMonth(prevMonth.getMonth() - 1);
                    setMonth(prevMonth);
                  }}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-10 w-10 p-0 flex items-center justify-center rounded-md"
                  )}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    const nextMonth = new Date(month);
                    nextMonth.setMonth(nextMonth.getMonth() + 1);
                    setMonth(nextMonth);
                  }}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-10 w-10 p-0 flex items-center justify-center rounded-md"
                  )}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  setMonth(today);
                  onSelect?.(today);
                }}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-10 px-4 text-sm rounded-md"
                )}
              >
                Today
              </button>
            </div>
          </div>
        )
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
