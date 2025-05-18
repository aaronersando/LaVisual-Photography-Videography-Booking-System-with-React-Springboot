/**
 * BookingUpdateRequest DTO (Data Transfer Object)
 * 
 * This record class serves as a data container for updating existing bookings in the system.
 * It encapsulates only the fields that can be modified during a booking update operation,
 * providing a clean and focused interface for the update operation.
 * 
 * Key features:
 * - Used by the BookingController.updateBooking endpoint (PUT /api/bookings/{id})
 * - Processed by BookingService.updateBooking method
 * - Contains only the fields that are allowed to be updated
 * 
 * As a Java record (introduced in Java 14+), it automatically provides:
 * - Immutable data structure
 * - Constructor for all fields
 * - Accessor methods (getters) for each field
 * - Standard implementations of equals(), hashCode(), and toString()
 * 
 * Unlike the full BookingRequest used for creating new bookings, this DTO
 * contains a subset of fields focused on general information updates,
 * and does not include payment or time-related fields which are handled
 * by separate specialized update operations.
 */
package com.La.Visual.dto;

// Java record definition - a compact class for holding immutable data
public record BookingUpdateRequest(
    // The unique identifier of the booking to be updated
    Long bookingId,
    
    // The new package name for the booking (e.g., "Premium Wedding Package")
    String packageName,
    
    // The photography category for the booking (e.g., "Wedding", "Portrait")
    String category,
    
    // The updated name of the guest/customer
    String guestName,
    
    // The updated contact phone number
    String phoneNumber,
    
    // The updated location where the photography session will take place
    String location,
    
    // Any updated special requests or notes from the customer
    String specialRequest
) {}