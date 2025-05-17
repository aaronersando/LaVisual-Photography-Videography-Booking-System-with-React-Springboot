package com.La.Visual.entity;

import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.With;
import lombok.ToString;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Getter
@With
@Builder(toBuilder = true)
@ToString
@EqualsAndHashCode
@AllArgsConstructor
public class Booking {
    private final Integer bookingId;
    private final String guestName;
    private final String guestEmail;
    private final String guestPhone;
    private final LocalDate bookingDate;
    private final LocalTime bookingTimeStart;
    private final LocalTime bookingTimeEnd;
    private final Integer bookingHours;
    private final String location;
    private final String categoryName;
    private final String packageName;
    private final Double packagePrice;
    private final String specialRequests;
    private final String bookingStatus;
    private final String bookingReference;
    private final Integer paymentId;
    private final String paymentProof;
    private final String adminNotes;
    private final LocalDateTime createdAt;
    
    // Keep your custom methods
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