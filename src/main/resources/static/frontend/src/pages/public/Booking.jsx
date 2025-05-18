/**
 * Booking Page Component
 * 
 * This component manages the multi-step booking flow for the LaVisual photography/videography business.
 * It coordinates the entire booking process by orchestrating different sub-components for each step
 * and maintains the centralized state of the booking data.
 * 
 * The booking flow consists of 5 sequential steps:
 * 1. Package Selection - Users choose a service category and specific package
 * 2. Date & Time Selection - Users select when they want their session
 * 3. Customer Details - Users enter their personal information
 * 4. Review & Payment - Users review their booking and complete payment
 * 5. Confirmation - Users see a success message with their booking details
 * 
 * The component handles navigation between steps, collects and centralizes all booking data,
 * manages error states, and passes appropriate props to each step sub-component.
 * 
 * This is a key user-facing feature of the application that drives business revenue through
 * the online booking capability.
 */

import { useState } from 'react'; // Import React's useState hook for state management
import Navbar from '../../components/common/Navbar'; // Import site navigation header
import FooterComp from '../../components/common/FooterComp'; // Import site footer
import BookingSteps from '../../components/booking/BookingSteps'; // Import step indicator component
import PackageSelection from '../../components/booking/PackageSelection'; // Import step 1 component
import DateTimeSelection from '../../components/booking/DateTimeSelection'; // Import step 2 component
import CustomerDetails from '../../components/booking/CustomerDetails'; // Import step 3 component
import BookingSummary from '../../components/booking/BookingSummary'; // Import step 4 component
import BookingConfirmation from '../../components/booking/BookingConfirmation'; // Import step 5 component

function Booking() {
  // State for tracking which step of the booking process the user is on (starts at 1)
  const [currentStep, setCurrentStep] = useState(1);
  // State for tracking loading operations (currently unused but available for future features)
  const [isLoading, setIsLoading] = useState(false);
  // State for storing any error messages that occur during the booking process
  const [bookingError, setBookingError] = useState(null);
  // Main state that holds all booking information collected across all steps
  const [bookingData, setBookingData] = useState({
    package: '', // Selected package name
    category: '', // Selected category (Photography, Videography, etc.)
    date: '', // Selected booking date
    timeRange: null, // Selected time slot with start and end times
    customerDetails: {
      name: '', // Customer's full name
      email: '', // Customer's email address
      phone: '', // Customer's phone number
      location: '', // Service location/address
      notes: '' // Any special requests or additional information
    },
    price: 0, // Price of the selected package
    packageDetails: {
      hours: 4 // Default session duration in hours
    },
    reference: `BK${Math.random().toString(36).substr(2, 9).toUpperCase()}` // Generate unique booking reference
  });

  // Definition of all steps in the booking process with their IDs and titles
  const steps = [
    { id: 1, title: 'Package' }, // First step - package selection
    { id: 2, title: 'Date & Time' }, // Second step - date and time selection
    { id: 3, title: 'Details' }, // Third step - customer details entry
    { id: 4, title: 'Review' }, // Fourth step - booking review and payment
    { id: 5, title: 'Confirmation' } // Final step - booking confirmation
  ];

  // Function to move to the next step in the booking process
  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length)); // Increase step but don't exceed max steps
  };

  // Function to go back to the previous step in the booking process
  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1)); // Decrease step but don't go below step 1
  };

  // Function to update the booking data with new information (merges with existing data)
  const updateBookingData = (data) => {
    setBookingData(prev => ({ ...prev, ...data })); // Merge new data with existing booking data
  };

  // Function called when payment is complete to finalize booking and move to confirmation
  const handleBookingComplete = (paymentData) => {
    updateBookingData(paymentData); // Add payment information to booking data
    handleNext(); // Advance to the confirmation step
  };

  // Error handling - if there's an error, render a simplified error page
  if (bookingError) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#111827] py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="w-full max-w-md sm:max-w-lg md:max-w-xl">
            <div className="bg-red-500/20 border border-red-500 text-red-100 p-4 sm:p-6 rounded shadow-lg">
              <h2 className="text-lg sm:text-xl font-bold">An error occurred</h2>
              <p className="mt-2 text-sm sm:text-base">{bookingError}</p>
              <button 
                onClick={() => setBookingError(null)} // Clear error and allow user to try again
                className="mt-4 px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 text-white text-sm sm:text-base rounded hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
        <FooterComp />
      </>
    );
  }

  // Main render - booking flow interface with appropriate step component
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#111827] py-10 sm:py-14 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-6 sm:mb-8">
            Book Your Session
          </h1>
          
          {/* Progress Steps - show step indicator for steps 1-4 but not for confirmation */}
          {currentStep < 5 && (
            <div className="px-2 sm:px-4">
              <BookingSteps steps={steps.slice(0, 4)} currentStep={currentStep} />
            </div>
          )}

          {/* Step Content - conditionally render the appropriate component based on current step */}
          <div className="mt-6 sm:mt-8 max-w-3xl mx-auto bg-gray-900/50 rounded-lg p-4 sm:p-6 md:p-8">
            {currentStep === 1 && (
              <PackageSelection 
                onNext={handleNext} // Function to proceed to next step
                updateData={updateBookingData} // Function to update central booking data
                data={bookingData} // Current booking data to pre-fill any fields
              />
            )}
            {currentStep === 2 && (
              <DateTimeSelection 
                onNext={handleNext} // Function to proceed to next step
                onBack={handleBack} // Function to go back to previous step
                updateData={updateBookingData} // Function to update central booking data
                data={bookingData} // Current booking data to pre-fill any fields
              />
            )}
            {currentStep === 3 && (
              <CustomerDetails 
                onNext={handleNext} // Function to proceed to next step
                onBack={handleBack} // Function to go back to previous step
                updateData={updateBookingData} // Function to update central booking data
                data={bookingData} // Current booking data to pre-fill any fields
              />
            )}
            {currentStep === 4 && (
              <BookingSummary 
                onBack={handleBack} // Function to go back to previous step
                onComplete={handleBookingComplete} // Function to call when payment is complete
                data={bookingData} // Current booking data to display for review
              />
            )}
            {currentStep === 5 && (
              <BookingConfirmation bookingData={bookingData} /> // Final confirmation showing booking success
            )}
          </div>
        </div>
      </main>
      <FooterComp />
    </>
  );
}

export default Booking; // Export the component for use in routing