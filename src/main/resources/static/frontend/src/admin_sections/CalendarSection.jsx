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

  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="p-4 text-center pt-20">
          <div className="inline-block animate-spin text-purple-500 text-4xl mb-4">
            <FontAwesomeIcon icon={faSpinner} />
          </div>
          <p className="text-gray-300">Loading Calendar data...</p>
        </div>
      );
    } else if (error) {
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
    } else if (!bookings || bookings.length === 0) {
      return (
        <div className="p-4 bg-yellow-500/20 text-yellow-100 rounded-md mt-20">
          <p className="font-bold mb-2">No Bookings Found</p>
          <p className="mb-4">No booking data is available to display on the calendar.</p>
          <button
            onClick={fetchBookings}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-md"
          >
            Refresh
          </button>
        </div>
      );
    }
    
    return (
      <Calendar2 
        onDateClick={handleDateClick}
        bookings={bookings}
      />
    );
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-white font-bold">Calendar Dashboard</h2>
      
      {renderContent()}
      
      {showScheduleModal && selectedDate && (
        <SetScheduleModal
          date={selectedDate}
          onClose={handleCloseModal}
          onSetManual={handleSetManual}
          onShowDetails={handleShowDetails}
          bookings={bookings}
        />
      )}
    </div>
  );
}

export default CalendarSection;