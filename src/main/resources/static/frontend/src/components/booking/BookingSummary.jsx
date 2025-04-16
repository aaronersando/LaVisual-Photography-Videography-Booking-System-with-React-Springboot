import { useState } from 'react';

function BookingSummary({ onBack, data, onComplete }) {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: ''
  });

  const calculateDownPayment = () => {
    return data.price * 0.5; // 50% down payment
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    // Add payment processing logic here
    onComplete({
      ...data,
      paymentMethod,
      paymentType,
      paymentAmount: paymentType === 'full' ? data.price : calculateDownPayment()
    });
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
              <span>Date & Time:</span>
              <span className="font-medium">
                {new Date(data.date).toLocaleDateString()} at {data.time}
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
            {data.customerDetails.notes && (
              <p><span className="text-gray-400">Notes:</span> {data.customerDetails.notes}</p>
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
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    className="p-2 bg-gray-600 rounded border border-gray-500"
                    value={cardDetails.cvc}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, cvc: e.target.value }))}
                  />
                </div>
              )}
            </form>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-4 py-2 text-white border-[#4B5563] border-2 hover:bg-gray-700 rounded"
        >
          Back
        </button>
        <button
          onClick={handlePaymentSubmit}
          disabled={!paymentMethod || !paymentType}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          Confirm & Pay
        </button>
      </div>
    </div>
  );
}

export default BookingSummary;