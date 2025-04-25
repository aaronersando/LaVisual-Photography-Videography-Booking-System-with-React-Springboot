import { useState, useEffect } from 'react';
import Calendar2 from '../components/admin/Calendar2';
import SetScheduleModal from '../components/admin/SetScheduleModal';

function CalendarSection() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/bookings');
            if (!response.ok) {
                throw new Error('Failed to fetch bookings');
            }
            const data = await response.json();
            setBookings(data.success ? data.data.bookings : []);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };
    
    fetchBookings();
}, []);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowScheduleModal(true);
  };

  const handleCloseModal = () => {
    setShowScheduleModal(false);
    setSelectedDate(null);
  };

  // This would fetch bookings from  backend
  useEffect(() => {
    // Example 
    // const fetchBookings = async () => {
    //   const response = await fetch('/api/bookings');
    //   const data = await response.json();
    //   setBookings(data);
    // };
    // fetchBookings();
  }, []);

  const handleSetManual = () => {
    // Will implement later
    console.log('Set Manual Schedule');
  };

  const handleShowDetails = () => {
    // Will implement later
    console.log('Show Details');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-white font-bold">Calendar Dashboard</h2>
      
      <Calendar2 
        onDateClick={handleDateClick}
        bookings={bookings} // Pass bookings to Calendar component
      />

      {showScheduleModal && selectedDate && (
        <SetScheduleModal
          date={selectedDate}
          onClose={handleCloseModal}
          onSetManual={handleSetManual}
          onShowDetails={handleShowDetails}
          bookings={bookings} // Pass bookings to modal
        />
      )}
    </div>
  );
}

export default CalendarSection;