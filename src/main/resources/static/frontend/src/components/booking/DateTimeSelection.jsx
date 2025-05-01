import { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import CalendarComp from './CalendarComp';

const formatTime = (hour) => {
  const hourNum = parseInt(hour);
  const ampm = hourNum >= 12 ? 'PM' : 'AM';
  const hour12 = hourNum % 12 || 12;
  return `${hour12}:00 ${ampm}`;
};

function DateTimeSelection({ onNext, onBack, updateData, data }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);
  const [bookedTimeSlots, setBookedTimeSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get package duration from the selected package
  const packageDuration = data.packageDetails?.hours || 4; // default to 4 hours if not specified

  // Fetch booked time slots from the backend when component mounts
  useEffect(() => {
    fetchAllBookedTimeSlots();
  }, []);
  
  // Fetch all booked slots initially
  const fetchAllBookedTimeSlots = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use the full URL with http://localhost:8080 prefix
      const response = await axios.get('http://localhost:8080/api/bookings/booked-slots');
      console.log("API Response:", response.data);
      
      // Check if the response is HTML instead of JSON
      if (typeof response.data === 'string' && response.data.includes('<!doctype html>')) {
        console.error("Received HTML instead of JSON");
        setError('Failed to connect to booking API. Please try again later.');
        // Fallback to dummy data for development
        setBookedTimeSlots([
          { date: '2025-04-18', startTime: '09:00', endTime: '13:00' },
          { date: '2025-04-19', startTime: '14:00', endTime: '18:00' },
        ]);
        return;
      }
      
      if (response.data && response.data.success) {
        // Format the data to match our expected structure
        const formattedSlots = response.data.data.bookings.map(booking => ({
          date: booking.bookingDate, 
          startTime: booking.bookingTimeStart,
          endTime: booking.bookingTimeEnd,
          bookingId: booking.bookingId
        }));
        
        setBookedTimeSlots(formattedSlots);
      } else {
        const errorMsg = response.data?.message || 'Unknown error occurred';
        console.error("API returned error:", errorMsg);
        setError('Failed to load booking data: ' + errorMsg);
      }
    } catch (err) {
      console.error('Error fetching booked slots:', err);
      setError('Error loading booking data. Please try again.');
      // For development - use dummy data instead of failing completely
      setBookedTimeSlots([
        { date: '2025-04-18', startTime: '09:00', endTime: '13:00' },
        { date: '2025-04-19', startTime: '14:00', endTime: '18:00' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced check for overlapping time ranges based on the selected date
  const isTimeRangeOverlapping = (date, startTime, endTime) => {
    if (!date) return false;
    
    const dateStr = date.toISOString().split('T')[0];
    const rangeStart = parseInt(startTime.split(':')[0]);
    const rangeEnd = parseInt(endTime.split(':')[0]);

    return bookedTimeSlots.some(slot => {
      if (slot.date !== dateStr) return false;
      
      const slotStart = parseInt(slot.startTime.split(':')[0]);
      const slotEnd = parseInt(slot.endTime.split(':')[0]);
      
      // Check for any overlap between the ranges
      return (
        (rangeStart >= slotStart && rangeStart < slotEnd) || // Start time is within a booked slot
        (rangeEnd > slotStart && rangeEnd <= slotEnd) || // End time is within a booked slot
        (rangeStart <= slotStart && rangeEnd >= slotEnd) // Range completely encompasses a booked slot
      );
    });
  };

  // When user selects a date, update the selected date and clear the time range
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTimeRange(null); // Clear selected time range when date changes
  };

  // Generate time ranges and check for overlaps
  const getTimeRangesWithAvailability = () => {
    if (!selectedDate) return [];
    
    const ranges = generateTimeRanges();
    return ranges.map(range => ({
      ...range,
      isOverlapping: isTimeRangeOverlapping(selectedDate, range.startTime, range.endTime)
    }));
  };

  // Generate available time slots based on duration
  const generateTimeRanges = () => {
    const ranges = [];
    const startHour = 0; // 12 AM (midnight)
    const endHour = 23 - packageDuration; // Last slot should end by 11 PM

    for (let hour = startHour; hour <= endHour; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + packageDuration).toString().padStart(2, '0')}:00`;
      const formattedStartTime = formatTime(hour);
      const formattedEndTime = formatTime(hour + packageDuration);
      
      ranges.push({ 
        startTime, 
        endTime,
        formattedStartTime,
        formattedEndTime
      });
    }
    return ranges;
  };

  const handleTimeSelect = (range) => {
    if (!selectedDate) {
      alert('Please select a date first');
      return;
    }
    setSelectedTimeRange(range);
    updateData({ 
      date: selectedDate,
      timeRange: range
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedDate && selectedTimeRange) {
      updateData({ 
        date: selectedDate,
        timeRange: selectedTimeRange 
      });
      onNext();
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl text-white mb-6">Select Date & Time</h2>
      
      {isLoading && (
        <div className="text-center text-purple-400 mb-4">
          <p>Loading availability data...</p>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-100 rounded">
          <p>{error}</p>
        </div>
      )}
      
      {/* Calendar */}
      <div className="mb-3">
        <CalendarComp
          onDateSelect={handleDateSelect}
          selectedDate={selectedDate}
          bookedDates={[]} // You can pass actually fully booked dates here if you want
        />
      </div>

      {/* Display a message if no date is selected */}
      {!selectedDate && (
        <div className="text-center text-gray-400 mb-4">
          <p>Please select a date to view available time slots</p>
        </div>
      )}

      {/* Time Range Selection */}
      {selectedDate && (
        <div className="mb-6">
          <h3 className="text-white text-center text-lg font-bold mb-3">
            Select Time Range ({packageDuration} hours)
          </h3>
          <div className="grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-2">
            {getTimeRangesWithAvailability().map((range) => {
              const isSelected = selectedTimeRange?.startTime === range.startTime;
              
              return (
                <button
                  key={`${range.startTime}-${range.endTime}`}
                  onClick={() => !range.isOverlapping && handleTimeSelect(range)}
                  disabled={range.isOverlapping}
                  className={`
                    p-3 rounded-lg border transition-all
                    ${range.isOverlapping 
                      ? 'bg-red-900/20 border-red-900/50 text-red-300/50 cursor-not-allowed'
                      : isSelected
                        ? 'bg-purple-500 border-purple-500 text-white'
                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-purple-500'
                    }
                  `}
                >
                  <div className="text-sm">
                    {range.formattedStartTime} - {range.formattedEndTime}
                  </div>
                  {range.isOverlapping && (
                    <div className="text-xs text-red-300/50 mt-1">
                      Already Booked
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-4 py-2 text-white border-[#4B5563] border-2 hover:bg-gray-700 rounded"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!selectedDate || !selectedTimeRange}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default DateTimeSelection;