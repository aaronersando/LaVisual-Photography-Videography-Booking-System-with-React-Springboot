


function BookingConfirmation({ bookingData }) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 text-center">
      <div className="mb-6">
        <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Thank You For Booking!</h2>
        <p className="text-gray-400">Your booking has been confirmed</p>
      </div>

      <div className="bg-gray-700 p-4 rounded-lg text-left mb-6">
        <h3 className="font-semibold text-white mb-4">Booking Details</h3>
        <div className="space-y-2 text-gray-300">
          <p>Booking Reference: <span className="text-white">{bookingData.reference}</span></p>
          <p>Package: <span className="text-white">{bookingData.package}</span></p>
          <p>Date: <span className="text-white">{new Date(bookingData.date).toLocaleDateString()}</span></p>
          <p>Time: <span className="text-white">{bookingData.time}</span></p>
          <p>Amount Paid: <span className="text-purple-400">₱{bookingData.paymentAmount.toLocaleString()}</span></p>
        </div>
      </div>

      <div className="text-gray-400 text-sm">
        <p>A confirmation email has been sent to {bookingData.customerDetails.email}</p>
        <p className="mt-2">For any questions, please contact us at support@lavisual.com</p>
      </div>

      <div className="mt-8">
        <a
          href="/"
          className="px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 inline-block"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
}

export default BookingConfirmation;