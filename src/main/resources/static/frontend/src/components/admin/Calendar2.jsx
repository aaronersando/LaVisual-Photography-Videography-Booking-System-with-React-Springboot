import { useState, useEffect } from "react";
import QuickInfoModal from "./QuickInfoModal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight, faArrowLeft, faLeftLong, faLessThan } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function Calendar2({onDateClick, bookings}){

    // Date today for basis
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedBookings, setSelectedBookings] = useState(null);

    const [events, setEvents] = useState([]);
    const [localBookings, setLocalBookings] = useState(bookings || []);

    // Filter fetchBookings function to make double sure only confirmed bookings show
    const fetchBookings = async (date = currentDate) => {
        try {
            // Format year and month for API request
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            
            console.log(`Fetching bookings for ${year}-${month}`);
            
            // Use the month calendar endpoint to get all approved bookings for the month
            const response = await axios.get(
                `http://localhost:8080/api/bookings/calendar/month/${year}/${month}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            
            if (response.data.success) {
                // Filter to ensure we only get CONFIRMED or COMPLETED bookings
                const confirmedBookings = response.data.data.bookings.filter(
                    booking => booking.bookingStatus === "CONFIRMED" || booking.bookingStatus === "COMPLETED"
                );
                
                console.log(`Found ${confirmedBookings.length} confirmed bookings out of ${response.data.data.bookings.length} total`);
                
                // Clear any props-based bookings to avoid duplication
                setLocalBookings(confirmedBookings);
                
                // Immediately format these bookings for the calendar
                formatBookingsForCalendar(confirmedBookings);
            } else {
                console.error("Failed to fetch confirmed bookings:", response.data.message);
            }
        } catch (error) {
            console.error("Error fetching confirmed bookings:", error);
        }
    };

    // Fetch bookings when the month changes
    useEffect(() => {
        // Only fetch bookings if we don't have any from props
        if (!bookings || bookings.length === 0) {
            fetchBookings();
        }
    }, [currentDate]);

    // Format bookings data into the events format needed for calendar
    useEffect(() => {
        // When the component receives new props or fetches new bookings from API
        if (bookings && bookings.length > 0) {
            // If bookings are passed as props (from parent component)
            const confirmedBookings = bookings.filter(booking => 
                booking.bookingStatus === "CONFIRMED" || 
                booking.bookingStatus === "COMPLETED"
            );
            
            console.log(`Processing ${confirmedBookings.length} confirmed bookings from props`);
            
            // Store the filtered bookings locally
            setLocalBookings(confirmedBookings);
            
            // Format them for display
            formatBookingsForCalendar(confirmedBookings);
        }
        // We'll rely on the fetchBookings function to handle API-sourced bookings
        // This way we avoid double-processing the same bookings
    }, [bookings]); // Only depend on props bookings

    // Add this function before the useEffect
    const formatBookingsForCalendar = (bookingsToFormat) => {
        if (!bookingsToFormat || bookingsToFormat.length === 0) {
            console.log("No bookings to format");
            return;
        }
        
        console.log(`Formatting ${bookingsToFormat.length} bookings for calendar`);
        
        // Check if all bookings are confirmed/completed
        const allConfirmed = bookingsToFormat.every(booking => 
            booking.bookingStatus === "CONFIRMED" || booking.bookingStatus === "COMPLETED"
        );
        
        if (!allConfirmed) {
            console.warn("Warning: Some bookings are not confirmed/completed!");
            // Print the problematic bookings
            bookingsToFormat.forEach(booking => {
                if (booking.bookingStatus !== "CONFIRMED" && booking.bookingStatus !== "COMPLETED") {
                    console.warn(`Booking with status ${booking.bookingStatus}:`, booking);
                }
            });
            
            // Force filter again
            bookingsToFormat = bookingsToFormat.filter(booking => 
                booking.bookingStatus === "CONFIRMED" || booking.bookingStatus === "COMPLETED"
            );
        }
        
        // Group bookings by date
        const groupedBookings = bookingsToFormat.reduce((acc, booking) => {
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
    };
    
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
        // Clear events before changing month
        setEvents([]);
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() -1, 1));
    }
    
    const handleNextMonth = () => {
        // Clear events before changing month
        setEvents([]);
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

    const handleDateClick = (day) => {
        if (day > 0 && day <= daysInMonth) {
            // Create a date with time set to noon to avoid timezone issues
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day, 12, 0, 0);
            
            // Debug logs to verify correct date
            console.log("Calendar day clicked:", day);
            console.log("Calendar clicked date object:", date);
            console.log("Calendar clicked formatted ISO date:", date.toISOString());
            console.log("Calendar clicked YYYY-MM-DD:", date.toISOString().split('T')[0]);
            
            // Pass the date to parent component
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
                                        // Make sure each booking in the event has the correct date
                                        const formattedBookings = event.bookings.map(booking => ({
                                            ...booking,
                                            date: event.date // Ensure the date is correct
                                        }));
                                        setSelectedBookings(formattedBookings); // Set bookings to show in modal
                                    }}
                                    className="mt-1 p-1 rounded text-sm bg-purple-600 text-white hover:opacity-80 cursor-pointer"
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
                {/* Your existing calendar code */}
                <div className="mb-4 pt-6">
                    {/* Calendar Header */}
                    <div className="flex justify-between items-center px-6 pb-4">
                        <button
                            onClick={handlePrevMonth}
                            className="p-2 rounded hover:bg-gray-700 text-gray-400"
                        >
                            <FontAwesomeIcon icon={faAngleLeft} className="text-xl"/>
                        </button>
                        <h2 className="text-xl font-semibold text-white">
                            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <button
                            onClick={handleNextMonth}
                            className="p-2 rounded hover:bg-gray-700 text-gray-400"
                        >
                            <FontAwesomeIcon icon={faAngleRight} className="text-xl"/>
                        </button>
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
            {/* Render the modal when bookings are selected */}
            {selectedBookings && (
                <QuickInfoModal 
                    bookings={selectedBookings} 
                    onClose={() => setSelectedBookings(null)} 
                />
            )}
        </>
    );
}

export default Calendar2;