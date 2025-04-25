import React, {useState} from 'react';
import UpdateSchedule from './UpdateSchedule';

function ShowScheduleDetails({ booking, onClose, onUpdate }) {

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [bookingToUpdate, setBookingToUpdate] = useState(null);
    // Destructure booking data for easier access
    const { 
        clientEvent: packageName, 
        category, 
        date, 
        timeRange, 
        customerDetails,
        paymentDetails = {},
        totalAmount,
        bookingReference
    } = booking || {};

    

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    // Format time for display
    const formatTime = (timeString) => {
        if (!timeString) return '';
        const [hour] = timeString.split(':');
        const hourNum = parseInt(hour);
        const ampm = hourNum >= 12 ? 'PM' : 'AM';
        const hour12 = hourNum % 12 || 12;
        return `${hour12}:00 ${ampm}`;
    };
    

    const handleUpdateBooking = (booking) => {
        setBookingToUpdate(booking);
        // setShowDetailsModal(false);
        setShowUpdateModal(true);
    };
    
    const handleSaveUpdatedBooking = (updatedBooking) => {
        // tO save the updated booking to your backend
        // After success:
        setShowUpdateModal(false);
        // If want to refresh the booking data here
    };

    return (
        <div className="fixed inset-0 mt-[80px] bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-6 space-y-6">
                    {/* Header */}
                    <h2 className="text-xl font-semibold text-white">Booking Details</h2>

                    {/* Booking Summary */}
                    <div className="bg-gray-700 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-4 text-white">Booking Summary</h3>
                        <div className="space-y-2 text-white">
                            <div className="flex justify-between">
                                <span>Reference:</span>
                                <span className="font-medium">{booking.bookingReference}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Package:</span>
                                <span className="font-medium">{packageName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Category:</span>
                                <span className="font-medium">{category}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Date:</span>
                                <span className="font-medium">{formatDate(date)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Time:</span>
                                <span className="font-medium">
                                    {timeRange ? `${formatTime(timeRange.startTime)} - ${formatTime(timeRange.endTime)}` : ''}
                                </span>
                            </div>
                            <div className="flex justify-between text-lg font-semibold text-purple-400 mt-2">
                                <span>Total Amount:</span>
                                <span>₱{totalAmount?.toLocaleString() || paymentDetails?.amount?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Customer Details */}
                    <div className="bg-gray-700 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-4 text-white">Customer Details</h3>
                        <div className="space-y-2 text-white">
                            <p><span className="text-gray-400">Name:</span> {customerDetails?.name || customerDetails?.fullName}</p>
                            <p><span className="text-gray-400">Email:</span> {customerDetails?.email}</p>
                            <p><span className="text-gray-400">Phone:</span> {customerDetails?.phone || customerDetails?.phoneNumber}</p>
                            <p><span className="text-gray-400">Location:</span> {customerDetails?.location}</p>
                            {(customerDetails?.notes || customerDetails?.specialRequest) && (
                                <p><span className="text-gray-400">Requests:</span> {customerDetails?.notes || customerDetails?.specialRequest}</p>
                            )}
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-gray-700 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-4 text-white">Payment Details</h3>
                        
                        {/* Payment Type */}
                        <div className="mb-4">
                            <p className="text-sm text-gray-400 mb-2">Selected Payment Type</p>
                            <div className="p-3 rounded-lg border border-gray-600 bg-gray-700/50">
                                <div className="text-lg font-semibold text-white">
                                    {paymentDetails?.type === 'full' || paymentDetails?.paymentType === 'Full Payment'
                                        ? 'Full Payment'
                                        : 'Down Payment'}
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="mb-4">
                            <p className="text-sm text-gray-400 mb-2">Selected Payment Method</p>
                            <div className="p-3 rounded-lg border border-gray-600 bg-gray-700/50">
                                <div className="text-lg font-semibold text-white">
                                    {paymentDetails?.method === 'bank' || paymentDetails?.paymentMode === 'Bank Transfer'
                                        ? 'Bank Transfer'
                                        : 'GCash'}
                                </div>
                            </div>
                        </div>

                        {/* Paid Amount */}
                        <div className="mb-4">
                            <p className="text-sm text-gray-400 mb-2">Paid Amount</p>
                            <div className="p-3 rounded-lg border border-gray-600 bg-gray-700/50">
                                <div className="text-lg font-semibold text-purple-400">
                                    ₱{paymentDetails?.amount?.toLocaleString() || '0'}
                                </div>
                            </div>
                        </div>

                        {/* Account Number (only if GCash was selected) */}
                        {(paymentDetails?.method === 'gcash' || paymentDetails?.paymentMode === 'Gcash') && (
                            <div className="mb-4">
                                <h4 className="text-sm text-gray-400 mb-2">GCash Account Number</h4>
                                <div className="p-3 rounded-lg border border-gray-600 bg-gray-700/50">
                                    <div className="text-lg font-semibold text-white">
                                        {paymentDetails?.accountNumber || 'Not provided'}
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Payment Proof (if available) */}
                            {paymentDetails?.paymentProof && (
                                <div className="mb-4">
                                    <h4 className="text-sm text-gray-400 mb-2">Payment Proof</h4>
                                    <div className="p-3 rounded-lg border border-gray-600 bg-gray-700/50">
                                        <img 
                                            src={`/api/files/download/${paymentDetails.paymentProof}`}
                                            alt="Payment Proof" 
                                            className="w-full rounded"
                                            onClick={() => window.open(`/api/files/download/${paymentDetails.paymentProof}`, '_blank')}
                                            style={{ cursor: 'pointer' }}
                                        />
                                        <p className="text-xs text-gray-400 text-center mt-2">Click to view full image</p>
                                    </div>
                                </div>
                            )}

                            {/* GCash Number (if GCash was selected) */}
                            {paymentDetails?.paymentMethod === 'GCASH' && paymentDetails?.gcashNumber && (
                                <div className="mb-4">
                                    <h4 className="text-sm text-gray-400 mb-2">GCash Number</h4>
                                    <div className="p-3 rounded-lg border border-gray-600 bg-gray-700/50">
                                        <div className="text-lg font-semibold text-white">
                                            {paymentDetails.gcashNumber}
                                        </div>
                                    </div>
                                </div>
                            )}

                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-700 flex justify-between">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-white border border-gray-600 rounded hover:bg-gray-700"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => handleUpdateBooking(booking)}
                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                        Update
                    </button>
                </div>
            </div>
            {showUpdateModal && bookingToUpdate && (
            <UpdateSchedule
                booking={bookingToUpdate}
                onClose={() => setShowUpdateModal(false)}
                onUpdate={handleSaveUpdatedBooking}
            />
)}
        </div>
    );
}

export default ShowScheduleDetails;