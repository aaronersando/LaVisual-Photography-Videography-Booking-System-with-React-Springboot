/**
 * Schedule Controller
 * 
 * This controller handles scheduling-related operations in the application's RESTful API.
 * It provides endpoints for managing unavailable time ranges (time slots that are blocked off
 * and cannot be booked by users).
 * 
 * Key features:
 * - Admin-only access for all endpoints through JWT authentication
 * - Creation of unavailable time slots (for blocking off certain times)
 * - Retrieval of unavailable time slots for a specific date
 * - Standardized error handling and response formatting
 * 
 * This controller works alongside the booking system to ensure that customers
 * cannot book appointments during times that administrators have marked as unavailable.
 * It provides the backend functionality needed for admin calendar management.
 */
package com.La.Visual.controller;

// Import necessary DTOs for request/response handling
import com.La.Visual.dto.RequestResponse;
import com.La.Visual.dto.UnavailableRangesRequest;
// Import services that contain business logic
import com.La.Visual.service.AuthService;
import com.La.Visual.service.ScheduleService;
// Import Spring framework components for web functionality
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// Import Java utility classes
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// Mark as REST controller to handle HTTP requests and return data directly (not views)
@RestController
// Set base URL path for all endpoints in this controller
@RequestMapping("/api/schedules")
public class ScheduleController {
    
    // Service for schedule-related business logic operations
    private final ScheduleService scheduleService;
    // Service for authentication and authorization checks
    private final AuthService authService;
    
    // Constructor with dependency injection via @Autowired
    @Autowired
    public ScheduleController(ScheduleService scheduleService, AuthService authService) {
        this.scheduleService = scheduleService;
        this.authService = authService;
    }
    
    /**
     * Save unavailable time ranges for a specific date
     * POST /api/schedules/unavailable
     * 
     * This endpoint allows admins to mark certain time slots as unavailable for booking
     */
    @PostMapping("/unavailable")
    public ResponseEntity<RequestResponse> saveUnavailableTimeRanges(
            @RequestBody UnavailableRangesRequest request,  // Request body containing date and time ranges
            @RequestHeader("Authorization") String authHeader) {  // JWT token for authentication
        
        try {
            // Verify the admin is authenticated by extracting and validating the JWT token
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            if (!authService.isAdminAuthenticated(token)) {
                // Return 401 Unauthorized if not an admin
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new RequestResponse(
                        "Unauthorized access", 
                        null, 
                        401, 
                        false
                    ));
            }
            
            // Call service to save the unavailable time ranges
            scheduleService.saveUnavailableTimeRanges(request.getDate(), request.getUnavailableRanges());
            
            // Return success response
            return ResponseEntity.ok(new RequestResponse(
                "Unavailable time ranges saved successfully", 
                null, 
                200, 
                true
            ));
        } catch (Exception e) {
            // Log the error and return a 500 error response
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
    
    /**
     * Get unavailable time ranges for a specific date
     * GET /api/schedules/unavailable/{date}
     * 
     * This endpoint allows admins to retrieve all unavailable time slots for a specific date
     */
    @GetMapping("/unavailable/{date}")
    public ResponseEntity<RequestResponse> getUnavailableTimeRanges(
            @PathVariable String date,  // Date parameter from URL path
            @RequestHeader("Authorization") String authHeader) {  // JWT token for authentication
        
        try {
            // Verify the admin is authenticated by extracting and validating the JWT token
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            if (!authService.isAdminAuthenticated(token)) {
                // Return 401 Unauthorized if not an admin
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new RequestResponse(
                        "Unauthorized access", 
                        null, 
                        401, 
                        false
                    ));
            }
            
            // Call service to get unavailable time ranges for the specified date
            List<com.La.Visual.dto.UnavailableTimeRange> ranges = scheduleService.getUnavailableTimeRangesDto(date);
            
            // Prepare response data structure
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("unavailableRanges", ranges);
            
            // Return success response with the retrieved data
            return ResponseEntity.ok(new RequestResponse(
                "Unavailable time ranges retrieved successfully", 
                responseData, 
                200, 
                true
            ));
        } catch (Exception e) {
            // Log the error and return a 500 error response
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