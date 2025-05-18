/**
 * Booking Service
 * 
 * This service class is the heart of the booking system, handling all business logic related to bookings
 * for photography services. It serves as an intermediary between the controllers (which handle HTTP requests) 
 * and the repositories (which manage data persistence).
 * 
 * Key responsibilities:
 * - Creating bookings (standard, with payment proof, and manual admin bookings)
 * - Retrieving bookings (by ID, email, status, date, etc.)
 * - Updating booking information (status, time ranges, general details)
 * - Managing the booking approval/rejection workflow
 * - Handling payment information related to bookings
 * - Providing calendar/scheduling data
 * - Deleting bookings and managing associated data cleanup
 * 
 * The service manages the complex relationship between bookings and payments, ensuring data consistency
 * through transaction management, and returns standardized response objects with appropriate status codes.
 * 
 * All public methods return a RequestResponse object (except for a few specific update methods)
 * that contains a message, data, status code, and success flag to provide a consistent API.
 */
package com.La.Visual.service;

// Import DTOs (Data Transfer Objects) used for request/response data
import com.La.Visual.dto.BookingRequest;
import com.La.Visual.dto.BookingTimeUpdateRequest;
import com.La.Visual.dto.BookingUpdateRequest;
import com.La.Visual.dto.RequestResponse;
// Import entity classes representing database records
import com.La.Visual.entity.Booking;
import com.La.Visual.entity.Payment;
// Import repositories for database operations
import com.La.Visual.repository.BookingRepository;
import com.La.Visual.repository.PaymentRepository;
// Import Spring annotations for dependency injection and transaction management
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
// Import Java utility classes
import java.util.UUID;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import java.util.Random;
import java.util.HashMap;
import com.La.Visual.entity.Payment;

// Mark this class as a service component in Spring's component scanning
@Service
public class BookingService {

    // Repository dependencies needed for data access, marked as final for immutability
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    /**
     * Constructor with dependency injection via @Autowired
     * Spring will automatically provide the repository instances
     * 
     * @param bookingRepository Repository for booking data operations
     * @param paymentRepository Repository for payment data operations
     */
    @Autowired
    public BookingService(BookingRepository bookingRepository, PaymentRepository paymentRepository) {
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
    }

    /**
     * Creates a new booking based on the client request
     * Uses a three-step process to handle the circular reference between bookings and payments
     * 
     * @param request The BookingRequest containing all booking information
     * @return RequestResponse with booking and payment IDs if successful
     */
    @Transactional // Ensures this method executes as a database transaction (all or nothing)
    public RequestResponse createBooking(BookingRequest request) {
        try {
            // Step 1: Create initial payment (without booking_id)
            // This step creates a payment record first, which will later be linked to the booking
            Payment initialPayment = paymentRepository.saveInitial(
                null, // Will be set after booking creation
                request.amount(),
                request.paymentType(),
                request.paymentMethod(), 
                request.gcashNumber()
            );
            
            // Use provided reference or generate a new one if not provided
            // The booking reference is a unique identifier for the booking (like a confirmation code)
            String bookingReference = request.bookingReference();
            if (bookingReference == null || bookingReference.isEmpty()) {
                bookingReference = generateBookingReference();
            }
            
            // Step 2: Create booking with payment_id
            // Uses builder pattern from Lombok to create a Booking object
            Booking booking = Booking.builder()
                .guestName(request.guestName())
                .guestEmail(request.guestEmail())
                .guestPhone(request.guestPhone())
                .bookingDate(request.bookingDate())
                .bookingTimeStart(request.bookingTimeStart())
                .bookingTimeEnd(request.bookingTimeEnd())
                .bookingHours(request.bookingHours())
                .location(request.location())
                .categoryName(request.categoryName())
                .packageName(request.packageName())
                .packagePrice(request.packagePrice())
                .specialRequests(request.specialRequests())
                .bookingStatus("PENDING") // Initial status
                .bookingReference(bookingReference) // Add this line
                .paymentId(initialPayment.getPaymentId())
                .build();
            
            // Save the booking to the database and get back the version with generated ID
            Booking savedBooking = bookingRepository.save(booking);
            
            // Step 3: Update payment with booking_id
            // Now we can update the payment with the booking ID to complete the relationship
            paymentRepository.updateBookingId(
                initialPayment.getPaymentId(),
                savedBooking.getBookingId(),
                savedBooking.getPackagePrice()
            );
            
            // Prepare response with relevant data for the client
            Map<String, Object> data = new HashMap<>();
            data.put("bookingId", savedBooking.getBookingId());
            data.put("paymentId", initialPayment.getPaymentId());
            data.put("bookingReference", savedBooking.getBookingReference()); // Add this line
            
            // Return success response with booking data
            return new RequestResponse(
                "Booking created successfully",
                data,
                200,
                true
            );
            
        } catch (Exception e) {
            // If any error occurs, return an error response
            return new RequestResponse(
                "Error creating booking: " + e.getMessage(),
                null,
                500,
                false
            );
        }
    }
    
    /**
     * Generates a unique booking reference code
     * Format: BK-XXXXXXXX where X is an uppercase alphanumeric character
     * 
     * @return A unique booking reference string
     */
    private String generateBookingReference() {
        return "BK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    /**
     * Retrieves a booking by its ID, including any associated payments
     * 
     * @param id The booking ID to look up
     * @return RequestResponse containing the booking and its payments if found
     */
    public RequestResponse getBookingById(Integer id) {
        try {
            // Use the repository to find the booking by ID, returning an Optional
            return bookingRepository.findById(id)
                .map(booking -> {
                    // If booking is found, get its payments
                    List<Payment> payments = paymentRepository.findByBookingId(booking.getBookingId());
                    
                    // Prepare data for response
                    Map<String, Object> data = new HashMap<>();
                    data.put("booking", booking);
                    data.put("payments", payments);
                    
                    // Return success response
                    return new RequestResponse(
                        "Booking found",
                        data,
                        200,
                        true
                    );
                })
                .orElse(new RequestResponse(
                    "Booking not found",
                    null,
                    404,
                    false
                ));
                
        } catch (Exception e) {
            // If any error occurs, return an error response
            return new RequestResponse(
                "Error retrieving booking: " + e.getMessage(),
                null,
                500,
                false
            );
        }
    }
    
    /**
     * Retrieves all bookings in the system
     * 
     * @return RequestResponse containing a list of all bookings
     */
    public RequestResponse getAllBookings() {
        try {
            // Get all bookings from the repository
            List<Booking> bookings = bookingRepository.findAll();
            
            // Return success response with the list of bookings
            return new RequestResponse(
                "Bookings retrieved successfully",
                Map.of("bookings", bookings),
                200,
                true
            );
        } catch (Exception e) {
            // If any error occurs, return an error response
            return new RequestResponse(
                "Error retrieving bookings: " + e.getMessage(),
                null,
                500,
                false
            );
        }
    }
    
    /**
     * Retrieves all bookings associated with a specific email address
     * Used for showing a user their booking history
     * 
     * @param email The email address to search for
     * @return RequestResponse containing a list of bookings for that email
     */
    public RequestResponse getBookingsByEmail(String email) {
        try {
            // Get all bookings for the specified email
            List<Booking> bookings = bookingRepository.findByGuestEmail(email);
            
            // Return success response with the list of bookings
            return new RequestResponse(
                "Bookings retrieved successfully",
                Map.of("bookings", bookings),
                200,
                true
            );
        } catch (Exception e) {
            // If any error occurs, return an error response
            return new RequestResponse(
                "Error retrieving bookings: " + e.getMessage(),
                null,
                500,
                false
            );
        }
    }
    
    /**
     * Updates the status of a booking
     * Used for changing booking states (e.g., pending to confirmed)
     * 
     * @param id The ID of the booking to update
     * @param status The new status to set
     * @return RequestResponse with updated booking if successful
     */
    @Transactional
    public RequestResponse updateBookingStatus(Integer id, String status) {
        try {
            // Find the booking by ID
            return bookingRepository.findById(id)
                .map(booking -> {
                    // Create a new booking with updated status (immutable pattern)
                    Booking updatedBooking = booking.withBookingStatus(status);
                    // Save the updated booking
                    bookingRepository.update(updatedBooking);
                    
                    // Return success response with updated booking
                    return new RequestResponse(
                        "Booking status updated successfully",
                        Map.of("booking", updatedBooking),
                        200,
                        true
                    );
                })
                .orElse(new RequestResponse(
                    "Booking not found",
                    null,
                    404,
                    false
                ));
        } catch (Exception e) {
            // If any error occurs, return an error response
            return new RequestResponse(
                "Error updating booking status: " + e.getMessage(),
                null,
                500,
                false
            );
        }
    }

    /**
     * Creates a new booking with payment proof in a single operation
     * Similar to createBooking but includes payment proof processing
     * 
     * @param request The BookingRequest containing all booking information
     * @param proofFileName The filename of the uploaded payment proof
     * @return RequestResponse with booking, payment IDs and proof info if successful
     */
    @Transactional
    public RequestResponse createBookingWithProof(BookingRequest request, String proofFileName) {
        try {
            // Step 1: Create initial payment (without booking_id)
            Payment initialPayment = paymentRepository.saveInitial(
                null, // Will be set after booking creation
                request.amount(),
                request.paymentType(),
                request.paymentMethod(),
                request.gcashNumber()
            );
            
            // Step 2: Set the payment proof immediately
            paymentRepository.updatePaymentProof(initialPayment.getPaymentId(), proofFileName);
            
            // Use provided reference or generate a new one if not provided
            String bookingReference = request.bookingReference();
            if (bookingReference == null || bookingReference.isEmpty()) {
                bookingReference = generateBookingReference();
            }
            
            // Step 3: Create booking with payment_id and payment_proof
            Booking booking = Booking.builder()
                .guestName(request.guestName())
                .guestEmail(request.guestEmail())
                .guestPhone(request.guestPhone())
                .bookingDate(request.bookingDate())
                .bookingTimeStart(request.bookingTimeStart())
                .bookingTimeEnd(request.bookingTimeEnd())
                .bookingHours(request.bookingHours())
                .location(request.location())
                .categoryName(request.categoryName())
                .packageName(request.packageName())
                .packagePrice(request.packagePrice())
                .specialRequests(request.specialRequests())
                .bookingStatus("PENDING") // Initial status
                .bookingReference(bookingReference)
                .paymentId(initialPayment.getPaymentId())
                .paymentProof(proofFileName)  // Add payment proof directly to booking
                .createdAt(LocalDateTime.now())
                .build();
            
            // Save the booking to the database
            Booking savedBooking = bookingRepository.save(booking);
            
            // Update payment with booking_id
            paymentRepository.updateBookingId(
                initialPayment.getPaymentId(),
                savedBooking.getBookingId(),
                savedBooking.getPackagePrice()
            );
            
            // Update payment status to COMPLETED since proof is provided
            Payment updatedPayment = initialPayment
                .withPaymentStatus("COMPLETED")
                .withBookingId(savedBooking.getBookingId())
                .withPaymentProof(proofFileName);
                
            paymentRepository.update(updatedPayment);
            
            // Prepare response data
            Map<String, Object> data = new HashMap<>();
            data.put("bookingId", savedBooking.getBookingId());
            data.put("paymentId", initialPayment.getPaymentId());
            data.put("bookingReference", savedBooking.getBookingReference());
            data.put("paymentProof", proofFileName);
            
            // Return success response
            return new RequestResponse(
                "Booking created successfully with payment proof",
                data,
                200,
                true
            );
        } catch (Exception e) {
            // If any error occurs, return an error response
            return new RequestResponse(
                "Error creating booking: " + e.getMessage(),
                null,
                500,
                false
            );
        }
    }

    /**
     * Deletes a booking and its associated payment data
     * Uses a careful approach to handle the circular reference between bookings and payments
     * 
     * @param id The ID of the booking to delete
     * @return RequestResponse indicating success or failure
     */
    @Transactional
    public RequestResponse deleteBooking(Integer id) {
        try {
            // First check if the booking exists
            return bookingRepository.findById(id)
                .map(booking -> {
                    try {
                        // Step 1: Break the circular reference by unlinking payments from this booking
                        paymentRepository.unlinkPaymentsFromBooking(id);
                        
                        // Step 2: Now that no payments reference this booking, delete it
                        boolean bookingDeleted = bookingRepository.deleteById(id);
                        if (!bookingDeleted) {
                            return new RequestResponse(
                                "Failed to delete booking",
                                null,
                                500,
                                false
                            );
                        }
                        
                        // Step 3: Delete any associated payments (optional if they're already unlinked)
                        Integer paymentId = booking.getPaymentId();
                        if (paymentId != null) {
                            paymentRepository.deleteById(paymentId);
                        }
                        
                        // Return success response
                        return new RequestResponse(
                            "Booking deleted successfully",
                            null,
                            200,
                            true
                        );
                    } catch (Exception e) {
                        // Log the stack trace for debugging
                        e.printStackTrace();
                        return new RequestResponse(
                            "Error in deletion process: " + e.getMessage(),
                            null,
                            500,
                            false
                        );
                    }
                })
                .orElse(new RequestResponse(
                    "Booking not found",
                    null,
                    404,
                    false
                ));
        } catch (Exception e) {
            // Log the stack trace for debugging
            e.printStackTrace();
            return new RequestResponse(
                "Error deleting booking: " + e.getMessage(),
                null,
                500,
                false
            );
        }
    }

    /**
     * Updates general booking information
     * Different from updateBookingStatus as it changes multiple fields
     * 
     * @param id The ID of the booking to update
     * @param request The BookingUpdateRequest with new field values
     * @return The updated Booking entity
     * @throws RuntimeException if booking not found
     */
    @Transactional
    public Booking updateBooking(Long id, BookingUpdateRequest request) {
        // Find the booking by ID
        Booking existingBooking = bookingRepository.findById(id.intValue())
            .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        
        // Update the booking fields using the immutable pattern (.with methods)
        Booking updatedBooking = existingBooking
            .withPackageName(request.packageName())
            .withCategoryName(request.category())
            .withGuestName(request.guestName())
            .withGuestPhone(request.phoneNumber())
            .withLocation(request.location())
            .withSpecialRequests(request.specialRequest());
        
        // Save the updated booking
        return bookingRepository.update(updatedBooking);
    }

    /**
     * Updates the time range (start and end time) of a booking
     * Checks for scheduling conflicts with other bookings
     * 
     * @param request The BookingTimeUpdateRequest with booking ID and new times
     * @return RequestResponse with updated booking if successful
     */
    @Transactional
    public RequestResponse updateBookingTimeRange(BookingTimeUpdateRequest request) {
        try {
            // Get the booking from the database
            Optional<Booking> bookingOpt = bookingRepository.findById(request.getBookingId());
            
            if (bookingOpt.isEmpty()) {
                return new RequestResponse(
                    "Booking not found with ID: " + request.getBookingId(), 
                    null, 
                    404, 
                    false
                );
            }
            
            Booking booking = bookingOpt.get();
            
            // Parse the time strings to LocalTime objects
            LocalTime startTime = LocalTime.parse(request.getStartTime());
            LocalTime endTime = LocalTime.parse(request.getEndTime());
            
            // Calculate the new booking hours
            int startHour = startTime.getHour();
            int endHour = endTime.getHour();
            int bookingHours = endHour - startHour;
            
            // If end hour is earlier than start hour (overnight booking), add 24 hours
            if (bookingHours < 0) {
                bookingHours += 24;
            }
            
            // Check if there are any overlapping bookings (excluding the current booking)
            List<Booking> overlappingBookings = bookingRepository.findOverlappingBookings(
                booking.getBookingDate(), 
                startTime, 
                endTime,
                booking.getBookingId()
            );
            
            // If conflicts exist, return an error response with the conflicting bookings
            if (!overlappingBookings.isEmpty()) {
                return new RequestResponse(
                    "Cannot update booking time: overlaps with existing bookings", 
                    Map.of("overlappingBookings", overlappingBookings), 
                    409, 
                    false
                );
            }
            
            // Create updated booking with new time range
            Booking updatedBooking = booking
                .withBookingTimeStart(startTime)
                .withBookingTimeEnd(endTime)
                .withBookingHours(bookingHours);
            
            // Save the updated booking
            Booking savedBooking = bookingRepository.update(updatedBooking);
            
            // Return success response with the updated booking
            return new RequestResponse(
                "Booking time range updated successfully", 
                Map.of("booking", savedBooking), 
                200, 
                true
            );
        } catch (Exception e) {
            // Log the stack trace for debugging
            e.printStackTrace();
            return new RequestResponse(
                "Error updating booking time range: " + e.getMessage(), 
                null, 
                500, 
                false
            );
        }
    }

    /**
     * Creates a booking manually by an administrator
     * Similar to regular booking creation but with different defaults
     * (auto-confirmed status, default email for missing data)
     * 
     * @param request The BookingRequest containing booking information
     * @return RequestResponse with created booking and payment info
     */
    @Transactional
    public RequestResponse createManualBooking(BookingRequest request) {
        try {
            // Generate a unique booking reference
            String bookingReference = generateBookingReference();
            
            // Step 1: Create initial payment (without booking_id)
            Payment initialPayment = paymentRepository.saveInitial(
                null, // Will be set after booking creation
                request.amount(),
                request.paymentType(),
                request.paymentMethod(), 
                request.gcashNumber()
            );
            
            // Step 2: Create booking with payment_id using builder pattern
            Booking booking = Booking.builder()
                .guestName(request.guestName())
                .guestEmail(request.guestEmail() != null ? request.guestEmail() : "manual-booking@admin.com")
                .guestPhone(request.guestPhone())
                .bookingDate(request.bookingDate())
                .bookingTimeStart(request.bookingTimeStart())
                .bookingTimeEnd(request.bookingTimeEnd())
                .bookingHours(request.bookingHours() != null ? request.bookingHours() : 
                            calculateHours(request.bookingTimeStart(), request.bookingTimeEnd()))
                .location(request.location())
                .categoryName(request.categoryName())
                .packageName(request.packageName())
                .packagePrice(request.packagePrice())
                .specialRequests(request.specialRequests())
                .bookingStatus("CONFIRMED") // Admin-created bookings are automatically confirmed
                .bookingReference(bookingReference)
                .paymentId(initialPayment.getPaymentId())
                .build();
            
            // Save the booking
            Booking savedBooking = bookingRepository.save(booking);
            
            // Step 3: Update payment with booking_id and set to completed
            Payment updatedPayment = initialPayment
                .withPaymentStatus("COMPLETED")
                .withBookingId(savedBooking.getBookingId());
            
            paymentRepository.update(updatedPayment);
            
            // Prepare response data
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("booking", savedBooking);
            responseData.put("payment", updatedPayment);
            responseData.put("bookingReference", savedBooking.getBookingReference());
            
            // Return success response with 201 Created status
            return new RequestResponse(
                "Booking created successfully",
                responseData,
                201,
                true
            );
        } catch (Exception e) {
            // Log the stack trace for debugging
            e.printStackTrace();
            return new RequestResponse(
                "Failed to create booking: " + e.getMessage(),
                null,
                500,
                false
            );
        }
    }

    /**
     * Helper method to calculate booking hours from start and end times
     * Handles the case of overnight bookings (where end time is on the next day)
     * 
     * @param startTime The start time of the booking
     * @param endTime The end time of the booking
     * @return The number of hours between start and end time
     */
    private int calculateHours(LocalTime startTime, LocalTime endTime) {
        int startHour = startTime.getHour();
        int endHour = endTime.getHour();
        int bookingHours = endHour - startHour;
        
        // If end hour is earlier than start hour (overnight booking), add 24 hours
        if (bookingHours < 0) {
            bookingHours += 24;
        }
        
        return bookingHours;
    }

    /**
     * Approves a booking, changing its status to CONFIRMED
     * Also stores admin notes about the approval
     * 
     * @param id The ID of the booking to approve
     * @param adminNotes Notes added by the administrator during approval
     * @return RequestResponse with the approved booking if successful
     */
    @Transactional
    public RequestResponse approveBooking(Integer id, String adminNotes) {
        try {
            // Log for debugging
            System.out.println("Approving booking with ID: " + id + ", adminNotes: " + adminNotes);
            
            // Find the booking by ID
            return bookingRepository.findById(id)
                .map(booking -> {
                    try {
                        // Log for debugging
                        System.out.println("Found booking: " + booking.getBookingId() + ", current status: " + booking.getBookingStatus());
                        
                        // Create updated booking with new status and admin notes
                        // Using constructor instead of builder since we're updating all fields
                        Booking updatedBooking = new Booking(
                            booking.getBookingId(),
                            booking.getGuestName(),
                            booking.getGuestEmail(),
                            booking.getGuestPhone(),
                            booking.getBookingDate(),
                            booking.getBookingTimeStart(),
                            booking.getBookingTimeEnd(),
                            booking.getBookingHours(),
                            booking.getLocation(),
                            booking.getCategoryName(),
                            booking.getPackageName(),
                            booking.getPackagePrice(),
                            booking.getSpecialRequests(),
                            "CONFIRMED", // Change from "APPROVED" to "CONFIRMED" to match the ENUM
                            booking.getBookingReference(),
                            booking.getPaymentId(),
                            booking.getPaymentProof(),
                            adminNotes,
                            booking.getCreatedAt()
                        );
                        
                        // Save the updated booking
                        bookingRepository.update(updatedBooking);
                        System.out.println("Successfully updated booking status to CONFIRMED");
                        
                        // Email notification would go here
                        // emailService.sendBookingApprovalEmail(...);
                        
                        // Return success response with the updated booking
                        return new RequestResponse(
                            "Booking approved successfully",
                            Map.of("booking", updatedBooking),
                            200,
                            true
                        );
                    } catch (Exception e) {
                        // Log the error for debugging
                        System.err.println("Error updating booking: " + e.getMessage());
                        e.printStackTrace();
                        throw new RuntimeException("Error updating booking: " + e.getMessage(), e);
                    }
                })
                .orElse(new RequestResponse(
                    "Booking not found",
                    null,
                    404,
                    false
                ));
        } catch (Exception e) {
            // Handle exceptions
            return new RequestResponse(
                "Error approving booking: " + e.getMessage(),
                null,
                500,
                false
            );
        }
    }

    /**
     * Rejects a booking, changing its status to CANCELLED
     * Also stores the reason for rejection
     * 
     * @param id The ID of the booking to reject
     * @param rejectionReason The reason for rejection
     * @return RequestResponse with the rejected booking if successful
     */
    @Transactional
    public RequestResponse rejectBooking(Integer id, String rejectionReason) {
        try {
            // Find the booking by ID
            return bookingRepository.findById(id)
                .map(booking -> {
                    // Update booking status using the immutable pattern
                    Booking updatedBooking = booking
                        .withBookingStatus("CANCELLED") // Change from "REJECTED" to "CANCELLED"
                        .withAdminNotes(rejectionReason);
                    
                    // Save the updated booking
                    bookingRepository.update(updatedBooking);
                    
                    // Email notification would go here
                    // emailService.sendBookingRejectionEmail(...);
                    
                    // Return success response with the updated booking
                    return new RequestResponse(
                        "Booking rejected successfully",
                        Map.of("booking", updatedBooking),
                        200,
                        true
                    );
                })
                .orElse(new RequestResponse(
                    "Booking not found",
                    null,
                    404,
                    false
                ));
        } catch (Exception e) {
            // If any error occurs, return an error response
            return new RequestResponse(
                "Error rejecting booking: " + e.getMessage(),
                null,
                500,
                false
            );
        }
    }

    /**
     * Retrieves all bookings with PENDING status
     * Used by administrators to review bookings that need approval
     * 
     * @return RequestResponse with a list of pending bookings
     */
    public RequestResponse getPendingBookings() {
        try {
            // Query the repository for bookings with PENDING status
            List<Booking> pendingBookings = bookingRepository.findByStatus("PENDING");
            
            // Debug logging
            System.out.println("Found " + pendingBookings.size() + " pending bookings");
            
            // Prepare data for response
            Map<String, Object> data = new HashMap<>();
            data.put("bookings", pendingBookings);
            
            // Return success response with the pending bookings
            return new RequestResponse(
                "Pending bookings retrieved successfully",
                data,
                200,
                true
            );
        } catch (Exception e) {
            // Log the stack trace for debugging
            e.printStackTrace();
            return new RequestResponse(
                "Error retrieving pending bookings: " + e.getMessage(),
                null,
                500,
                false
            );
        }
    }

    /**
     * Retrieves detailed booking information including payment proof
     * Generates a URL for viewing the payment proof file
     * 
     * @param id The ID of the booking to retrieve details for
     * @return RequestResponse with booking details and payment proof URL if available
     */
    public RequestResponse getBookingDetailsWithPaymentProof(Integer id) {
        try {
            // Find the booking by ID
            return bookingRepository.findById(id)
                .map(booking -> {
                    // Prepare data for response
                    Map<String, Object> data = new HashMap<>();
                    data.put("booking", booking);
                    
                    // Get payment info if exists
                    Payment payment = null;
                    if (booking.getPaymentId() != null) {
                        payment = paymentRepository.findById(booking.getPaymentId()).orElse(null);
                        data.put("payment", payment);
                        
                        // Add payment proof URL if exists in the payment object
                        if (payment != null && payment.getPaymentProof() != null && !payment.getPaymentProof().isEmpty()) {
                            String paymentProofUrl = "/api/files/view/" + payment.getPaymentProof();
                            data.put("paymentProofUrl", paymentProofUrl);
                            System.out.println("Found payment proof: " + payment.getPaymentProof());
                        } else {
                            // Try to get from booking as fallback (depending on your schema)
                            if (booking.getPaymentProof() != null && !booking.getPaymentProof().isEmpty()) {
                                String paymentProofUrl = "/api/files/view/" + booking.getPaymentProof();
                                data.put("paymentProofUrl", paymentProofUrl);
                                System.out.println("Found booking payment proof: " + booking.getPaymentProof());
                            } else {
                                System.out.println("No payment proof found for booking ID: " + id);
                            }
                        }
                    }
                    
                    // Return success response with booking details and payment information
                    return new RequestResponse(
                        "Booking details retrieved successfully",
                        data,
                        200,
                        true
                    );
                })
                .orElse(new RequestResponse(
                    "Booking not found",
                    null,
                    404,
                    false
                ));
        } catch (Exception e) {
            // Log the stack trace for debugging
            e.printStackTrace();
            return new RequestResponse(
                "Error retrieving booking details: " + e.getMessage(),
                null,
                500,
                false
            );
        }
    }

    /**
     * Retrieves all approved bookings for a specific date
     * Used for calendar views and availability checking
     * 
     * @param date The date to get bookings for
     * @return RequestResponse with a list of bookings for that date
     */
    public RequestResponse getBookingsForCalendar(LocalDate date) {
        try {
            // Get approved bookings for the specified date
            List<Booking> bookings = bookingRepository.findApprovedBookingsByDate(date);
            
            // Return success response with the bookings
            return new RequestResponse(
                "Bookings retrieved successfully",
                Map.of("bookings", bookings),
                200,
                true
            );
        } catch (Exception e) {
            // If any error occurs, return an error response
            return new RequestResponse(
                "Error retrieving bookings: " + e.getMessage(),
                null,
                500,
                false
            );
        }
    }

    /**
     * Retrieves all approved bookings for a specific month
     * Used for monthly calendar views
     * 
     * @param year The year (e.g., 2023)
     * @param month The month (1-12)
     * @return RequestResponse with a list of bookings for that month
     */
    public RequestResponse getBookingsForMonthCalendar(int year, int month) {
        try {
            // Get approved bookings for the specified month and year
            List<Booking> bookings = bookingRepository.findApprovedBookingsInMonth(year, month);
            
            // Return success response with the bookings
            return new RequestResponse(
                "Bookings for month retrieved successfully",
                Map.of("bookings", bookings),
                200,
                true
            );
        } catch (Exception e) {
            // If any error occurs, return an error response
            return new RequestResponse(
                "Error retrieving bookings for month: " + e.getMessage(),
                null,
                500,
                false
            );
        }
    }

}