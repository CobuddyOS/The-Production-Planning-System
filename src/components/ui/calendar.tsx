"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-2", className)}
      classNames={{
        months: "flex flex-col gap-3",
        month: "space-y-3",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-semibold text-white",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "h-7 w-7 bg-white/5 text-white hover:bg-white/10"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-white/60 rounded-md w-9 font-medium text-[0.7rem]",
        row: "flex w-full mt-1",
        cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-white/5 rounded-md",
        day: cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "h-9 w-9 p-0 font-normal text-white hover:bg-white/10"
        ),
        day_selected:
          "bg-white text-black hover:bg-white/90 focus:bg-white/90",
        day_today: "bg-white/10 text-white",
        day_outside: "text-white/30",
        day_disabled: "text-white/20 opacity-50",
        day_range_middle: "aria-selected:bg-white/10 aria-selected:text-white",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...props }) => {
          const Icon = orientation === "left" ? ChevronLeftIcon : ChevronRightIcon
          return <Icon className="h-4 w-4" {...props} />
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
