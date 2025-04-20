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
    

    
    const handleSetManual = (timeRange) => {
        setSelectedTimeRange(timeRange);
        setShowManualSchedule(true);
    };


    const handleShowDetails = (booking) => {
        setSelectedBooking(booking);
        setShowDetailsModal(true);
      };
      
      const handleCloseDetails = () => {
        setShowDetailsModal(false);
        setSelectedBooking(null);
      };
      
      const handleUpdateBooking = (booking) => {
        // Handle the update logic here
        console.log('Update booking:', booking);
        // You might want to navigate to an edit form or open another modal
        setShowDetailsModal(false);
      };
    
    

    // Initialize time ranges for the selected date only
    const [timeRanges, setTimeRanges] = useState([
      {
          id: 1,
          start: '07:00 PM',
          end: '11:00 PM',
          status: 'booking',
          date: currentDateStr,
          booking: {
              client: 'John Doe',
              clientEvent: 'Birthday Party',
              timeRange: {
                  startTime: '07:00 PM',
                  endTime: '11:00 PM'
              }
          }
      },
      {
          id: 2,
          start: '06:00 AM',
          end: '10:00 PM',
          status: 'available',
          date: currentDateStr,
          booking: null
      }
  ]);

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

    // Load time ranges when date changes
    // useEffect(() => {
    //     // Get bookings for this specific date from props
    //     const dateBookings = bookings?.filter(booking => booking.date === currentDateStr) || [];
        
    //     // Create initial time ranges including any bookings
    //     const initialRanges = dateBookings.map(booking => ({
    //         id: booking.id,
    //         start: booking.timeRange.startTime,
    //         end: booking.timeRange.endTime,
    //         status: 'booking',
    //         date: currentDateStr,
    //         booking: booking
    //     }));

    //     // Add a default available time range if no bookings
    //     if (initialRanges.length === 0) {
    //         initialRanges.push({
    //             id: 1,
    //             start: '06:00 AM',
    //             end: '10:00 PM',
    //             status: 'available',
    //             date: currentDateStr,
    //             booking: null
    //         });
    //     }

    //     setTimeRanges(initialRanges);
    // }, [currentDateStr, bookings]);

    const handleSaveChanges = () => {
        // Here you would save the changes to your backend
        // Including the date information with each time range
        const updatedSchedule = {
            date: currentDateStr,
            timeRanges: timeRanges
        };
        console.log('Saving schedule:', updatedSchedule);
        onClose();
    };

    const handleAddTimeRange = () => {
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
          default:
              return '';
      }
  };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-700 w-2xl">
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

                {/* Content */}
                <div className="px-6 py-4 w-2xl">
                    {/* Time Ranges */}
                    <div className="space-y-4 mb-6">
                        {timeRanges.map(range => (
                            <div key={range.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50 w-full">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
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
                                      {/* Status button - shows for available/unavailable */}
                                      {range.status !== 'booking' && (
                                          <button
                                              onClick={() => handleToggleStatus(range.id)}
                                              className={`px-3 py-2 rounded text-white ${getStatusColor(range.status)}`}
                                          >
                                              {range.status === 'available' ? 'Available' : 'Unavailable'}
                                          </button>
                                      )}

                                      {/* Booked status button - shows when status is booking */}
                                      {range.status === 'booking' && (
                                          <button
                                              disabled
                                              className="px-3 py-2 rounded text-white bg-purple-600 opacity-50 cursor-not-allowed"
                                          >
                                              Booked
                                          </button>
                                      )}

                                      {/* Set Manual Schedule button - shows for available slots */}
                                      {range.status === 'available' && (
                                        <button
                                            onClick={() => handleSetManual({
                                                start: range.start,
                                                end: range.end
                                            })}
                                            className="px-3 py-2 w-45 bg-gray-600 text-white rounded hover:bg-gray-700"
                                        >
                                            Set Manual Schedule
                                        </button>
                                    )}

                                      {/* Show Details button - shows when there's a booking */}
                                      {range.booking && (
                                          <button
                                              onClick={() => handleShowDetails(range.booking)}
                                              className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                          >
                                              Show Details
                                          </button>
                                      )}

                                      {/* Delete button - hidden for booked slots */}
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

                    {/* Add Time Range Button */}
                    <button
                        onClick={handleAddTimeRange}
                        className="w-full mb-6 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Add Schedule (Time Range)
                    </button>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-700 flex justify-end space-x-4">
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
            {showManualSchedule && (
            <SetManualSchedule
                onClose={() => setShowManualSchedule(false)}
                selectedTimeRange={selectedTimeRange}
                selectedDate={date}
            />
            )}
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