import { useState, useEffect } from "react";
import QuickInfoModal from "./QuickInfoModal"

function Calendar2({onDateClick, bookings}){

    // Date today for basis
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedBookings, setSelectedBookings] = useState(null);

    const [events, setEvents] = useState([]);

    // Format bookings data into the events format needed for calendar
    useEffect(() => {
        if (!bookings || bookings.length === 0) return;
        
        // Group bookings by date
        const groupedBookings = bookings.reduce((acc, booking) => {
            // Extract date in YYYY-MM-DD format
            let dateKey;
            
            // Handle different date formats
            if (booking.date) {
                // If it's already a string in YYYY-MM-DD format
                if (typeof booking.date === 'string' && booking.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
                    dateKey = booking.date;
                } 
                // If it's a Date object or other date format string
                else {
                    const bookingDate = new Date(booking.date);
                    if (!isNaN(bookingDate.getTime())) {
                        dateKey = bookingDate.toISOString().split('T')[0];
                    }
                }
            } 
            // Fallback if booking.bookingDate is used instead (from backend API)
            else if (booking.bookingDate) {
                dateKey = new Date(booking.bookingDate).toISOString().split('T')[0];
            }
            
            if (!dateKey) {
                console.error("Could not extract date from booking:", booking);
                return acc;
            }
            
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            
            // Format booking data for the modal
            acc[dateKey].push({
                client: booking.customerDetails?.name || booking.guestName || 'Client',
                clientEvent: booking.package || booking.packageName || 'Booking',
                timeRange: formatBookingTimeRange(booking)
            });
            
            return acc;
        }, {});
        
        // Convert the grouped object to array format needed by calendar
        const formattedEvents = Object.entries(groupedBookings).map(([date, bookings]) => ({
            date,
            bookings
        }));
        
        setEvents(formattedEvents);
    }, [bookings]);
    
    // Add this helper function for better time format handling
    const formatBookingTimeRange = (booking) => {
        // Handle different time formats
        if (booking.timeRange) {
            return `${formatTime(booking.timeRange.startTime)}-${formatTime(booking.timeRange.endTime)}`;
        } else if (booking.bookingTimeStart && booking.bookingTimeEnd) {
            return `${formatTime(booking.bookingTimeStart)}-${formatTime(booking.bookingTimeEnd)}`;
        }
        return 'Time not specified';
    };

    // Helper function to format time from 24h to 12h format
    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        const [hour] = timeStr.split(':');
        const hourNum = parseInt(hour);
        const ampm = hourNum >= 12 ? 'PM' : 'AM';
        const hour12 = hourNum % 12 || 12;
        return `${hour12}${ampm}`;
    };
    
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
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() -1, 1));
    }

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() +1, 1));
    }

    const formatDate = (day) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return date.toISOString().split('T')[0];
    }

    const getEventsForDate = (day) => {
        const dateStr = formatDate(day);
        return events.find(event => event.date === dateStr)
    }

    const handleDateClick= (day) => {
        if (day > 0 && day <= daysInMonth){
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            onDateClick?.(date);
        }
    }

    const renderCalendarDays = () => {
        // Define the getEventForDate function inside renderCalendarDays
        const getEventForDate = (year, month, day) => {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            return events.find(event => event.date === dateStr);
        };
    
        const days = [];
        const totalDays = firstDayOfMonth + daysInMonth;
        const weeks = Math.ceil(totalDays / 7);
    
        for(let i = 0; i < weeks * 7; i++) {
            const dayNumber = i - firstDayOfMonth + 1;
            const event = dayNumber > 0 && dayNumber <= daysInMonth ? 
                getEventForDate(currentDate.getFullYear(), currentDate.getMonth(), dayNumber) : 
                null;
    
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
                                        setSelectedBookings(event.bookings); // Set bookings to show in modal
                                    }}
                                    className="mt-1 p-1 rounded text-sm bg-purple-600 text-white hover:opacity-80"
                                >
                                    Bookings: {event.bookings.length}
                                </div>
                            )}
                        </>
                    )}
                </div>
            );
        }
        return days;
    }

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];


    return(
        <>
        <div className="bg-gray-900 rounded-lg">
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

                {/* Bookings
                <div className="flex space-x-4 mb-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                        <span className="text-sm text-gray-300">Booking</span>
                    </div>
                </div> */}

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
        {/* Render the modal when bookings are selected */}
        {selectedBookings && (
                <QuickInfoModal 
                    bookings={selectedBookings} 
                    onClose={() => setSelectedBookings(null)} 
                />
            )}
        </>
    )
}

export default Calendar2;