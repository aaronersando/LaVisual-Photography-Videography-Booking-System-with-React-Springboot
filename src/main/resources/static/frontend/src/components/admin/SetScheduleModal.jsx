import { useState, useEffect } from 'react';
import SetManualSchedule from './SetManualSchedule';
import ShowScheduleDetails from './ShowScheduleDetails';
import { faTrash, faTrashAlt, faTrashArrowUp, faTrashCan, faTrashRestore, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
    const [editedBookings, setEditedBookings] = useState([]);
    const [isEdited, setIsEdited] = useState(false);

    // Load time ranges and unavailable slots
    // Load time ranges and unavailable slots
useEffect(() => {
    // Format date as YYYY-MM-DD for comparison with a fixed time (noon)
    const selectedDate = new Date(date);
    selectedDate.setHours(12, 0, 0, 0);
    const formattedDateStr = selectedDate.toISOString().split('T')[0];
    
    console.log("SetScheduleModal - Selected date:", formattedDateStr);
    
    // Filter bookings for confirmed/completed status first
    const confirmedBookings = bookings?.filter(booking => 
        booking.bookingStatus === "CONFIRMED" || 
        booking.bookingStatus === "COMPLETED"
    ) || [];
    
    console.log(`SetScheduleModal: Filtered ${confirmedBookings.length} confirmed bookings out of ${bookings?.length || 0}`);
    
    // Filter confirmed bookings for the selected date with strict date comparison
    const dateBookings = confirmedBookings.filter(booking => {
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

    const loadUnavailableTimeRanges = async (dateStr) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.warn('Admin token not found, skipping unavailable ranges loading');
                return [];
            }
    
            const response = await fetch(`http://localhost:8080/api/schedules/unavailable/${dateStr}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data && data.data.unavailableRanges) {
                    return data.data.unavailableRanges;
                }
            }
    
            return [];
        } catch (error) {
            console.error('Error loading unavailable time ranges:', error);
            return [];
        }
    };
    
    // Load unavailable time ranges - NEW FUNCTIONALITY
    const fetchUnavailableRanges = async () => {
        const unavailableRanges = await loadUnavailableTimeRanges(formattedDateStr);
        
        if (unavailableRanges.length > 0) {
            // Use the current state to get the highest ID
            setTimeRanges(prevRanges => {
                // Calculate highest existing ID from current state
                const highestId = prevRanges.length > 0 
                    ? Math.max(...prevRanges.map(r => r.id)) 
                    : 0;
                
                // Convert to UI format and add to time ranges with truly unique IDs
                const formattedUnavailableRanges = unavailableRanges
                    // First deduplicate based on start and end times
                    .filter((range, index, self) => 
                        index === self.findIndex(r => 
                            r.startTime === range.startTime && r.endTime === range.endTime
                        )
                    )
                    .map((range, index) => ({
                        id: highestId + index + 1, // Using current highest ID as base
                        start: parseTimeFormat(range.startTime),
                        end: parseTimeFormat(range.endTime),
                        status: 'unavailable',
                        booking: null,
                        date: formattedDateStr,
                        serverId: range.id // Store the server ID for deletion
                    }));
                
                // Filter out duplicates based on time range
                const existingTimeRanges = prevRanges.map(r => `${r.start}-${r.end}-${r.status}`);
                const uniqueNewRanges = formattedUnavailableRanges.filter(
                    range => !existingTimeRanges.includes(`${range.start}-${range.end}-${range.status}`)
                );
                
                if (uniqueNewRanges.length > 0) {
                    console.log('Added unique unavailable ranges:', uniqueNewRanges);
                    return [...prevRanges, ...uniqueNewRanges];
                }
                
                return prevRanges;
            });
        }
    };
    
    fetchUnavailableRanges();
}, [date, bookings]);

    


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
      
    const handleUpdateBooking = (updatedBooking) => {
        console.log('Booking updated:', updatedBooking);
        
        // Close the details modal
        setShowDetailsModal(false);
        
        // Update the local state to reflect changes
        const updatedTimeRanges = timeRanges.map(range => {
            if (range.booking && 
                (range.booking.id === updatedBooking.id || 
                 range.booking.bookingId === updatedBooking.bookingId ||
                 range.booking.databaseId === updatedBooking.databaseId)) {
                return {
                    ...range,
                    booking: updatedBooking
                };
            }
            return range;
        });
        
        setTimeRanges(updatedTimeRanges);
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
            return `${hour12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
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

    

    // Generate time options in AM/PM format
    const generateTimeOptions = (rangeId = null, field = null) => {
        const options = [];
        let currentStart = null, currentEnd = null;
    
        if (rangeId !== null) {
            const range = timeRanges.find(r => r.id === rangeId);
            if (range) {
                currentStart = range.start;
                currentEnd = range.end;
            }
        }
    
        for (let hour = 0; hour < 24; hour++) {
            const period = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 === 0 ? 12 : hour % 12;
            const timeString = `${displayHour.toString().padStart(2, '0')}:00 ${period}`;
    
            let isConflict = false;
    
            // Check for conflicts with booked or unavailable ranges
            if (field === 'start') {
                isConflict = timeRanges.some(range => {
                    if (range.id === rangeId) return false; // Skip the current range
                    if (range.status === 'booking' || range.status === 'unavailable') {
                        const rangeStartMinutes = timeToMinutes(range.start);
                        const rangeEndMinutes = timeToMinutes(range.end);
                        const timeMinutes = timeToMinutes(timeString);
    
                        // Disable if the start time falls within an existing range
                        return timeMinutes >= rangeStartMinutes && timeMinutes < rangeEndMinutes;
                    }
                    return false;
                });
            } else if (field === 'end') {
                isConflict = timeRanges.some(range => {
                    if (range.id === rangeId) return false; // Skip the current range
                    if (range.status === 'booking' || range.status === 'unavailable') {
                        const rangeStartMinutes = timeToMinutes(range.start);
                        const rangeEndMinutes = timeToMinutes(range.end);
                        const timeMinutes = timeToMinutes(timeString);
    
                        // Disable if the end time falls within an existing range
                        return timeMinutes > rangeStartMinutes && timeMinutes <= rangeEndMinutes;
                    }
                    return false;
                });
            }
    
            options.push({
                value: timeString,
                label: timeString,
                isConflict: isConflict
            });
        }
    
        return options;
    };

    const timeOptions = generateTimeOptions();

    const handleSaveChanges = async () => {
        const hasConflicts = timeRanges.some(range => 
            isTimeRangeOverlapping(range.start, range.end, range.id)
        );
    
        if (hasConflicts) {
            alert('Some time ranges overlap with booked or unavailable ranges. Please fix them before saving.');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                alert('You need to be logged in as an admin to make changes');
                return;
            }
            
            // Format date as YYYY-MM-DD for API calls
            const currentDateStr = date.toISOString().split('T')[0];
            
            // 1. Process any edited bookings first
            if (editedBookings.length > 0) {
                try {
                    let allSuccess = true;
                    
                    for (const booking of editedBookings) {
                        const updateSuccess = await updateBookingTimeRange(booking);
                        if (!updateSuccess) {
                            allSuccess = false;
                        }
                    }
                    
                    if (!allSuccess) {
                        const proceed = window.confirm('Some booking time range updates failed. Do you want to continue with other changes?');
                        if (!proceed) return;
                    }
                    
                    // Clear the edited bookings after processing
                    setEditedBookings([]);
                } catch (error) {
                    console.error('Error updating booking time ranges:', error);
                    alert(`Error occurred while updating booking time ranges: ${error.message}`);
                    return;
                }
            }
    
            // 2. Process any pending deletions
            if (pendingDeletions.length > 0) {
                try {
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
                } catch (error) {
                    console.error('Error processing deletions:', error);
                    alert(`Error occurred while processing deletions: ${error.message}`);
                    return;
                }
            }
            
            // 3. Save unavailable time ranges
            const unavailableRanges = timeRanges.filter(range => range.status === 'unavailable');
            // Always call saveUnavailableTimeRanges, even when the array is empty
            const saveResult = await saveUnavailableTimeRanges(unavailableRanges, currentDateStr);
            if (!saveResult) {
                const proceed = window.confirm('Some unavailable time ranges failed to save. Continue anyway?');
                if (!proceed) return;
            }
            
            console.log('Saving schedule:', {
                date: currentDateStr,
                timeRanges: timeRanges
            });
            
            alert("Changes saved successfully!");
            onClose();

            setIsEdited(false);
            
            // Refresh the page to see the updated data
            window.location.reload();
            
        } catch (error) {
            console.error('Error saving changes:', error);
            alert(`Error occurred while saving changes: ${error.message}`);
        }
    };

    const handleAddTimeRange = () => {
        // Don't allow adding if full day is booked
        if (isFullDayBooked()) {
            alert('Cannot add more time ranges when a full day booking exists');
            return;
        }
        
        // Find all booked time ranges
        const bookedRanges = timeRanges
            .filter(range => range.status === 'booking')
            .map(range => ({
                start: timeToMinutes(range.start),
                end: timeToMinutes(range.end)
            }))
            .sort((a, b) => a.start - b.start);
        
        // Find available slots (minimum 3 hours / 180 minutes)
        const availableSlots = [];
        
        // Check early morning slot (12:00 AM to first booking)
        if (bookedRanges.length > 0 && bookedRanges[0].start >= 180) {
            availableSlots.push({
                start: 0, // 12:00 AM
                end: bookedRanges[0].start
            });
        }
        
        // Check slots between bookings
        for (let i = 0; i < bookedRanges.length - 1; i++) {
            const gapStart = bookedRanges[i].end;
            const gapEnd = bookedRanges[i+1].start;
            
            if (gapEnd - gapStart >= 180) {
                availableSlots.push({
                    start: gapStart,
                    end: gapEnd
                });
            }
        }
        
        // Check evening slot (last booking to midnight)
        if (bookedRanges.length > 0) {
            const lastEnd = bookedRanges[bookedRanges.length - 1].end;
            if (1440 - lastEnd >= 180) { // 1440 = minutes in a day
                availableSlots.push({
                    start: lastEnd,
                    end: 1440
                });
            }
        } else {
            // No bookings at all
            availableSlots.push({
                start: 360, // 6:00 AM
                end: 1320 // 10:00 PM
            });
        }
        
        // Convert minutes back to time strings
        const convertMinutesToTimeStr = (mins) => {
            const hours = Math.floor(mins / 60);
            const minutes = mins % 60;
            const period = hours >= 12 ? 'PM' : 'AM';
            const hour12 = hours % 12 || 12;
            return `${hour12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
        };
        
        // Use the first available slot, or default if nothing available
        let defaultStart = '06:00 AM';
        let defaultEnd = '10:00 PM';
        
        if (availableSlots.length > 0) {
            const slot = availableSlots[0];
            defaultStart = convertMinutesToTimeStr(slot.start);
            defaultEnd = convertMinutesToTimeStr(slot.end);
        }
        
        const newId = timeRanges.length > 0 ? Math.max(...timeRanges.map(r => r.id)) + 1 : 1;
        setTimeRanges([...timeRanges, {
            id: newId,
            start: defaultStart,
            end: defaultEnd,
            status: 'available',
            date: currentDateStr,
            booking: null
        }]);
    };

    const handleDeleteTimeRange = async (id) => {
        // Don't allow deletion of booked slots
        const range = timeRanges.find(r => r.id === id);
        if (!range) return;
        
        if (range.status === 'booking') {
            alert('Cannot delete a booked schedule');
            return;
        }
        
        // Just remove from UI - we'll handle server changes on "Save Changes"
        setTimeRanges(timeRanges.filter(r => r.id !== id));
        console.log('Range removed from UI, will be saved on "Save Changes"');
        
        // No need to make immediate DELETE API calls - we'll use the replace approach on save
    };

    const handleTimeChange = (id, field, value) => {
        const range = timeRanges.find(r => r.id === id);
        
        // If range is not found, exit early
        if (!range) return;
        
        // Calculate new start and end times
        const newStart = field === 'start' ? value : range.start;
        const newEnd = field === 'end' ? value : range.end;
        
        // Ensure minimum 3-hour booking
        const startMins = timeToMinutes(newStart);
        const endMins = timeToMinutes(newEnd);
        const durationMins = endMins - startMins;
        
        // Check for adequate duration
        if (durationMins < 180 && durationMins > 0) {
            const proceed = window.confirm(
                `This booking is only ${Math.floor(durationMins/60)} hours and ${durationMins%60} minutes long. The minimum recommended booking is 3 hours. Continue anyway?`
            );
            if (!proceed) return;
        }
        
        // Check for conflicts with other bookings, excluding this one
        let wouldConflict = false;
        
        if (field === 'start') {
            wouldConflict = isTimeRangeOverlapping(value, range.end, id);
        } else if (field === 'end') {
            wouldConflict = isTimeRangeOverlapping(range.start, value, id);
        }
        
        // If conflict, show warning
        if (wouldConflict) {
            const proceed = window.confirm(
                `This time range overlaps with an existing booking. Are you sure you want to continue?`
            );
            if (!proceed) return;
        }
        
        // If this is a booked range, track it for backend update
        if (range.status === 'booking') {
            trackEditedBooking(id, field === 'start' ? 'startTime' : 'endTime', value);
        }
        
        // Update the time range in UI
        setTimeRanges(timeRanges.map(r => {
            if (r.id === id) {
                return { ...r, [field]: value };
            }
            return r;
        }));

        setIsEdited(true);
    };

    const handleToggleStatus = (rangeId) => {
        setTimeRanges(prevRanges => 
            prevRanges.map(range => {
                if (range.id === rangeId) {
                    // Toggle between 'available' and 'unavailable'
                    const newStatus = range.status === 'available' ? 'unavailable' : 'available';
                    
                    return {
                        ...range,
                        status: newStatus
                    };
                }
                return range;
            })
        );
        
        // Set edited flag when status changes
        setIsEdited(true);
    };
    
    // function to determine the appropriate color for status buttons
    const getStatusColor = (status) => {
        switch (status) {
            case 'available':
                return 'bg-green-600 hover:bg-green-700';
            case 'unavailable':
                return 'bg-red-600 hover:bg-red-700';
            case 'booking':
                return 'bg-purple-600';
            default:
                return 'bg-gray-600 hover:bg-gray-700';
        }
    };

    const timeToMinutes = (timeStr) => {
        if (!timeStr) return 0;
        
        try {
            // Handle "HH:MM AM/PM" format
            if (timeStr.includes('AM') || timeStr.includes('PM')) {
                const [time, period] = timeStr.split(' ');
                let [hours, minutes] = time.split(':').map(Number);
                
                // Convert to 24-hour format
                if (period === 'PM' && hours !== 12) {
                    hours += 12;
                } else if (period === 'AM' && hours === 12) {
                    hours = 0;
                }
                
                return hours * 60 + (minutes || 0);
            } 
            // Handle "HH:MM" 24-hour format
            else {
                const [hours, minutes] = timeStr.split(':').map(Number);
                return hours * 60 + (minutes || 0);
            }
        } catch (e) {
            console.error("Error converting time to minutes:", e, timeStr);
            return 0;
        }
    };

    const isTimeRangeOverlapping = (start, end, excludeId = null) => {
        const startMinutes = timeToMinutes(start);
        const endMinutes = timeToMinutes(end);
    
        return timeRanges.some(range => {
            if (range.id === excludeId) return false;
    
            if (range.status === 'booking' || range.status === 'unavailable') {
                const rangeStartMinutes = timeToMinutes(range.start);
                const rangeEndMinutes = timeToMinutes(range.end);
    
                return (
                    (startMinutes < rangeEndMinutes && endMinutes > rangeStartMinutes) || // Overlap
                    (startMinutes === rangeStartMinutes && endMinutes === rangeEndMinutes) // Exact match
                );
            }
    
            return false;
        });
    };

    const trackEditedBooking = (rangeId, field, value) => {
        const range = timeRanges.find(r => r.id === rangeId);
        if (!range || !range.booking) return;
        
        const bookingId = range.booking.databaseId || range.booking.bookingId || range.booking.id;
        
        // Check if this booking is already in our edited list
        const existingIndex = editedBookings.findIndex(eb => eb.bookingId === bookingId);
        
        if (existingIndex >= 0) {
            // Update the existing entry
            const updatedEditedBookings = [...editedBookings];
            updatedEditedBookings[existingIndex] = {
                ...updatedEditedBookings[existingIndex],
                [field]: value
            };
            setEditedBookings(updatedEditedBookings);
        } else {
            // Add a new entry
            const newEditedBooking = {
                bookingId: bookingId,
                rangeId: rangeId,
                [field]: value
            };
            setEditedBookings([...editedBookings, newEditedBooking]);
        }
    };

    const updateBookingTimeRange = async (booking) => {
        try {
            // Get auth token from local storage
            const token = localStorage.getItem('token');
            
            if (!token) {
                alert('You need to be logged in as an admin to update bookings');
                return false;
            }
            
            const bookingId = booking.bookingId;
            
            // Find the corresponding range to get start and end times
            const range = timeRanges.find(r => 
                r.booking && (
                    r.booking.id === bookingId || 
                    r.booking.bookingId === bookingId || 
                    r.booking.databaseId === bookingId
                )
            );
            
            if (!range) {
                console.error('Could not find range for booking:', bookingId);
                return false;
            }
            
            // Prepare the data to send to the backend
            const timeUpdateData = {
                bookingId: bookingId,
                startTime: convertToTime24Format(range.start),
                endTime: convertToTime24Format(range.end)
            };
            
            console.log('Updating booking time range:', timeUpdateData);
            
            // Call the backend API
            const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}/time-range`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(timeUpdateData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to update booking time range:', errorData);
                alert(`Failed to update booking time range: ${errorData.message || 'Unknown error'}`);
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('Error updating booking time range:', error);
            alert(`Error occurred while updating booking time range: ${error.message}`);
            return false;
        }
    };

    const convertToTime24Format = (timeStr) => {
        if (!timeStr) return null;
    
        // If already in 24-hour format, return as is
        if (!timeStr.includes('AM') && !timeStr.includes('PM')) {
            return timeStr;
        }
    
        // Convert from "hh:mm AM/PM" to "HH:mm" format
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours, 10);
    
        if (modifier === 'AM' && hours === 12) {
            hours = 0; // Midnight case
        } else if (modifier === 'PM' && hours !== 12) {
            hours += 12; // Afternoon case
        }
    
        return `${hours.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    };

    // Helper function to convert time from 12h to 24h format for the backend
    const saveUnavailableTimeRanges = async (unavailableRanges, currentDateStr) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('You need to be logged in as an admin to save unavailable time ranges');
                return false;
            }
    
            // Format the unavailable ranges for the API
            const formattedRanges = unavailableRanges.map(range => ({
                startTime: convertToTime24Format(range.start),
                endTime: convertToTime24Format(range.end),
                status: 'unavailable'
            }));
    
            console.log('Saving unavailable time ranges:', formattedRanges);
    
            const response = await fetch('http://localhost:8080/api/schedules/unavailable', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    date: currentDateStr,
                    unavailableRanges: formattedRanges
                })
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                console.error('Failed to save unavailable time ranges:', data);
                alert(`Failed to save unavailable time ranges: ${data.message || 'Unknown error'}`);
                return false;
            }
    
            return true;
        } catch (error) {
            console.error('Error saving unavailable time ranges:', error);
            alert(`Error occurred while saving unavailable time ranges: ${error.message}`);
            return false;
        }
    };

    // Helper function to convert 24-hour format to 12-hour format with AM/PM
    const convertTo12HourFormat = (time24h) => {
        if (!time24h) return '';
        
        // If time is already in 12-hour format, return it
        if (time24h.includes('AM') || time24h.includes('PM')) {
            return time24h;
        }
        
        let [hours, minutes] = time24h.split(':');
        hours = parseInt(hours);
        
        const suffix = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
        
        return `${hours}:${minutes} ${suffix}`;
    };


    const formattedTimeRanges = timeRanges.map(range => ({
        ...range,
        start: parseTimeFormat(range.start),
        end: parseTimeFormat(range.end),
    }));

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
                            <FontAwesomeIcon icon={faX} className='h-6 w-6 text-lg'/>
                        </button>
                    </div>
                </div>

                {/* Content - make it scrollable */}
                <div className="px-6 py-4 overflow-y-auto flex-grow">
                    {/* Time Ranges */}
                    <div className="space-y-4 mb-6">
                        {formattedTimeRanges.map(range => {
                            // Generate time options specific to this range
                            const startOptions = generateTimeOptions(range.id, 'start');
                            const endOptions = generateTimeOptions(range.id, 'end');

                            const isEdited = range.status === 'booking' && editedBookings.some(
                                eb => eb.rangeId === range.id
                            );

                            return (
                                <div key={range.id} className={`bg-gray-700/50 rounded-lg p-4 border ${
                                    isEdited ? 'border-yellow-400' : 'border-gray-600/50'
                                }`}>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center space-x-2">
                                            {/* Start Time Dropdown */}
                                            <select
                                                value={range.start}
                                                onChange={(e) => handleTimeChange(range.id, 'start', e.target.value)}
                                                className={`min-w-[120px] bg-gray-600 text-white rounded px-3 py-2 border ${
                                                    isTimeRangeOverlapping(range.start, range.end, range.id)
                                                        ? 'border-red-500'
                                                        : isEdited ? 'border-yellow-400' : 'border-gray-500'
                                                }`}
                                            >
                                                {startOptions.map((option, i) => (
                                                    <option
                                                        key={i}
                                                        value={option.value}
                                                        disabled={option.isConflict}
                                                        className={option.isConflict ? 'text-red-500' : ''}
                                                    >
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <span className="text-white">to</span>
                                            {/* End Time Dropdown */}
                                            <select
                                                value={range.end}
                                                onChange={(e) => handleTimeChange(range.id, 'end', e.target.value)}
                                                className={`min-w-[120px] bg-gray-600 text-white rounded px-3 py-2 border ${
                                                    isTimeRangeOverlapping(range.start, range.end, range.id)
                                                        ? 'border-red-500'
                                                        : isEdited ? 'border-yellow-400' : 'border-gray-500'
                                                }`}
                                            >
                                                {endOptions.map((option, i) => (
                                                    <option
                                                        key={i}
                                                        value={option.value}
                                                        disabled={option.isConflict}
                                                        className={option.isConflict ? 'text-red-500' : ''}
                                                    >
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>

                                            {/* Edited Indicator */}
                                            {isEdited && (
                                                <span className="text-yellow-400 font-bold ml-2">
                                                    ⚠️ Time Changed
                                                </span>
                                            )}

                                            {/* Conflict Indicator */}
                                            {isTimeRangeOverlapping(range.start, range.end, range.id) && (
                                                <span className="text-red-500 font-bold ml-2">
                                                    ⚠️ Conflict
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            {/* Status Toggle Button */}
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

                                            {/* Action Buttons */}
                                            {range.status === 'available' && (
                                                <button
                                                    onClick={() => handleSetManual({
                                                        start: range.start,
                                                        end: range.end
                                                    })}
                                                    className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                                    disabled={isTimeRangeOverlapping(range.start, range.end, range.id)}
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
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </>
                                            )}

                                            {range.status !== 'booking' && (
                                                <button
                                                    onClick={() => handleDeleteTimeRange(range.id)}
                                                    className="text-red-400 hover:text-red-300 p-2"
                                                >
                                                    <FontAwesomeIcon icon={faTrashCan} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
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
                        disabled={timeRanges.some(range => range.status !== 'booking' && isTimeRangeOverlapping(range.start, range.end, range.id))}
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
                    existingBookings={timeRanges} // Pass all time ranges to check for conflicts
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