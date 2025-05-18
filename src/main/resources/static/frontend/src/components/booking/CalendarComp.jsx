/**
 * Booking Calendar Component
 * 
 * This component provides a customized calendar interface for the booking system,
 * allowing users to select available dates for their appointments/sessions. It handles
 * date selection logic, prevents booking on unavailable dates, and provides
 * visual feedback through different date states.
 * 
 * Key features:
 * - Prevents selection of past dates
 * - Disables dates that are too soon (next 3 days)
 * - Custom styling for different date states (selected, booked, disabled)
 * - Responsive design that adapts to different screen sizes
 * - Sends the selected date back to parent components for further processing
 * 
 * This component is used in the booking flow to allow customers to choose 
 * their preferred date for photography sessions.
 */

import { useState } from 'react'; // Import useState hook from React (though not used in this component)
import { Calendar } from '../ui/calendar'; // Import the base Calendar component from UI library
import { isBefore, isSameDay, addDays} from 'date-fns'; // Import date utility functions for date comparisons

export default function CalendarDemo({ selectedDate, onDateSelect}) {
  // Function to determine which dates should be disabled in the calendar
  const isDateDisabled = (day) => {
    const today = new Date(); // Create a date object for today
    today.setHours(0, 0, 0, 0); // Reset time part to midnight for accurate date-only comparison
    const isPast = isBefore(day, today); // Check if the date is in the past
    const isTodayOrNextThreeDays = isBefore(day, addDays(today, 4)); // Check if date is today or within next 3 days
    return isPast || isTodayOrNextThreeDays; // Disable if either condition is true
  };

  return (
    <div className="w-full xs:w-11/12 sm:w-5/6 md:w-3/4 lg:w-2/3 mx-auto pt-2 sm:pt-3 pb-6 sm:pb-8 bg-gray-900 rounded-xl sm:rounded-2xl shadow-xl border border-gray-700">
      {/* Calendar container with responsive widths and dark theme styling */}
      <h2 className="text-white text-base sm:text-lg font-bold mb-1 sm:mb-2 text-center">Select Date</h2>
      <div className="flex justify-center items-center px-2 sm:px-4">
        <div className="calendar-wrapper w-full flex justify-center">
          <Calendar
            mode="single" // Single date selection mode (as opposed to range)
            selected={selectedDate} // Currently selected date passed from parent
            onSelect={onDateSelect} // Function to call when user selects a date
            className="rounded-lg border border-gray-700 bg-gray-800 p-3 sm:p-4 max-w-fit mx-auto" // Styling for calendar container
            disabled={isDateDisabled} // Function that determines which dates should be disabled
            modifiersClassNames={{ // Custom styling for different date states
              booked: "bg-red-500 text-white hover:bg-red-600 cursor-not-allowed", // Style for dates that are already booked
              selected: "bg-purple-600 text-white hover:bg-purple-700", // Style for the currently selected date
              disabled: "text-gray-500", // Style for dates that cannot be selected
            }}
          />
        </div>
      </div>
    </div>
  );
}