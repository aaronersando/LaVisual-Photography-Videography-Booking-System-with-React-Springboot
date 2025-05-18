/**
 * Booking Controller
 * 
 * This controller handles all booking-related HTTP requests in the application.
 * It serves as the REST API endpoint layer for managing photography service bookings,
 * providing endpoints for:
 * - Creating and managing bookings (standard and with payment proof)
 * - Retrieving bookings (by ID, email, date, or status)
 * - Updating booking information (status, time ranges, general details)
 * - Processing bookings (approval, rejection)
 * - Managing payment proofs
 * - Calendar and scheduling features
 * 
 * The controller works with various services and repositories to process requests,
 * handles file uploads for payment proofs, enforces authorization for admin-only actions,
 * and returns standardized responses to the client application.
 */
package com.La.Visual.controller;

// Import DTOs (Data Transfer Objects) used for request/response data
import com.La.Visual.dto.BookingRequest;
import com.La.Visual.dto.BookingTimeUpdateRequest;
import com.La.Visual.dto.BookingUpdateRequest;
import com.La.Visual.dto.RequestResponse;
// Import entity class representing booking data
import com.La.Visual.entity.Booking;
// Import repositories for data access
import com.La.Visual.repository.BookingRepository;
import com.La.Visual.repository.PaymentRepository;
// Import service for booking business logic
import com.La.Visual.service.BookingService;
// Import service for file storage operations
import com.La.Visual.storage.StorageService;
// Import Jackson classes for JSON handling
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

// Import Spring Framework components
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

// Import Java utilities
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

// Define this class as a REST controller that handles requests
@RestController
// Set the base URL path for all endpoints in this controller
@RequestMapping("/api/bookings")
// Allow cross-origin requests from specified frontend development servers
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class BookingController {

    // Dependencies required by this controller, using final for immutability
    private final BookingService bookingService;         // For booking business logic
    private final StorageService storageService;         // For file storage operations
    private final PaymentRepository paymentRepository;   // For direct payment data access
    private final BookingRepository bookingRepository;   // For direct booking data access

    // Constructor with dependency injection via @Autowired
    @Autowired
    public BookingController(BookingService bookingService, 
                            StorageService storageService,
                            PaymentRepository paymentRepository,
                            BookingRepository bookingRepository) {
        this.bookingService = bookingService;
        this.storageService = storageService;
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
    }

    /**
     * Create a new booking
     * POST /api/bookings
     */
    @PostMapping
    public ResponseEntity<RequestResponse> createBooking(@RequestBody BookingRequest request) {
        // Call service to create booking and get response
        RequestResponse response = bookingService.createBooking(request);
        // Return response with appropriate status code
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    /**
     * Get a booking by ID
     * GET /api/bookings/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<RequestResponse> getBookingById(@PathVariable Integer id) {
        // Call service to find booking by ID
        RequestResponse response = bookingService.getBookingById(id);
        // Return response with appropriate status code
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    /**
     * Get all bookings
     * GET /api/bookings
     */
    @GetMapping
    public ResponseEntity<RequestResponse> getAllBookings() {
        // Call service to get all bookings
        RequestResponse response = bookingService.getAllBookings();
        // Return response with appropriate status code
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    /**
     * Get bookings for a specific email
     * GET /api/bookings/email/{email}
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<RequestResponse> getBookingsByEmail(@PathVariable String email) {
        // Call service to find bookings by email
        RequestResponse response = bookingService.getBookingsByEmail(email);
        // Return response with appropriate status code
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    /**
     * Update booking status
     * PUT /api/bookings/{id}/status
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<RequestResponse> updateBookingStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, String> statusUpdate) {
        // Extract status from request body
        String status = statusUpdate.get("status");
        // Call service to update booking status
        RequestResponse response = bookingService.updateBookingStatus(id, status);
        // Return response with appropriate status code
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    /**
     * Upload payment proof for an existing booking
     * POST /api/bookings/{bookingId}/payment-proof
     */
    @PostMapping("/{bookingId}/payment-proof")
    public ResponseEntity<RequestResponse> uploadPaymentProof(
            @PathVariable Integer bookingId,
            @RequestParam("paymentId") Integer paymentId,
            @RequestParam("file") MultipartFile file) {
        
        try {
            // Check if file is not empty
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(new RequestResponse(
                    "File is empty", 
                    null, 
                    400, 
                    false
                ));
            }
            
            // Check file type - only accept image files
            if (!file.getContentType().startsWith("image/")) {
                return ResponseEntity.badRequest().body(new RequestResponse(
                    "Only image files are allowed", 
                    null, 
                    400, 
                    false
                ));
            }
            
            // Generate a unique filename to prevent collisions
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String fileName = UUID.randomUUID().toString() + extension;
            
            // Store file with the generated unique name
            storageService.store(file, fileName);
            // Update payment record with the proof file name
            paymentRepository.updatePaymentProof(paymentId, fileName);
            
            // Prepare response data
            Map<String, Object> data = new HashMap<>();
            data.put("fileName", fileName);
            data.put("bookingId", bookingId);
            data.put("paymentId", paymentId);
            
            // Return success response
            return ResponseEntity.ok(new RequestResponse(
                "Payment proof uploaded successfully", 
                data, 
                200, 
                true
            ));
        } catch (Exception e) {
            // Return error response if anything fails
            return ResponseEntity.status(500).body(new RequestResponse(
                "Error uploading payment proof: " + e.getMessage(), 
                null, 
                500, 
                false
            ));
        }
    }

    /**
     * Create a new booking with payment proof in a single request
     * POST /api/bookings/with-proof
     */
    @PostMapping("/with-proof")
    public ResponseEntity<RequestResponse> createBookingWithProof(
        @RequestParam("bookingData") String bookingDataJson,
        @RequestParam("proofFile") MultipartFile proofFile) {
        
        try {
            // Deserialize the JSON string to BookingRequest object
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule()); // For handling Java 8 date/time types
            BookingRequest bookingRequest = objectMapper.readValue(bookingDataJson, BookingRequest.class);
            
            // Validate the file is provided
            if (proofFile.isEmpty()) {
                return ResponseEntity.badRequest().body(new RequestResponse(
                    "Payment proof is required", 
                    null, 
                    400, 
                    false
                ));
            }
            
            // Validate the file is an image
            if (!proofFile.getContentType().startsWith("image/")) {
                return ResponseEntity.badRequest().body(new RequestResponse(
                    "Only image files are allowed", 
                    null, 
                    400, 
                    false
                ));
            }
            
            // Store the file and get the filename
            String proofFileName = null;
            try {
                // Generate a unique filename
                String originalFilename = proofFile.getOriginalFilename();
                String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                proofFileName = UUID.randomUUID().toString() + extension;
                
                // Store the file
                storageService.store(proofFile, proofFileName);
                System.out.println("Successfully saved payment proof file: " + proofFileName);
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(500).body(new RequestResponse(
                    "Error saving payment proof: " + e.getMessage(), 
                    null, 
                    500, 
                    false
                ));
            }
            
            // Create the booking with payment proof
            RequestResponse response = bookingService.createBookingWithProof(bookingRequest, proofFileName);
            
            // Return appropriate response
            return ResponseEntity.status(response.getStatusCode()).body(response);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(new RequestResponse(
                "Error creating booking: " + e.getMessage(), 
                null, 
                500, 
                false
            ));
        }
    }

    /**
     * Get currently booked time slots for calendar
     * GET /api/bookings/booked-slots
     */
    @GetMapping("/booked-slots")
    public ResponseEntity<RequestResponse> getBookedSlots() {
        try {
            System.out.println("Fetching upcoming bookings...");
            // Get all upcoming bookings directly from repository
            List<Booking> bookings = bookingRepository.findUpcomingBookings();
            System.out.println("Found " + bookings.size() + " upcoming bookings");
            
            // Return success response with the bookings list
            return ResponseEntity.ok(new RequestResponse(
                "Booked slots retrieved successfully",
                Map.of("bookings", bookings),
                200,
                true
            ));
        } catch (Exception e) {
            e.printStackTrace(); // Log error for debugging
            return ResponseEntity.status(500).body(new RequestResponse(
                "Error retrieving booked slots: " + e.getMessage(),
                null,
                500,
                false
            ));
        }
    }

    /**
     * Test endpoint for debugging/health check
     * GET /api/bookings/test-endpoint
     */
    @GetMapping("/test-endpoint")
    public ResponseEntity<String> testEndpoint() {
        System.out.println("Test endpoint called!");
        return ResponseEntity.ok("Test endpoint working!");
    }

    /**
     * Delete a booking
     * DELETE /api/bookings/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<RequestResponse> deleteBooking(@PathVariable Integer id) {
        // Call service to delete booking
        RequestResponse response = bookingService.deleteBooking(id);
        // Return response with appropriate status code
        return new ResponseEntity<>(response, HttpStatus.valueOf(response.getStatusCode()));
    }

    /**
     * Update booking general information
     * PUT /api/bookings/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBooking(@PathVariable Long id, @RequestBody BookingUpdateRequest request) {
        try {
            // Call service to update booking
            Booking updatedBooking = bookingService.updateBooking(id, request);
            
            // Prepare success response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Booking updated successfully");
            response.put("data", updatedBooking);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Prepare error response
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Update booking time range (start and end time)
     * PUT /api/bookings/{id}/time-range
     */
    @PutMapping("/{id}/time-range")
    public ResponseEntity<RequestResponse> updateBookingTimeRange(
            @PathVariable Integer id,
            @RequestBody BookingTimeUpdateRequest request) {
        
        try {
            // Validate that the provided ID matches the request body ID
            if (!id.equals(request.getBookingId())) {
                return ResponseEntity.badRequest().body(new RequestResponse(
                    "Booking ID in path and request body do not match", 
                    null, 
                    400, 
                    false
                ));
            }
            
            // Call service to update the time range
            RequestResponse response = bookingService.updateBookingTimeRange(request);
            
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(new RequestResponse(
                "Error updating booking time range: " + e.getMessage(), 
                null, 
                500, 
                false
            ));
        }
    }

    /**
     * Create a manual booking (admin only)
     * POST /api/bookings/manual
     */
    @PostMapping("/manual")
    public ResponseEntity<?> createManualBooking(@RequestBody BookingRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            // Verify admin permissions - only admins can create manual bookings
            if (!hasAdminRole(userDetails)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new RequestResponse(
                        "Only admins can create manual bookings",
                        null,
                        403,
                        false
                    ));
            }
            
            // Create the booking
            RequestResponse response = bookingService.createManualBooking(request);
            
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new RequestResponse(
                    "Failed to create booking: " + e.getMessage(),
                    null,
                    400,
                    false
                ));
        }
    }

    /**
     * Helper method to check if a user has admin role
     */
    private boolean hasAdminRole(UserDetails userDetails) {
        if (userDetails == null) {
            return false;
        }
        // Check if any of the user's authorities match the ADMIN role
        return userDetails.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ADMIN"));
    }

    /**
     * Get all pending bookings
     * GET /api/bookings/pending
     */
    @GetMapping("/pending")
    public ResponseEntity<RequestResponse> getPendingBookings() {
        System.out.println("GET /api/bookings/pending endpoint called");
        
        try {
            // Get all bookings with PENDING status
            RequestResponse response = bookingService.getPendingBookings();
            System.out.println("Response prepared: success=" + response.isSuccess() + ", statusCode=" + response.getStatusCode());
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            // Log errors for debugging
            System.err.println("Error in getPendingBookings endpoint: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(
                new RequestResponse("Server error: " + e.getMessage(), null, 500, false)
            );
        }
    }

    /**
     * Approve a booking
     * PUT /api/bookings/{id}/approve
     */
    @PutMapping("/{id}/approve")
    public ResponseEntity<RequestResponse> approveBooking(
            @PathVariable Integer id,
            @RequestBody Map<String, String> approvalDetails) {
        
        // Extract admin notes from request, default to empty string if not provided
        String adminNotes = approvalDetails.getOrDefault("adminNotes", "");
        // Call service to approve booking
        RequestResponse response = bookingService.approveBooking(id, adminNotes);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    /**
     * Reject a booking
     * PUT /api/bookings/{id}/reject
     */
    @PutMapping("/{id}/reject")
    public ResponseEntity<RequestResponse> rejectBooking(
            @PathVariable Integer id,
            @RequestBody Map<String, String> rejectionDetails) {
        
        // Extract rejection reason from request, default to empty string if not provided
        String rejectionReason = rejectionDetails.getOrDefault("reason", "");
        // Call service to reject booking
        RequestResponse response = bookingService.rejectBooking(id, rejectionReason);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    /**
     * Get booking details with payment proof
     * GET /api/bookings/{id}/details
     */
    @GetMapping("/{id}/details")
    public ResponseEntity<RequestResponse> getBookingDetailsWithPaymentProof(@PathVariable Integer id) {
        // Call service to get detailed booking information including payment proof
        RequestResponse response = bookingService.getBookingDetailsWithPaymentProof(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    /**
     * Get bookings for a specific date (calendar view)
     * GET /api/bookings/calendar/date/{date}
     */
    @GetMapping("/calendar/date/{date}")
    public ResponseEntity<RequestResponse> getBookingsForCalendar(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        // Call service to get bookings for the specified date
        RequestResponse response = bookingService.getBookingsForCalendar(date);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    /**
     * Get bookings for a specific month (calendar view)
     * GET /api/bookings/calendar/month/{year}/{month}
     */
    @GetMapping("/calendar/month/{year}/{month}")
    public ResponseEntity<RequestResponse> getBookingsForMonthCalendar(
            @PathVariable int year,
            @PathVariable int month) {
        // Call service to get bookings for the specified month and year
        RequestResponse response = bookingService.getBookingsForMonthCalendar(year, month);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}