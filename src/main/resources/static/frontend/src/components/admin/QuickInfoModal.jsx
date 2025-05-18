/**
 * Quick Info Modal Component
 * 
 * This component creates a modal popup that displays a summary of booking information.
 * It's used in the admin dashboard to show a quick overview of bookings for a selected
 * date in the calendar view without needing to open the full booking details screen.
 * 
 * Key features:
 * - Lightweight modal overlay with semi-transparent background
 * - Scrollable content area for handling multiple bookings
 * - Clear close button in header and footer
 * - Prevents event propagation to avoid accidental closing when clicking inside
 * - Responsive design that works on different screen sizes
 * 
 * The modal takes an array of booking objects and displays their key information
 * (event type, client name, and time) in a condensed, easy-to-read format.
 */
import { faX } from "@fortawesome/free-solid-svg-icons"; // Import the X icon for the close button
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesome component

function QuickInfoModal({ bookings, onClose }) {
  return (
    // Modal overlay - covers the entire screen with a semi-transparent black background
    // The onClick handler closes the modal when clicking outside the content area
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      // Modal content container - prevents clicks from bubbling to the overlay (which would close the modal)
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        {/* Header section with title and close button */}
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Booking Details</h2>
          {/* Close button in the top-right corner */}
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FontAwesomeIcon icon={faX} className='h-6 w-6 text-lg'/> {/* X icon */}
          </button>
        </div>

        {/* Content section - scrollable if content exceeds the max height */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Map through each booking in the array and create a card for it */}
          {bookings.map((booking, index) => (
            <div key={index} className="mb-6 p-4 bg-gray-700 rounded-lg">
              {/* Booking type/package name */}
              <h3 className="text-lg font-medium text-white mb-2">{booking.clientEvent}</h3>
              <div className="space-y-2 text-white">
                {/* Client name with gray label */}
                <p><span className="text-gray-400">Client:</span> {booking.client}</p>
                {/* Booking time range with gray label */}
                <p><span className="text-gray-400">Time:</span> {booking.timeRange}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer section with close button */}
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

export default QuickInfoModal; // Export the component for use in other files