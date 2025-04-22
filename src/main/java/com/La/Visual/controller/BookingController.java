package com.La.Visual.controller;

import com.La.Visual.dto.BookingRequest;
import com.La.Visual.dto.RequestResponse;
import com.La.Visual.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    @Autowired
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
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
}