import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

function BookingConfirmation({ bookingData }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    if (bookingData.paymentProof) {
      const img = new Image();
      img.src = `/api/files/download/${bookingData.paymentProof}`;
      img.onload = () => {
        setImageLoaded(true);
        setImageSrc(img.src);
      };
      img.onerror = () => {
        setImageSrc('/images/payment-placeholder.png');
      };
    }
  }, [bookingData.paymentProof]);

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hour] = timeString.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum % 12 || 12;
    return `${hour12}:00 ${ampm}`;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 sm:p-5 md:p-6 text-center">
      <div className="mb-4 sm:mb-6">
        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <FontAwesomeIcon icon={faCheck} className='text-xl sm:text-2xl md:text-3xl'/>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Thank You For Booking!</h2>
        <p className="text-sm sm:text-base text-gray-400">Your booking has been confirmed</p>
      </div>

      <div className="bg-gray-700 p-3 sm:p-4 rounded-lg text-left mb-4 sm:mb-6">
        <h3 className="font-semibold text-base sm:text-lg text-white mb-3 sm:mb-4">Booking Details</h3>
        <div className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-gray-300">
          <p className="bg-purple-500/10 p-2 rounded border border-purple-500/30">
            <span className="font-medium">Booking Reference:</span> 
            <span className="text-white text-base sm:text-lg ml-1 sm:ml-2">{bookingData.reference}</span>
          </p>
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

      {/* Payment Proof Section */}
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

      <div className="text-gray-400 text-xs sm:text-sm">
        <p>A confirmation email has been sent to {bookingData.customerDetails.email}</p>
        <p className="mt-1 sm:mt-2">For any questions, please contact us at lavisualmedia@gmail.com</p>
      </div>

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

export default BookingConfirmation;