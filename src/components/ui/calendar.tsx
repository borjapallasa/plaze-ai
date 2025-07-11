
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
      className={cn("p-3 w-full max-w-sm mx-auto", className)}
      classNames={{
        months: "flex flex-col space-y-4 w-full",
        month: "space-y-4 w-full",
        caption: "flex justify-between items-center py-2 px-1",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 hover:opacity-75 flex items-center justify-center"
        ),
        table: "w-full border-collapse",
        head_row: "flex w-full",
        head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] flex-1 text-center",
        row: "flex w-full mt-2",
        cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 flex-1",
        day: cn(
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100 mx-auto flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
        ),
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
        Caption: ({ displayMonth }) => (
          <div className="flex justify-between items-center py-2 px-1 w-full">
            <span className="text-sm font-medium">
              {format(displayMonth, 'MMMM yyyy')}
            </span>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => {
                  const prevMonth = new Date(month);
                  prevMonth.setMonth(prevMonth.getMonth() - 1);
                  setMonth(prevMonth);
                }}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-7 w-7 p-0 flex items-center justify-center"
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
                  "h-7 w-7 p-0 flex items-center justify-center"
                )}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  setMonth(today);
                  onSelect?.(today);
                }}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-7 px-2 text-xs"
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
