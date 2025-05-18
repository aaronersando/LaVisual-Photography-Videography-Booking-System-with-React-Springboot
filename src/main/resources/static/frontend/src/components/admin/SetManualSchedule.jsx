/**
 * Set Manual Schedule Component
 * 
 * This component provides an admin interface for manually creating bookings in the photography 
 * scheduling system. It displays a modal form that allows administrators to:
 * 
 * - Create bookings for specific time slots
 * - Select photography/videography categories and packages
 * - Enter client details (name, phone, location)
 * - Record payment information (type, method, amount)
 * - Check for time conflicts with existing bookings
 * 
 * The component handles form validation, time formatting, conflict detection,
 * and API communication with the backend server to create new booking records.
 * 
 * This is typically used within the admin calendar interface when an admin
 * wants to add a booking to an available time slot that wasn't booked through
 * the customer-facing website.
 */
import { useState, useEffect } from 'react';
import { packages } from '../booking/PricingData';

function SetManualSchedule({ onClose, selectedTimeRange, selectedDate, existingBookings }) {
    // Initialize form state with default values
    const [formData, setFormData] = useState({
        category: 'Photography',     // Default to Photography category
        package: '',                 // Package will be populated based on selected category
        fullName: '',                // Client's full name
        phoneNumber: '',             // Client's contact number
        location: '',                // Photoshoot location
        specialRequest: '',          // Any special requests from the client
        paymentType: 'Down Payment', // Default payment type
        paymentMode: 'Gcash',        // Default payment method
        accountNumber: '',           // Gcash account number if applicable
        amount: ''                   // Payment amount
    });
    const [isSubmitting, setIsSubmitting] = useState(false); // Track form submission state
    const [formErrors, setFormErrors] = useState({});        // Store validation errors

    // Auto-select the first package when category changes
    useEffect(() => {
        // Check if packages exist for the selected category
        if (packages[formData.category]?.length > 0) {
            // Update form data with the first package in the selected category
            setFormData(prev => ({
                ...prev,
                package: packages[formData.category][0].name
            }));
        }
    }, [formData.category]); // Run effect when category changes

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            // When category changes, reset the package selection
            ...(name === 'category' && { package: '' })
        }));
    };

    // Check if the selected time range conflicts with existing bookings
    const checkTimeRangeConflict = () => {
        // Convert selected time range start/end to minutes for easier comparison
        const startMinutes = timeToMinutes(selectedTimeRange.start);
        const endMinutes = timeToMinutes(selectedTimeRange.end);
        
        // Filter existing bookings to find any conflicts
        const conflicts = existingBookings?.filter(booking => {
            // Only check bookings, not unavailable time blocks
            if (booking.status !== 'booking') return false;
            
            // Convert booking times to minutes
            const bookingStartMinutes = timeToMinutes(booking.start);
            const bookingEndMinutes = timeToMinutes(booking.end);
            
            // Check for overlap, allowing adjacent bookings (where one ends exactly when another starts)
            return (startMinutes < bookingEndMinutes && endMinutes > bookingStartMinutes) && 
                   !(endMinutes === bookingStartMinutes || startMinutes === bookingEndMinutes);
        });
        
        // Return true if any conflicts exist
        return conflicts && conflicts.length > 0;
    };
    
    // Helper function to convert time strings to total minutes for comparison
    const timeToMinutes = (timeStr) => {
        if (!timeStr) return 0;
        
        try {
            // Handle 12-hour format (e.g., "3:30 PM")
            if (timeStr.includes('AM') || timeStr.includes('PM')) {
                const [time, period] = timeStr.split(' ');
                let [hours, minutes] = time.split(':').map(Number);
                
                // Convert to 24-hour format for calculation
                if (period === 'PM' && hours !== 12) {
                    // Add 12 hours for PM times (except 12 PM)
                    hours += 12;
                } else if (period === 'AM' && hours === 12) {
                    // 12 AM is actually 0 hours in 24-hour format
                    hours = 0;
                }
                
                // Calculate total minutes (hours * 60 + minutes)
                return hours * 60 + (minutes || 0);
            } 
            // Handle 24-hour format (e.g., "15:30")
            else {
                const [hours, minutes] = timeStr.split(':').map(Number);
                return hours * 60 + (minutes || 0);
            }
        } catch (e) {
            // Log error and return 0 if time format is invalid
            console.error("Error converting time to minutes:", e, timeStr);
            return 0;
        }
    };
    
    // Convert time from 12-hour to 24-hour format for backend API
    const convertToTime24Format = (timeStr) => {
        if (!timeStr) return null;
        
        // If already in 24-hour format, return as is
        if (!timeStr.includes('AM') && !timeStr.includes('PM')) {
            return timeStr;
        }
        
        // Split time string into time and AM/PM indicator
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        
        // Convert hours to a number for calculations
        hours = parseInt(hours, 10);
        
        // Handle special cases for 12-hour to 24-hour conversion
        if (hours === 12 && modifier === 'AM') {
            // 12 AM is 00 in 24-hour format
            hours = 0;
        }
        else if (modifier === 'PM' && hours !== 12) {
            // Add 12 for PM times (except 12 PM which is already correct)
            hours = hours + 12;
        }
        
        // Format with leading zeros and return
        return `${hours.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    };

    // Validate form fields before submission
    const validateForm = () => {
        const errors = {};
        
        // Check required fields
        if (!formData.fullName.trim()) errors.fullName = "Name is required";
        if (!formData.phoneNumber.trim()) errors.phoneNumber = "Phone number is required";
        if (!formData.location.trim()) errors.location = "Location is required";
        if (!formData.package) errors.package = "Please select a package";
        
        // For Gcash payments, account number is required
        if (formData.paymentMode === 'Gcash' && !formData.accountNumber.trim()) 
            errors.accountNumber = "Account number is required for Gcash payments";
            
        // Payment amount is always required
        if (!formData.amount) errors.amount = "Payment amount is required";
        
        // Update error state and return whether validation passed
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Save booking data to the database via API
    const saveBookingToDatabase = async (bookingData) => {
        try {
            // Get authentication token from local storage
            const token = localStorage.getItem('token');
            
            // Verify user is authenticated
            if (!token) {
                alert('You need to be logged in as an admin to create bookings');
                return false;
            }
            
            // Format date as YYYY-MM-DD for API
            const formattedDate = typeof selectedDate === 'string' 
                ? selectedDate 
                : selectedDate.toISOString().split('T')[0];
            
            // Get the package price from the pricing data
            const selectedPackage = packages[formData.category]?.find(pkg => pkg.name === formData.package);
            const packagePrice = selectedPackage?.price || 0;
            
            // Convert payment type to match database enum format
            const dbPaymentType = formData.paymentType === 'Down Payment' ? 'DOWNPAYMENT' : 'FULL';
            
            // Prepare the data object for the API request
            const apiData = {
                bookingDate: formattedDate,
                bookingTimeStart: convertToTime24Format(selectedTimeRange.start),
                bookingTimeEnd: convertToTime24Format(selectedTimeRange.end),
                packageName: formData.package,
                categoryName: formData.category,
                guestName: formData.fullName,
                guestPhone: formData.phoneNumber,
                location: formData.location,
                specialRequests: formData.specialRequest,
                paymentType: dbPaymentType,
                paymentMethod: formData.paymentMode.toUpperCase(),
                gcashNumber: formData.paymentMode === 'Gcash' ? formData.accountNumber : null,
                amount: parseFloat(formData.amount),
                packagePrice: packagePrice,
                // Generate a unique reference number using timestamp and random string
                bookingReference: `BKLQ${Date.now().toString(36).slice(-6).toUpperCase()}`
            };
            
            console.log('Sending booking data to API:', apiData);
            
            // Send POST request to the API
            const response = await fetch('http://localhost:8080/api/bookings/manual', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(apiData)
            });
            
            // Handle error responses
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error ${response.status}: Failed to create booking`);
            }
            
            // Parse and log successful response
            const data = await response.json();
            console.log('Booking created successfully:', data);
            return true;
            
        } catch (error) {
            // Handle and display errors
            console.error('Error saving booking:', error);
            alert(`Failed to save booking: ${error.message}`);
            return false;
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form first
        if (!validateForm()) {
            return;
        }
        
        // Check for time conflicts with existing bookings
        if (checkTimeRangeConflict()) {
            const proceed = window.confirm(
                'This time slot conflicts with an existing booking. Do you still want to proceed?'
            );
            if (!proceed) return;
        }
        
        // Set submission state to show loading indicator
        setIsSubmitting(true);
        
        try {
            // Prepare complete booking data
            const bookingData = {
                ...formData,
                date: selectedDate,
                timeRange: selectedTimeRange
            };
            
            // Save to database and get result
            const success = await saveBookingToDatabase(bookingData);
            
            if (success) {
                // Show success message
                alert('Booking created successfully!');
                onClose();
                // Refresh the page to show new booking
                window.location.reload();
            }
        } catch (error) {
            // Handle unexpected errors
            console.error('Error creating booking:', error);
            alert(`Error creating booking: ${error.message}`);
        } finally {
            // Reset submission state
            setIsSubmitting(false);
        }
    };

    return (
        // Modal overlay - covers entire screen with semi-transparent background
        <div className="fixed inset-0 bg-black/50 z-[60]" onClick={(e) => {
            e.stopPropagation(); // Stop propagation to parent modals
            onClose();
        }}>
            {/* Modal container - centered and sized appropriately */}
            <div className="absolute top-15 left-1/2 transform -translate-x-1/2 p-4 w-full max-w-md">
                {/* Modal card - dark themed with rounded corners */}
                <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                    {/* Header section with title and selected time range */}
                    <div className="px-6 py-4 border-b border-gray-700 shrink-0">
                        <h2 className="text-xl font-semibold text-white">Set Manual Schedule</h2>
                        <p className="text-gray-400 text-sm mt-1">
                            Time: {selectedTimeRange.start} - {selectedTimeRange.end}
                        </p>
                    </div>

                    {/* Form Content - scrollable container */}
                    <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4 overflow-y-auto flex-1">

                        {/* Category Selection dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Select a Category
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={`w-full bg-gray-700 text-white rounded-md px-3 py-2 ${
                                    formErrors.category ? 'border border-red-500' : ''
                                }`}
                            >
                                <option value="Photography">Photography</option>
                                <option value="Videography">Videography</option>
                                <option value="Combo Package">Combo Package</option>
                            </select>
                            {formErrors.category && (
                                <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>
                            )}
                        </div>

                        {/* Package Selection dropdown - options change based on selected category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Select a Package
                            </label>
                            <select
                                name="package"
                                value={formData.package}
                                onChange={handleChange}
                                className={`w-full bg-gray-700 text-white rounded-md px-3 py-2 ${
                                    formErrors.package ? 'border border-red-500' : ''
                                }`}
                            >
                                <option value="">Select a package</option>
                                {/* Dynamically render package options based on selected category */}
                                {packages[formData.category]?.map(pkg => (
                                    <option key={pkg.name} value={pkg.name}>
                                        {pkg.name} - ₱{pkg.price}
                                    </option>
                                ))}
                            </select>
                            {formErrors.package && (
                                <p className="text-red-500 text-xs mt-1">{formErrors.package}</p>
                            )}
                        </div>

                        {/* Client Details section with multiple fields */}
                        <div className="space-y-4">
                            {/* Full Name input */}
                            <div>
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Full Name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className={`w-full bg-gray-700 text-white rounded-md px-3 py-2 ${
                                        formErrors.fullName ? 'border border-red-500' : ''
                                    }`}
                                />
                                {formErrors.fullName && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>
                                )}
                            </div>
                            
                            {/* Phone Number input */}
                            <div>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    placeholder="Phone Number"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className={`w-full bg-gray-700 text-white rounded-md px-3 py-2 ${
                                        formErrors.phoneNumber ? 'border border-red-500' : ''
                                    }`}
                                />
                                {formErrors.phoneNumber && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.phoneNumber}</p>
                                )}
                            </div>
                            
                            {/* Location input */}
                            <div>
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="Location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className={`w-full bg-gray-700 text-white rounded-md px-3 py-2 ${
                                        formErrors.location ? 'border border-red-500' : ''
                                    }`}
                                />
                                {formErrors.location && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.location}</p>
                                )}
                            </div>
                            
                            {/* Special Request textarea - optional field */}
                            <textarea
                                name="specialRequest"
                                placeholder="Special Request (Optional)"
                                value={formData.specialRequest}
                                onChange={handleChange}
                                className="w-full bg-gray-700 text-white rounded-md px-3 py-2 min-h-[100px]"
                            />
                        </div>

                        {/* Payment Details section */}
                        <div className="space-y-4">
                            {/* Payment Type dropdown (full or down payment) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Payment Mode
                                </label>
                                <select
                                    name="paymentType"
                                    value={formData.paymentType}
                                    onChange={handleChange}
                                    className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
                                >
                                    <option value="Down Payment">Down Payment</option>
                                    <option value="Full Payment">Full Payment</option>
                                </select>
                            </div>
                            
                            {/* Payment Method dropdown */}
                            <div>
                                <select
                                    name="paymentMode"
                                    value={formData.paymentMode}
                                    onChange={handleChange}
                                    className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
                                >
                                    <option value="Gcash">Gcash</option>
                                    <option value="Cash">Cash</option>
                                </select>
                            </div>
                            
                            {/* Conditional Gcash Account Number field - only shown for Gcash payments */}
                            {formData.paymentMode === 'Gcash' && (
                                <div>
                                    <input
                                        type="text"
                                        name="accountNumber"
                                        placeholder="Account Number"
                                        value={formData.accountNumber}
                                        onChange={handleChange}
                                        className={`w-full bg-gray-700 text-white rounded-md px-3 py-2 ${
                                            formErrors.accountNumber ? 'border border-red-500' : ''
                                        }`}
                                    />
                                    {formErrors.accountNumber && (
                                        <p className="text-red-500 text-xs mt-1">{formErrors.accountNumber}</p>
                                    )}
                                </div>
                            )}
                            
                            {/* Payment Amount input */}
                            <div>
                                <input
                                    type="number"
                                    name="amount"
                                    placeholder="Amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    className={`w-full bg-gray-700 text-white rounded-md px-3 py-2 ${
                                        formErrors.amount ? 'border border-red-500' : ''
                                    }`}
                                />
                                {formErrors.amount && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.amount}</p>
                                )}
                            </div>
                        </div>
                    </form>

                    {/* Footer with action buttons */}
                    <div className="px-6 py-4 border-t border-gray-700 flex justify-end space-x-3 shrink-0">
                        {/* Back/Cancel button */}
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-white border border-gray-600 rounded hover:bg-gray-700"
                            disabled={isSubmitting}
                        >
                            Back
                        </button>
                        {/* Submit/Confirm button with loading state */}
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Confirm'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SetManualSchedule;