
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
      className={cn("p-3 w-full rounded-lg overflow-hidden", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
        month: "space-y-4 w-full",
        caption: "flex flex-col sm:flex-row justify-between pt-1 pb-4 items-center px-2 relative gap-2",
        caption_label: "text-xl font-semibold order-1 sm:order-none",
        nav: "space-x-1 flex items-center gap-2 order-2 sm:order-none",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 hover:opacity-75 flex items-center justify-center border border-input"
        ),
        nav_button_previous: "mr-1",
        nav_button_next: "ml-1",
        table: "w-full border-collapse",
        head_row: cn(
          "flex w-full [&>*]:flex-1",
          "border-b border-border"
        ),
        head_cell: cn(
          "text-muted-foreground font-normal text-[0.8rem] py-4",
          "text-center",
          "lg:w-[14.28%] lg:pb-3"
        ),
        row: "flex w-full [&>*]:flex-1",
        cell: cn(
          "relative p-0 text-center min-h-[40px] border-b border-border",
          "[&:not(:first-child)]:border-l",
          "lg:h-[120px] lg:w-[14.28%] lg:p-0 lg:text-center lg:border-b lg:border-r lg:border-border lg:first:border-l",
          "focus-within:relative focus-within:z-20"
        ),
        day: cn(
          "h-full w-full p-2 font-normal aria-selected:opacity-100",
          "lg:absolute lg:top-2 lg:left-2 lg:text-sm lg:p-0 lg:h-9 lg:w-9",
          "hover:bg-transparent"
        ),
        day_selected:
          "bg-[#FDE1D3] text-[#1A1F2C] hover:bg-[#FDE1D3] hover:text-[#1A1F2C] focus:bg-[#FDE1D3] focus:text-[#1A1F2C]",
        day_today: cn(
          "text-[#1A1F2C] font-semibold",
          "before:absolute before:w-7 before:h-7 before:bg-[#FDE1D3] before:rounded-full before:-z-10 before:-translate-x-1/2 before:-translate-y-1/2"
        ),
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
          <div className="flex flex-col sm:flex-row w-full justify-between items-center gap-4 sm:gap-2">
            <span className="text-xl font-semibold order-1 sm:order-none">
              {format(displayMonth, 'MMMM yyyy')}
            </span>
            <div className="flex items-center gap-2 order-2 sm:order-none">
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
