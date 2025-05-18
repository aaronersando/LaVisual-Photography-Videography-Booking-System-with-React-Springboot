/**
 * Booking Update Modal Component
 * 
 * This component provides an administrator interface for modifying existing booking details.
 * It displays a modal dialog with a form that allows admins to:
 * 
 * - Update the service category (Photography, Videography, or Combo Package)
 * - Change the specific package selection within the chosen category
 * - Modify client information (name, phone number, location, special requests)
 * - View payment information (which remains read-only)
 * 
 * The component handles form validation, displays error messages for required fields,
 * and communicates with the parent component to persist changes to the backend.
 * 
 * It's typically accessed from the booking details view when an admin clicks 
 * the "Update" button to modify an existing booking.
 */

import { useState, useEffect } from 'react'; // Import React hooks for state management and side effects
import { packages } from '../booking/PricingData'; // Import package data with pricing information

function UpdateSchedule({ booking, onClose, onUpdate }) {
    // Initialize form state with empty default values
    // This will hold all editable booking information
    const [formData, setFormData] = useState({
        category: '',           // Photography service category
        package: '',            // Specific package within the category
        fullName: '',           // Client's full name
        phoneNumber: '',        // Client's contact number
        location: '',           // Photoshoot location
        specialRequest: '',     // Any special requests from the client
        paymentType: '',        // Full or down payment (read-only)
        paymentMode: '',        // Payment method like GCash (read-only)
        accountNumber: '',      // Payment account number (read-only)
        amount: ''              // Payment amount (read-only)
    });

    const [isSubmitting, setIsSubmitting] = useState(false); // Track form submission state
    const [formErrors, setFormErrors] = useState({}); // Track validation errors for form fields

    // Populate form with existing booking data when component mounts or booking changes
    useEffect(() => {
        if (booking) {
            setFormData({
                // Use fallbacks with || to handle different possible data structures
                category: booking.category || 'Photography', // Default to Photography if not provided
                package: booking.clientEvent || booking.package || '', // Handle different field names
                fullName: booking.customerDetails?.name || booking.customerDetails?.fullName || '', // Get name from either property
                phoneNumber: booking.customerDetails?.phone || booking.customerDetails?.phoneNumber || '', // Get phone from either property
                location: booking.customerDetails?.location || '', // Location information
                specialRequest: booking.customerDetails?.notes || booking.customerDetails?.specialRequest || '', // Special requests
                // Determine payment type with ternary operator
                paymentType: booking.paymentDetails?.type === 'full' || booking.paymentDetails?.paymentType === 'Full Payment' 
                    ? 'Full Payment' 
                    : 'Down Payment',
                paymentMode: 'Gcash', // Default payment method
                accountNumber: booking.paymentDetails?.accountNumber || '', // Payment account
                amount: booking.paymentDetails?.amount || booking.totalAmount || '' // Payment amount from either field
            });
        }
    }, [booking]); // Only run when booking prop changes

    // Filter packages list to only show packages for the selected category
    const filteredPackages = packages[formData.category] || [];

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target; // Extract field name and new value
        setFormData(prev => ({
            ...prev, // Keep all existing form data
            [name]: value, // Update only the changed field
            ...(name === 'category' && { package: '' }) // If category changed, reset package selection
        }));
        
        // Clear validation error for the field that was just changed
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Validate all form fields before submission
    const validateForm = () => {
        const errors = {}; // Will store all validation errors
        
        // Check required fields and add error messages
        if (!formData.category) errors.category = 'Category is required';
        if (!formData.package) errors.package = 'Package is required';
        if (!formData.fullName) errors.fullName = 'Full name is required';
        if (!formData.phoneNumber) errors.phoneNumber = 'Phone number is required';
        if (!formData.location) errors.location = 'Location is required';
        
        setFormErrors(errors); // Update error state
        return Object.keys(errors).length === 0; // Return true if no errors
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        
        // Validate form and stop if there are errors
        if (!validateForm()) {
            alert('Please fill in all required fields.');
            return;
        }
        
        setIsSubmitting(true); // Show loading state
        
        // Create updated booking object with modified data
        const updatedBooking = {
            ...booking, // Keep all existing booking data
            category: formData.category, // Update category
            package: formData.package, // Update package
            clientEvent: formData.package, // Update clientEvent (alternative field name)
            customerDetails: {
                ...booking.customerDetails, // Keep existing customer details
                name: formData.fullName, // Update name
                fullName: formData.fullName, // Update alternative name field
                phone: formData.phoneNumber, // Update phone
                phoneNumber: formData.phoneNumber, // Update alternative phone field
                location: formData.location, // Update location
                notes: formData.specialRequest, // Update notes
                specialRequest: formData.specialRequest // Update alternative notes field
            }
            // Payment details remain unchanged as they are read-only
        };
        
        // Call parent component's update function with the updated data
        onUpdate(updatedBooking);
        setIsSubmitting(false); // Reset submission state
    };

    return (
        // Modal overlay - covers entire screen with semi-transparent background
        // Clicking on the overlay closes the modal
        <div className="fixed inset-0 mt-[80px] bg-black/50 flex items-center justify-center p-4 z-[70]" onClick={(e) => {
            e.stopPropagation(); // Prevent event bubbling
            onClose(); // Close modal when clicking outside
        }}>
        {/* Modal content container - prevents clicks from closing when clicking inside */}
        <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Header with title - stays fixed at top when scrolling */}
            <div className="sticky top-0 bg-gray-800 px-6 py-4 border-b border-gray-700 z-10">
                <h2 className="text-xl font-semibold text-white">Update Booking</h2>
            </div>

                {/* Form with input fields */}
                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                    {/* Category dropdown selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Select a Category
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
                        >
                            <option value="Photography">Photography</option>
                            <option value="Videography">Videography</option>
                            <option value="Combo Package">Combo Package</option>
                        </select>
                    </div>

                    {/* Package dropdown selection - options depend on selected category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Select a Package
                        </label>
                        <select
                            name="package"
                            value={formData.package}
                            onChange={handleChange}
                            className={`w-full bg-gray-700 text-white rounded-md px-3 py-2 ${
                                formErrors.package ? 'border border-red-500' : '' // Red border if validation error
                            }`}
                        >
                            <option value="">Select a package</option>
                            {/* Map through available packages for the selected category */}
                            {filteredPackages.map(pkg => (
                                <option key={pkg.name} value={pkg.name}>
                                    {pkg.name} - ₱{pkg.price}
                                </option>
                            ))}
                        </select>
                        {/* Show error message if validation fails */}
                        {formErrors.package && (
                            <p className="mt-1 text-sm text-red-400">{formErrors.package}</p>
                        )}
                    </div>

                    {/* Client Details section with multiple inputs */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Client Details
                        </label>
                        {/* Full Name input */}
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Full Name"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={`w-full bg-gray-700 text-white rounded-md px-3 py-2 ${
                                formErrors.fullName ? 'border border-red-500' : '' // Red border if validation error
                            }`}
                        />
                        {/* Show error message if validation fails */}
                        {formErrors.fullName && (
                            <p className="mt-1 text-sm text-red-400">{formErrors.fullName}</p>
                        )}
                        
                        {/* Phone Number input */}
                        <input
                            type="text"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className={`w-full bg-gray-700 text-white rounded-md px-3 py-2 ${
                                formErrors.phoneNumber ? 'border border-red-500' : '' // Red border if validation error
                            }`}
                        />
                        {/* Show error message if validation fails */}
                        {formErrors.phoneNumber && (
                            <p className="mt-1 text-sm text-red-400">{formErrors.phoneNumber}</p>
                        )}
                        
                        {/* Location input */}
                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={formData.location}
                            onChange={handleChange}
                            className={`w-full bg-gray-700 text-white rounded-md px-3 py-2 ${
                                formErrors.location ? 'border border-red-500' : '' // Red border if validation error
                            }`}
                        />
                        {/* Show error message if validation fails */}
                        {formErrors.location && (
                            <p className="mt-1 text-sm text-red-400">{formErrors.location}</p>
                        )}
                        
                        {/* Special Request textarea - optional field */}
                        <textarea
                            name="specialRequest"
                            placeholder="Special Request (Optional)"
                            value={formData.specialRequest}
                            onChange={handleChange}
                            className="w-full bg-gray-700 text-white rounded-md px-3 py-2 min-h-[100px]"
                        />
                    </div>

                    {/* Payment Details section - all fields are read-only */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-white">Payment Information</h3>
                        
                        {/* Payment Type - read-only field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Payment Type
                            </label>
                            <input
                                type="text"
                                value={formData.paymentType}
                                disabled
                                className="w-full bg-gray-600 text-white rounded-md px-3 py-2 opacity-70 cursor-not-allowed"
                            />
                        </div>
                        
                        {/* Payment Method - read-only field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Payment Method
                            </label>
                            <input
                                type="text"
                                value={formData.paymentMode}
                                disabled
                                className="w-full bg-gray-600 text-white rounded-md px-3 py-2 opacity-70 cursor-not-allowed"
                            />
                        </div>
                        
                        {/* Account Number - only shown for GCash payments and read-only */}
                        {formData.paymentMode === 'Gcash' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Account Number
                                </label>
                                <input
                                    type="text"
                                    value={formData.accountNumber}
                                    disabled
                                    className="w-full bg-gray-600 text-white rounded-md px-3 py-2 opacity-70 cursor-not-allowed"
                                />
                            </div>
                        )}
                        
                        {/* Amount Paid - read-only field with currency formatting */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Amount Paid
                            </label>
                            <input
                                type="text"
                                value={`₱${Number(formData.amount).toLocaleString()}`} // Format with peso sign and thousands separators
                                disabled
                                className="w-full bg-gray-600 text-white rounded-md px-3 py-2 opacity-70 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </form>

                {/* Footer with action buttons */}
                <div className="px-6 py-4 border-t border-gray-700 flex justify-end space-x-3">
                    {/* Cancel button - closes the modal */}
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-white border border-gray-600 rounded hover:bg-gray-700"
                        disabled={isSubmitting} // Disable during submission
                    >
                        Cancel
                    </button>
                    {/* Submit button - saves the changes */}
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                        disabled={isSubmitting} // Disable during submission
                    >
                        {isSubmitting ? 'Updating...' : 'Update Booking'} {/* Change text when submitting */}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UpdateSchedule; // Export component for use in other files