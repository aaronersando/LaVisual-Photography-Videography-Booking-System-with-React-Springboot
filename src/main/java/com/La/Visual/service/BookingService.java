package com.La.Visual.service;

import com.La.Visual.dto.BookingRequest;
import com.La.Visual.dto.BookingTimeUpdateRequest;
import com.La.Visual.dto.BookingUpdateRequest;
import com.La.Visual.dto.RequestResponse;
import com.La.Visual.entity.Booking;
import com.La.Visual.entity.Payment;
import com.La.Visual.repository.BookingRepository;
import com.La.Visual.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    @Autowired
    public BookingService(BookingRepository bookingRepository, PaymentRepository paymentRepository) {
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
    }

    @Transactional
    public RequestResponse createBooking(BookingRequest request) {
        try {
            // Step 1: Create initial payment (without booking_id)
            Payment initialPayment = paymentRepository.saveInitial(
                null, // Will be set after booking creation
                request.amount(),
                request.paymentType(),
                request.paymentMethod(), 
                request.gcashNumber()
            );
            
            // Use provided reference or generate a new one if not provided
            String bookingReference = request.bookingReference();
            if (bookingReference == null || bookingReference.isEmpty()) {
                bookingReference = generateBookingReference();
            }
            
            // Step 2: Create booking with payment_id
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
                .paymentId(initialPayment.paymentId())
                .build();
            
            Booking savedBooking = bookingRepository.save(booking);
            
            // Step 3: Update payment with booking_id
            paymentRepository.updateBookingId(
                initialPayment.paymentId(),
                savedBooking.bookingId(),
                savedBooking.packagePrice()
            );
            
            // Prepare response
            Map<String, Object> data = new HashMap<>();
            data.put("bookingId", savedBooking.bookingId());
            data.put("paymentId", initialPayment.paymentId());
            data.put("bookingReference", savedBooking.bookingReference()); // Add this line
            
            return new RequestResponse(
                "Booking created successfully",
                data,
                200,
                true
            );
            
        } catch (Exception e) {
            return new RequestResponse(
                "Error creating booking: " + e.getMessage(),
                null,
                500,
                false
            );
        }
    }
    
    private String generateBookingReference() {
        return "BK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    public RequestResponse getBookingById(Integer id) {
        try {
            return bookingRepository.findById(id)
                .map(booking -> {
                    List<Payment> payments = paymentRepository.findByBookingId(booking.bookingId());
                    
                    Map<String, Object> data = new HashMap<>();
                    data.put("booking", booking);
                    data.put("payments", payments);
                    
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
            return new RequestResponse(
                "Error retrieving booking: " + e.getMessage(),
                null,
                500,
                false
            );
        }
    }
    
    public RequestResponse getAllBookings() {
        try {
            List<Booking> bookings = bookingRepository.findAll();
            
            return new RequestResponse(
                "Bookings retrieved successfully",
                Map.of("bookings", bookings),
                200,
                true
            );
        } catch (Exception e) {
            return new RequestResponse(
                "Error retrieving bookings: " + e.getMessage(),
                null,
                500,
                false
            );
        }
    }
    
    public RequestResponse getBookingsByEmail(String email) {
        try {
            List<Booking> bookings = bookingRepository.findByGuestEmail(email);
            
            return new RequestResponse(
                "Bookings retrieved successfully",
                Map.of("bookings", bookings),
                200,
                true
            );
        } catch (Exception e) {
            return new RequestResponse(
                "Error retrieving bookings: " + e.getMessage(),
                null,
                500,
                false
            );
        }
    }
    
    @Transactional
    public RequestResponse updateBookingStatus(Integer id, String status) {
        try {
            return bookingRepository.findById(id)
                .map(booking -> {
                    Booking updatedBooking = booking.withBookingStatus(status);
                    bookingRepository.update(updatedBooking);
                    
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
            return new RequestResponse(
                "Error updating booking status: " + e.getMessage(),
                null,
                500,
                false
            );
        }
    }

    // In the createBookingWithProof method:

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
            paymentRepository.updatePaymentProof(initialPayment.paymentId(), proofFileName);
            
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
                .paymentId(initialPayment.paymentId())
                .paymentProof(proofFileName)  // Add payment proof directly to booking
                .createdAt(LocalDateTime.now())
                .build();
            
            Booking savedBooking = bookingRepository.save(booking);
            
            // Update payment with booking_id
            paymentRepository.updateBookingId(
                initialPayment.paymentId(),
                savedBooking.bookingId(),
                savedBooking.packagePrice()
            );
            
            // Update payment status to COMPLETED since proof is provided
            Payment updatedPayment = initialPayment
                .withPaymentStatus("COMPLETED")
                .withBookingId(savedBooking.bookingId())
                .withPaymentProof(proofFileName);
                
            paymentRepository.update(updatedPayment);
            
            // Prepare response data
            Map<String, Object> data = new HashMap<>();
            data.put("bookingId", savedBooking.bookingId());
            data.put("paymentId", initialPayment.paymentId());
            data.put("bookingReference", savedBooking.bookingReference());
            data.put("paymentProof", proofFileName);
            
            return new RequestResponse(
                "Booking created successfully with payment proof",
                data,
                200,
                true
            );
        } catch (Exception e) {
            return new RequestResponse(
                "Error creating booking: " + e.getMessage(),
                null,
                500,
                false
            );
        }
    }


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
                        Integer paymentId = booking.paymentId();
                        if (paymentId != null) {
                            paymentRepository.deleteById(paymentId);
                        }
                        
                        return new RequestResponse(
                            "Booking deleted successfully",
                            null,
                            200,
                            true
                        );
                    } catch (Exception e) {
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
            e.printStackTrace();
            return new RequestResponse(
                "Error deleting booking: " + e.getMessage(),
                null,
                500,
                false
            );
        }
    }

    @Transactional
    public Booking updateBooking(Long id, BookingUpdateRequest request) {
        // Find the booking by ID
        Booking existingBooking = bookingRepository.findById(id.intValue())
            .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        
        // Update the booking fields
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
            
            // Parse the time strings
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
                booking.bookingDate(), 
                startTime, 
                endTime,
                booking.bookingId()
            );
            
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
            
            return new RequestResponse(
                "Booking time range updated successfully", 
                Map.of("booking", savedBooking), 
                200, 
                true
            );
        } catch (Exception e) {
            e.printStackTrace();
            return new RequestResponse(
                "Error updating booking time range: " + e.getMessage(), 
                null, 
                500, 
                false
            );
        }
    }

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
                .paymentId(initialPayment.paymentId())
                .build();
            
            // Save the booking
            Booking savedBooking = bookingRepository.save(booking);
            
            // Step 3: Update payment with booking_id and set to completed
            Payment updatedPayment = initialPayment
                .withPaymentStatus("COMPLETED")
                .withBookingId(savedBooking.bookingId());
            
            paymentRepository.update(updatedPayment);
            
            // Prepare response data
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("booking", savedBooking);
            responseData.put("payment", updatedPayment);
            responseData.put("bookingReference", savedBooking.bookingReference());
            
            return new RequestResponse(
                "Booking created successfully",
                responseData,
                201,
                true
            );
        } catch (Exception e) {
            e.printStackTrace();
            return new RequestResponse(
                "Failed to create booking: " + e.getMessage(),
                null,
                500,
                false
            );
        }
    }

    // Helper method to calculate booking hours
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

    @Transactional
    public RequestResponse approveBooking(Integer id, String adminNotes) {
        try {
            System.out.println("Approving booking with ID: " + id + ", adminNotes: " + adminNotes);
            
            return bookingRepository.findById(id)
                .map(booking -> {
                    try {
                        // Update booking status
                        System.out.println("Found booking: " + booking.bookingId() + ", current status: " + booking.bookingStatus());
                        
                        // Create updated booking with new status and admin notes
                        Booking updatedBooking = new Booking(
                            booking.bookingId(),
                            booking.guestName(),
                            booking.guestEmail(),
                            booking.guestPhone(),
                            booking.bookingDate(),
                            booking.bookingTimeStart(),
                            booking.bookingTimeEnd(),
                            booking.bookingHours(),
                            booking.location(),
                            booking.categoryName(),
                            booking.packageName(),
                            booking.packagePrice(),
                            booking.specialRequests(),
                            "CONFIRMED", // Change from "APPROVED" to "CONFIRMED" to match the ENUM
                            booking.bookingReference(),
                            booking.paymentId(),
                            booking.paymentProof(),
                            adminNotes,
                            booking.createdAt()
                        );
                        
                        // Save the updated booking
                        bookingRepository.update(updatedBooking);
                        System.out.println("Successfully updated booking status to CONFIRMED");
                        
                        // Email notification would go here
                        // emailService.sendBookingApprovalEmail(...);
                        
                        return new RequestResponse(
                            "Booking approved successfully",
                            Map.of("booking", updatedBooking),
                            200,
                            true
                        );
                    } catch (Exception e) {
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

    @Transactional
    public RequestResponse rejectBooking(Integer id, String rejectionReason) {
        try {
            return bookingRepository.findById(id)
                .map(booking -> {
                    // Update booking status
                    Booking updatedBooking = booking
                        .withBookingStatus("CANCELLED") // Change from "REJECTED" to "CANCELLED"
                        .withAdminNotes(rejectionReason);
                    
                    bookingRepository.update(updatedBooking);
                    
                    // Email notification would go here
                    // emailService.sendBookingRejectionEmail(...);
                    
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
            return new RequestResponse(
                "Error rejecting booking: " + e.getMessage(),
                null,
                500,
                false
            );
        }
    }

    public RequestResponse getPendingBookings() {
        try {
            List<Booking> pendingBookings = bookingRepository.findByStatus("PENDING");
            
            // Debug logging
            System.out.println("Found " + pendingBookings.size() + " pending bookings");
            
            Map<String, Object> data = new HashMap<>();
            data.put("bookings", pendingBookings);
            
            return new RequestResponse(
                "Pending bookings retrieved successfully",
                data,
                200,
                true
            );
        } catch (Exception e) {
            e.printStackTrace();
            return new RequestResponse(
                "Error retrieving pending bookings: " + e.getMessage(),
                null,
                500,
                false
            );
        }
    }

    public RequestResponse getBookingDetailsWithPaymentProof(Integer id) {
        try {
            return bookingRepository.findById(id)
                .map(booking -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("booking", booking);
                    
                    // Get payment info if exists
                    if (booking.paymentId() != null) {
                        Payment payment = paymentRepository.findById(booking.paymentId()).orElse(null);
                        data.put("payment", payment);
                    }
                    
                    // Add payment proof URL if exists
                    String paymentProofUrl = null;
                    if (booking.paymentProof() != null && !booking.paymentProof().isEmpty()) {
                        paymentProofUrl = "/api/files/download/" + booking.paymentProof();
                        data.put("paymentProofUrl", paymentProofUrl);
                    }
                    
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
            return new RequestResponse(
                "Error retrieving booking details: " + e.getMessage(),
                null,
                500,
                false
            );
        }
    }

    public RequestResponse getBookingsForCalendar(LocalDate date) {
        try {
            List<Booking> bookings = bookingRepository.findApprovedBookingsByDate(date);
            
            return new RequestResponse(
                "Bookings retrieved successfully",
                Map.of("bookings", bookings),
                200,
                true
            );
        } catch (Exception e) {
            return new RequestResponse(
                "Error retrieving bookings: " + e.getMessage(),
                null,
                500,
                false
            );
        }
    }

    public RequestResponse getBookingsForMonthCalendar(int year, int month) {
        try {
            List<Booking> bookings = bookingRepository.findApprovedBookingsInMonth(year, month);
            
            return new RequestResponse(
                "Bookings for month retrieved successfully",
                Map.of("bookings", bookings),
                200,
                true
            );
        } catch (Exception e) {
            return new RequestResponse(
                "Error retrieving bookings for month: " + e.getMessage(),
                null,
                500,
                false
            );
        }
    }

}