/**
 * Booking Entity
 * 
 * This class represents the core booking entity in the application, containing all information
 * related to a photography service booking. It uses an immutable design pattern where all fields
 * are final, ensuring data integrity throughout the application.
 * 
 * Key features:
 * - Contains all booking data including guest information, scheduling details, and payment references
 * - Uses Lombok annotations to reduce boilerplate code
 * - Provides immutability through final fields
 * - Includes helper methods for common operations on booking data
 * 
 * This entity is used throughout the application for storing, retrieving, and 
 * manipulating booking information. It serves as the core domain model for the
 * booking functionality and is mapped to the database by the BookingRepository.
 */
package com.La.Visual.entity;

// Import Lombok annotations to reduce boilerplate code
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.With;
import lombok.ToString;
import lombok.AllArgsConstructor;

// Import Java time API classes for date and time handling
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

// Lombok annotations to generate common methods
@Getter                 // Automatically generates getter methods for all fields
@With                   // Creates withX methods that return a new instance with the changed field
@Builder(toBuilder = true)  // Provides a builder pattern, toBuilder allows creating a builder from an instance
@ToString               // Generates a toString method that includes all fields
@EqualsAndHashCode      // Generates equals and hashCode methods based on all fields
@AllArgsConstructor     // Creates a constructor with all fields as parameters
public class Booking {
    // Unique identifier for the booking
    private final Integer bookingId;
    
    // Guest/customer information
    private final String guestName;      // Name of the person making the booking
    private final String guestEmail;     // Email for communication and identification
    private final String guestPhone;     // Contact phone number
    
    // Booking date and time details
    private final LocalDate bookingDate;         // Date of the photography session
    private final LocalTime bookingTimeStart;    // Start time of the session
    private final LocalTime bookingTimeEnd;      // End time of the session
    private final Integer bookingHours;          // Duration in hours
    
    // Service details
    private final String location;       // Where the photography session will take place
    private final String categoryName;   // Type of photography (e.g., Wedding, Portrait)
    private final String packageName;    // Specific service package selected
    private final Double packagePrice;   // Price of the selected package
    private final String specialRequests; // Any special requirements from the customer
    
    // Status and reference information
    private final String bookingStatus;      // Current status (e.g., PENDING, CONFIRMED, CANCELLED)
    private final String bookingReference;   // Unique reference code for the booking
    
    // Payment information
    private final Integer paymentId;     // Reference to the associated payment record
    private final String paymentProof;   // File reference to uploaded payment proof
    
    // Administrative information
    private final String adminNotes;     // Notes added by administrators
    
    // Metadata
    private final LocalDateTime createdAt; // When the booking was created
    
    /**
     * Determines if this booking is in the future
     * 
     * @return true if the booking date is after the current date, false otherwise
     */
    public boolean isUpcoming() {
        return bookingDate != null && bookingDate.isAfter(LocalDate.now());
    }
    
    /**
     * Returns a formatted string representation of the booking time range
     * 
     * @return A string in the format "startTime - endTime" or "Time not specified" if times are null
     */
    public String getFormattedTime() {
        if (bookingTimeStart == null || bookingTimeEnd == null) {
            return "Time not specified";
        }
        return bookingTimeStart + " - " + bookingTimeEnd;
    }
}