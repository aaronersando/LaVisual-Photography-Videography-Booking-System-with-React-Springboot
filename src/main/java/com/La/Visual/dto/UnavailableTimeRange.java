/**
 * UnavailableTimeRange DTO (Data Transfer Object)
 * 
 * This class represents a time period that is marked as unavailable for booking in the system.
 * It serves as a data container for transferring unavailable time slot information between
 * different layers of the application (controller, service, and UI).
 * 
 * Key features:
 * - Part of the scheduling system that prevents bookings during blocked-off times
 * - Used in UnavailableRangesRequest as a collection of time slots for a specific date
 * - Transferred between ScheduleController and ScheduleService
 * - Mapped to and from the entity version in the database layer
 * 
 * The time values are stored as strings in 24-hour format (HH:mm) to simplify
 * transfer and front-end integration, avoiding serialization issues with more
 * complex time objects.
 */
package com.La.Visual.dto;

// Standard Java class used for data transfer between application layers
public class UnavailableTimeRange {
    // Date for this unavailable time range (typically in ISO format "YYYY-MM-DD")
    private String date;
    
    // Start time of the unavailable period in 24-hour format (HH:mm)
    private String startTime;
    
    // End time of the unavailable period in 24-hour format (HH:mm)
    private String endTime;
    
    // Status of this time range (typically "unavailable")
    private String status;
    
    /**
     * Gets the date for this unavailable time range
     * @return date in string format
     */
    public String getDate() {
        return date;
    }
    
    /**
     * Sets the date for this unavailable time range
     * @param date The date in string format (typically "YYYY-MM-DD")
     */
    public void setDate(String date) {
        this.date = date;
    }
    
    /**
     * Gets the start time of the unavailable period
     * @return start time in string format
     */
    public String getStartTime() {
        return startTime;
    }
    
    /**
     * Sets the start time of the unavailable period
     * @param startTime The start time in 24-hour format (HH:mm)
     */
    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }
    
    /**
     * Gets the end time of the unavailable period
     * @return end time in string format
     */
    public String getEndTime() {
        return endTime;
    }
    
    /**
     * Sets the end time of the unavailable period
     * @param endTime The end time in 24-hour format (HH:mm)
     */
    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }
    
    /**
     * Gets the status of this time range
     * @return status string (typically "unavailable")
     */
    public String getStatus() {
        return status;
    }
    
    /**
     * Sets the status of this time range
     * @param status The status string (typically "unavailable")
     */
    public void setStatus(String status) {
        this.status = status;
    }
}