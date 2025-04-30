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
    String bookingReference,
    Integer paymentId,
    String paymentProof,
    String adminNotes,
    LocalDateTime createdAt
) {
    // Remove this custom builder method - Lombok generates it for you
    // public static Builder builder() {
    //     return new Builder();
    // }

    // Keep your other methods
    public Booking withAdminNotes(String adminNotes) {
        return new Booking(
            this.bookingId,
            this.guestName,
            this.guestEmail,
            this.guestPhone,
            this.bookingDate,
            this.bookingTimeStart,
            this.bookingTimeEnd,
            this.bookingHours,
            this.location,
            this.categoryName,
            this.packageName,
            this.packagePrice,
            this.specialRequests,
            this.bookingStatus,
            this.bookingReference,
            this.paymentId,
            this.paymentProof,
            adminNotes,
            this.createdAt
        );
    }
    
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