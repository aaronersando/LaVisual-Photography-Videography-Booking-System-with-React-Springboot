package com.La.Visual.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;
import lombok.With;

import java.time.LocalDateTime;

@Getter
@With
@Builder(toBuilder = true)
@ToString
@EqualsAndHashCode
@AllArgsConstructor
public class Payment {
    private final Integer paymentId;
    private final Integer bookingId;
    private final Double amount;
    private final String paymentType;
    private final String paymentMethod;
    private final String paymentStatus;
    private final Double remainingBalance;
    private final String gcashNumber;     
    private final String paymentProof;    
    private final LocalDateTime paymentDate;
    
    public boolean isFullPayment() {
        return "FULL".equalsIgnoreCase(paymentType);
    }
    
    public boolean isCompleted() {
        return "COMPLETED".equalsIgnoreCase(paymentStatus);
    }
}