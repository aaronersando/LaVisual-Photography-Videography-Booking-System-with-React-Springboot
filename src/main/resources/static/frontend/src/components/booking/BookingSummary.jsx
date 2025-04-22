import { useState } from 'react';
import emailjs from '@emailjs/browser';
import BookingService from '../service/BookingService';

function BookingSummary({ onBack, data, onComplete }) {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const calculateDownPayment = () => {
    return data.price * 0.5; // 50% down payment
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
  
    const paymentAmount = paymentType === 'full' ? data.price : calculateDownPayment();
    
    try {
      // Prepare email parameters
      const emailParams = {
        name: data.customerDetails.name,
        email: data.customerDetails.email,
        phone: data.customerDetails.phone,
        location: data.customerDetails.location,
        package: data.package,
        category: data.category,
        date: new Date(data.date).toLocaleDateString(),
        startTime: formatTime(data.timeRange?.startTime || ''),
        endTime: formatTime(data.timeRange?.endTime || ''),
        paymentAmount: paymentAmount,
        paymentType: paymentType === 'full' ? 'Full Payment' : 'Down Payment',
        paymentMethod: paymentMethod === 'gcash' ? 'GCash' : 'Bank Transfer',
        accountNumber: cardDetails.number, 
      };
  
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
        
        // Payment details
        paymentType: paymentType === 'full' ? 'FULL' : 'DOWNPAYMENT',
        paymentMethod: paymentMethod.toUpperCase(),
        amount: paymentAmount,
        accountNumber: cardDetails.number
      };
  
      // Save booking to backend - REMOVE THE DUPLICATE CALL BELOW THIS TRY BLOCK
      const response = await BookingService.createBooking(bookingRequest);
      
      if (response.success) {
        // Add booking ID and payment info to the data
        const completedBookingData = {
          ...data,
          paymentMethod,
          paymentType,
          paymentAmount,
          bookingId: response.data.bookingId,
          paymentId: response.data.paymentId,
          reference: response.data.bookingReference || data.reference
        };
  
        // Send confirmation email
        await emailjs.send('service_cs4kvtp', 'template_j6uer9r', emailParams, 'XEOTxlS2BnBaqReO4');
        
        // Complete booking process
        onComplete(completedBookingData);
      } else {
        setError(response.message || 'Failed to save booking');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setError(error.message || 'Failed to process booking. Please try again.');
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
              <h4 className="text-sm text-gray-400 mb-2">Select Payment Method</h4>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('gcash')}
                  className={`p-3 rounded-lg border ${
                    paymentMethod === 'gcash'
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-gray-600 hover:border-purple-500'
                  }`}
                >
                  GCash
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank')}
                  className={`p-3 rounded-lg border ${
                    paymentMethod === 'bank'
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-gray-600 hover:border-purple-500'
                  }`}
                >
                  Bank Transfer
                </button>
              </div>
            </div>
          )}

          {/* Payment Details Form */}
          {paymentMethod && (
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder={paymentMethod === 'gcash' ? 'GCash Number' : 'Card Number'}
                  className="w-full p-2 bg-gray-600 rounded border border-gray-500"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
                  required
                />
              </div>
              {paymentMethod === 'bank' && (
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="p-2 bg-gray-600 rounded border border-gray-500"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                    required={paymentMethod === 'bank'}
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    className="p-2 bg-gray-600 rounded border border-gray-500"
                    value={cardDetails.cvc}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, cvc: e.target.value }))}
                    required={paymentMethod === 'bank'}
                  />
                </div>
              )}
            </form>
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
          onClick={handlePaymentSubmit}
          disabled={!paymentMethod || !paymentType || isSubmitting}
          className={`px-4 py-2 ${isSubmitting ? 'bg-purple-700 cursor-wait' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded disabled:opacity-50`}
        >
          {isSubmitting ? 'Processing...' : 'Confirm & Pay'}
        </button>
      </div>
    </div>
  );
}

export default BookingSummary;