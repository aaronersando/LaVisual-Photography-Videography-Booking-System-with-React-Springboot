package com.La.Visual.controller;

import com.La.Visual.dto.BookingRequest;
import com.La.Visual.dto.BookingTimeUpdateRequest;
import com.La.Visual.dto.BookingUpdateRequest;
import com.La.Visual.dto.RequestResponse;
import com.La.Visual.entity.Booking;
import com.La.Visual.repository.BookingRepository;
import com.La.Visual.repository.PaymentRepository;
import com.La.Visual.service.BookingService;
import com.La.Visual.storage.StorageService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class BookingController {

    private final BookingService bookingService;
    private final StorageService storageService;
    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

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

    @PostMapping
    public ResponseEntity<RequestResponse> createBooking(@RequestBody BookingRequest request) {
        RequestResponse response = bookingService.createBooking(request);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<RequestResponse> getBookingById(@PathVariable Integer id) {
        RequestResponse response = bookingService.getBookingById(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @GetMapping
    public ResponseEntity<RequestResponse> getAllBookings() {
        RequestResponse response = bookingService.getAllBookings();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @GetMapping("/email/{email}")
    public ResponseEntity<RequestResponse> getBookingsByEmail(@PathVariable String email) {
        RequestResponse response = bookingService.getBookingsByEmail(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<RequestResponse> updateBookingStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, String> statusUpdate) {
        String status = statusUpdate.get("status");
        RequestResponse response = bookingService.updateBookingStatus(id, status);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

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
            
            // Check file type
            if (!file.getContentType().startsWith("image/")) {
                return ResponseEntity.badRequest().body(new RequestResponse(
                    "Only image files are allowed", 
                    null, 
                    400, 
                    false
                ));
            }
            
            // Generate a unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String fileName = UUID.randomUUID().toString() + extension;
            
            // Store file with new name
            storageService.store(file, fileName);
            paymentRepository.updatePaymentProof(paymentId, fileName);
            
            Map<String, Object> data = new HashMap<>();
            data.put("fileName", fileName);
            data.put("bookingId", bookingId);
            data.put("paymentId", paymentId);
            
            return ResponseEntity.ok(new RequestResponse(
                "Payment proof uploaded successfully", 
                data, 
                200, 
                true
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new RequestResponse(
                "Error uploading payment proof: " + e.getMessage(), 
                null, 
                500, 
                false
            ));
        }
    }

    @PostMapping("/with-proof")
    public ResponseEntity<RequestResponse> createBookingWithProof(
        @RequestParam("bookingData") String bookingDataJson,
        @RequestParam("proofFile") MultipartFile proofFile) {
        
        try {
            // Deserialize the JSON string to BookingRequest
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule()); // For handling Java 8 date/time types
            BookingRequest bookingRequest = objectMapper.readValue(bookingDataJson, BookingRequest.class);
            
            // Validate the file
            if (proofFile.isEmpty()) {
                return ResponseEntity.badRequest().body(new RequestResponse(
                    "Payment proof is required", 
                    null, 
                    400, 
                    false
                ));
            }
            
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

    @GetMapping("/booked-slots")
    public ResponseEntity<RequestResponse> getBookedSlots() {
        try {
            System.out.println("Fetching upcoming bookings...");
            List<Booking> bookings = bookingRepository.findUpcomingBookings();
            System.out.println("Found " + bookings.size() + " upcoming bookings");
            
            return ResponseEntity.ok(new RequestResponse(
                "Booked slots retrieved successfully",
                Map.of("bookings", bookings),
                200,
                true
            ));
        } catch (Exception e) {
            e.printStackTrace(); // Add this for better debugging
            return ResponseEntity.status(500).body(new RequestResponse(
                "Error retrieving booked slots: " + e.getMessage(),
                null,
                500,
                false
            ));
        }
    }

    @GetMapping("/test-endpoint")
    public ResponseEntity<String> testEndpoint() {
        System.out.println("Test endpoint called!");
        return ResponseEntity.ok("Test endpoint working!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<RequestResponse> deleteBooking(@PathVariable Integer id) {
        RequestResponse response = bookingService.deleteBooking(id);
        return new ResponseEntity<>(response, HttpStatus.valueOf(response.getStatusCode()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBooking(@PathVariable Long id, @RequestBody BookingUpdateRequest request) {
        try {
            Booking updatedBooking = bookingService.updateBooking(id, request);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Booking updated successfully");
            response.put("data", updatedBooking);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PutMapping("/{id}/time-range")
    public ResponseEntity<RequestResponse> updateBookingTimeRange(
            @PathVariable Integer id,
            @RequestBody BookingTimeUpdateRequest request) {
        
        try {
            // Validate that the provided ID matches the request
            if (!id.equals(request.getBookingId())) {
                return ResponseEntity.badRequest().body(new RequestResponse(
                    "Booking ID in path and request body do not match", 
                    null, 
                    400, 
                    false
                ));
            }
            
            // Call the service method to update the time range
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

    @PostMapping("/manual")
    public ResponseEntity<?> createManualBooking(@RequestBody BookingRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            // Verify admin permissions
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

    private boolean hasAdminRole(UserDetails userDetails) {
        if (userDetails == null) {
            return false;
        }
        return userDetails.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ADMIN"));
    }

    @GetMapping("/pending")
    public ResponseEntity<RequestResponse> getPendingBookings() {
        System.out.println("GET /api/bookings/pending endpoint called");
        
        try {
            RequestResponse response = bookingService.getPendingBookings();
            System.out.println("Response prepared: success=" + response.isSuccess() + ", statusCode=" + response.getStatusCode());
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            System.err.println("Error in getPendingBookings endpoint: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(
                new RequestResponse("Server error: " + e.getMessage(), null, 500, false)
            );
        }
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<RequestResponse> approveBooking(
            @PathVariable Integer id,
            @RequestBody Map<String, String> approvalDetails) {
        
        String adminNotes = approvalDetails.getOrDefault("adminNotes", "");
        RequestResponse response = bookingService.approveBooking(id, adminNotes);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<RequestResponse> rejectBooking(
            @PathVariable Integer id,
            @RequestBody Map<String, String> rejectionDetails) {
        
        String rejectionReason = rejectionDetails.getOrDefault("reason", "");
        RequestResponse response = bookingService.rejectBooking(id, rejectionReason);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<RequestResponse> getBookingDetailsWithPaymentProof(@PathVariable Integer id) {
        RequestResponse response = bookingService.getBookingDetailsWithPaymentProof(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/calendar/date/{date}")
    public ResponseEntity<RequestResponse> getBookingsForCalendar(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        RequestResponse response = bookingService.getBookingsForCalendar(date);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/calendar/month/{year}/{month}")
    public ResponseEntity<RequestResponse> getBookingsForMonthCalendar(
            @PathVariable int year,
            @PathVariable int month) {
        RequestResponse response = bookingService.getBookingsForMonthCalendar(year, month);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}