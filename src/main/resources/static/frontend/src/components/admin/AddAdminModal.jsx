/**
 * Admin Creation Modal Component
 * 
 * This component renders a modal dialog that allows administrators to create new admin accounts.
 * It provides a form with fields for name, email, password, and address information.
 * 
 * The modal includes validation to ensure all required fields are completed before submission
 * and provides immediate visual feedback through the UI. When submitted, the form data is
 * passed to the parent component for processing.
 * 
 * This component is typically used in the Admin Accounts section of the admin dashboard
 * when the "Add Account" button is clicked.
 * 
 * Key features:
 * - Clean, responsive modal interface
 * - Form validation with required fields
 * - Dark theme styling consistent with the admin dashboard
 * - Click-outside behavior to dismiss the modal
 */

import { useState } from 'react'; // Import React useState hook for state management
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome component
import { faX } from '@fortawesome/free-solid-svg-icons'; // Import X icon for the close button

function AddAdminModal({ onClose, onAdd }) {
  // Initialize form state with empty values for all fields
  // The role is pre-set to 'ADMIN' as the default value
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    city: '',
    role: 'ADMIN' // Default role is ADMIN
  });

  // Handle input field changes
  // Updates the formData state while preserving other field values
  const handleChange = (e) => {
    const { name, value } = e.target; // Extract field name and new value
    setFormData(prev => ({
      ...prev, // Spread the previous state to maintain other field values
      [name]: value // Update only the changed field (using computed property name)
    }));
  };

  // Handle form submission
  // Prevents default form behavior and passes data to parent component
  const handleSubmit = (e) => {
    if (e) e.preventDefault(); // Prevent default form submission if event is provided
    onAdd(formData); // Pass the form data to parent component through onAdd prop
  };

  return (
    // Modal overlay - covers entire screen with semi-transparent background
    // The onClick handler closes the modal when clicking outside the content
    <div className="fixed inset-0 bg-black/50 mt-10 flex items-center justify-center p-4" onClick={onClose}>
      {/* Modal content container - prevents clicks from bubbling to the overlay */}
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        {/* Header section with title and close button */}
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Purple circular icon container with plus sign */}
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-3xl pb-2">+</span>
            </div>
            <h2 className="text-xl font-semibold text-white">Add New Admin</h2>
          </div>
          {/* Close button in the top-right corner */}
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FontAwesomeIcon icon={faX} className='h-6 w-6 text-lg'/>
          </button>
        </div>

        {/* Form section with input fields */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name input field */}
          <div>
            <label className="text-sm text-gray-400">Name</label>
            <input
              type="text"
              name="name" // Matches property name in formData state
              value={formData.name} // Controlled component tied to state
              onChange={handleChange} // Update state when value changes
              className="w-full mt-1 p-2 bg-gray-700 text-white rounded border border-gray-600"
              required // HTML5 validation - field cannot be empty
            />
          </div>

          {/* Email input field */}
          <div>
            <label className="text-sm text-gray-400">Email</label>
            <input
              type="email" // Email input type with built-in format validation
              name="email" // Matches property name in formData state
              value={formData.email} // Controlled component tied to state
              onChange={handleChange} // Update state when value changes
              className="w-full mt-1 p-2 bg-gray-700 text-white rounded border border-gray-600"
              required // HTML5 validation - field cannot be empty
            />
          </div>

          {/* Password input field */}
          <div>
            <label className="text-sm text-gray-400">Password</label>
            <input
              type="password" // Password input for hidden characters
              name="password" // Matches property name in formData state
              value={formData.password} // Controlled component tied to state
              onChange={handleChange} // Update state when value changes
              className="w-full mt-1 p-2 bg-gray-700 text-white rounded border border-gray-600"
              required // HTML5 validation - field cannot be empty
            />
          </div>

          {/* Address/City input field */}
          <div>
            <label className="text-sm text-gray-400">Address</label>
            <input
              type="text"
              name="city" // Matches property name in formData state
              value={formData.city} // Controlled component tied to state
              onChange={handleChange} // Update state when value changes
              className="w-full mt-1 p-2 bg-gray-700 text-white rounded border border-gray-600"
              required // HTML5 validation - field cannot be empty
            />
          </div>

          
        </form>

        {/* Footer section with action buttons */}
        <div className="px-6 py-4 border-t border-gray-700 flex justify-end space-x-4">
          {/* Cancel button - closes the modal */}
          <button
            onClick={onClose}
            className="px-4 py-2 text-white border border-gray-600 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
          {/* Submit button - creates the new admin account */}
          <button
            onClick={handleSubmit}
            disabled={Object.values(formData).some(value => 
              typeof value === 'string' && value.trim() === ''
            )} // Disable button if any string field is empty after trimming
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddAdminModal; // Export component for use in other parts of the application