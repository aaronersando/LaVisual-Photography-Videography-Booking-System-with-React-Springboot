import { useState, useEffect } from 'react';
import SetManualSchedule from './SetManualSchedule';
import ShowScheduleDetails from './ShowScheduleDetails';

function SetScheduleModal({ date, onClose, onSetManual, onShowDetails, bookings }) {
    const formatDate = (date) => date.toISOString().split('T')[0];
    const currentDateStr = formatDate(date);
    const [showManualSchedule, setShowManualSchedule] = useState(false);
    const [selectedTimeRange, setSelectedTimeRange] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [timeRanges, setTimeRanges] = useState([]);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [bookingToDelete, setBookingToDelete] = useState(null);
    const [pendingDeletions, setPendingDeletions] = useState([]);


    // Function to handle booking deletion
    const handleDeleteBooking = (booking, rangeId) => {
        // Check if we have a valid database ID to use
        const databaseId = booking.databaseId || booking.bookingId || booking.id;
        
        if (!databaseId) {
            alert('Cannot delete this booking: Missing database ID');
            return;
        }
        
        const isConfirmed = window.confirm(
            `Are you sure you want to delete the booking for ${booking.client || booking.customerDetails?.name}? This will be deleted when you save changes.`
        );
        
        if (isConfirmed) {
            // Add the actual database ID to pending deletions
            setPendingDeletions([...pendingDeletions, databaseId]);
            
            // Remove from UI only (temporarily)
            setTimeRanges(timeRanges.filter(range => range.id !== rangeId));
            
            console.log(`Booking with database ID ${databaseId} marked for deletion`);
        }
    };

    // Function to handle confirmed deletion from database
    // const handleConfirmDelete = async () => {
    //     if (!bookingToDelete) return;
        
    //     try {
    //         // Get authentication token from localStorage
    //         const token = localStorage.getItem('token');
            
    //         console.log("Auth token:", token ? "Found" : "Not found");
            
    //         // Check if we are authenticated
    //         if (!token) {
    //             console.error('Authentication token not found');
    //             alert('You need to be logged in as an admin to delete bookings');
    //             setBookingToDelete(null);
    //             return;
    //         }
            
    //         // Log the ID we're trying to delete for debugging
    //         console.log(`Attempting to delete booking with ID: ${bookingToDelete.booking.id}`);
            
    //         // Delete from database
    //         const response = await fetch(`http://localhost:8080/api/bookings/${bookingToDelete.booking.id}`, {
    //             method: 'DELETE',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         });
            
    //         // Parse response even if it's an error
    //         let responseData;
    //         const responseText = await response.text();
    //         try {
    //             responseData = responseText ? JSON.parse(responseText) : {};
    //         } catch (e) {
    //             responseData = { message: responseText };
    //         }
            
    //         console.log("Delete response status:", response.status);
    //         console.log("Delete response body:", responseData);
            
    //         if (response.ok) {
    //             console.log(`Booking ${bookingToDelete.booking.bookingReference} deleted successfully`);
    //             // Remove from UI
    //             setTimeRanges(timeRanges.filter(range => range.id !== bookingToDelete.rangeId));
    //             alert("Booking deleted successfully");
                
    //             // Refresh page to see updated data
    //             window.location.reload();
    //         } else {
    //             // Enhanced error reporting
    //             const errorMessage = responseData.message || `Error ${response.status}: Failed to delete booking`;
    //             console.error('Failed to delete booking:', errorMessage);
    //             alert(`Failed to delete booking: ${errorMessage}. Please try again.`);
    //         }
    //     } catch (error) {
    //         console.error('Error deleting booking:', error);
    //         alert(`Error occurred while deleting booking: ${error.message}`);
    //     } finally {
    //         // Reset booking to delete
    //         setBookingToDelete(null);
    //     }
    // };

    const handleSetManual = (timeRange) => {
        setSelectedTimeRange(timeRange);
        setShowManualSchedule(true);
    };

    const handleShowDetails = (booking) => {
        console.log("Showing details for booking:", booking);
        
        // Make sure the booking date matches the selected date
        const bookingToShow = {
            ...booking,
            date: currentDateStr // Ensure the date is correct
        };
        
        setSelectedBooking(bookingToShow);
        setShowDetailsModal(true);
    };
      
    const handleCloseDetails = () => {
        setShowDetailsModal(false);
        setSelectedBooking(null);
    };
      
    const handleUpdateBooking = (booking) => {
        // Handle the update logic here
        console.log('Update booking:', booking);
        setShowDetailsModal(false);
    };

    // Parse time string to consistent format
    const parseTimeFormat = (timeStr) => {
        if (!timeStr) return '12:00 AM';
        
        // If already in 12-hour format with AM/PM, return as is
        if (timeStr.includes('AM') || timeStr.includes('PM')) {
            return timeStr;
        }
        
        // Convert 24-hour format to 12-hour format with AM/PM
        try {
            const [hours, minutes] = timeStr.split(':').map(Number);
            const period = hours >= 12 ? 'PM' : 'AM';
            const hour12 = hours % 12 || 12;
            return `${hour12.toString().padStart(2, '0')}:${minutes ? minutes.toString().padStart(2, '0') : '00'} ${period}`;
        } catch (e) {
            console.error("Error parsing time:", timeStr);
            return '12:00 AM';
        }
    };

    // Convert time string to 24-hour format for sorting
    const convertTimeStringTo24Hr = (timeStr) => {
        if (!timeStr) return '00:00';
        
        // If already in 24-hour format, return as is
        if (!timeStr.includes('AM') && !timeStr.includes('PM')) {
            return timeStr;
        }
        
        // Convert 12-hour to 24-hour for sorting
        try {
            const [time, period] = timeStr.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            
            if (period === 'PM' && hours !== 12) {
                hours += 12;
            } else if (period === 'AM' && hours === 12) {
                hours = 0;
            }
            
            return `${hours.toString().padStart(2, '0')}:${minutes ? minutes.toString().padStart(2, '0') : '00'}`;
        } catch (e) {
            return '00:00';
        }
    };

    // Check if a full day is already booked
    const isFullDayBooked = () => {
        return timeRanges.some(range => 
            range.status === 'booking' && 
            ((range.start === '12:00 AM' && range.end === '12:00 AM') ||
             (range.start === '12:00 AM' && range.end === '11:59 PM'))
        );
    };

    // Load time ranges when date changes
    useEffect(() => {
        // Format date as YYYY-MM-DD for comparison with a fixed time (noon)
        const selectedDate = new Date(date);
        selectedDate.setHours(12, 0, 0, 0);
        const formattedDateStr = selectedDate.toISOString().split('T')[0];
        
        console.log("SetScheduleModal - Selected date:", formattedDateStr);
        
        // Filter bookings for the selected date with strict date comparison
        const dateBookings = bookings?.filter(booking => {
            let bookingDateStr;
            
            try {
                // Handle booking.date field
                if (booking.date) {
                    if (typeof booking.date === 'string') {
                        // If already in YYYY-MM-DD format, use directly
                        if (booking.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
                            bookingDateStr = booking.date;
                        } else {
                            // Otherwise parse and format consistently
                            const bookingDate = new Date(booking.date);
                            bookingDate.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
                            bookingDateStr = bookingDate.toISOString().split('T')[0];
                        }
                    } else {
                        // Handle Date object
                        const bookingDate = new Date(booking.date);
                        bookingDate.setHours(12, 0, 0, 0);
                        bookingDateStr = bookingDate.toISOString().split('T')[0];
                    }
                } 
                // Handle booking.bookingDate field
                else if (booking.bookingDate) {
                    if (typeof booking.bookingDate === 'string') {
                        if (booking.bookingDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
                            bookingDateStr = booking.bookingDate;
                        } else {
                            const bookingDate = new Date(booking.bookingDate);
                            bookingDate.setHours(12, 0, 0, 0);
                            bookingDateStr = bookingDate.toISOString().split('T')[0];
                        }
                    } else {
                        const bookingDate = new Date(booking.bookingDate);
                        bookingDate.setHours(12, 0, 0, 0);
                        bookingDateStr = bookingDate.toISOString().split('T')[0];
                    }
                }
                
                console.log(`Comparing booking date: ${bookingDateStr} with selected date: ${formattedDateStr} - Match: ${bookingDateStr === formattedDateStr}`);
                
                return bookingDateStr === formattedDateStr;
            } catch (e) {
                console.error("Error processing booking date:", e, booking);
                return false;
            }
        }) || [];
        
        console.log("Filtered bookings for this date:", dateBookings);
        
        // Create initial time ranges including any bookings
        let initialRanges = [];
        if (dateBookings.length > 0) {
            // Sort bookings by start time before mapping
            initialRanges = dateBookings
                .sort((a, b) => {
                    // Parse times for comparison
                    const aTimeStr = a.timeRange?.startTime || a.bookingTimeStart || '00:00';
                    const bTimeStr = b.timeRange?.startTime || b.bookingTimeStart || '00:00';
                    
                    // Convert to comparable format
                    const aTime = convertTimeStringTo24Hr(aTimeStr);
                    const bTime = convertTimeStringTo24Hr(bTimeStr);
                    
                    return aTime.localeCompare(bTime);
                })
                .map((booking, index) => {
                    // Extract proper time format from booking
                    const startTime = parseTimeFormat(booking.timeRange?.startTime || booking.bookingTimeStart || '12:00');
                    const endTime = parseTimeFormat(booking.timeRange?.endTime || booking.bookingTimeEnd || '15:00');
                    
                    console.log(`Booking ${index+1} time range: ${startTime} - ${endTime}`);
                    
                    // Create a properly formatted booking object with the correct date
                    const bookingData = {
                        // Use the actual database booking ID, which could be bookingId or id
                        id: booking.bookingId || booking.id || index + 1,
                        // Keep track of the actual booking ID separately to ensure we have the right one
                        databaseId: booking.bookingId || booking.id,
                        bookingReference: booking.bookingReference || booking.reference || `BKLQ${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                        client: booking.customerDetails?.name || booking.guestName || 'Client',
                        clientEvent: booking.package || booking.packageName || 'Booking',
                        category: booking.category || 'Photography',
                        date: formattedDateStr, // Use the selected date to ensure consistency
                        timeRange: {
                            startTime: startTime,
                            endTime: endTime
                        },
                        customerDetails: {
                            name: booking.customerDetails?.name || booking.guestName || 'Client',
                            email: booking.customerDetails?.email || booking.guestEmail || '',
                            phone: booking.customerDetails?.phone || booking.guestPhone || '',
                            location: booking.customerDetails?.location || booking.location || 'ewan',
                            notes: booking.customerDetails?.notes || booking.specialRequests || ''
                        },
                        paymentDetails: {
                            type: booking.paymentDetails?.type || booking.paymentType || 'Full Payment',
                            method: booking.paymentDetails?.method || booking.paymentMethod || 'GCash',
                            amount: booking.paymentDetails?.amount || booking.amount || 3000,
                            accountNumber: booking.paymentDetails?.accountNumber || booking.gcashNumber || '09665469008'
                        },
                        totalAmount: booking.totalAmount || booking.packagePrice || booking.price || 3000
                    };
                    
                    return {
                        id: index + 1,
                        start: startTime,
                        end: endTime,
                        status: 'booking',
                        date: formattedDateStr,
                        booking: bookingData
                    };
                });
        }
    
        // Add a default available time range if no bookings
        if (initialRanges.length === 0) {
            initialRanges.push({
                id: 1,
                start: '06:00 AM',
                end: '10:00 PM',
                status: 'available',
                date: formattedDateStr,
                booking: null
            });
        }
    
        setTimeRanges(initialRanges);
    }, [date, bookings]);

    // Generate time options in AM/PM format
    const generateTimeOptions = () => {
        const options = [];
        for (let hour = 0; hour < 24; hour++) {
            const period = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 === 0 ? 12 : hour % 12;
            const timeString = `${displayHour.toString().padStart(2, '0')}:00 ${period}`;
            const value = `${displayHour.toString().padStart(2, '0')}:00 ${period}`;
            options.push({ value, label: timeString });
        }
        return options;
    };

    const timeOptions = generateTimeOptions();

    const handleSaveChanges = async () => {
        console.log('Pending deletions:', pendingDeletions);
        for (const bookingId of pendingDeletions) {
            console.log(`Attempting to delete booking with database ID: ${bookingId}`);
        }
        // Process any pending deletions
        if (pendingDeletions.length > 0) {
            try {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    alert('You need to be logged in as an admin to delete bookings');
                    return;
                }
                
                // Process each deletion sequentially
                for (const bookingId of pendingDeletions) {
                    console.log(`Deleting booking ID: ${bookingId}`);
                    
                    const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    
                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error(`Failed to delete booking ${bookingId}:`, errorData);
                        alert(`Error deleting booking ${bookingId}: ${errorData.message || 'Unknown error'}`);
                        // Continue with other deletions even if one fails
                    }
                }
                
                // Clear the pending deletions
                setPendingDeletions([]);
                
                // Here you would also save other changes to your backend
                const updatedSchedule = {
                    date: currentDateStr,
                    timeRanges: timeRanges
                };
                console.log('Saving schedule:', updatedSchedule);
                
                alert("Changes saved successfully!");
                onClose();
                
                // Refresh the page to see the updated data
                window.location.reload();
                
            } catch (error) {
                console.error('Error saving changes:', error);
                alert(`Error occurred while saving changes: ${error.message}`);
            }
        } else {
            // No deletions to process, just save other changes
            console.log('Saving schedule:', {
                date: currentDateStr,
                timeRanges: timeRanges
            });
            alert("Changes saved successfully!");
            onClose();
        }

    };

    const handleAddTimeRange = () => {
        // Don't allow adding if full day is booked
        if (isFullDayBooked()) {
            alert('Cannot add more time ranges when a full day booking exists');
            return;
        }
        
        const newId = timeRanges.length > 0 ? Math.max(...timeRanges.map(r => r.id)) + 1 : 1;
        setTimeRanges([...timeRanges, {
            id: newId,
            start: '06:00 AM',
            end: '10:00 PM',
            status: 'available',
            date: currentDateStr,
            booking: null
        }]);
    };

    const handleDeleteTimeRange = (id) => {
        // Don't allow deletion of booked slots
        const range = timeRanges.find(r => r.id === id);
        if (range.status === 'booking') {
            alert('Cannot delete a booked schedule');
            return;
        }
        setTimeRanges(timeRanges.filter(range => range.id !== id));
    };

    const handleTimeChange = (id, field, value) => {
        setTimeRanges(timeRanges.map(range => {
            if (range.id === id && range.status !== 'booking') { // Prevent editing booked slots
                return { ...range, [field]: value };
            }
            return range;
        }));
    };

    const handleToggleStatus = (id) => {
        setTimeRanges(timeRanges.map(range => {
            if (range.id === id && range.status !== 'booking') { // Prevent toggling booked slots
                const newStatus = range.status === 'available' ? 'unavailable' : 'available';
                return { ...range, status: newStatus };
            }
            return range;
        }));
    };

    const getStatusColor = (status) => {
      switch (status) {
          case 'available':
              return 'bg-green-600 hover:bg-green-700';
          case 'unavailable':
              return 'bg-red-600 hover:bg-red-700';
          case 'booking':
              return 'bg-purple-600';
          default:
              return '';
      }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-700 flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-white">
                            Set Schedule - {date.toLocaleDateString()}
                        </h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content - make it scrollable */}
                <div className="px-6 py-4 overflow-y-auto flex-grow">
                    {/* Time Ranges */}
                    <div className="space-y-4 mb-6">
                        {timeRanges.map(range => (
                            <div key={range.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center space-x-2">
                                        <select
                                            value={range.start}
                                            onChange={(e) => handleTimeChange(range.id, 'start', e.target.value)}
                                            disabled={range.status === 'booking'}
                                            className={`min-w-[120px] bg-gray-600 text-white rounded px-3 py-2 border border-gray-500 ${
                                                range.status === 'booking' ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                        >
                                            {timeOptions.map((option, i) => (
                                                <option key={i} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <span className="text-white">to</span>
                                        <select
                                            value={range.end}
                                            onChange={(e) => handleTimeChange(range.id, 'end', e.target.value)}
                                            disabled={range.status === 'booking'}
                                            className={`min-w-[120px] bg-gray-600 text-white rounded px-3 py-2 border border-gray-500 ${
                                                range.status === 'booking' ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                        >
                                            {timeOptions.map((option, i) => (
                                                <option key={i} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                      {/* Status button */}
                                      <button
                                          disabled={range.status === 'booking'}
                                          onClick={() => range.status !== 'booking' ? handleToggleStatus(range.id) : null}
                                          className={`px-3 py-2 rounded text-white ${getStatusColor(range.status)} ${
                                            range.status === 'booking' ? 'opacity-100 cursor-default' : ''
                                          }`}
                                      >
                                          {range.status === 'booking' ? 'Booked' : 
                                           range.status === 'available' ? 'Available' : 'Unavailable'}
                                      </button>

                                      {/* Action buttons */}
                                      {range.status === 'available' && (
                                        <button
                                            onClick={() => handleSetManual({
                                                start: range.start,
                                                end: range.end
                                            })}
                                            className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                        >
                                            Set Manual Schedule
                                        </button>
                                      )}

                                        {range.booking && (
                                            <>
                                                <button
                                                    onClick={() => handleShowDetails(range.booking)}
                                                    className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                                >
                                                    Show Details
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteBooking(range.booking, range.id)}
                                                    className="text-red-400 hover:text-red-300 p-2"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </>
                                        )}

                                      {/* Delete button - trash icon */}
                                      {range.status !== 'booking' && (
                                          <button
                                              onClick={() => handleDeleteTimeRange(range.id)}
                                              className="text-red-400 hover:text-red-300 p-2"
                                          >
                                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                              </svg>
                                          </button>
                                      )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add Time Range Button - disable if full day is booked */}
                    <button
                        onClick={handleAddTimeRange}
                        disabled={isFullDayBooked()}
                        className={`w-full mb-6 px-4 py-3 rounded-lg text-white transition-colors
                            ${isFullDayBooked() 
                            ? 'bg-purple-400 cursor-not-allowed' 
                            : 'bg-purple-600 hover:bg-purple-700'}`}
                    >
                        {isFullDayBooked() 
                        ? 'Cannot Add More - Full Day Booked' 
                        : 'Add Schedule (Time Range)'}
                    </button>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-700 flex justify-end space-x-4 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveChanges}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
            
            {/* Set Manual Schedule modal */}
            {showManualSchedule && (
                <SetManualSchedule
                    onClose={() => setShowManualSchedule(false)}
                    selectedTimeRange={selectedTimeRange}
                    selectedDate={date}
                />
            )}
            
            {/* Show Booking Details modal */}
            {showDetailsModal && selectedBooking && (
                <ShowScheduleDetails
                    booking={selectedBooking}
                    onClose={handleCloseDetails}
                    onUpdate={handleUpdateBooking}
                />
            )}
        </div>
    );
}

export default SetScheduleModal;