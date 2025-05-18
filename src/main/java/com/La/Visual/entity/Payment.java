/**
 * Payment Entity
 * 
 * This class represents the payment information in the application, which is associated
 * with bookings for photography services. It captures all details related to a payment
 * transaction, including:
 * - Payment amount and remaining balance (for partial payments)
 * - Payment method (cash, GCash, bank transfer, etc.)
 * - Payment status (pending, completed, etc.)
 * - Payment proof documentation (reference to uploaded files)
 * 
 * Key features:
 * - Immutable design with final fields to ensure data integrity
 * - Linked to bookings through the bookingId reference
 * - Support for different payment types (full payment vs. down payment)
 * - Payment proof tracking for verification purposes
 * 
 * This entity is used throughout the payment processing workflow, from creating
 * initial payment records to updating their status as they move through the system.
 * It works closely with the Booking entity to provide a complete picture of
 * both the service requested and its financial aspects.
 */
package com.La.Visual.entity;

// Import Lombok annotations to reduce boilerplate code
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;
import lombok.With;

// Import Java time for date/time handling
import java.time.LocalDateTime;

// Lombok annotations to generate common methods
@Getter                 // Automatically generates getter methods for all fields
@With                   // Creates withX methods that return a new instance with the changed field
@Builder(toBuilder = true)  // Provides a builder pattern, toBuilder allows creating a builder from an instance
@ToString               // Generates a toString method that includes all fields
@EqualsAndHashCode      // Generates equals and hashCode methods based on all fields
@AllArgsConstructor     // Creates a constructor with all fields as parameters
public class Payment {
    // Core identity fields
    private final Integer paymentId;     // Unique identifier for this payment record
    private final Integer bookingId;     // ID of the booking this payment is associated with
    
    // Payment amount information
    private final Double amount;         // The amount paid in this transaction
    private final Double remainingBalance; // Any remaining amount to be paid (for partial payments)
    
    // Payment classification and method
    private final String paymentType;    // Type of payment (e.g., "FULL", "DOWNPAYMENT")
    private final String paymentMethod;  // Method used for payment (e.g., "CASH", "GCASH", "BANK_TRANSFER")
    private final String paymentStatus;  // Current status of the payment (e.g., "PENDING", "COMPLETED")
    
    // Payment method-specific details
    private final String gcashNumber;    // GCash account number if paid via GCash
    
    // Payment verification
    private final String paymentProof;   // Reference to file/image uploaded as payment proof
    
    // Metadata
    private final LocalDateTime paymentDate; // When the payment was made or recorded
    
    /**
     * Determines if this is a full payment (as opposed to partial/down payment)
     * 
     * @return true if this is a full payment, false otherwise
     */
    public boolean isFullPayment() {
        return "FULL".equalsIgnoreCase(paymentType);
    }
    
    /**
     * Determines if this payment has been completed
     * 
     * @return true if the payment status is "COMPLETED", false otherwise
     */
    public boolean isCompleted() {
        return "COMPLETED".equalsIgnoreCase(paymentStatus);
    }
}