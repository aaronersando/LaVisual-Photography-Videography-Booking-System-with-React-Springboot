package com.La.Visual.dto;

public class BookingTimeUpdateRequest {
    private Integer bookingId;
    private String startTime;  // in 24-hour format (HH:mm)
    private String endTime;    // in 24-hour format (HH:mm)
    
    // Getters and Setters
    
    public Integer getBookingId() {
        return bookingId;
    }
    
    public void setBookingId(Integer bookingId) {
        this.bookingId = bookingId;
    }
    
    public String getStartTime() {
        return startTime;
    }
    
    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }
    
    public String getEndTime() {
        return endTime;
    }
    
    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }
}