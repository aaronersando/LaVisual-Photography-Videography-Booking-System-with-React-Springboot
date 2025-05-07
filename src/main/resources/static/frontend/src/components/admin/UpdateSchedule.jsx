import { useState, useEffect } from 'react';
import { packages } from '../booking/PricingData';

function UpdateSchedule({ booking, onClose, onUpdate }) {
    // Initialize form with booking data
    const [formData, setFormData] = useState({
        category: '',
        package: '',
        fullName: '',
        phoneNumber: '',
        location: '',
        specialRequest: '',
        paymentType: '',
        paymentMode: '',
        accountNumber: '',
        amount: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // Populate form with booking data on mount
    useEffect(() => {
        if (booking) {
            setFormData({
                category: booking.category || 'Photography',
                package: booking.clientEvent || booking.package || '',
                fullName: booking.customerDetails?.name || booking.customerDetails?.fullName || '',
                phoneNumber: booking.customerDetails?.phone || booking.customerDetails?.phoneNumber || '',
                location: booking.customerDetails?.location || '',
                specialRequest: booking.customerDetails?.notes || booking.customerDetails?.specialRequest || '',
                paymentType: booking.paymentDetails?.type === 'full' || booking.paymentDetails?.paymentType === 'Full Payment' 
                    ? 'Full Payment' 
                    : 'Down Payment',
                paymentMode: 'Gcash',
                accountNumber: booking.paymentDetails?.accountNumber || '',
                amount: booking.paymentDetails?.amount || booking.totalAmount || ''
            });
        }
    }, [booking]);

    // Filter packages by selected category
    const filteredPackages = packages[formData.category] || [];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'category' && { package: '' }) // Reset package when category changes
        }));
        
        // Clear validation error when field is changed
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const errors = {};
        
        if (!formData.category) errors.category = 'Category is required';
        if (!formData.package) errors.package = 'Package is required';
        if (!formData.fullName) errors.fullName = 'Full name is required';
        if (!formData.phoneNumber) errors.phoneNumber = 'Phone number is required';
        if (!formData.location) errors.location = 'Location is required';
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            alert('Please fill in all required fields.');
            return;
        }
        
        setIsSubmitting(true);
        
        // Prepare updated booking data
        const updatedBooking = {
            ...booking,
            category: formData.category,
            package: formData.package,
            clientEvent: formData.package, // Ensure both fields are updated
            customerDetails: {
                ...booking.customerDetails,
                name: formData.fullName,
                fullName: formData.fullName,
                phone: formData.phoneNumber,
                phoneNumber: formData.phoneNumber,
                location: formData.location,
                notes: formData.specialRequest,
                specialRequest: formData.specialRequest
            }
            // Not updating payment details as those are read-only
        };
        
        // Call onUpdate from parent component
        onUpdate(updatedBooking);
        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 mt-[80px] bg-black/50 flex items-center justify-center p-4 z-[70]" onClick={(e) => {
            e.stopPropagation(); 
            onClose();
        }}>
        <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 bg-gray-800 px-6 py-4 border-b border-gray-700 z-10">
                <h2 className="text-xl font-semibold text-white">Update Booking</h2>
            </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                    {/* Category Selection */}
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
                            {filteredPackages.map(pkg => (
                                <option key={pkg.name} value={pkg.name}>
                                    {pkg.name} - ₱{pkg.price}
                                </option>
                            ))}
                        </select>
                        {formErrors.package && (
                            <p className="mt-1 text-sm text-red-400">{formErrors.package}</p>
                        )}
                    </div>

                    {/* Client Details */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Client Details
                        </label>
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
                            <p className="mt-1 text-sm text-red-400">{formErrors.fullName}</p>
                        )}
                        
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
                            <p className="mt-1 text-sm text-red-400">{formErrors.phoneNumber}</p>
                        )}
                        
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
                            <p className="mt-1 text-sm text-red-400">{formErrors.location}</p>
                        )}
                        
                        <textarea
                            name="specialRequest"
                            placeholder="Special Request (Optional)"
                            value={formData.specialRequest}
                            onChange={handleChange}
                            className="w-full bg-gray-700 text-white rounded-md px-3 py-2 min-h-[100px]"
                        />
                    </div>

                    {/* Payment Details (Read-only) */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-white">Payment Information</h3>
                        
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
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Amount Paid
                            </label>
                            <input
                                type="text"
                                value={`₱${Number(formData.amount).toLocaleString()}`}
                                disabled
                                className="w-full bg-gray-600 text-white rounded-md px-3 py-2 opacity-70 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-700 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-white border border-gray-600 rounded hover:bg-gray-700"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Updating...' : 'Update Booking'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UpdateSchedule;