package com.La.Visual.dto;

import java.util.List;

public class UnavailableRangesRequest {
    private String date;
    private List<UnavailableTimeRange> unavailableRanges;
    
    public String getDate() {
        return date;
    }
    
    public void setDate(String date) {
        this.date = date;
    }
    
    public List<UnavailableTimeRange> getUnavailableRanges() {
        return unavailableRanges;
    }
    
    public void setUnavailableRanges(List<UnavailableTimeRange> unavailableRanges) {
        this.unavailableRanges = unavailableRanges;
    }
}