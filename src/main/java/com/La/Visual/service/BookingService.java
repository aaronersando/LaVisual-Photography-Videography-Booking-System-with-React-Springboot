package com.La.Visual.service;

import com.La.Visual.dto.BookingRequest;
import com.La.Visual.dto.RequestResponse;
import com.La.Visual.entity.Booking;
import com.La.Visual.entity.Payment;
import com.La.Visual.repository.BookingRepository;
import com.La.Visual.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
            
            // Step 3: Create booking with payment_id
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
                .build();
            
            Booking savedBooking = bookingRepository.save(booking);
            
            // Step 4: Update payment with booking_id
            paymentRepository.updateBookingId(
                initialPayment.paymentId(),
                savedBooking.bookingId(),
                savedBooking.packagePrice()
            );
            
            // Since payment proof is already uploaded, set payment status to COMPLETED
            Payment updatedPayment = initialPayment
                .withPaymentStatus("COMPLETED")
                .withBookingId(savedBooking.bookingId())
                .withPaymentProof(proofFileName);
                
            paymentRepository.update(updatedPayment);
            
            // Prepare response
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
}