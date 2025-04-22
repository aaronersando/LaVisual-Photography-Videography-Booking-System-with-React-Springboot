package com.La.Visual.entity;

import lombok.Builder;
import lombok.With;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Builder
@With
public record Booking(
    Integer bookingId,
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
    String bookingStatus,
    Integer paymentId,
    LocalDateTime createdAt
) {
    public boolean isUpcoming() {
        return bookingDate != null && bookingDate.isAfter(LocalDate.now());
    }
    
    public String getFormattedTime() {
        if (bookingTimeStart == null || bookingTimeEnd == null) {
            return "Time not specified";
        }
        return bookingTimeStart + " - " + bookingTimeEnd;
    }
}