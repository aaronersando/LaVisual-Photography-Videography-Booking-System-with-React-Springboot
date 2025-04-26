package com.La.Visual.controller;

import com.La.Visual.dto.RequestResponse;
import com.La.Visual.dto.UnavailableRangesRequest;
import com.La.Visual.service.AuthService;
import com.La.Visual.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {
    
    private final ScheduleService scheduleService;
    private final AuthService authService;
    
    @Autowired
    public ScheduleController(ScheduleService scheduleService, AuthService authService) {
        this.scheduleService = scheduleService;
        this.authService = authService;
    }
    
    @PostMapping("/unavailable")
    public ResponseEntity<RequestResponse> saveUnavailableTimeRanges(
            @RequestBody UnavailableRangesRequest request,
            @RequestHeader("Authorization") String authHeader) {
        
        try {
            // Verify the admin is authenticated
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            if (!authService.isAdminAuthenticated(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new RequestResponse(
                        "Unauthorized access", 
                        null, 
                        401, 
                        false
                    ));
            }
            
            scheduleService.saveUnavailableTimeRanges(request.getDate(), request.getUnavailableRanges());
            
            return ResponseEntity.ok(new RequestResponse(
                "Unavailable time ranges saved successfully", 
                null, 
                200, 
                true
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new RequestResponse(
                    "Failed to save unavailable time ranges: " + e.getMessage(), 
                    null, 
                    500, 
                    false
                ));
        }
    }
    
    @GetMapping("/unavailable/{date}")
    public ResponseEntity<RequestResponse> getUnavailableTimeRanges(
            @PathVariable String date,
            @RequestHeader("Authorization") String authHeader) {
        
        try {
            // Verify the admin is authenticated
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            if (!authService.isAdminAuthenticated(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new RequestResponse(
                        "Unauthorized access", 
                        null, 
                        401, 
                        false
                    ));
            }
            
            List<com.La.Visual.dto.UnavailableTimeRange> ranges = scheduleService.getUnavailableTimeRangesDto(date);
            
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("unavailableRanges", ranges);
            
            return ResponseEntity.ok(new RequestResponse(
                "Unavailable time ranges retrieved successfully", 
                responseData, 
                200, 
                true
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new RequestResponse(
                    "Failed to retrieve unavailable time ranges: " + e.getMessage(), 
                    null, 
                    500, 
                    false
                ));
        }
    }
}