package com.La.Visual.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record BookingRequest(
    String guestName,
    String guestEmail,
    String guestPhone,
    LocalDate bookingDate,
    LocalTime bookingTimeStart,
    LocalTime bookingTimeEnd,
    Integer bookingHours,
    String location,
    String categoryName,
    String packageName,
    Double packagePrice,
    String specialRequests,
    String bookingReference,
    
    // Payment information
    String paymentType,
    String paymentMethod,
    Double amount,
    String accountNumber, // Not stored but may be useful for reference
    String gcashNumber
) {}