"use client";
import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, } from "react-day-picker"
import "react-day-picker/dist/style.css";
import { cn } from "../../lib/utils"
import { buttonVariants } from "./button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {

  return (
    (<DayPicker
        {...props}
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          month_caption: "flex justify-center pt-3.5 relative items-center",
          caption_label: "text-sm  flex items-center",
         nav: "flex items-center justify-between",
          nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7  p-0 opacity-50 hover:opacity-100 "
        ),
          button_previous: "absolute left-1 top-[10px] z-50",
          button_next: "absolute right-1 top-[10px] z-50",
          month_grid: "w-full border-collapse space-y-1",
          weekdays: "flex",
          weekday: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          week: "flex w-full mt-1",
          day: "h-9 w-9 text-center text-sm p-0 relative  [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected].range_start)]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day_button: cn(
          buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-none"),
          range_end: "range_end",
          range_start: "range_start",
          selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          today: "bg-accent text-accent-foreground",
          outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          disabled: "text-muted-foreground opacity-50",
          range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          chevron: "text-muted-foreground",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft  className="h-4 w-4 text-muted-foreground"  {...props}/> ,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4 text-muted-foreground"  {...props}/>,
      }}
      />)
  );{}
}
Calendar.displayName = "Calendar"

export { Calendar }
