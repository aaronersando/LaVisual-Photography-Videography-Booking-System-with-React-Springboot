import { useState, useEffect } from 'react';
import Calendar from '../components/admin/Calendar';
import SetScheduleModal from '../components/admin/SetScheduleModal';

function CalendarSection() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [bookings, setBookings] = useState([
    //  come from  backend
    {
      id: 1,
      date: '2025-04-18', // Example booking
      timeRange: {
        startTime: '09:00',
        endTime: '13:00'
      },
      customerDetails: {
        name: 'John Lei',
        email: 'john@example.com',
        phone: '09665469008',
        location: 'Paombong, Bulacan'
      },
      package: 'Event Coverage',
      category: 'Photography',
      paymentDetails: {
        type: 'full',
        method: 'gcash',
        amount: 15000
      }
    }
  ]);

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
      
      <Calendar 
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