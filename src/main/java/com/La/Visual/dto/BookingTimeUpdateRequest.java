/**
 * BookingTimeUpdateRequest DTO (Data Transfer Object)
 * 
 * This class serves as a container for time range update requests for existing bookings.
 * It is used when clients need to modify the start and end times of a booking 
 * without changing other booking details.
 * 
 * Key features:
 * - Captures the ID of the booking to be updated
 * - Contains new start and end times as strings in 24-hour format
 * - Used by the BookingController.updateBookingTimeRange endpoint
 * - Processed by BookingService.updateBookingTimeRange method
 * 
 * Unlike some other DTOs in the system that use Java records, this class uses
 * the traditional approach with private fields and explicit getters/setters,
 * which allows for more flexibility if validation or transformation logic
 * needs to be added in the future.
 */
package com.La.Visual.dto;

// Regular Java class used as a Data Transfer Object for booking time updates
public class BookingTimeUpdateRequest {
    // The unique identifier of the booking to be updated
    private Integer bookingId;
    // The new starting time for the booking, stored as a string in 24-hour format (HH:mm)
    private String startTime;  // in 24-hour format (HH:mm)
    // The new ending time for the booking, stored as a string in 24-hour format (HH:mm)
    private String endTime;    // in 24-hour format (HH:mm)
    
    // Getters and Setters for all fields
    
    /**
     * Returns the ID of the booking to be updated
     * @return the booking ID as an Integer
     */
    public Integer getBookingId() {
        return bookingId;
    }
    
    /**
     * Sets the ID of the booking to be updated
     * @param bookingId the booking ID
     */
    public void setBookingId(Integer bookingId) {
        this.bookingId = bookingId;
    }
    
    /**
     * Returns the new start time for the booking
     * @return the start time as a string in 24-hour format (HH:mm)
     */
    public String getStartTime() {
        return startTime;
    }
    
    /**
     * Sets the new start time for the booking
     * @param startTime the start time as a string in 24-hour format (HH:mm)
     */
    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }
    
    /**
     * Returns the new end time for the booking
     * @return the end time as a string in 24-hour format (HH:mm)
     */
    public String getEndTime() {
        return endTime;
    }
    
    /**
     * Sets the new end time for the booking
     * @param endTime the end time as a string in 24-hour format (HH:mm)
     */
    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }
}