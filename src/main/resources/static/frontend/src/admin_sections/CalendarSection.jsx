import React, { useState, useEffect } from 'react';
import Calendar2 from '../components/admin/Calendar2';
import SetScheduleModal from '../components/admin/SetScheduleModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function CalendarSection() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch bookings from the backend
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/api/bookings');
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      const data = await response.json();
      setBookings(data.success ? data.data.bookings : []);
      console.log("Fetched bookings:", data.success ? data.data.bookings : []);
    } catch (error) {
      setError('Error loading calendar data. Please try again.');
      console.error('Error fetching bookings:', error);
      
      // Fallback for testing - remove in production
      setBookings([
        {
          id: 11,
          bookingReference: 'BKLQ3BC9PQ7',
          packageName: 'Intimate Session',
          date: '2025-04-26',
          bookingTimeStart: '12:00',
          bookingTimeEnd: '15:00',
          guestName: 'Test Client',
          guestEmail: 'test@example.com',
          location: 'ewan',
          paymentType: 'Full Payment',
          paymentMethod: 'GCash',
          gcashNumber: '09665469008',
          amount: 3000
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  
  const handleDateClick = (date) => {
  
  const selectedDate = new Date(date);
  selectedDate.setHours(12, 0, 0, 0);
  
  console.log("CalendarSection received date:", selectedDate);
  setSelectedDate(selectedDate);
  setShowScheduleModal(true);
};

  const handleCloseModal = () => {
    setShowScheduleModal(false);
    setSelectedDate(null);
  };

  const handleSetManual = () => {
    // Will implement later
    console.log('Set Manual Schedule');
  };

  const handleShowDetails = () => {
    // Will implement later
    console.log('Show Details');
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center pt-20">
        <div className="inline-block animate-spin text-purple-500 text-4xl mb-4">
          <FontAwesomeIcon icon={faSpinner} />
        </div>
        <p className="text-gray-300">Loading Calendar data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/20 text-red-100 rounded-md mt-20">
        <p className="font-bold mb-2">Failed to load Calendar data</p>
        <p className="mb-4">{error}</p>
        <button
          onClick={fetchBookings}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-white font-bold">Calendar Dashboard</h2>
      
      

      {/* {isLoading ? (
        <div className="text-center py-8 text-white">Loading calendar data...</div>
      ) : (
        <Calendar2 
          onDateClick={handleDateClick}
          bookings={bookings} // Pass bookings to Calendar component
        />
      )} */}
      
      {showScheduleModal && selectedDate && (
        <SetScheduleModal
          date={selectedDate}
          onClose={handleCloseModal}
          onSetManual={handleSetManual}
          onShowDetails={handleShowDetails}
          bookings={bookings} // Pass all bookings to the modal
        />
      )}
    </div>
  );
}

export default CalendarSection;