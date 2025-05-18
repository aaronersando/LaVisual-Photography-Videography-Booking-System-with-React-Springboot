/**
 * Calendar Dashboard Section Component
 * 
 * This component serves as the main calendar interface for the admin dashboard, displaying
 * photography session bookings in a calendar view. It provides functionality for:
 * 
 * - Fetching and displaying all booking data from the backend API
 * - Viewing booking information organized by date
 * - Selecting dates to manage schedules
 * - Opening modal dialogs for detailed schedule management
 * 
 * The component handles different states including loading, errors, and empty booking lists,
 * providing appropriate user feedback for each state. It implements a responsive calendar
 * interface that allows administrators to visualize and manage booking schedules effectively.
 * 
 * This is typically used as the main content when an admin selects the Calendar section
 * in the admin dashboard navigation.
 */

import React, { useState, useEffect } from 'react'; // Import React and hooks for component functionality
import Calendar2 from '../components/admin/Calendar2'; // Import custom calendar display component
import SetScheduleModal from '../components/admin/SetScheduleModal'; // Import modal for managing schedules
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome icon component
import { faSpinner } from '@fortawesome/free-solid-svg-icons'; // Import spinner icon for loading states

function CalendarSection() {
  // State for tracking the currently selected date
  const [selectedDate, setSelectedDate] = useState(null);
  // State to control the visibility of the schedule management modal
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  // State to store booking data fetched from the backend
  const [bookings, setBookings] = useState([]);
  // State to track when data is being loaded
  const [isLoading, setIsLoading] = useState(true);
  // State to store error messages if API requests fail
  const [error, setError] = useState(null);

  // Fetch bookings when component mounts (empty dependency array means run once)
  useEffect(() => {
    fetchBookings();
  }, []);

  // Function to fetch booking data from the backend API
  const fetchBookings = async () => {
    setIsLoading(true); // Start loading state
    setError(null); // Clear any previous errors
    try {
      // Make HTTP request to the bookings API endpoint
      const response = await fetch('http://localhost:8080/api/bookings');
      // Check if response is successful (status 200-299)
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      // Parse JSON response
      const data = await response.json();
      // Update bookings state with the fetched data or empty array if no data
      setBookings(data.success ? data.data.bookings : []);
      // Log fetched bookings for debugging
      console.log("Fetched bookings:", data.success ? data.data.bookings : []);
    } catch (error) {
      // Set user-friendly error message
      setError('Error loading calendar data. Please try again.');
      // Log detailed error for debugging
      console.error('Error fetching bookings:', error);
      
      // Test data for development - provides a sample booking when API fails
      // This allows testing even when backend is unavailable
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
      // Always set loading to false when done, whether successful or not
      setIsLoading(false);
    }
  };

  // Handler for when a date is clicked in the calendar
  const handleDateClick = (date) => {
    // Create a new date object to avoid modifying the original
    const selectedDate = new Date(date);
    // Set time to noon to prevent timezone issues in date comparisons
    selectedDate.setHours(12, 0, 0, 0);
    
    // Log selected date for debugging
    console.log("CalendarSection received date:", selectedDate);
    // Update state with selected date
    setSelectedDate(selectedDate);
    // Show the schedule modal for the selected date
    setShowScheduleModal(true);
  };

  // Handler to close the schedule modal
  const handleCloseModal = () => {
    setShowScheduleModal(false); // Hide the modal
    setSelectedDate(null); // Clear the selected date
  };

  // Placeholder for future manual schedule creation functionality
  const handleSetManual = () => {
    // Will implement later
    console.log('Set Manual Schedule');
  };

  // Placeholder for future booking details viewing functionality
  const handleShowDetails = () => {
    // Will implement later
    console.log('Show Details');
  };

  // Function to conditionally render content based on loading/error/data states
  const renderContent = () => {
    // Show loading spinner when data is being fetched
    if (isLoading) {
      return (
        <div className="p-4 text-center pt-20">
          <div className="inline-block animate-spin text-purple-500 text-4xl mb-4">
            <FontAwesomeIcon icon={faSpinner} />
          </div>
          <p className="text-gray-300">Loading Calendar Data...</p>
        </div>
      );
    } else if (error) {
      // Show error message with retry button if fetch failed
      return (
        <div className="p-4 bg-red-500/20 text-red-100 rounded-md mt-12">
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
      // Show empty state message when no bookings exist
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
    
    // If everything is OK, render the calendar with bookings
    return (
      <Calendar2 
        onDateClick={handleDateClick} // Pass date click handler to calendar
        bookings={bookings} // Pass booking data to display in calendar
      />
    );
  };
  
  // Main component render
  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-white font-bold">Calendar Dashboard</h2>
      
      {/* Render appropriate content based on state */}
      {renderContent()}
      
      {/* Conditionally render schedule modal when a date is selected */}
      {showScheduleModal && selectedDate && (
        <SetScheduleModal
          date={selectedDate} // Pass the selected date to the modal
          onClose={handleCloseModal} // Pass close handler to the modal
          onSetManual={handleSetManual} // Pass manual schedule handler
          onShowDetails={handleShowDetails} // Pass details handler
          bookings={bookings} // Pass all bookings to filter for the selected date
        />
      )}
    </div>
  );
}

export default CalendarSection; // Export component for use in the admin dashboard