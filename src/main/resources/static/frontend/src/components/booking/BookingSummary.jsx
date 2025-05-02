import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import BookingService from '../service/BookingService';
import qrCode from '../../assets/booking/OngleoQR.webp'

function BookingSummary({ onBack, data, onComplete }) {
  const [paymentMethod, setPaymentMethod] = useState('gcash');
  const [paymentType, setPaymentType] = useState('');
  const [gcashNumber, setGcashNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // New states for file upload
  const [showUploadStep, setShowUploadStep] = useState(false);
  const [paymentProofFile, setPaymentProofFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  const calculateDownPayment = () => {
    return data.price * 0.5; // 50% down payment
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // Only accept image files
    if (file && file.type.startsWith('image/')) {
      setPaymentProofFile(file);
      setUploadError(null);
    } else {
      setPaymentProofFile(null);
      setUploadError("Please select an image file (JPEG, PNG, etc.)");
    }
  };

  // Step 1: Initial payment details submission
  const handleInitialSubmit = (e) => {
    e.preventDefault();
    setShowUploadStep(true);
  };

  
  const compressImage = (file, maxWidth, quality = 0.7) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          // Create canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Calculate new dimensions
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            const ratio = maxWidth / width;
            width = maxWidth;
            height = height * ratio;
          }
          
          // Resize image
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          // Get compressed image as a data URL
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
      };
    });
  };

  // Step 2: Final submission after upload (or direct for bank transfers)
const handleFinalSubmit = async () => {
  setIsSubmitting(true);
  setError(null);
  
  const paymentAmount = paymentType === 'full' ? data.price : calculateDownPayment();
  
  try {
    // Calculate booking hours from time range
    const startHour = parseInt(data.timeRange?.startTime?.split(':')[0] || 0);
    const endHour = parseInt(data.timeRange?.endTime?.split(':')[0] || 0);
    const bookingHours = endHour - startHour;

    // Prepare data for backend API
    const bookingRequest = {
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
      
      // Payment details
      paymentType: paymentType === 'full' ? 'FULL' : 'DOWNPAYMENT',
      paymentMethod: 'GCASH',
      amount: paymentAmount,
      gcashNumber: gcashNumber
    };
    
    // Make API call to create booking
    const response = await BookingService.createBooking(bookingRequest, paymentProofFile);

    // Now that we have the response, prepare email parameters
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
      reference: response.data?.bookingReference || data.reference,
      specialRequests: data.customerDetails.notes || 'None',
      
      // Payment details
      paymentType: paymentType === 'full' ? 'Full Payment' : 'Down Payment',
      paymentMethod: 'GCash',
      accountNumber: gcashNumber,
      paymentAmount: paymentAmount.toLocaleString(),
      
      // Remove problematic fields if any
      hasPaymentProof: paymentProofFile ? "true" : "false"
    };

    // Send email without attachment first to test if the template works
    try {
      // For small images only - larger ones will cause the 413 error
      if (paymentProofFile) {
        // Try with a much smaller image
        const tinyImage = await compressImage(paymentProofFile, 300, 0.4); // Smaller width, lower quality
        // Remove the data:image/jpeg;base64, prefix from the data URL
        const imageBase64 = tinyImage.split(',')[1];
        emailParams.paymentProofImage = imageBase64;
      }
      
      await emailjs.send('service_cs4kvtp', 'template_j6uer9r', emailParams, 'XEOTxlS2BnBaqReO4');
    } catch (error) {
      console.error('Error sending email:', error);
      
      // If it fails, try again without the image
      delete emailParams.paymentProofImage;
      try {
        await emailjs.send('service_cs4kvtp', 'template_j6uer9r', emailParams, 'XEOTxlS2BnBaqReO4');
      } catch (secondError) {
        console.error('Error sending email without image:', secondError);
      }
    }
    
    
    if (response.success) {
      // Add booking ID and payment info to the data
      const completedBookingData = {
        ...data,
        paymentMethod: 'gcash',
        paymentType,
        paymentAmount,
        bookingId: response.data.bookingId,
        paymentId: response.data.paymentId,
        gcashNumber: gcashNumber,
        reference: response.data.bookingReference,
        paymentProofUploaded: paymentProofFile !== null,
        paymentProof: response.data.paymentProof 
      };
      
      // Complete booking process
      onComplete(completedBookingData);
    } else {
      setError(response.message || 'Failed to save booking');
      setShowUploadStep(false); // Go back to payment selection on error
    }
  } catch (error) {
    console.error('Booking error:', error);
    setError(error.message || 'Failed to process booking. Please try again.');
    setShowUploadStep(false); // Go back to payment selection on error
  } finally {
    setIsSubmitting(false);
  }
};

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hour] = timeString.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum % 12 || 12;
    return `${hour12}:00 ${ampm}`;
  };

  // If we're on the file upload step (for GCash)
  if (showUploadStep) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl text-white mb-6">Payment Proof Upload</h2>
        
        <div className="bg-gray-700 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-lg text-white mb-4">GCash Payment</h3>
          <p className="text-gray-300 mb-4">
            Please scan the QR code below to make your payment of ₱{(paymentType === 'full' ? data.price : calculateDownPayment()).toLocaleString()}
          </p>
          
          {/* QR Code Display */}
          <div className="bg-white p-4 rounded-lg flex justify-center mb-4">
            <img 
              src={qrCode} 
              alt="GCash QR Code" 
              className="max-w-[200px]"
            />
          </div>
          
          {/* Upload Section */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-300 mb-2">
              Upload Payment Screenshot
            </h4>
            <p className="text-sm text-gray-400 mb-4">
              After completing your payment, please upload a screenshot as proof of payment.
            </p>
            
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="block w-full text-sm text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded file:border-0
                  file:text-sm file:font-semibold
                  file:bg-purple-600 file:text-white
                  hover:file:bg-purple-700
                  file:cursor-pointer cursor-pointer"
              />
              
              {paymentProofFile && (
                <div className="mt-4">
                  <h5 className="text-sm text-gray-300 mb-2">Preview:</h5>
                  <div className="border border-gray-600 rounded-lg p-2 bg-gray-700">
                    <img 
                      src={URL.createObjectURL(paymentProofFile)} 
                      alt="Payment Proof Preview" 
                      className="w-full max-h-48 object-contain rounded"
                    />
                  </div>
                </div>
              )}
              
              {uploadError && (
                <div className="text-red-500 text-sm mt-2">
                  {uploadError}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-100 rounded">
            <p className="flex items-center">
              <i className="fa fa-exclamation-circle w-5 h-5 mr-2 flex-shrink-0" aria-hidden="true"></i>
              {error}
            </p>
          </div>
        )}
        
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setShowUploadStep(false)}
            className="px-4 py-2 text-white border-[#4B5563] border-2 hover:bg-gray-700 rounded"
            disabled={isSubmitting}
          >
            Back
          </button>
          <button
            onClick={handleFinalSubmit}
            disabled={!paymentProofFile || isSubmitting}
            className={`px-4 py-2 ${isSubmitting ? 'bg-purple-700 cursor-wait' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded disabled:opacity-50`}
          >
            {isSubmitting ? 'Processing...' : 'Complete Booking'}
          </button>
        </div>
      </div>
    );
  }

  // Original payment selection view
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl text-white mb-6">Review & Payment</h2>
      
      {/* Booking Summary */}
      <div className="space-y-4 text-white mb-8">
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-4">Booking Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Package:</span>
              <span className="font-medium">{data.package}</span>
            </div>
            <div className="flex justify-between">
              <span>Category:</span>
              <span className="font-medium">{data.category}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span className="font-medium">
                {new Date(data.date).toLocaleDateString()} 
              </span>
            </div>
            <div className="flex justify-between">
              <span>Time:</span>
              <span className="font-medium">
                {data.timeRange 
                  ? `${formatTime(data.timeRange.startTime)} - ${formatTime(data.timeRange.endTime)}`
                  : 'Not selected'
                }
              </span>
            </div>
            <div className="flex justify-between text-lg font-semibold text-purple-400 mt-4">
              <span>Total Amount:</span>
              <span>₱{data.price.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-4">Customer Details</h3>
          <div className="space-y-2">
            <p><span className="text-gray-400">Name:</span> {data.customerDetails.name}</p>
            <p><span className="text-gray-400">Email:</span> {data.customerDetails.email}</p>
            <p><span className="text-gray-400">Phone:</span> {data.customerDetails.phone}</p>
            <p><span className="text-gray-400">Location:</span> {data.customerDetails.location}</p>
            {data.customerDetails.notes && (
              <p><span className="text-gray-400">Requests:</span> {data.customerDetails.notes}</p>
            )}
          </div>
        </div>

        {/* Payment Options */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-4">Payment Options</h3>
          
          {/* Payment Type Selection */}
          <div className="mb-4">
            <h4 className="text-sm text-gray-400 mb-2">Select Payment Type</h4>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentType('full')}
                className={`p-3 rounded-lg border ${
                  paymentType === 'full'
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-gray-600 hover:border-purple-500'
                }`}
              >
                <div className="text-sm">Full Payment</div>
                <div className="text-lg font-semibold">₱{data.price.toLocaleString()}</div>
              </button>
              <button
                type="button"
                onClick={() => setPaymentType('down')}
                className={`p-3 rounded-lg border ${
                  paymentType === 'down'
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-gray-600 hover:border-purple-500'
                }`}
              >
                <div className="text-sm">50% Down Payment</div>
                <div className="text-lg font-semibold">₱{calculateDownPayment().toLocaleString()}</div>
              </button>
            </div>
          </div>

          {/* Payment Method Selection */}
          {paymentType && (
            <div className="mb-4">
              <h4 className="text-sm text-gray-400 mb-2">GCash Payment</h4>
              <div>
                <input
                  type="text"
                  placeholder="GCash Number (e.g., 09XX-XXX-XXXX)"
                  className="w-full p-2 bg-gray-600 rounded border border-gray-500"
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
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-100 rounded">
          <p className="flex items-center">
            <i className="fa fa-exclamation-circle w-5 h-5 mr-2 flex-shrink-0" aria-hidden="true"></i>
            {error}
          </p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-4 py-2 text-white border-[#4B5563] border-2 hover:bg-gray-700 rounded"
          disabled={isSubmitting}
        >
          Back
        </button>
        <button
          onClick={handleInitialSubmit}
          disabled={!paymentType || isSubmitting || !gcashNumber}
          className={`px-4 py-2 ${isSubmitting ? 'bg-purple-700 cursor-wait' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded disabled:opacity-50`}
        >
          {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
        </button>
      </div>
    </div>
  );
}

export default BookingSummary;