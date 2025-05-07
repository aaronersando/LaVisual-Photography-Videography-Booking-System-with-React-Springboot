import { useState, useEffect } from 'react';
import { packages } from '../booking/PricingData';

function SetManualSchedule({ onClose, selectedTimeRange, selectedDate, existingBookings }) {
    const [formData, setFormData] = useState({
        category: 'Photography',
        package: '',
        fullName: '',
        phoneNumber: '',
        location: '',
        specialRequest: '',
        paymentType: 'Down Payment',
        paymentMode: 'Gcash',
        accountNumber: '',
        amount: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // Select the first package by default when category changes
    useEffect(() => {
        if (packages[formData.category]?.length > 0) {
            setFormData(prev => ({
                ...prev,
                package: packages[formData.category][0].name
            }));
        }
    }, [formData.category]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            // Reset package when category changes
            ...(name === 'category' && { package: '' })
        }));
    };

    // Check if the selected time range conflicts with existing bookings
    const checkTimeRangeConflict = () => {
        // Convert selectedTimeRange to minutes for easier comparison
        const startMinutes = timeToMinutes(selectedTimeRange.start);
        const endMinutes = timeToMinutes(selectedTimeRange.end);
        
        // Check against all existing bookings
        const conflicts = existingBookings?.filter(booking => {
            if (booking.status !== 'booking') return false;
            
            const bookingStartMinutes = timeToMinutes(booking.start);
            const bookingEndMinutes = timeToMinutes(booking.end);
            
            // Check for overlap - no conflict if adjacent
            return (startMinutes < bookingEndMinutes && endMinutes > bookingStartMinutes) && 
                   !(endMinutes === bookingStartMinutes || startMinutes === bookingEndMinutes);
        });
        
        return conflicts && conflicts.length > 0;
    };
    
    // Helper function to convert time to minutes
    const timeToMinutes = (timeStr) => {
        if (!timeStr) return 0;
        
        try {
            // Handle "HH:MM AM/PM" format
            if (timeStr.includes('AM') || timeStr.includes('PM')) {
                const [time, period] = timeStr.split(' ');
                let [hours, minutes] = time.split(':').map(Number);
                
                // Convert to 24-hour format
                if (period === 'PM' && hours !== 12) {
                    hours += 12;
                } else if (period === 'AM' && hours === 12) {
                    hours = 0;
                }
                
                return hours * 60 + (minutes || 0);
            } 
            // Handle "HH:MM" 24-hour format
            else {
                const [hours, minutes] = timeStr.split(':').map(Number);
                return hours * 60 + (minutes || 0);
            }
        } catch (e) {
            console.error("Error converting time to minutes:", e, timeStr);
            return 0;
        }
    };
    
    // Convert time from 12h to 24h format for the backend
    const convertToTime24Format = (timeStr) => {
        if (!timeStr) return null;
        
        // If already in 24-hour format, return as is
        if (!timeStr.includes('AM') && !timeStr.includes('PM')) {
            return timeStr;
        }
        
        // Convert from "hh:mm AM/PM" to "HH:mm" format
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        
        // Convert hours to number for arithmetic operations
        hours = parseInt(hours, 10);
        
        // Handle midnight (12 AM) case
        if (hours === 12 && modifier === 'AM') {
            hours = 0;
        }
        // Handle afternoon (PM) cases but not noon (12 PM)
        else if (modifier === 'PM' && hours !== 12) {
            hours = hours + 12;
        }
        
        // Pad both hours and minutes with leading zeros
        return `${hours.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    };

    const validateForm = () => {
        const errors = {};
        
        if (!formData.fullName.trim()) errors.fullName = "Name is required";
        if (!formData.phoneNumber.trim()) errors.phoneNumber = "Phone number is required";
        if (!formData.location.trim()) errors.location = "Location is required";
        if (!formData.package) errors.package = "Please select a package";
        if (formData.paymentMode === 'Gcash' && !formData.accountNumber.trim()) 
            errors.accountNumber = "Account number is required for Gcash payments";
        if (!formData.amount) errors.amount = "Payment amount is required";
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const saveBookingToDatabase = async (bookingData) => {
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                alert('You need to be logged in as an admin to create bookings');
                return false;
            }
            
            // Format date as YYYY-MM-DD
            const formattedDate = typeof selectedDate === 'string' 
                ? selectedDate 
                : selectedDate.toISOString().split('T')[0];
            
            // Get the package price from the selection
            const selectedPackage = packages[formData.category]?.find(pkg => pkg.name === formData.package);
            const packagePrice = selectedPackage?.price || 0;
            
            // Convert payment type to match database enum values
            const dbPaymentType = formData.paymentType === 'Down Payment' ? 'DOWNPAYMENT' : 'FULL';
            
            // Prepare the data for the API
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
                paymentType: dbPaymentType, // Use the converted value
                paymentMethod: formData.paymentMode.toUpperCase(),
                gcashNumber: formData.paymentMode === 'Gcash' ? formData.accountNumber : null,
                amount: parseFloat(formData.amount),
                packagePrice: packagePrice,
                // Generate a unique reference number
                bookingReference: `BKLQ${Date.now().toString(36).slice(-6).toUpperCase()}`
            };
            
            console.log('Sending booking data to API:', apiData);
            
            // Call the API to create the booking
            const response = await fetch('http://localhost:8080/api/bookings/manual', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(apiData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error ${response.status}: Failed to create booking`);
            }
            
            const data = await response.json();
            console.log('Booking created successfully:', data);
            return true;
            
        } catch (error) {
            console.error('Error saving booking:', error);
            alert(`Failed to save booking: ${error.message}`);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form first
        if (!validateForm()) {
            return;
        }
        
        // Check for time conflicts
        if (checkTimeRangeConflict()) {
            const proceed = window.confirm(
                'This time slot conflicts with an existing booking. Do you still want to proceed?'
            );
            if (!proceed) return;
        }
        
        setIsSubmitting(true);
        
        try {
            // Prepare booking data
            const bookingData = {
                ...formData,
                date: selectedDate,
                timeRange: selectedTimeRange
            };
            
            // Save to database
            const success = await saveBookingToDatabase(bookingData);
            
            if (success) {
                alert('Booking created successfully!');
                onClose();
                // Refresh the page to show new booking
                window.location.reload();
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            alert(`Error creating booking: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[60]" onClick={(e) => {
            e.stopPropagation(); // Stop propagation to parent modals
            onClose();
        }}>
            <div className="absolute top-15 left-1/2 transform -translate-x-1/2 p-4 w-full max-w-md">
                <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-700 shrink-0">
                        <h2 className="text-xl font-semibold text-white">Set Manual Schedule</h2>
                        <p className="text-gray-400 text-sm mt-1">
                            Time: {selectedTimeRange.start} - {selectedTimeRange.end}
                        </p>
                    </div>

                    {/* Form Content */}
                    <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4 overflow-y-auto flex-1">

                        {/* Category Selection */}
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

                        {/* Package Selection */}
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

                        {/* Client Details */}
                        <div className="space-y-4">
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
                            
                            <textarea
                                name="specialRequest"
                                placeholder="Special Request (Optional)"
                                value={formData.specialRequest}
                                onChange={handleChange}
                                className="w-full bg-gray-700 text-white rounded-md px-3 py-2 min-h-[100px]"
                            />
                        </div>

                        {/* Payment Details */}
                        <div className="space-y-4">
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

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-gray-700 flex justify-end space-x-3 shrink-0">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-white border border-gray-600 rounded hover:bg-gray-700"
                            disabled={isSubmitting}
                        >
                            Back
                        </button>
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