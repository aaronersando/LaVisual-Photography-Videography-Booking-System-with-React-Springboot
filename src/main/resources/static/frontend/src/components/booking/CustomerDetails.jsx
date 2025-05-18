/**
 * Customer Details Component
 * 
 * This component renders a form that collects customer information during the booking process.
 * It's part of a multi-step booking flow where users enter their personal details before proceeding
 * to payment or confirmation. The component handles validation for each field and displays
 * appropriate error messages.
 * 
 * Key features:
 * - Collects essential customer information (name, email, phone, location)
 * - Provides field for optional special requests/notes
 * - Performs form validation with specific requirements for each field
 * - Shows inline error messages for invalid inputs
 * - Responsive design that adapts to different screen sizes
 * - Sends validated data back to parent component when submitted
 * 
 * This component is typically used as the third step in the booking flow, after package
 * and date/time selection, but before payment information.
 */

import { useState } from 'react'; // Import React's useState hook for state management

function CustomerDetails({ onNext, onBack, updateData, data }) {
  // Initialize form state with empty values for all required fields
  const [formData, setFormData] = useState({
    name: '',        // Customer's full name
    email: '',       // Customer's email address
    phone: '',       // Customer's phone number
    location: '',    // Event location
    notes: ''        // Optional special requests
  });
  
  // State to track validation errors for each field
  const [errors, setErrors] = useState({});

  // Function to validate all form fields before submission
  const validateForm = () => {
    const newErrors = {}; // Object to collect validation errors
    
    // Required field validations - check if fields are empty
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.location.trim()) newErrors.location = 'Event location is required';
    
    // Email format validation using regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';
    
    // Phone number validation - must be exactly 11 digits
    const phoneRegex = /^[0-9]{11}$/;
    if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Invalid phone number (11 digits)';

    // Update error state with any validation errors found
    setErrors(newErrors);
    
    // Return true if no errors (form is valid), false otherwise
    return Object.keys(newErrors).length === 0;
  };

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (validateForm()) { // Only proceed if all validations pass
      updateData({ customerDetails: formData }); // Pass customer data to parent component
      onNext(); // Navigate to the next step in the booking process
    }
  };

  // Handler for input field changes
  const handleChange = (e) => {
    const { name, value } = e.target; // Extract field name and new value
    
    // Update form data state with the new value
    setFormData(prev => ({
      ...prev, // Keep all other field values
      [name]: value // Update only the changed field
    }));
    
    // Clear error message for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev, // Keep other error messages
        [name]: '' // Clear error for this field
      }));
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 sm:p-5 md:p-6">
      {/* Form title */}
      <h2 className="text-lg sm:text-xl md:text-2xl text-white mb-4 sm:mb-6">Enter Your Details</h2>
      
      {/* Form with all customer information fields */}
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        {/* Full Name input field */}
        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className={`w-full p-2 sm:p-3 text-sm sm:text-base bg-gray-700 text-white rounded ${
              errors.name ? 'border border-red-500' : 'border border-gray-600' // Red border if validation error
            }`}
          />
          {/* Show error message if name validation fails */}
          {errors.name && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Email input field */}
        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className={`w-full p-2 sm:p-3 text-sm sm:text-base bg-gray-700 text-white rounded ${
              errors.email ? 'border border-red-500' : 'border border-gray-600' // Red border if validation error
            }`}
          />
          {/* Show error message if email validation fails */}
          {errors.email && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Phone Number input field */}
        <div>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number (11 digits)"
            className={`w-full p-2 sm:p-3 text-sm sm:text-base bg-gray-700 text-white rounded ${
              errors.phone ? 'border border-red-500' : 'border border-gray-600' // Red border if validation error
            }`}
          />
          {/* Show error message if phone validation fails */}
          {errors.phone && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.phone}</p>}
        </div>

        {/* Event Location input field */}
        <div>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Event Location"
            className={`w-full p-2 sm:p-3 text-sm sm:text-base bg-gray-700 text-white rounded ${
              errors.location ? 'border border-red-500' : 'border border-gray-600' // Red border if validation error
            }`}
          />
          {/* Show error message if location validation fails */}
          {errors.location && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.location}</p>}
        </div>

        {/* Special Requests textarea (optional field) */}
        <div>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Special Requests (Optional)"
            className="w-full p-2 sm:p-3 text-sm sm:text-base bg-gray-700 text-white rounded border border-gray-600"
            rows={4}
          />
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-5 sm:mt-6">
          {/* Back button - returns to previous step */}
          <button
            type="button"
            onClick={onBack}
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-white border-[#4B5563] border-2 hover:bg-gray-700 rounded text-sm sm:text-base"
          >
            Back
          </button>
          {/* Continue button - submits form and proceeds to next step */}
          <button
            type="submit"
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm sm:text-base"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}

export default CustomerDetails; // Export the component for use in the booking flow