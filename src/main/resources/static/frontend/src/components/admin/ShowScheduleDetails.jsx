/**
 * Booking Details Modal Component
 * 
 * This component displays a detailed view of a booking in a modal dialog.
 * It shows comprehensive booking information including booking summary,
 * customer details, and payment information. The component also provides
 * functionality to update the booking through a nested update modal.
 * 
 * It's used in the admin dashboard when an admin clicks on the "Show Details"
 * button for a booking in the schedule management interface.
 * 
 * The component communicates with the backend API to persist any changes
 * made to booking details.
 */

import React, {useState} from 'react'; // Import React and useState hook
import UpdateSchedule from './UpdateSchedule'; // Import the UpdateSchedule component for editing bookings

function ShowScheduleDetails({ booking, onClose, onUpdate }) {
    // State to control visibility of the update modal
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    // State to store the booking that is being updated
    const [bookingToUpdate, setBookingToUpdate] = useState(null);
    
    // Destructure booking data for easier access throughout the component
    // Using aliasing (clientEvent: packageName) and default values ({} for paymentDetails)
    const { 
        clientEvent: packageName, // Rename clientEvent to packageName for clarity
        category, 
        date, 
        timeRange, 
        customerDetails,
        paymentDetails = {}, // Default to empty object to avoid null reference errors
        totalAmount,
        bookingReference,
        databaseId, // This is important for the backend to identify the record
        id
    } = booking || {}; // Use empty object as fallback if booking is null/undefined

    // Format date for display - converts ISO date to locale-specific format
    const formatDate = (dateString) => {
        if (!dateString) return ''; // Return empty string if date is not provided
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Format date according to user's locale
    };

    // Format time for display - converts 24-hour format to 12-hour format with AM/PM
    const formatTime = (timeString) => {
        if (!timeString) return ''; // Return empty string if time is not provided
        const [hour] = timeString.split(':'); // Extract hour part from "HH:MM" format
        const hourNum = parseInt(hour); // Convert hour string to number
        const ampm = hourNum >= 12 ? 'PM' : 'AM'; // Determine AM/PM
        const hour12 = hourNum % 12 || 12; // Convert 24-hour to 12-hour format (0 becomes 12)
        return `${hour12}:00 ${ampm}`; // Return formatted time string
    };

    // Handler to initiate the booking update process
    const handleUpdateBooking = (booking) => {
        setBookingToUpdate(booking); // Store the booking to be updated
        setShowUpdateModal(true); // Show the update modal
    };
    
    // Handler to save the updated booking data to the backend
    const handleSaveUpdatedBooking = async (updatedBooking) => {
        // Try different ID fields to ensure we have a valid ID for the API call
        const bookingId = updatedBooking.databaseId || updatedBooking.bookingId || updatedBooking.id;
        
        if (!bookingId) {
            alert('Error: Could not determine booking ID');
            return; // Exit if no valid ID is found
        }
        
        try {
            // Get authentication token from local storage
            const token = localStorage.getItem('token');
            
            if (!token) {
                alert('You need to be logged in as an admin to update bookings');
                return; // Exit if not authenticated
            }
            
            // Prepare data object for the API request
            const apiData = {
                bookingId: bookingId,
                packageName: updatedBooking.package,
                category: updatedBooking.category,
                guestName: updatedBooking.customerDetails.name,
                phoneNumber: updatedBooking.customerDetails.phoneNumber,
                location: updatedBooking.customerDetails.location,
                specialRequest: updatedBooking.customerDetails.specialRequest
            };
            
            console.log('Sending update for booking:', apiData);
            
            // Send update request to backend API
            const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}`, {
                method: 'PUT', // HTTP method for updates
                headers: {
                    'Content-Type': 'application/json', // Content type header
                    'Authorization': `Bearer ${token}` // Authentication header
                },
                body: JSON.stringify(apiData) // Convert data to JSON string
            });
            
            // Parse the response - first get text content
            const responseText = await response.text();
            let responseData;
            
            try {
                // Try to parse response as JSON
                responseData = responseText ? JSON.parse(responseText) : {};
            } catch (e) {
                // If parsing fails, use text as message
                responseData = { message: responseText };
            }
            
            // Handle response based on success/failure
            if (response.ok) {
                alert('Booking updated successfully!');
                setShowUpdateModal(false); // Close the update modal
                
                // Call the onUpdate function from parent to refresh data
                if (onUpdate) {
                    onUpdate(updatedBooking);
                }
                
                // Refresh the page to see the updated data
                window.location.reload();
            } else {
                // Handle error response
                const errorMsg = responseData.message || `Error ${response.status}: Failed to update booking`;
                console.error('Failed to update booking:', errorMsg);
                alert(`Failed to update booking: ${errorMsg}. Please try again.`);
            }
        } catch (error) {
            // Handle exceptions from the fetch operation
            console.error('Error updating booking:', error);
            alert(`Error occurred while updating booking: ${error.message}`);
        }
    };

    return (
        // Modal overlay - covers the entire screen with a semi-transparent black background
        // The onClick handler closes the modal when clicking outside
        <div className="fixed inset-0 mt-[80px] bg-black/50 flex items-center justify-center p-4 z-[60]" onClick={(e) => {
            e.stopPropagation(); 
            onClose();
        }}>
            {/* Modal container - stops click propagation to prevent closing when clicking inside */}
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="p-6 space-y-6">
                    {/* Header section with title */}
                    <h2 className="text-xl font-semibold text-white">Booking Details</h2>

                    {/* Booking Summary section - shows main booking information */}
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

                    {/* Customer Details section - shows customer contact information */}
                    <div className="bg-gray-700 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-4 text-white">Customer Details</h3>
                        <div className="space-y-2 text-white">
                            <p><span className="text-gray-400">Name:</span> {customerDetails?.name || customerDetails?.fullName}</p>
                            <p><span className="text-gray-400">Email:</span> {customerDetails?.email}</p>
                            <p><span className="text-gray-400">Phone:</span> {customerDetails?.phone || customerDetails?.phoneNumber}</p>
                            <p><span className="text-gray-400">Location:</span> {customerDetails?.location}</p>
                            {/* Only show special requests if they exist */}
                            {(customerDetails?.notes || customerDetails?.specialRequest) && (
                                <p><span className="text-gray-400">Requests:</span> {customerDetails?.notes || customerDetails?.specialRequest}</p>
                            )}
                        </div>
                    </div>

                    {/* Payment Details section - shows payment information */}
                    <div className="bg-gray-700 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-4 text-white">Payment Details</h3>
                        
                        {/* Payment Type - full or down payment */}
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

                        {/* Payment Method - always GCash in this implementation */}
                        <div className="mb-4">
                            <p className="text-sm text-gray-400 mb-2">Selected Payment Method</p>
                            <div className="p-3 rounded-lg border border-gray-600 bg-gray-700/50">
                                <div className="text-lg font-semibold text-white">
                                    GCash
                                </div>
                            </div>
                        </div>

                        {/* Paid Amount - with PHP peso sign */}
                        <div className="mb-4">
                            <p className="text-sm text-gray-400 mb-2">Paid Amount</p>
                            <div className="p-3 rounded-lg border border-gray-600 bg-gray-700/50">
                                <div className="text-lg font-semibold text-purple-400">
                                    ₱{paymentDetails?.amount?.toLocaleString() || '0'}
                                </div>
                            </div>
                        </div>

                        {/* Account Number - only shown if GCash was selected */}
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
                        
                        {/* Payment Proof - shows image if available */}
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
                                        onError={(e) => {
                                            console.log("Admin view: Image failed to load");
                                            e.target.onerror = null; // Prevent infinite loop
                                            e.target.src = "/images/payment-placeholder.png"; // Use a placeholder image
                                        }}
                                    />
                                    <p className="text-xs text-gray-400 text-center mt-2">Click to view full image</p>
                                </div>
                            </div>
                        )}

                        {/* Alternative GCash Number display - using different property names */}
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

                {/* Footer with action buttons */}
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
            
            {/* Update booking modal - only rendered when showUpdateModal is true */}
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

export default ShowScheduleDetails; // Export the component for use elsewhere