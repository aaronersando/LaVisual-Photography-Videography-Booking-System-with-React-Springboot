/**
 * Booking Confirmation Component
 * 
 * This component displays a success page after a customer completes their booking process.
 * It shows a summary of all booking details, including reference number, selected package,
 * date/time, payment information, and optionally the payment proof image.
 * 
 * Key features:
 * - Displays a success message with a checkmark icon
 * - Shows comprehensive booking details in a formatted layout
 * - Handles loading of payment proof image with fallback for errors
 * - Formats time values from 24-hour to 12-hour AM/PM format
 * - Provides a contact email and return to home button
 * - Fully responsive design with different styling for different screen sizes
 * 
 * This is the final step in the booking flow, and is shown after the user has
 * successfully submitted their booking information and payment.
 */

import React, { useState, useEffect } from 'react'; // Import React and hooks
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome component
import { faCheck } from '@fortawesome/free-solid-svg-icons'; // Import checkmark icon

function BookingConfirmation({ bookingData }) {
  // State to track if payment proof image has loaded successfully
  const [imageLoaded, setImageLoaded] = useState(false);
  // State to store the image source URL
  const [imageSrc, setImageSrc] = useState('');

  // Effect to handle loading the payment proof image when component mounts or bookingData changes
  useEffect(() => {
    if (bookingData.paymentProof) {
      const img = new Image(); // Create a new image object to preload
      img.src = `/api/files/download/${bookingData.paymentProof}`; // Set source to API endpoint
      img.onload = () => {
        // When image loads successfully, update states
        setImageLoaded(true);
        setImageSrc(img.src);
      };
      img.onerror = () => {
        // If image fails to load, use fallback image
        setImageSrc('/images/payment-placeholder.png');
      };
    }
  }, [bookingData.paymentProof]); // Only re-run if payment proof changes

  // Helper function to convert time from 24-hour format to 12-hour AM/PM format
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hour] = timeString.split(':'); // Extract hour from time string
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM'; // Determine AM/PM
    const hour12 = hourNum % 12 || 12; // Convert to 12-hour format (0 becomes 12)
    return `${hour12}:00 ${ampm}`;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 sm:p-5 md:p-6 text-center">
      {/* Success message with checkmark icon */}
      <div className="mb-4 sm:mb-6">
        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <FontAwesomeIcon icon={faCheck} className='text-xl sm:text-2xl md:text-3xl'/>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Thank You For Booking!</h2>
        <p className="text-sm sm:text-base text-gray-400">Your booking has been confirmed</p>
      </div>

      {/* Booking details section */}
      <div className="bg-gray-700 p-3 sm:p-4 rounded-lg text-left mb-4 sm:mb-6">
        <h3 className="font-semibold text-base sm:text-lg text-white mb-3 sm:mb-4">Booking Details</h3>
        <div className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-gray-300">
          {/* Highlighted booking reference */}
          <p className="bg-purple-500/10 p-2 rounded border border-purple-500/30">
            <span className="font-medium">Booking Reference:</span> 
            <span className="text-white text-base sm:text-lg ml-1 sm:ml-2">{bookingData.reference}</span>
          </p>
          {/* Regular booking details */}
          <p>Booking ID: <span className="text-white">{bookingData.bookingId}</span></p>
          <p>Package: <span className="text-white">{bookingData.package}</span></p>
          <p>Date: <span className="text-white">{new Date(bookingData.date).toLocaleDateString()}</span></p>
          <p>Time: <span className="text-white">
            {bookingData.timeRange 
              ? `${formatTime(bookingData.timeRange.startTime)} - ${formatTime(bookingData.timeRange.endTime)}`
              : 'Not selected'}
          </span></p>
          <p>Location: <span className="text-white">{bookingData.customerDetails.location}</span></p>
          <p>Amount Paid: <span className="text-purple-400">₱{bookingData.paymentAmount.toLocaleString()}</span></p>
          <p>Payment Method: <span className="text-white">GCash</span></p>
          <p>Payment Type: <span className="text-white">{bookingData.paymentType === 'full' ? 'Full Payment' : 'Down Payment'}</span></p>
        </div>
      </div>

      {/* Payment Proof Section - currently commented out but code is maintained for future use */}
      {/* {bookingData.paymentProofUploaded && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-600">
          <h4 className="font-medium text-base sm:text-lg text-white mb-2">Payment Proof</h4>
          <div className="bg-gray-600/50 p-3 sm:p-4 rounded">
            {!imageLoaded && <p className="text-gray-400 text-xs sm:text-sm">Loading image...</p>}
            {imageLoaded && (
              <img 
                src={imageSrc}
                alt="Payment Proof"
                className="w-full sm:max-w-md md:max-w-lg mx-auto rounded shadow-md"
                style={{ maxHeight: '40vh', objectFit: 'contain' }}
              />
            )}
          </div>
        </div>
      )} */}

      {/* Email confirmation and contact information */}
      <div className="text-gray-400 text-xs sm:text-sm">
        <p>A confirmation email has been sent to {bookingData.customerDetails.email}</p>
        <p className="mt-1 sm:mt-2">For any questions, please contact us at lavisualmedia@gmail.com</p>
      </div>

      {/* Return to home button */}
      <div className="mt-6 sm:mt-8">
        <a
          href="/"
          className="px-4 py-2 sm:px-6 sm:py-3 bg-purple-600 text-white text-sm sm:text-base rounded hover:bg-purple-700 inline-block"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
}

export default BookingConfirmation; // Export the component for use in other parts of the application