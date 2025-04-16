"use client"

import React, { useEffect, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { isBefore, isSameDay } from "date-fns"

export default function CalendarDemo() {
  const [date, setDate] = useState(new Date())
  const [bookedDates, setBookedDates] = useState([
    // new Date(2025, 3, 18), // April 18, 2025
    // new Date(2025, 3, 20),
  ])

  // Disable past and booked dates
  const isDateDisabled = (day) => {
    const today = new Date()
    const isPast = isBefore(day, today)
    const isBooked = bookedDates.some((booked) => isSameDay(booked, day))
    return isPast || isBooked
  }

  return (

      <div className="w-2/3 justify-self-center-safe max-w-3xl pt-3 pb-8 bg-gray-900 rounded-2xl shadow-xl border border-gray-700">
        <h2 className="text-white text-lg font-bold mb-2 text-center">Select Date</h2>
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-lg border border-gray-700 bg-gray-800 p-4"
            disabled={isDateDisabled}
            modifiers={{
              booked: bookedDates,
            }}
            modifiersClassNames={{
              booked: "bg-red-500 text-white hover:bg-red-600 cursor-not-allowed",
              selected: "bg-purple-600 text-white hover:bg-purple-700",
              disabled: "text-gray-500",
            }}
          />
        </div>
      </div>


  )
}
