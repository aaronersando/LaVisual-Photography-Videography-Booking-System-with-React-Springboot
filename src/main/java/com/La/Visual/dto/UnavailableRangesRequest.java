/**
 * UnavailableRangesRequest DTO (Data Transfer Object)
 * 
 * This class serves as a container for requests to set multiple unavailable time ranges for a specific date.
 * It is used by the system's scheduling functionality to allow administrators to block off time slots
 * that should not be available for booking (such as holidays, maintenance periods, or reserved times).
 * 
 * Key features:
 * - Contains a single date and multiple unavailable time ranges associated with that date
 * - Used by the ScheduleController.saveUnavailableTimeRanges endpoint (POST /api/schedules/unavailable)
 * - Processed by ScheduleService.saveUnavailableTimeRanges method
 * - Allows for batch processing of multiple time ranges in a single request
 * 
 * This DTO simplifies the API by allowing clients to send a single date with multiple time ranges
 * in one request, rather than requiring separate requests for each unavailable time slot.
 */
package com.La.Visual.dto;

// Import the List interface from Java Collections Framework to store multiple time ranges
import java.util.List;

// Class definition - a standard Java class used as a Data Transfer Object
public class UnavailableRangesRequest {
    // The date for which the unavailable time ranges are being defined (in format like "YYYY-MM-DD")
    private String date;
    
    // List of time ranges that will be marked as unavailable for the specified date
    // Each UnavailableTimeRange contains start time and end time information
    private List<UnavailableTimeRange> unavailableRanges;
    
    /**
     * Returns the date for which the unavailable ranges apply
     * @return the date as a String
     */
    public String getDate() {
        return date;
    }
    
    /**
     * Sets the date for which the unavailable ranges apply
     * @param date the date in String format (typically "YYYY-MM-DD")
     */
    public void setDate(String date) {
        this.date = date;
    }
    
    /**
     * Returns the list of unavailable time ranges for the specified date
     * @return List of UnavailableTimeRange objects
     */
    public List<UnavailableTimeRange> getUnavailableRanges() {
        return unavailableRanges;
    }
    
    /**
     * Sets the list of unavailable time ranges for the specified date
     * @param unavailableRanges List of UnavailableTimeRange objects
     */
    public void setUnavailableRanges(List<UnavailableTimeRange> unavailableRanges) {
        this.unavailableRanges = unavailableRanges;
    }
}