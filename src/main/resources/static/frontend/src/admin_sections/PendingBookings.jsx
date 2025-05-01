import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faEye, faSpinner } from '@fortawesome/free-solid-svg-icons';

function PendingBookings() {
    const [pendingBookings, setPendingBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [adminNotes, setAdminNotes] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [actionInProgress, setActionInProgress] = useState(false);

    useEffect(() => {
        fetchPendingBookings();
    }, []);

    const fetchPendingBookings = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const token = localStorage.getItem('token');
            
            // Log the request for debugging
            console.log("Fetching pending bookings with token:", token ? "Token exists" : "No token");
            
            const response = await axios.get('http://localhost:8080/api/bookings/pending', {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log("Pending bookings response:", response.data);
            
            if (response.data.success) {
                setPendingBookings(response.data.data.bookings || []);
            } else {
                setError(response.data.message || 'Failed to fetch pending bookings');
            }
        } catch (err) {
            console.error('Error fetching pending bookings:', err);
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error("Server responded with error:", err.response.data);
                setError(`Error loading pending bookings: ${err.response.status} - ${err.response.data.message || err.message}`);
            } else if (err.request) {
                // The request was made but no response was received
                console.error("No response received:", err.request);
                setError('Error loading pending bookings: No response from server. Please check your network connection.');
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error setting up request:", err.message);
                setError('Error loading pending bookings: ' + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (bookingId) => {
        try {
            setActionInProgress(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/bookings/${bookingId}/details`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success) {
                setSelectedBooking(response.data.data);
                setShowDetailsModal(true);
            } else {
                alert('Failed to load booking details: ' + response.data.message);
            }
        } catch (err) {
            alert('Error loading booking details: ' + (err.response?.data?.message || err.message));
            console.error('Error fetching booking details:', err);
        } finally {
            setActionInProgress(false);
        }
    };

    const handleApprove = async () => {
        if (!selectedBooking) return;
        
        try {
            setActionInProgress(true);
            const token = localStorage.getItem('token');
            
            // Debug log
            console.log(`Sending approval request for booking ID: ${selectedBooking.booking.bookingId}`);
            console.log(`Admin notes: ${adminNotes}`);
            
            const response = await axios.put(
                `http://localhost:8080/api/bookings/${selectedBooking.booking.bookingId}/approve`,
                { adminNotes },
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    } 
                }
            );
            
            console.log("Approval response:", response.data);
            
            if (response.data.success) {
                alert('Booking approved successfully');
                setShowDetailsModal(false);
                // Reset the state
                setAdminNotes('');
                fetchPendingBookings(); // Refresh the list
            } else {
                alert('Failed to approve booking: ' + response.data.message);
            }
        } catch (err) {
            console.error('Error details:', err);
            if (err.response) {
                console.error('Server response:', err.response.data);
                alert(`Error approving booking: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`);
            } else {
                alert('Error approving booking: ' + err.message);
                console.error('Error approving booking:', err);
            }
        } finally {
            setActionInProgress(false);
        }
    };

    const handleReject = async () => {
        if (!selectedBooking || !rejectionReason.trim()) {
            alert('Please provide a reason for rejection');
            return;
        }
        
        try {
            setActionInProgress(true);
            const token = localStorage.getItem('token');
            const response = await axios.put(
                // Use the full URL instead of a relative path
                `http://localhost:8080/api/bookings/${selectedBooking.booking.bookingId}/reject`,
                { reason: rejectionReason },
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    } 
                }
            );
            
            if (response.data.success) {
                alert('Booking rejected successfully');
                setShowDetailsModal(false);
                setRejectionReason(''); // Reset the rejection reason
                fetchPendingBookings(); // Refresh the list
            } else {
                alert('Failed to reject booking: ' + response.data.message);
            }
        } catch (err) {
            alert('Error rejecting booking: ' + (err.response?.data?.message || err.message));
            console.error('Error rejecting booking:', err);
        } finally {
            setActionInProgress(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        const [hour] = timeString.split(':');
        const hourNum = parseInt(hour);
        const ampm = hourNum >= 12 ? 'PM' : 'AM';
        const hour12 = hourNum % 12 || 12;
        return `${hour12}:00 ${ampm}`;
    };

    if (loading) {
        return (
            <div className="p-4 text-center pt-20">
                <div className="inline-block animate-spin text-purple-500 text-4xl mb-4">
                    <FontAwesomeIcon icon={faSpinner} />
                </div>
                <p className="text-gray-300">Loading pending bookings...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-500/20 text-red-100 rounded-md mt-20">
                <p className="font-bold mb-2">Failed to fetch pending bookings</p>
                <p className="mb-4">{error}</p>
                <button
                    onClick={fetchPendingBookings}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto pt-20">
            <h2 className="text-2xl font-bold text-white mb-6">Pending Bookings</h2>
            
            {pendingBookings.length === 0 ? (
                <div className="bg-gray-700 p-6 rounded-lg text-center">
                    <p className="text-gray-300">No pending bookings to review</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Reference</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Client</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Package</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-600">
                            {pendingBookings.map((booking) => (
                                <tr key={booking.bookingId} className="hover:bg-gray-700">
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{booking.bookingReference}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{booking.guestName}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{booking.packageName}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(booking.bookingDate)}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {formatTime(booking.bookingTimeStart)} - {formatTime(booking.bookingTimeEnd)}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-purple-400">₱{booking.packagePrice.toLocaleString()}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                                        <button
                                            onClick={() => handleViewDetails(booking.bookingId)}
                                            disabled={actionInProgress}
                                            className="text-blue-400 hover:text-blue-300 mr-3"
                                            title="View Details"
                                        >
                                            <FontAwesomeIcon icon={faEye} /> View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Details Modal */}
            {showDetailsModal && selectedBooking && (
                <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
                    <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-700">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold text-white">
                                    Booking #{selectedBooking.booking.bookingReference}
                                </h3>
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    &times;
                                </button>
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Booking Details */}
                            <div className="space-y-4">
                                <h4 className="text-lg font-medium text-white border-b border-gray-600 pb-2">Booking Details</h4>
                                
                                <div className="space-y-2 text-sm">
                                    <p><span className="text-gray-400">Client Name:</span> <span className="text-white">{selectedBooking.booking.guestName}</span></p>
                                    <p><span className="text-gray-400">Email:</span> <span className="text-white">{selectedBooking.booking.guestEmail}</span></p>
                                    <p><span className="text-gray-400">Phone:</span> <span className="text-white">{selectedBooking.booking.guestPhone}</span></p>
                                    <p><span className="text-gray-400">Package:</span> <span className="text-white">{selectedBooking.booking.packageName}</span></p>
                                    <p><span className="text-gray-400">Category:</span> <span className="text-white">{selectedBooking.booking.categoryName}</span></p>
                                    <p><span className="text-gray-400">Date:</span> <span className="text-white">{formatDate(selectedBooking.booking.bookingDate)}</span></p>
                                    <p><span className="text-gray-400">Time:</span> <span className="text-white">
                                        {formatTime(selectedBooking.booking.bookingTimeStart)} - {formatTime(selectedBooking.booking.bookingTimeEnd)}
                                    </span></p>
                                    <p><span className="text-gray-400">Location:</span> <span className="text-white">{selectedBooking.booking.location}</span></p>
                                    <p><span className="text-gray-400">Special Requests:</span> <span className="text-white">{selectedBooking.booking.specialRequests || 'None'}</span></p>
                                </div>

                                <div className="mt-4">
                                    <h4 className="text-lg font-medium text-white border-b border-gray-600 pb-2">Payment Details</h4>
                                    <div className="space-y-2 text-sm mt-2">
                                        <p><span className="text-gray-400">Amount:</span> <span className="text-purple-400">₱{selectedBooking.booking.packagePrice.toLocaleString()}</span></p>
                                        <p><span className="text-gray-400">Payment Type:</span> <span className="text-white">
                                            {selectedBooking.payment?.paymentType === 'FULL' ? 'Full Payment' : 'Down Payment'}
                                        </span></p>
                                        <p><span className="text-gray-400">Payment Method:</span> <span className="text-white">{selectedBooking.payment?.paymentMethod || 'N/A'}</span></p>
                                        {selectedBooking.payment?.gcashNumber && (
                                            <p><span className="text-gray-400">GCash Number:</span> <span className="text-white">{selectedBooking.payment.gcashNumber}</span></p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Proof and Actions */}
                            <div className="space-y-4">
                                <h4 className="text-lg font-medium text-white border-b border-gray-600 pb-2">Payment Proof</h4>

                                {selectedBooking.paymentProofUrl ? (
                                    <div className="bg-gray-700 p-2 rounded-lg">
                                        <img 
                                            src={selectedBooking.paymentProofUrl}
                                            alt="Payment Proof" 
                                            className="w-full max-h-60 object-contain rounded"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/images/payment-placeholder.png';
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="bg-gray-700 p-4 rounded-lg text-center text-gray-400">
                                        No payment proof available
                                    </div>
                                )}

                                <div className="mt-6 space-y-4">
                                    <h4 className="text-lg font-medium text-white border-b border-gray-600 pb-2">Admin Actions</h4>
                                    
                                    {/* Approval Section */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-400">
                                            Admin Notes (Optional)
                                        </label>
                                        <textarea
                                            value={adminNotes}
                                            onChange={(e) => setAdminNotes(e.target.value)}
                                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                                            rows="2"
                                            placeholder="Add notes about this booking"
                                        ></textarea>
                                    </div>

                                    <div className="flex space-x-2">
                                        <button
                                            onClick={handleApprove}
                                            disabled={actionInProgress}
                                            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center justify-center"
                                        >
                                            <FontAwesomeIcon icon={faCheck} className="mr-1" /> 
                                            {actionInProgress ? 'Processing...' : 'Approve Booking'}
                                        </button>
                                    </div>

                                    {/* Rejection Section */}
                                    <div className="space-y-2 mt-4">
                                        <label className="block text-sm font-medium text-gray-400">
                                            Rejection Reason (Required for rejection)
                                        </label>
                                        <textarea
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                                            rows="2"
                                            placeholder="Explain why this booking is being rejected"
                                        ></textarea>
                                    </div>

                                    <button
                                        onClick={handleReject}
                                        disabled={actionInProgress || !rejectionReason.trim()}
                                        className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center justify-center disabled:opacity-50"
                                    >
                                        <FontAwesomeIcon icon={faTimes} className="mr-1" /> 
                                        {actionInProgress ? 'Processing...' : 'Reject Booking'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PendingBookings;