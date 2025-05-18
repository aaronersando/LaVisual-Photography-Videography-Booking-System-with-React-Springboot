/**
 * BookingRequest DTO (Data Transfer Object)
 * 
 * This record class serves as a data container for incoming booking requests from the client application.
 * It encapsulates all data needed to create a new booking in the system, including:
 * - Guest personal details
 * - Booking scheduling information
 * - Service package selection
 * - Special requirements
 * - Payment details
 * 
 * As a Java record (introduced in Java 14+), it automatically provides:
 * - Immutable data structure
 * - Constructor for all fields
 * - Accessor methods (getters) for each field
 * - Standard implementations of equals(), hashCode(), and toString()
 * 
 * This DTO is used by controllers to receive booking data from client applications,
 * then passed to service classes which process the data and create the actual 
 * booking and payment entities in the database.
 */
package com.La.Visual.dto;

// Import Java time classes for date and time handling
import java.time.LocalDate;
import java.time.LocalTime;

// Record declaration with all fields needed for a complete booking request
public record BookingRequest(
    // Guest information - personal details of the customer making the booking
    String guestName,           // Full name of the person making the booking
    String guestEmail,          // Email address for confirmation and communication
    String guestPhone,          // Contact phone number
    
    // Booking time information - when the service will be provided
    LocalDate bookingDate,      // Date when the service is scheduled
    LocalTime bookingTimeStart, // Starting time of the service
    LocalTime bookingTimeEnd,   // Ending time of the service
    Integer bookingHours,       // Duration of the booking in hours
    
    // Booking details - what and where the service will be provided
    String location,            // Location where the service will be performed
    String categoryName,        // Category of service (e.g., Wedding, Portrait)
    String packageName,         // Specific package selected within the category
    Double packagePrice,        // Price of the selected package
    String specialRequests,     // Any special requirements or notes from the guest
    String bookingReference,    // Optional reference code (generated if null)
    
    // Payment information - details about how the booking will be paid for
    String paymentType,         // Type of payment (e.g., "FULL", "PARTIAL")
    String paymentMethod,       // Method of payment (e.g., "CASH", "GCASH", "BANK_TRANSFER")
    Double amount,              // Amount to be paid
    String accountNumber,       // Not stored but may be useful for reference
    String gcashNumber          // GCash account number if paid via GCash
) {}