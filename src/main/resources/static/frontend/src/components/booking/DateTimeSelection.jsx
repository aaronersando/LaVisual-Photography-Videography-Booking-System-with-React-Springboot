import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import CalendarComp from './CalendarComp'

const formatTime = (hour) => {
  const hourNum = parseInt(hour);
  const ampm = hourNum >= 12 ? 'PM' : 'AM';
  const hour12 = hourNum % 12 || 12;
  return `${hour12}:00 ${ampm}`;
};

function DateTimeSelection({ onNext, onBack, updateData, data }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);
  const [bookedTimeSlots, setBookedTimeSlots] = useState([
    // Example booked slots - replace with actual data from backend
    { date: '2025-04-18', startTime: '09:00', endTime: '13:00' },
    { date: '2025-04-19', startTime: '14:00', endTime: '18:00' },
  ]);

  // Get package duration from the selected package
  const packageDuration = data.packageDetails?.hours || 4; // default to 4 hours if not specified

  // Enhanced check for overlapping time ranges
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

  // Generate time ranges and check for overlaps
  const getTimeRangesWithAvailability = () => {
    const ranges = generateTimeRanges();
    return ranges.map(range => ({
      ...range,
      isOverlapping: isTimeRangeOverlapping(selectedDate, range.startTime, range.endTime)
    }));
  };

  // Generate available time slots based on duration
  const generateTimeRanges = () => {
    const ranges = [];
    const startHour = 7; // 7 AM
    const endHour = 22 - packageDuration; // Last slot should end by 10 PM

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

  // Check if a time range is booked
  const isTimeRangeBooked = (date, startTime, endTime) => {
    if (!date) return false;
    
    const dateStr = date.toISOString().split('T')[0];
    return bookedTimeSlots.some(slot => {
      if (slot.date !== dateStr) return false;
      
      const slotStart = parseInt(slot.startTime.split(':')[0]);
      const slotEnd = parseInt(slot.endTime.split(':')[0]);
      const rangeStart = parseInt(startTime.split(':')[0]);
      const rangeEnd = parseInt(endTime.split(':')[0]);
      
      return (rangeStart < slotEnd && rangeEnd > slotStart);
    });
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
    if (selectedDate && selectedTimeRange) { // Changed from selectedTime to selectedTimeRange
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
      
      {/* Calendar */}
      <div className="mb-3">
        <CalendarComp
          onDateSelect={setSelectedDate}
          selectedDate={selectedDate}
        />
      </div>


      {/* Time Range Selection */}
      <div className="mb-6">
        <h3 className="text-white text-center text-lg font-bold mb-3">
          Select Time Range ({packageDuration} hours)
        </h3>
        <div className="grid grid-cols-2 gap-3">
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
                    Unavailable
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-4 py-2 text-white border-[#4B5563] border-2 hover:bg-gray-700 rounded "
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