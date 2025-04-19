import { useState } from 'react';

// Calendar Component for the Calendar Section 
function Calendar({ onDateClick, onScheduleClick }) {
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events] = useState(
    [
    { date: '2025-04-12', name: 'John Lei', status: 'booking' }
    ]
  );

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'booking':
        return 'bg-purple-600';
      case 'available':
        return 'bg-green-600';
      case 'unavailable':
        return 'bg-red-600';
      default:
        return '';
    }
  };

  const formatDate = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return date.toISOString().split('T')[0];
  };

  const getEventForDate = (day) => {
    const dateStr = formatDate(day);
    return events.find(event => event.date === dateStr);
  };

  const handleDateClick = (day) => {
    if (day > 0 && day <= daysInMonth) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      onDateClick?.(date);
    }
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalDays = firstDayOfMonth + daysInMonth;
    const weeks = Math.ceil(totalDays / 7);

    for (let i = 0; i < weeks * 7; i++) {
      const dayNumber = i - firstDayOfMonth + 1;
      const event = dayNumber > 0 && dayNumber <= daysInMonth ? getEventForDate(dayNumber) : null;

      days.push(
        <div 
          key={i} 
          onClick={() => handleDateClick(dayNumber)}
          className={`border border-gray-700 p-2 min-h-[100px] ${
            dayNumber <= 0 || dayNumber > daysInMonth 
              ? 'bg-gray-900' 
              : 'bg-gray-800 hover:bg-gray-700 cursor-pointer'
          }`}
        >
          {dayNumber > 0 && dayNumber <= daysInMonth && (
            <>
              <div className="text-sm text-gray-400">{dayNumber}</div>
              {event && (
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    onScheduleClick?.(event);
                  }}
                  className={`mt-1 p-1 rounded text-sm text-white ${getStatusColor(event.status)} hover:opacity-80`}
                >
                  {event.name}
                </div>
              )}
            </>
          )}
        </div>
      );
    }

    return days;
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="bg-gray-900 rounded-lg ">
      <div className="mb-4 pt-6">
        {/* Calendar Header */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl text-white">Schedule Dashboard</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handlePrevMonth}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
            >
              Back
            </button>
            <span className="text-white">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button 
              onClick={handleNextMonth}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
            >
              Next
            </button>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-purple-600"></div>
            <span className="text-sm text-gray-300">Booking</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-600"></div>
            <span className="text-sm text-gray-300">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-600"></div>
            <span className="text-sm text-gray-300">Unavailable</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Weekday Headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-gray-400 pb-2">
              {day}
            </div>
          ))}
          
          {/* Calendar Days */}
          {renderCalendarDays()}
        </div>
      </div>
    </div>
  );
}

export default Calendar;