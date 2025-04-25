package com.La.Visual.controller;

import com.La.Visual.dto.BookingRequest;
import com.La.Visual.dto.BookingTimeUpdateRequest;
import com.La.Visual.dto.BookingUpdateRequest;
import com.La.Visual.dto.RequestResponse;
import com.La.Visual.entity.Booking;
import com.La.Visual.repository.BookingRepository;
import com.La.Visual.repository.PaymentRepository;
import com.La.Visual.service.BookingService;
import com.La.Visual.service.FileStorageService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.La.Visual.entity.Booking;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final FileStorageService fileStorageService;
    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    @Autowired
    public BookingController(BookingService bookingService, 
                            FileStorageService fileStorageService,
                            PaymentRepository paymentRepository,
                            BookingRepository bookingRepository) {
        this.bookingService = bookingService;
        this.fileStorageService = fileStorageService;
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
            
            String fileName = fileStorageService.storeFile(file);
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
            String proofFileName = fileStorageService.storeFile(proofFile);
            
            // Create the booking with payment proof
            RequestResponse response = bookingService.createBookingWithProof(bookingRequest, proofFileName);
            
            return ResponseEntity.status(response.getStatusCode()).body(response);
            
        } catch (Exception e) {
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



}