package com.La.Visual.entity;

import lombok.Builder;
import lombok.With;

import java.time.LocalDateTime;

@Builder
@With
public record Payment(
    Integer paymentId,
    Integer bookingId,
    Double amount,
    String paymentType,
    String paymentMethod,
    String paymentStatus,
    Double remainingBalance,
    String gcashNumber,     
    String paymentProof,    
    LocalDateTime paymentDate
) {
    public boolean isFullPayment() {
        return "FULL".equalsIgnoreCase(paymentType);
    }
    
    public boolean isCompleted() {
        return "COMPLETED".equalsIgnoreCase(paymentStatus);
    }
}