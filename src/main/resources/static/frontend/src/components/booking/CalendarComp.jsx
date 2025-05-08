import { useState } from 'react';
import { Calendar } from '../ui/calendar';
import { isBefore, isSameDay, addDays} from 'date-fns';

export default function CalendarDemo({ selectedDate, onDateSelect}) {
  // Disable past and booked dates
  const isDateDisabled = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison
    const isPast = isBefore(day, today);
    const isTodayOrNextThreeDays = isBefore(day, addDays(today, 4)); // Disable today and next 3 days
    return isPast || isTodayOrNextThreeDays;
  };

  return (
    <div className="w-full xs:w-11/12 sm:w-5/6 md:w-3/4 lg:w-2/3 mx-auto pt-2 sm:pt-3 pb-6 sm:pb-8 bg-gray-900 rounded-xl sm:rounded-2xl shadow-xl border border-gray-700">
      <h2 className="text-white text-base sm:text-lg font-bold mb-1 sm:mb-2 text-center">Select Date</h2>
      <div className="flex justify-center items-center px-2 sm:px-4">
        <div className="calendar-wrapper w-full flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            className="rounded-lg border border-gray-700 bg-gray-800 p-3 sm:p-4 max-w-fit mx-auto"
            disabled={isDateDisabled}
            modifiersClassNames={{
              booked: "bg-red-500 text-white hover:bg-red-600 cursor-not-allowed",
              selected: "bg-purple-600 text-white hover:bg-purple-700",
              disabled: "text-gray-500",
            }}
          />
        </div>
      </div>
    </div>
  );
}