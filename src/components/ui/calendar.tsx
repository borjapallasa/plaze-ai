
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, SelectedDate } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  selected,
  onSelect,
  ...props
}: CalendarProps) {
  const handleTodayClick = () => {
    if (onSelect) {
      onSelect(new Date(), { selected: new Date() });
    }
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 w-full", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
        month: "space-y-4 w-full",
        caption: "flex justify-between pt-1 pb-4 items-center px-2",
        caption_label: "text-base font-semibold",
        nav: "space-x-1 flex items-center gap-4",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 hover:opacity-75"
        ),
        nav_button_previous: "",
        nav_button_next: "",
        table: "w-full border-collapse",
        head_row: "flex w-full border-b border-border",
        head_cell:
          "text-muted-foreground w-[14.28%] font-normal text-[0.8rem] pb-3",
        row: "flex w-full",
        cell: cn(
          "relative w-[14.28%] h-[120px] p-0 text-center border-b border-r border-border first:border-l focus-within:relative focus-within:z-20",
          "[&:nth-child(7n)]:border-r-0"
        ),
        day: cn(
          "absolute top-2 left-2 text-sm",
          "hover:bg-transparent"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-full",
        day_today: cn(
          "bg-accent rounded-full font-semibold",
          "before:absolute before:w-7 before:h-7 before:bg-accent before:rounded-full before:-z-10 before:-translate-x-1/2 before:-translate-y-1/2"
        ),
        day_outside:
          "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
      }}
      selected={selected}
      onSelect={onSelect}
      footer={
        <div className="mt-4 space-x-2">
          <button
            onClick={handleTodayClick}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "text-xs px-3"
            )}
          >
            Today
          </button>
        </div>
      }
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
