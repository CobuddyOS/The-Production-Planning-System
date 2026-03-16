"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type DatePickerProps = {
  value?: Date
  onChange: (date?: Date) => void
  placeholder?: string
  className?: string
}

function formatDate(value?: Date) {
  if (!value) return ""
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(value)
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-10 w-full justify-start gap-2 rounded-xl bg-transparent px-3 font-medium text-white/80",
            !value && "text-white/50",
            className
          )}
        >
          <CalendarIcon className="h-4 w-4 text-white/60" />
          {value ? formatDate(value) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
