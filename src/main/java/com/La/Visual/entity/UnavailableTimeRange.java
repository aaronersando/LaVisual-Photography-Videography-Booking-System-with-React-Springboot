/**
 * UnavailableTimeRange Entity
 * 
 * This class represents a time period that is marked as unavailable for booking in the system.
 * It is a database entity that maps to the unavailable_time_ranges table and stores information
 * about time slots that are blocked off and cannot be booked by users.
 * 
 * Key features:
 * - Maps to database records for unavailable time ranges
 * - Used by the scheduling system to prevent bookings during blocked times
 * - Stores date, time range (start/end), and status information
 * - Part of the administrative calendar management functionality
 * 
 * This entity class works with the UnavailableTimeRangeRepository for database operations
 * and is used by the ScheduleService for business logic related to unavailable time slots.
 * The DTO version (in the dto package) is used for API communications, while this entity
 * version is used for database operations.
 */
package com.La.Visual.entity;

// Entity class representing an unavailable time range in the database
public class UnavailableTimeRange {
    // Unique identifier for the unavailable time range record
    private Integer id;
    // The date for which this time range is unavailable (stored as string, typically in "YYYY-MM-DD" format)
    private String date;
    // Start time of the unavailable period in 24-hour format (HH:mm)
    private String startTime;
    // End time of the unavailable period in 24-hour format (HH:mm)
    private String endTime;
    // Status of this time range (typically set to "unavailable")
    private String status;
    
    /**
     * Default no-argument constructor
     * Required for ORM frameworks and JSON serialization/deserialization
     */
    public UnavailableTimeRange() {}
    
    /**
     * Fully parameterized constructor to create a complete UnavailableTimeRange instance
     * 
     * @param id Unique identifier for the record
     * @param date Date string in "YYYY-MM-DD" format
     * @param startTime Start time string in "HH:mm" format
     * @param endTime End time string in "HH:mm" format
     * @param status Status string (typically "unavailable")
     */
    public UnavailableTimeRange(Integer id, String date, String startTime, String endTime, String status) {
        this.id = id;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
    }
    
    // Getters and setters for all fields
    
    /**
     * Returns the unique identifier of this unavailable time range
     * @return the id as an Integer
     */
    public Integer getId() {
        return id;
    }
    
    /**
     * Sets the unique identifier of this unavailable time range
     * @param id the id to set
     */
    public void setId(Integer id) {
        this.id = id;
    }
    
    /**
     * Returns the date for which this time range is unavailable
     * @return the date as a string in "YYYY-MM-DD" format
     */
    public String getDate() {
        return date;
    }
    
    /**
     * Sets the date for which this time range is unavailable
     * @param date the date to set, in "YYYY-MM-DD" format
     */
    public void setDate(String date) {
        this.date = date;
    }
    
    /**
     * Returns the start time of the unavailable period
     * @return the start time as a string in "HH:mm" format
     */
    public String getStartTime() {
        return startTime;
    }
    
    /**
     * Sets the start time of the unavailable period
     * @param startTime the start time to set, in "HH:mm" format
     */
    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }
    
    /**
     * Returns the end time of the unavailable period
     * @return the end time as a string in "HH:mm" format
     */
    public String getEndTime() {
        return endTime;
    }
    
    /**
     * Sets the end time of the unavailable period
     * @param endTime the end time to set, in "HH:mm" format
     */
    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }
    
    /**
     * Returns the status of this time range
     * @return the status string (typically "unavailable")
     */
    public String getStatus() {
        return status;
    }
    
    /**
     * Sets the status of this time range
     * @param status the status to set (typically "unavailable")
     */
    public void setStatus(String status) {
        this.status = status;
    }
}