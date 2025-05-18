/**
 * Calendar Component
 * 
 * This file defines a customized calendar component that wraps the DayPicker library
 * from react-day-picker. It provides a consistent, styled date picker that integrates 
 * with the application's design system.
 * 
 * The component handles multiple selection modes:
 * - Single date selection
 * - Date range selection
 * 
 * It also provides styling for various date states:
 * - Selected dates
 * - Today's date
 * - Date range start/end
 * - Disabled dates
 * - Outside days (days from previous/next months)
 * 
 * This component is used throughout the application wherever date selection is needed,
 * like in booking forms, event scheduling, and date filtering interfaces.
 */

import * as React from "react" // Import React
import { ChevronLeft, ChevronRight } from "lucide-react" // Import navigation arrow icons
import { DayPicker } from "react-day-picker" // Import the base calendar component

import { cn } from "@/lib/utils" // Import utility for combining class names
import { buttonVariants } from "@/components/ui/button" // Import button styling

function Calendar({
  className, // Additional classes to apply to the calendar
  classNames, // Custom class names for specific calendar elements
  showOutsideDays = true, // Whether to show days from previous/next months
  ...props // All other props passed to DayPicker
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays} // Configure visibility of outside days
      className={cn("p-3", className)} // Combine default padding with custom classes
      classNames={{
        months: "flex flex-col sm:flex-row gap-2", // Month container styling
        month: "flex flex-col gap-4", // Individual month styling
        caption: "flex justify-center pt-1 relative items-center w-full", // Month caption styling
        caption_label: "text-sm font-medium", // Month name styling
        nav: "flex items-center gap-1", // Navigation container styling
        nav_button: cn( // Navigation button styling
          buttonVariants({ variant: "outline" }), // Use the outline button variant
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100" // Size and hover effect
        ),
        nav_button_previous: "absolute left-1", // Position previous month button
        nav_button_next: "absolute right-1", // Position next month button
        table: "w-full border-collapse space-x-1", // Calendar table styling
        head_row: "flex", // Header row (days of week) styling
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]", // Weekday header styling
        row: "flex w-full mt-2", // Row of days styling
        cell: cn( // Calendar cell styling with conditional logic
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range" // Apply different styles based on selection mode
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn( // Day button styling
          buttonVariants({ variant: "ghost" }), // Use ghost button variant
          "size-8 p-0 font-normal aria-selected:opacity-100" // Size and selected state
        ),
        day_range_start: // Style for the first day in a range
          "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_range_end: // Style for the last day in a range
          "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_selected: // Style for selected day
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground", // Style for today's date
        day_outside: // Style for days outside current month
          "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50", // Style for disabled days
        day_range_middle: // Style for days between range start and end
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible", // Style for hidden days
        ...classNames, // Merge with any custom classNames passed as props
      }}
      components={{ // Custom components for calendar parts
        IconLeft: ({ className, ...props }) => ( // Custom left arrow icon
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => ( // Custom right arrow icon
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
      }}
      {...props} /> // Pass all remaining props to DayPicker
  );
}

export { Calendar } // Export the Calendar component