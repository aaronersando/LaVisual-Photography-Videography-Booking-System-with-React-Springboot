/**
 * Booking Summary Component
 * 
 * This component handles the final step of the booking process where users review their booking details,
 * select payment options, and complete their booking by uploading payment proof.
 * 
 * Key features:
 * - Displays a comprehensive summary of the booking (package, date, time, customer details)
 * - Allows users to choose between full payment or 50% down payment
 * - Provides GCash payment integration with QR code scanning
 * - Handles payment proof screenshot upload with preview functionality
 * - Processes the booking submission to the backend API
 * - Sends confirmation emails with booking details
 * - Handles image compression for efficient storage and transmission
 * - Implements responsive design for all screen sizes
 * - Provides detailed error handling and loading states
 * 
 * The component has two main views:
 * 1. Initial view: Shows booking summary and payment selection
 * 2. Payment proof upload view: Shows QR code and allows screenshot upload
 * 
 * This component is the final step before the booking confirmation is displayed to the user.
 */

import { useState, useRef } from 'react'; // Import React hooks for state management and refs
import emailjs from '@emailjs/browser'; // Import emailjs for sending confirmation emails
import BookingService from '../service/BookingService'; // Import service for API calls
import qrCode from '../../assets/booking/OngleoQR.webp' // Import GCash QR code image

function BookingSummary({ onBack, data, onComplete }) {
  // Payment method state - currently only GCash is implemented
  const [paymentMethod, setPaymentMethod] = useState('gcash');
  // Payment type state - 'full' for full payment, 'down' for down payment
  const [paymentType, setPaymentType] = useState('');
  // State to store customer's GCash number
  const [gcashNumber, setGcashNumber] = useState('');
  // Loading state for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Error state to display any issues during submission
  const [error, setError] = useState(null);
  
  // State for file upload functionality
  const [showUploadStep, setShowUploadStep] = useState(false); // Controls which view is displayed
  const [paymentProofFile, setPaymentProofFile] = useState(null); // Stores the uploaded file
  const [uploadError, setUploadError] = useState(null); // Stores upload-specific errors
  const [previewUrl, setPreviewUrl] = useState(null); // Stores the image preview URL
  const fileInputRef = useRef(null); // Reference to the file input element

  // Helper function to calculate 50% down payment amount
  const calculateDownPayment = () => {
    return data.price * 0.5; // 50% down payment
  };

  // Handler for when user selects a file to upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setPaymentProofFile(file); // Store the file for later submission
    
    // Create a preview of the file
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result); // Set the data URL as preview
    };
    reader.readAsDataURL(file); // Read the file as data URL
  };

  // Main function to handle the final submission with payment proof
  const handleFileUploadSubmit = async () => {
    setIsSubmitting(true); // Start loading state
    setError(null); // Clear any previous errors
    
    try {
      console.log("Uploading payment proof and creating booking...");
      
      // Create form data for multipart/form-data submission
      const formData = new FormData();
      
      // Add the payment proof file to form data
      formData.append('proofFile', paymentProofFile);
      
      // Calculate final payment amount based on selected payment type
      const paymentAmount = paymentType === 'full' ? data.price : calculateDownPayment();
      
      // Calculate booking duration in hours
      const startHour = parseInt(data.timeRange?.startTime?.split(':')[0] || 0);
      const endHour = parseInt(data.timeRange?.endTime?.split(':')[0] || 0);
      const bookingHours = endHour - startHour;
      
      // Prepare complete booking data object
      const bookingData = {
        guestName: data.customerDetails.name,
        guestEmail: data.customerDetails.email,
        guestPhone: data.customerDetails.phone,
        bookingDate: data.date,
        bookingTimeStart: data.timeRange?.startTime,
        bookingTimeEnd: data.timeRange?.endTime,
        bookingHours: bookingHours > 0 ? bookingHours : data.packageDetails.hours,
        location: data.customerDetails.location,
        categoryName: data.category,
        packageName: data.package,
        packagePrice: data.price,
        specialRequests: data.customerDetails.notes || '',
        bookingReference: data.reference,
        paymentType: paymentType === 'full' ? 'FULL' : 'DOWNPAYMENT',
        paymentMethod: 'GCASH',
        amount: paymentAmount,
        gcashNumber: gcashNumber
      };
      
      // Add booking data as JSON string to form data
      formData.append('bookingData', JSON.stringify(bookingData));
      
      console.log("Creating booking with data:", bookingData);
      
      // Send API request to create booking with payment proof
      const bookingResponse = await fetch('http://localhost:8080/api/bookings/with-proof', {
        method: 'POST',
        body: formData
        // Don't set Content-Type header - browser will set it correctly with boundary
      });
      
      // Handle HTTP error responses
      if (!bookingResponse.ok) {
        throw new Error(`Server returned ${bookingResponse.status}: ${bookingResponse.statusText}`);
      }
      
      // Parse the response JSON
      const bookingResult = await bookingResponse.json();
      console.log("Booking creation result:", bookingResult);
      
      // Prepare email parameters for confirmation email
      const emailParams = {
        // Basic information
        name: data.customerDetails.name,
        email: data.customerDetails.email,
        phone: data.customerDetails.phone,
        location: data.customerDetails.location,
        package: data.package,
        category: data.category,
        
        // Booking details
        date: new Date(data.date).toLocaleDateString(),
        startTime: formatTime(data.timeRange?.startTime || ''),
        endTime: formatTime(data.timeRange?.endTime || ''),
        reference: bookingResult.data?.bookingReference || data.reference,
        specialRequests: data.customerDetails.notes || 'None',
        
        // Payment details
        paymentType: paymentType === 'full' ? 'Full Payment' : 'Down Payment',
        paymentMethod: 'GCash',
        accountNumber: gcashNumber,
        paymentAmount: paymentAmount.toLocaleString(),
        hasPaymentProof: "true"
      };
      
      // Try to send confirmation email with compressed image
      try {
        if (paymentProofFile) {
          // Compress the image for email attachment
          const tinyImage = await compressImage(paymentProofFile, 300, 0.4);
          const imageBase64 = tinyImage.split(',')[1]; // Extract base64 data
          emailParams.paymentProofImage = imageBase64; // Add to email params
        }
        
        // Send email with EmailJS service
        await emailjs.send('service_cs4kvtp', 'template_j6uer9r', emailParams, 'XEOTxlS2BnBaqReO4');
      } catch (emailError) {
        console.error('Error sending email with image:', emailError);
        
        // If sending with image fails, try again without the image
        delete emailParams.paymentProofImage;
        try {
          await emailjs.send('service_cs4kvtp', 'template_j6uer9r', emailParams, 'XEOTxlS2BnBaqReO4');
        } catch (fallbackError) {
          console.error('Error sending email without image:', fallbackError);
        }
      }
      
      if (bookingResult.success) {
        // If booking was successful, prepare final data for the confirmation page
        const completedBookingData = {
          ...data,
          paymentMethod: 'gcash',
          paymentType,
          paymentAmount,
          bookingId: bookingResult.data.bookingId,
          reference: bookingResult.data.bookingReference || data.reference,
          paymentProofUploaded: true,
          paymentProof: bookingResult.data.paymentProof
        };
        
        // Call parent component's completion handler with final data
        onComplete(completedBookingData);
      } else {
        // If booking API returned an error
        setError("Failed to create booking: " + bookingResult.message);
      }
    } catch (error) {
      // Handle any exceptions during the process
      console.error("Error during booking submission:", error);
      setError("Error: " + error.message);
    } finally {
      // Always reset loading state
      setIsSubmitting(false);
    }
  };

  // Handler for the initial form submission 
  const handleInitialSubmit = (e) => {
    e.preventDefault();
    setShowUploadStep(true); // Move to payment proof upload step
  };

  // Helper function to compress images before sending
  const compressImage = (file, maxWidth, quality = 0.7) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          // Create canvas for image manipulation
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Calculate new dimensions to maintain aspect ratio
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            const ratio = maxWidth / width;
            width = maxWidth;
            height = height * ratio;
          }
          
          // Resize image using canvas
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert canvas to compressed data URL
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
      };
    });
  };

  // Helper function to format time from 24-hour to 12-hour format
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hour] = timeString.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${hour12}:00 ${ampm}`;
  };

  // CONDITIONAL RENDERING: If we're on the file upload step (for GCash)
  if (showUploadStep) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 sm:p-5 md:p-6">
        <h2 className="text-lg sm:text-xl md:text-2xl text-white mb-4 sm:mb-6">Payment Proof Upload</h2>
        
        <div className="bg-gray-700 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
          <h3 className="font-semibold text-base sm:text-lg text-white mb-3 sm:mb-4">GCash Payment</h3>
          <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4">
            Please scan the QR code below to make your payment of ₱{(paymentType === 'full' ? data.price : calculateDownPayment()).toLocaleString()}
          </p>
          
          {/* QR Code Display */}
          <div className="bg-white p-3 sm:p-4 rounded-lg flex justify-center mb-3 sm:mb-4">
            <img 
              src={qrCode} 
              alt="GCash QR Code" 
              className="w-36 sm:w-40 md:w-48 max-w-full"
            />
          </div>
          
          {/* Upload Section */}
          <div className="mt-4 sm:mt-6">
            <h4 className="text-sm sm:text-base font-medium text-gray-300 mb-2">
              Upload Payment Screenshot
            </h4>
            <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
              After completing your payment, please upload a screenshot as proof of payment.
            </p>
            
            <div className="space-y-3 sm:space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="block w-full text-xs sm:text-sm text-gray-400
                  file:mr-3 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4
                  file:rounded file:border-0
                  file:text-xs sm:file:text-sm file:font-semibold
                  file:bg-purple-600 file:text-white
                  hover:file:bg-purple-700
                  file:cursor-pointer cursor-pointer"
              />
              
              {/* Show image preview if a file is selected */}
              {paymentProofFile && (
                <div className="mt-3 sm:mt-4">
                  <h5 className="text-xs sm:text-sm text-gray-300 mb-2">Preview:</h5>
                  <div className="border border-gray-600 rounded-lg p-1.5 sm:p-2 bg-gray-700">
                    <img 
                      src={URL.createObjectURL(paymentProofFile)} 
                      alt="Payment Proof Preview" 
                      className="w-full max-h-32 sm:max-h-48 object-contain rounded"
                    />
                  </div>
                </div>
              )}
              
              {/* Show upload error if any */}
              {uploadError && (
                <div className="text-red-500 text-xs sm:text-sm mt-2">
                  {uploadError}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-red-500/20 border border-red-500 text-red-100 rounded">
            <p className="flex items-center text-xs sm:text-sm">
              <i className="fa fa-exclamation-circle w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0" aria-hidden="true"></i>
              {error}
            </p>
          </div>
        )}
        
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-4 sm:mt-6">
          <button
            onClick={() => setShowUploadStep(false)} // Return to payment selection view
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-white border-[#4B5563] border-2 hover:bg-gray-700 rounded text-sm sm:text-base"
            disabled={isSubmitting}
          >
            Back
          </button>
          <button
            onClick={handleFileUploadSubmit} // Submit the booking with payment proof
            disabled={!paymentProofFile || isSubmitting} // Disable if no file or already submitting
            className={`px-3 py-1.5 sm:px-4 sm:py-2 ${isSubmitting ? 'bg-purple-700 cursor-wait' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded disabled:opacity-50 text-sm sm:text-base`}
          >
            {isSubmitting ? 'Processing...' : 'Complete Booking'}
          </button>
        </div>
      </div>
    );
  }

  // MAIN RENDER: Payment selection and booking review view
  return (
    <div className="bg-gray-800 rounded-lg p-4 sm:p-5 md:p-6">
      <h2 className="text-lg sm:text-xl md:text-2xl text-white mb-4 sm:mb-6">Review & Payment</h2>
      
      {/* Booking Summary Section */}
      <div className="space-y-3 sm:space-y-4 text-white mb-6 sm:mb-8">
        <div className="bg-gray-700 p-3 sm:p-4 rounded-lg">
          <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Booking Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm sm:text-base">
              <span>Package:</span>
              <span className="font-medium">{data.package}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span>Category:</span>
              <span className="font-medium">{data.category}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span>Date:</span>
              <span className="font-medium">
                {new Date(data.date).toLocaleDateString()} 
              </span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span>Time:</span>
              <span className="font-medium">
                {data.timeRange 
                  ? `${formatTime(data.timeRange.startTime)} - ${formatTime(data.timeRange.endTime)}`
                  : 'Not selected'
                }
              </span>
            </div>
            <div className="flex justify-between text-base sm:text-lg font-semibold text-purple-400 mt-3 sm:mt-4">
              <span>Total Amount:</span>
              <span>₱{data.price.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Customer Details Section */}
        <div className="bg-gray-700 p-3 sm:p-4 rounded-lg">
          <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Customer Details</h3>
          <div className="space-y-1.5 sm:space-y-2 text-sm sm:text-base">
            <p><span className="text-gray-400">Name:</span> {data.customerDetails.name}</p>
            <p><span className="text-gray-400">Email:</span> {data.customerDetails.email}</p>
            <p><span className="text-gray-400">Phone:</span> {data.customerDetails.phone}</p>
            <p><span className="text-gray-400">Location:</span> {data.customerDetails.location}</p>
            {data.customerDetails.notes && (
              <p><span className="text-gray-400">Requests:</span> {data.customerDetails.notes}</p>
            )}
          </div>
        </div>

        {/* Payment Options Section */}
        <div className="bg-gray-700 p-3 sm:p-4 rounded-lg">
          <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Payment Options</h3>
          
          {/* Payment Type Selection - Full vs Down Payment */}
          <div className="mb-3 sm:mb-4">
            <h4 className="text-xs sm:text-sm text-gray-400 mb-2">Select Payment Type</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              <button
                type="button"
                onClick={() => setPaymentType('full')} // Set full payment option
                className={`p-2 sm:p-3 rounded-lg border ${
                  paymentType === 'full'
                    ? 'border-purple-500 bg-purple-500/20' // Active state
                    : 'border-gray-600 hover:border-purple-500' // Inactive state
                }`}
              >
                <div className="text-xs sm:text-sm">Full Payment</div>
                <div className="text-sm sm:text-lg font-semibold">₱{data.price.toLocaleString()}</div>
              </button>
              <button
                type="button"
                onClick={() => setPaymentType('down')} // Set down payment option
                className={`p-2 sm:p-3 rounded-lg border ${
                  paymentType === 'down'
                    ? 'border-purple-500 bg-purple-500/20' // Active state
                    : 'border-gray-600 hover:border-purple-500' // Inactive state
                }`}
              >
                <div className="text-xs sm:text-sm">50% Down Payment</div>
                <div className="text-sm sm:text-lg font-semibold">₱{calculateDownPayment().toLocaleString()}</div>
              </button>
            </div>
          </div>

          {/* GCash Number Input - Only shown after payment type is selected */}
          {paymentType && (
            <div className="mb-3 sm:mb-4">
              <h4 className="text-xs sm:text-sm text-gray-400 mb-2">GCash Payment</h4>
              <div>
                <input
                  type="text"
                  placeholder="GCash Number (e.g., 09XX-XXX-XXXX)"
                  className="w-full p-2 sm:p-2.5 text-sm sm:text-base bg-gray-600 rounded border border-gray-500"
                  value={gcashNumber}
                  onChange={(e) => setGcashNumber(e.target.value)}
                  required
                />
              </div>
            </div>
          )}
          
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-red-500/20 border border-red-500 text-red-100 rounded">
          <p className="flex items-center text-xs sm:text-sm">
            <i className="fa fa-exclamation-circle w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0" aria-hidden="true"></i>
            {error}
          </p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4 sm:mt-6">
        <button
          onClick={onBack} // Go back to previous booking step
          className="px-3 py-1.5 sm:px-4 sm:py-2 text-white border-[#4B5563] border-2 hover:bg-gray-700 rounded text-sm sm:text-base"
          disabled={isSubmitting}
        >
          Back
        </button>
        <button
          onClick={handleInitialSubmit} // Move to payment proof upload step
          disabled={!paymentType || isSubmitting || !gcashNumber} // Disable if required fields are missing
          className={`px-3 py-1.5 sm:px-4 sm:py-2 ${isSubmitting ? 'bg-purple-700 cursor-wait' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded disabled:opacity-50 text-sm sm:text-base`}
        >
          {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
        </button>
      </div>
    </div>
  );
}

export default BookingSummary; // Export component for use in booking flow