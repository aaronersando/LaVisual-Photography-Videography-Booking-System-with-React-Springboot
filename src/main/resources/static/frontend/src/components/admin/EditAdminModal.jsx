/**
 * Admin Edit Modal Component
 * 
 * This component renders a modal dialog for editing existing administrator accounts.
 * It displays a form pre-populated with the admin's current information and allows
 * updating fields including name, email, password (optional), and address.
 * 
 * Key features:
 * - Form validation with required fields
 * - Optional password update (blank password keeps the current one)
 * - Dark theme styling consistent with the admin dashboard
 * - Responsive modal design
 * - Click-outside behavior to dismiss the modal
 * 
 * The component is typically used in the Admin Accounts section when an administrator
 * clicks the "Edit" button for an existing admin account.
 */

import { useState, useEffect } from 'react'; // Import React hooks for state and side effects
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome component
import { faX } from '@fortawesome/free-solid-svg-icons'; // Import X icon for close button

function EditAdminModal({ admin, onClose, onSave }) {
  // State to store and track form field values
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    city: '',
    role: ''
  });

  // Initialize form data when admin prop changes
  useEffect(() => {
    if (admin) {
      setFormData({
        name: admin.name || '', // Populate name with fallback to empty string
        email: admin.email || '', // Populate email with fallback to empty string
        password: '', // Clear password field on open (don't show existing password)
        city: admin.city || '', // Populate city with fallback to empty string
        role: admin.role || 'ADMIN' // Populate role with fallback to 'ADMIN'
      });
    }
  }, [admin]); // Re-run when the admin prop changes

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target; // Extract field name and new value
    setFormData(prev => ({
      ...prev, // Preserve existing form data
      [name]: value // Update only the changed field using computed property name
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    // Create data object to submit to API (matching YourProfileSection approach)
    const updateData = {
      id: admin.id, // Include the admin ID for the update
      name: formData.name,
      email: formData.email,
      // Only include password if provided (not empty)
      ...(formData.password && formData.password.trim() !== '' ? { password: formData.password } : {}),
      city: formData.city,
      role: formData.role || admin.role // Preserve existing role if not changed
    };
    
    // Pass the update data to parent component's onSave handler
    onSave(updateData);
  };

  return (
    // Modal overlay - covers entire screen with semi-transparent background
    <div className="fixed inset-0 bg-black/50 mt-10 flex items-center justify-center p-4" onClick={onClose}>
      {/* Modal content container - stop event propagation to prevent closing when clicking inside */}
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Admin avatar - purple circle with first letter of admin's name */}
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">{admin.name ? admin.name[0]?.toUpperCase() : 'A'}</span>
            </div>
            <h2 className="text-xl font-semibold text-white">Edit Admin</h2>
          </div>
          {/* Close button */}
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FontAwesomeIcon icon={faX} className='h-6 w-6 text-lg'/>
          </button>
        </div>

        {/* Form */}
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
              required // Field cannot be empty
            />
          </div>

          {/* Email input field */}
          <div>
            <label className="text-sm text-gray-400">Email</label>
            <input
              type="email" // Email input type with format validation
              name="email" // Matches property name in formData state
              value={formData.email} // Controlled component tied to state
              onChange={handleChange} // Update state when value changes
              className="w-full mt-1 p-2 bg-gray-700 text-white rounded border border-gray-600"
              required // Field cannot be empty
            />
          </div>

          {/* Password input field - optional field */}
          <div>
            <label className="text-sm text-gray-400">Password (leave blank to keep current)</label>
            <input
              type="password" // Password input for hidden characters
              name="password" // Matches property name in formData state
              value={formData.password} // Controlled component tied to state
              onChange={handleChange} // Update state when value changes
              className="w-full mt-1 p-2 bg-gray-700 text-white rounded border border-gray-600"
              placeholder="••••••••" // Visual indicator for password field
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
              required // Field cannot be empty
            />
          </div>
        </form>

        {/* Footer with action buttons */}
        <div className="px-6 py-4 border-t border-gray-700 flex justify-end space-x-4">
          {/* Cancel button */}
          <button
            onClick={onClose} // Close modal without saving
            className="px-4 py-2 text-white border border-gray-600 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
          {/* Save button */}
          <button
            onClick={handleSubmit} // Submit form data
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditAdminModal; // Export the component for use in other parts of the application