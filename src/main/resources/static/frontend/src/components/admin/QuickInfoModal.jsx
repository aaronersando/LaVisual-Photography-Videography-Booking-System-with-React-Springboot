function QuickInfoModal({ bookings, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Booking Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {bookings.map((booking, index) => (
            <div key={index} className="mb-6 p-4 bg-gray-700 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-2">{booking.clientEvent}</h3>
              <div className="space-y-2 text-white">
                <p><span className="text-gray-400">Client:</span> {booking.client}</p>
                <p><span className="text-gray-400">Time:</span> {booking.timeRange}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuickInfoModal;