/**
 * Date and Time Selection Component
 * 
 * This component handles the date and time selection step in the booking process.
 * It allows users to select an available date from a calendar and then choose from
 * available time slots for their appointment. The component:
 * 
 * - Fetches existing booking data from the backend API to determine which slots are already booked
 * - Prevents double-booking by disabling time slots that overlap with existing bookings
 * - Shows a calendar interface for date selection
 * - Dynamically generates time slots based on the selected package duration
 * - Handles validation and error states
 * - Provides responsive design for various screen sizes
 * 
 * The component is part of a multi-step booking flow and receives navigation and data
 * management functions from its parent component.
 */

import { useState, useEffect } from 'react'; // Import React hooks for state management and side effects
import axios from 'axios'; // Import axios for making HTTP requests
import 'react-calendar/dist/Calendar.css'; // Import base calendar styling
import CalendarComp from './CalendarComp'; // Import custom calendar component

// Helper function to format time from 24-hour format to 12-hour AM/PM format
const formatTime = (hour) => {
  const hourNum = parseInt(hour);
  const ampm = hourNum >= 12 ? 'PM' : 'AM'; // Determine if AM or PM
  const hour12 = hourNum % 12 || 12; // Convert 24-hour to 12-hour format (0 becomes 12)
  return `${hour12}:00 ${ampm}`;
};

// Helper function to convert a Date object to YYYY-MM-DD string format
// This is important for consistent date comparisons and API communication
const formatDateToLocalString = (date) => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, adding 1
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`; // Format as YYYY-MM-DD
};

function DateTimeSelection({ onNext, onBack, updateData, data }) {
  // State variables for component
  const [selectedDate, setSelectedDate] = useState(null); // Currently selected date
  const [selectedTimeRange, setSelectedTimeRange] = useState(null); // Currently selected time slot
  const [bookedTimeSlots, setBookedTimeSlots] = useState([]); // Slots that are already booked
  const [isLoading, setIsLoading] = useState(false); // Loading state for API calls
  const [error, setError] = useState(null); // Error state for API failures

  // Extract package duration from the data passed from parent component
  const packageDuration = data.packageDetails?.hours || 4; // Default to 4 hours if not specified

  // Fetch booked time slots when component mounts
  useEffect(() => {
    fetchConfirmedBookedTimeSlots();
  }, []);
  
  // Function to fetch existing bookings from the API
  const fetchConfirmedBookedTimeSlots = async () => {
    setIsLoading(true); // Show loading indicator
    setError(null); // Clear any previous errors
    
    try {
      // Make API request to get booked slots with CONFIRMED status
      const response = await axios.get('http://localhost:8080/api/bookings/booked-slots?status=CONFIRMED');
      console.log("API Response:", response.data);
      
      // Handle case where response is HTML (typically an error page) instead of JSON
      if (typeof response.data === 'string' && response.data.includes('<!doctype html>')) {
        console.error("Received HTML instead of JSON");
        setError('Failed to connect to booking API. Please try again later.');
        // Use fallback dummy data so the component still works during development
        setBookedTimeSlots([
          { date: '2025-04-18', startTime: '09:00', endTime: '13:00' },
          { date: '2025-04-19', startTime: '14:00', endTime: '18:00' },
        ]);
        return;
      }
      
      // Process successful API response
      if (response.data && response.data.success) {
        // Filter and map API data to the format needed by this component
        const formattedSlots = response.data.data.bookings
          .filter(booking => 
            booking.bookingStatus === "CONFIRMED" || booking.bookingStatus === "APPROVED"
          )
          .map(booking => ({
            date: booking.bookingDate, 
            startTime: booking.bookingTimeStart,
            endTime: booking.bookingTimeEnd,
            bookingId: booking.bookingId
          }));
        
        setBookedTimeSlots(formattedSlots); // Save formatted booking data
      } else {
        // Handle API error response
        const errorMsg = response.data?.message || 'Unknown error occurred';
        console.error("API returned error:", errorMsg);
        setError('Failed to load booking data: ' + errorMsg);
      }
    } catch (err) {
      // Handle exception during API call
      console.error('Error fetching booked slots:', err);
      setError('Error loading booking data. Please try again.');
      // Use fallback dummy data for development
      setBookedTimeSlots([
        { date: '2025-04-18', startTime: '09:00', endTime: '13:00' },
        { date: '2025-04-19', startTime: '14:00', endTime: '18:00' },
      ]);
    } finally {
      setIsLoading(false); // Hide loading indicator when done
    }
  };

  // Function to check if a time range overlaps with any existing bookings
  const isTimeRangeOverlapping = (date, startTime, endTime) => {
    if (!date) return false; // No date selected, so no overlap
    
    // Format the date for comparison with booked slots
    const dateStr = formatDateToLocalString(date);
    // Convert time strings to integers for easier comparison
    const rangeStart = parseInt(startTime.split(':')[0]);
    const rangeEnd = parseInt(endTime.split(':')[0]);

    // Check all booked slots for potential overlaps
    return bookedTimeSlots.some(slot => {
      if (slot.date !== dateStr) return false; // Different date, no overlap
      
      // Get start and end hours for the booked slot
      const slotStart = parseInt(slot.startTime.split(':')[0]);
      const slotEnd = parseInt(slot.endTime.split(':')[0]);
      
      // Three overlap conditions checked:
      return (
        (rangeStart >= slotStart && rangeStart < slotEnd) || // Start time is within a booked slot
        (rangeEnd > slotStart && rangeEnd <= slotEnd) || // End time is within a booked slot
        (rangeStart <= slotStart && rangeEnd >= slotEnd) // Range completely encompasses a booked slot
      );
    });
  };

  // Handler for date selection from calendar
  const handleDateSelect = (date) => {
    setSelectedDate(date); // Update selected date
    setSelectedTimeRange(null); // Reset time selection when date changes
  };

  // Function to get all possible time ranges with availability status
  const getTimeRangesWithAvailability = () => {
    if (!selectedDate) return []; // No date selected, return empty array
    
    // Generate all possible time ranges for the day
    const ranges = generateTimeRanges();
    
    // Add availability flag to each range
    return ranges.map(range => ({
      ...range,
      isOverlapping: isTimeRangeOverlapping(selectedDate, range.startTime, range.endTime)
    }));
  };

  // Function to generate all possible time slots based on package duration
  const generateTimeRanges = () => {
    const ranges = [];
    const startHour = 0; // 12 AM (midnight)
    const endHour = 23 - packageDuration; // Last slot should end by 11 PM

    // Generate time slots for the entire day with selected package duration
    for (let hour = startHour; hour <= endHour; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`; // Format: "HH:00"
      const endTime = `${(hour + packageDuration).toString().padStart(2, '0')}:00`;
      const formattedStartTime = formatTime(hour); // 12-hour format with AM/PM
      const formattedEndTime = formatTime(hour + packageDuration);
      
      // Add time range to array
      ranges.push({ 
        startTime, 
        endTime,
        formattedStartTime,
        formattedEndTime
      });
    }
    return ranges;
  };

  // Handler for time slot selection
  const handleTimeSelect = (range) => {
    if (!selectedDate) {
      alert('Please select a date first');
      return;
    }
    setSelectedTimeRange(range); // Update selected time range
    updateData({ // Pass data to parent component
      date: selectedDate,
      timeRange: range
    });
  };

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedDate && selectedTimeRange) {
      // Create a copy of the date that won't be affected by timezone issues
      const formattedDate = new Date(selectedDate);
      // Set time to noon to prevent date shifts in further processing
      formattedDate.setHours(12, 0, 0, 0);
      
      // Update parent component with final date and time selection
      updateData({ 
        date: formattedDate,
        timeRange: selectedTimeRange 
      });
      onNext(); // Navigate to next step in booking flow
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 sm:p-5 md:p-6">
      <h2 className="text-lg sm:text-xl md:text-2xl text-white mb-4 sm:mb-6">Select Date & Time</h2>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="text-center text-purple-400 mb-3 sm:mb-4">
          <p>Loading availability data...</p>
        </div>
      )}
      
      {/* Error message display */}
      {error && (
        <div className="mb-3 sm:mb-4 p-3 bg-red-500/20 border border-red-500 text-red-100 rounded">
          <p className="text-sm sm:text-base">{error}</p>
        </div>
      )}
      
      {/* Calendar for date selection */}
      <div className="mb-3 sm:mb-4 md:mb-5 mx-auto max-w-xs sm:max-w-sm md:max-w-md">
        <CalendarComp
          onDateSelect={handleDateSelect}
          selectedDate={selectedDate}
          bookedDates={[]} // You can pass actually fully booked dates here if you want
        />
      </div>

      {/* Display a message if no date is selected */}
      {!selectedDate && (
        <div className="text-center text-gray-400 mb-3 sm:mb-4">
          <p className="text-sm sm:text-base">Please select a date to view available time slots</p>
        </div>
      )}

      {/* Time Range Selection - only shown when a date is selected */}
      {selectedDate && (
        <div className="mb-4 sm:mb-5 md:mb-6">
          <h3 className="text-white text-center text-base sm:text-lg font-bold mb-2 sm:mb-3">
            Select Time Range ({packageDuration} hours)
          </h3>
          {/* Grid of time slots with scrolling for overflow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 max-h-[40vh] sm:max-h-[50vh] overflow-y-auto pr-1 sm:pr-2">
            {getTimeRangesWithAvailability().map((range) => {
              const isSelected = selectedTimeRange?.startTime === range.startTime;
              
              return (
                <button
                  key={`${range.startTime}-${range.endTime}`}
                  onClick={() => !range.isOverlapping && handleTimeSelect(range)}
                  disabled={range.isOverlapping}
                  className={`
                    p-2 sm:p-3 rounded-lg border transition-all
                    ${range.isOverlapping 
                      ? 'bg-red-900/20 border-red-900/50 text-red-300/50 cursor-not-allowed' // Style for unavailable slots
                      : isSelected
                        ? 'bg-purple-500 border-purple-500 text-white' // Style for selected slot
                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-purple-500' // Style for available slots
                    }
                  `}
                >
                  <div className="text-xs sm:text-sm">
                    {range.formattedStartTime} - {range.formattedEndTime}
                  </div>
                  {/* Show "Already Booked" label for unavailable slots */}
                  {range.isOverlapping && (
                    <div className="text-xs mt-1">
                      Already Booked
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-4 sm:mt-6">
        <button
          onClick={onBack} // Go back to previous step
          className="px-3 py-1.5 sm:px-4 sm:py-2 text-white border-[#4B5563] border-2 hover:bg-gray-700 rounded text-sm sm:text-base"
        >
          Back
        </button>
        <button
          onClick={handleSubmit} // Proceed to next step
          disabled={!selectedDate || !selectedTimeRange} // Disable if date or time not selected
          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 text-sm sm:text-base"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default DateTimeSelection; // Export component for use in the booking flow