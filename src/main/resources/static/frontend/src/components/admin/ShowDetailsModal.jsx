/**
 * Admin Details Modal Component
 * 
 * This component displays a modal dialog showing detailed information about an admin user.
 * It's used in the admin dashboard to view administrator information when clicking on an
 * admin entry in the Admin Accounts section. The modal displays basic information including
 * the admin's name (with avatar), email, and address in a clean, organized format.
 * 
 * The modal can be closed by:
 * - Clicking the X button in the top-right corner
 * - Clicking the Close button at the bottom
 * - Clicking anywhere outside the modal content area
 * 
 * Props:
 * - admin: Object containing admin details (name, email, city)
 * - onClose: Function to call when the modal should be closed
 */

import { useEffect } from "react"; // Import useEffect hook (though it's not used in this component)
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesome component
import { faX } from "@fortawesome/free-solid-svg-icons"; // Import X icon for close button

function ShowDetailsModal({ admin, onClose }) {
  return (
    // Modal overlay - covers entire screen with semi-transparent black background
    // The onClick handler closes the modal when clicking outside the content
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Modal content container - prevents clicks from bubbling to the overlay */}
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        {/* Header section with title and close button */}
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Admin Details</h2>
          {/* Close button in the top-right corner */}
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FontAwesomeIcon icon={faX}/>
          </button>
        </div>

        {/* Content section with admin information */}
        <div className="p-6 space-y-4">
          {/* Admin avatar and name section */}
          <div className="flex items-center space-x-4 mb-6">
            {/* Circular avatar with admin's first initial */}
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">{admin.name[0].toUpperCase()}</span>
            </div>
            {/* Admin name and role */}
            <div>
              <h3 className="text-xl font-medium text-white">{admin.name}</h3>
              <p className="text-gray-400">Administrator</p>
            </div>
          </div>

          {/* Admin contact details section */}
          <div className="space-y-3 text-white">
            {/* Email information with label */}
            <p>
              <span className="text-gray-400">Email:</span> {admin.email}
            </p>
            {/* Address information with label */}
            <p>
              <span className="text-gray-400">Address:</span> {admin.city}
            </p>
            {/* Phone number field removed */}
          </div>
        </div>

        {/* Footer section with close button */}
        <div className="px-6 py-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShowDetailsModal; // Export the component for use in other files