/**
 * RequestResponse DTO (Data Transfer Object)
 * 
 * This class serves as a standardized response format for all API endpoints in the application.
 * It provides a consistent structure for both successful and error responses, which helps
 * frontend applications easily process and handle API results.
 * 
 * Key features:
 * - Flexible structure that can carry various types of response data
 * - Standard fields for status codes, messages, and success indicators
 * - Support for authentication data (tokens, expiration)
 * - Ability to carry user information either individually or as lists
 * - JSON serialization controls via Jackson annotations
 * 
 * This class is used throughout the application controllers to ensure a consistent
 * API response structure, making frontend integration simpler and more reliable.
 */
package com.La.Visual.dto;


import java.util.List;

// Import Jackson annotations for JSON processing control
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
// Import user entity for carrying user data
import com.La.Visual.entity.OurUsers;

// Lombok annotation to automatically generate getters, setters, equals(), hashCode(), toString() methods
import lombok.Data;

// Apply Lombok's @Data annotation to reduce boilerplate code
@Data
// Only include non-null fields in JSON serialization output
@JsonInclude(JsonInclude.Include.NON_NULL)
// Ignore any JSON properties during deserialization that don't match fields in this class
@JsonIgnoreProperties(ignoreUnknown = true)
public class RequestResponse {

    // Response metadata fields
    private int statusCode;       // HTTP status code or application-specific code
    private String message;       // Human-readable response message
    private String error;         // Error description when applicable
    private Object data;          // Generic field to hold any response data payload
    private boolean success;      // Flag indicating if the operation was successful
    
    // Authentication-related fields
    private String token;         // JWT authentication token
    private String refreshToken;  // Token for refreshing authentication
    private String expirationTime; // When the token expires
    
    // User information fields
    private String name;          // User's name
    private String email;         // User's email (often used as username)
    private String city;          // User's city
    private String role;          // User's role (e.g., "ADMIN", "USER")
    private String password;      // Password (typically only used in request, not response)
    
    // User entity fields for more complex operations
    private OurUsers ourUsers;           // Single user object
    private List<OurUsers> ourUsersList; // Collection of user objects

    /**
     * Constructor with common response fields
     * 
     * @param message    Human-readable message about the response
     * @param data       Any object to return as response data
     * @param statusCode HTTP status code or application code
     * @param success    Whether the operation was successful
     */
    public RequestResponse(String message, Object data, int statusCode, boolean success) {
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
        this.success = success;
    }

    /**
     * Default no-argument constructor
     * Required for Jackson JSON deserialization
     */
    public RequestResponse() {
        //TODO Auto-generated constructor stub
    }
}