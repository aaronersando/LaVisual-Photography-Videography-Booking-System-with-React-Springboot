import { useState } from 'react';
import {packages} from '../booking/PricingData'

function SetManualSchedule({ onClose, selectedTimeRange, selectedDate }) {
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


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            // Reset package when category changes
            ...(name === 'category' && { package: '' })
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the data to your backend
        const bookingData = {
            ...formData,
            date: selectedDate,
            timeRange: selectedTimeRange
        };
        console.log('Booking data:', bookingData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[9999]">
            <div className="absolute top-15 left-1/2 transform -translate-x-1/2 p-4 w-full max-w-md">
                <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-700 shrink-0">
                        <h2 className="text-xl font-semibold text-white">Set Manual Schedule</h2>
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
                                className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
                            >
                                {/* <option value="">Select a package</option> */}
                                {packages[formData.category]?.map(pkg => (
                                    <option key={pkg.name} value={pkg.name}>
                                        {pkg.name} - ₱{pkg.price}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Client Details */}
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Full Name"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
                            />
                            <input
                                type="text"
                                name="phoneNumber"
                                placeholder="Phone Number"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
                            />
                            <input
                                type="text"
                                name="location"
                                placeholder="Location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
                            />
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
                            <select
                                name="paymentMode"
                                value={formData.paymentMode}
                                onChange={handleChange}
                                className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
                            >
                                <option value="Gcash">Gcash</option>
                                <option value="Cash">Cash</option>
                            </select>
                            {formData.paymentMode === 'Gcash' && (
                                <input
                                    type="text"
                                    name="accountNumber"
                                    placeholder="Account Number"
                                    value={formData.accountNumber}
                                    onChange={handleChange}
                                    className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
                                />
                            )}
                            <input
                                type="number"
                                name="amount"
                                placeholder="Amount"
                                value={formData.amount}
                                onChange={handleChange}
                                className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
                            />
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-gray-700 flex justify-end space-x-3 shrink-0">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-white border border-gray-600 rounded hover:bg-gray-700"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SetManualSchedule;