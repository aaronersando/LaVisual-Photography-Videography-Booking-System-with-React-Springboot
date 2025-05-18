/**
 * Pending Bookings Management Component
 * 
 * This component serves as the administrative interface for managing pending photography/videography bookings.
 * It allows administrators to review, approve, or reject booking requests from customers, and provides
 * detailed information about each booking including customer information, session details, and payment proof.
 * 
 * Key features:
 * - Fetches and displays a list of all pending booking requests
 * - Allows viewing detailed information for each booking
 * - Provides functionality to approve bookings with optional admin notes
 * - Allows rejection of bookings with required explanation
 * - Sends automated email notifications to customers upon approval or rejection
 * - Displays payment proof images uploaded by customers
 * - Handles loading states, errors, and empty data scenarios
 * 
 * This component is an essential part of the booking workflow, allowing admins to review
 * booking requests before they are confirmed and added to the schedule.
 */

import React, { useState, useEffect } from 'react'; // Import React and core hooks
import axios from 'axios'; // Import axios for making HTTP requests
import emailjs from '@emailjs/browser'; // Import emailjs for sending notification emails
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome component
import { faCheck, faTimes, faEye, faSpinner } from '@fortawesome/free-solid-svg-icons'; // Import specific icons
import PaymentProofViewer from '../components/admin/PaymentProofViewer' // Import component to display payment proof images

function PendingBookings() {
    // State for storing the list of pending bookings from the API
    const [pendingBookings, setPendingBookings] = useState([]);
    // State for tracking loading status during API calls
    const [loading, setLoading] = useState(true);
    // State for storing any error messages
    const [error, setError] = useState(null);
    // State for storing the currently selected booking for detailed view
    const [selectedBooking, setSelectedBooking] = useState(null);
    // State to control visibility of the booking details modal
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    // State for storing admin notes when approving a booking
    const [adminNotes, setAdminNotes] = useState('');
    // State for storing the reason when rejecting a booking
    const [rejectionReason, setRejectionReason] = useState('');
    // State to track when an approval/rejection action is in progress
    const [actionInProgress, setActionInProgress] = useState(false);

    // Fetch pending bookings when component mounts
    useEffect(() => {
        fetchPendingBookings();
    }, []);

    // Function to fetch all pending bookings from the backend API
    const fetchPendingBookings = async () => {
        try {
            setLoading(true); // Show loading indicator
            setError(null); // Clear any previous errors
            
            // Get authentication token from localStorage for API authorization
            const token = localStorage.getItem('token');
            
            // Log the request for debugging
            console.log("Fetching pending bookings with token:", token ? "Token exists" : "No token");
            
            // Make GET request to the pending bookings endpoint with auth token
            const response = await axios.get('http://localhost:8080/api/bookings/pending', {
                headers: { 
                    Authorization: `Bearer ${token}`, // Include auth token
                    'Content-Type': 'application/json' // Specify content type
                }
            });
            
            // Log the response for debugging
            console.log("Pending bookings response:", response.data);
            
            // If request was successful, update state with bookings data
            if (response.data.success) {
                setPendingBookings(response.data.data.bookings || []);
            } else {
                // If API indicates an error, set error message
                setError(response.data.message || 'Failed to fetch pending bookings');
            }
        } catch (err) {
            // Handle any errors that occur during the API call
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
            // Always set loading to false when done, regardless of outcome
            setLoading(false);
        }
    };

    // Function to handle viewing the details of a specific booking
    const handleViewDetails = async (bookingId) => {
        try {
            setActionInProgress(true); // Show loading state
            const token = localStorage.getItem('token'); // Get auth token
            
            // Fetch the detailed booking information from the API
            const response = await axios.get(`http://localhost:8080/api/bookings/${bookingId}/details`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // If request was successful, store booking details and show modal
            if (response.data.success) {
                console.log("Booking details:", response.data.data);
                console.log("Payment proof URL:", response.data.data.paymentProofUrl);
                
                // Additional logging for payment proof
                if (response.data.data.payment && response.data.data.payment.paymentProof) {
                    console.log("Payment proof from payment:", response.data.data.payment.paymentProof);
                }
                
                // Update state with booking details and show modal
                setSelectedBooking(response.data.data);
                setShowDetailsModal(true);
            } else {
                // Show error message if API indicates failure
                alert('Failed to load booking details: ' + response.data.message);
            }
        } catch (err) {
            // Handle any errors during the API call
            alert('Error loading booking details: ' + (err.response?.data?.message || err.message));
            console.error('Error fetching booking details:', err);
        } finally {
            // Reset loading state
            setActionInProgress(false);
        }
    };

    // Function to handle approving a booking
    const handleApprove = async () => {
        if (!selectedBooking) return; // Safety check
        
        try {
            setActionInProgress(true); // Show loading state
            const token = localStorage.getItem('token'); // Get auth token
            
            // Debug log
            console.log(`Sending approval request for booking ID: ${selectedBooking.booking.bookingId}`);
            console.log(`Admin notes: ${adminNotes}`);
            
            // Make PUT request to approve the booking
            const response = await axios.put(
                `http://localhost:8080/api/bookings/${selectedBooking.booking.bookingId}/approve`,
                { adminNotes }, // Send admin notes in request body
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    } 
                }
            );
            
            console.log("Approval response:", response.data);
            
            if (response.data.success) {
                // Prepare email parameters for confirmation email to the customer
                const booking = selectedBooking.booking;
                const emailParams = {
                    // Customer information
                    name: booking.guestName,
                    email: booking.guestEmail,
                    phone: booking.guestPhone,
                    
                    // Booking details
                    reference: booking.bookingReference,
                    package: booking.packageName,
                    category: booking.categoryName,
                    date: formatDate(booking.bookingDate),
                    startTime: formatTime(booking.bookingTimeStart),
                    endTime: formatTime(booking.bookingTimeEnd),
                    location: booking.location,
                    specialRequests: booking.specialRequests || 'None',
                    
                    // Payment information
                    paymentType: booking.paymentType === 'FULL' ? 'Full Payment' : 'Down Payment',
                    paymentMethod: booking.paymentMethod || 'GCash',
                    paymentAmount: booking.packagePrice.toLocaleString(),
                    
                    // Admin notes
                    adminNotes: adminNotes || 'No additional notes from the photographer.'
                };
                
                // Send confirmation email using EmailJS service
                try {
                    await emailjs.send('service_01wb493', 'template_7o0b64m', emailParams, '-3twibzAtFBX4xBB2');
                    console.log('Booking confirmation email sent successfully');
                } catch (emailError) {
                    console.error('Error sending confirmation email:', emailError);
                    // Continue with the flow even if email fails
                }
                
                // Show success message, close modal, and reset state
                alert('Booking approved successfully');
                setShowDetailsModal(false);
                // Reset the state
                setAdminNotes('');
                fetchPendingBookings(); // Refresh the list of pending bookings
            } else {
                // Show error if API indicates failure
                alert('Failed to approve booking: ' + response.data.message);
            }
        } catch (err) {
            // Handle any errors during the API call
            console.error('Error details:', err);
            if (err.response) {
                console.error('Server response:', err.response.data);
                alert(`Error approving booking: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`);
            } else {
                alert('Error approving booking: ' + err.message);
                console.error('Error approving booking:', err);
            }
        } finally {
            // Reset loading state
            setActionInProgress(false);
        }
    };

    // Function to handle rejecting a booking
    const handleReject = async () => {
        // Validate that we have a booking and rejection reason
        if (!selectedBooking || !rejectionReason.trim()) {
            alert('Please provide a reason for rejection');
            return;
        }
        
        try {
            setActionInProgress(true); // Show loading state
            const token = localStorage.getItem('token'); // Get auth token
            
            // Make PUT request to reject the booking
            const response = await axios.put(
                // Use the full URL instead of a relative path
                `http://localhost:8080/api/bookings/${selectedBooking.booking.bookingId}/reject`,
                { reason: rejectionReason }, // Send rejection reason in request body
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    } 
                }
            );
            
            if (response.data.success) {
                // Prepare email parameters for rejection notification to the customer
                const booking = selectedBooking.booking;
                const emailParams = {
                    // Customer information
                    name: booking.guestName,
                    email: booking.guestEmail,
                    phone: booking.guestPhone,
                    
                    // Booking details
                    reference: booking.bookingReference,
                    package: booking.packageName,
                    category: booking.categoryName,
                    date: formatDate(booking.bookingDate),
                    
                    // Rejection details
                    rejectionReason: rejectionReason
                };
                
                // Send rejection email using EmailJS service
                try {
                    await emailjs.send('service_01wb493', 'template_2eoafic', emailParams, '-3twibzAtFBX4xBB2');
                    console.log('Booking rejection email sent successfully');
                } catch (emailError) {
                    console.error('Error sending rejection email:', emailError);
                    // Continue with the flow even if email fails
                }
                
                // Show success message, close modal, and reset state
                alert('Booking rejected successfully');
                setShowDetailsModal(false);
                setRejectionReason(''); // Reset the rejection reason
                fetchPendingBookings(); // Refresh the list of pending bookings
            } else {
                // Show error if API indicates failure
                alert('Failed to reject booking: ' + response.data.message);
            }
        } catch (err) {
            // Handle any errors during the API call
            alert('Error rejecting booking: ' + (err.response?.data?.message || err.message));
            console.error('Error rejecting booking:', err);
        } finally {
            // Reset loading state
            setActionInProgress(false);
        }
    };

    // Helper function to format date strings into readable format
    const formatDate = (dateString) => {
        if (!dateString) return ''; // Handle empty input
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    // Helper function to format time strings from 24-hour to 12-hour format
    const formatTime = (timeString) => {
        if (!timeString) return ''; // Handle empty input
        const [hour] = timeString.split(':'); // Extract hour from time string
        const hourNum = parseInt(hour);
        const ampm = hourNum >= 12 ? 'PM' : 'AM'; // Determine AM/PM
        const hour12 = hourNum % 12 || 12; // Convert to 12-hour format
        return `${hour12}:00 ${ampm}`; // Return formatted time string
    };

    // Render loading spinner while data is being fetched
    if (loading) {
        return (
            <div className="p-4 text-center pt-20 mt-15">
                <div className="inline-block animate-spin text-purple-500 text-4xl mb-4">
                    <FontAwesomeIcon icon={faSpinner} />
                </div>
                <p className="text-gray-300">Loading pending bookings...</p>
            </div>
        );
    }

    // Render error message if loading failed
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

    // Main render - table of pending bookings or empty state
    return (
        <div className="container mx-auto pt-20">
            <h2 className="text-2xl font-bold text-white mb-6">Pending Bookings</h2>
            
            {/* Show message when no bookings are available */}
            {pendingBookings.length === 0 ? (
                <div className="bg-gray-700 p-6 rounded-lg text-center">
                    <p className="text-gray-300">No pending bookings to review</p>
                </div>
            ) : (
                // Table display for the list of pending bookings
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
                            {/* Map through bookings array to create table rows */}
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

            {/* Modal for displaying and managing booking details */}
            {showDetailsModal && selectedBooking && (
                <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4" onClick={() => setShowDetailsModal(false)}>
                    <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
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
                            {/* Left column: Booking and Payment Details */}
                            <div className="space-y-4">
                                <h4 className="text-lg font-medium text-white border-b border-gray-600 pb-2">Booking Details</h4>
                                
                                {/* Show all booking details in a list */}
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

                                {/* Payment information section */}
                                <div className="mt-4">
                                    <h4 className="text-lg font-medium text-white border-b border-gray-600 pb-2">Payment Details</h4>
                                    <div className="space-y-2 text-sm mt-2">
                                        <p><span className="text-gray-400">Amount:</span> <span className="text-purple-400">₱{selectedBooking.booking.packagePrice.toLocaleString()}</span></p>
                                        <p><span className="text-gray-400">Payment Type:</span> <span className="text-white">
                                            {selectedBooking.payment?.paymentType === 'FULL' ? 'Full Payment' : 'Down Payment'}
                                        </span></p>
                                        <p><span className="text-gray-400">Payment Method:</span> <span className="text-white">{selectedBooking.payment?.paymentMethod || 'N/A'}</span></p>
                                        {/* Conditionally show GCash number if available */}
                                        {selectedBooking.payment?.gcashNumber && (
                                            <p><span className="text-gray-400">GCash Number:</span> <span className="text-white">{selectedBooking.payment.gcashNumber}</span></p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right column: Payment Proof and Admin Actions */}
                            <div className="space-y-4">
                                <h4 className="text-lg font-medium text-white border-b border-gray-600 pb-2">Payment Proof</h4>

                                {/* Display payment proof image if available */}
                                {selectedBooking.paymentProofUrl ? (
                                    <PaymentProofViewer 
                                        proofUrl={selectedBooking.paymentProofUrl} 
                                    />
                                ) : selectedBooking.payment && selectedBooking.payment.paymentProof ? (
                                    <PaymentProofViewer 
                                        proofUrl={selectedBooking.payment.paymentProof} 
                                    />
                                ) : (
                                    <div className="bg-gray-700 p-4 rounded-lg text-center text-gray-400">
                                        No payment proof available
                                    </div>
                                )}

                                {/* Admin actions section */}
                                <div className="mt-6 space-y-4">
                                    <h4 className="text-lg font-medium text-white border-b border-gray-600 pb-2">Admin Actions</h4>
                                    
                                    {/* Approval Section with optional notes */}
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

                                    {/* Approve button */}
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

                                    {/* Rejection Section with required reason */}
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

                                    {/* Reject button - disabled if no reason provided */}
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

export default PendingBookings; // Export the component for use in the application