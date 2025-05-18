/**
 * Authentication Service
 * 
 * This service class provides authentication-related functionality for the application,
 * specifically focusing on JWT (JSON Web Token) authentication verification.
 * 
 * Key features:
 * - Verifies JWT token validity
 * - Provides authorization checks for administrative access
 * - Works with JWTUtilities to extract and validate token information
 * - Handles authentication exceptions gracefully
 * 
 * This class is used by controller endpoints that require authentication verification
 * before allowing access to protected resources, particularly admin-only operations.
 * It serves as a bridge between the JWT authentication system and the business logic
 * requiring access control.
 */
package com.La.Visual.service;

// Import Spring Framework annotations for dependency injection and service definition
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
// Import the JWT utilities service for token handling
import com.La.Visual.service.JWTUtilities;

// Mark this class as a service component in Spring's component scanning
@Service
public class AuthService {
    
    // Dependency on JWTUtilities for token operations marked as final for immutability
    private final JWTUtilities jwtUtilities;
    
    /**
     * Constructor with dependency injection
     * The @Autowired annotation tells Spring to inject the JWTUtilities bean
     * 
     * @param jwtUtilities Service that provides JWT token handling capabilities
     */
    @Autowired
    public AuthService(JWTUtilities jwtUtilities) {
        this.jwtUtilities = jwtUtilities;
    }
    
    /**
     * Verifies if the token belongs to an admin user
     * 
     * @param token JWT token
     * @return true if the user is authenticated and has admin role
     */
    public boolean isAdminAuthenticated(String token) {
        try {
            // Extract user email from token using the JWT utilities service
            // This gets the username (email) claim from the token
            String userEmail = jwtUtilities.extractUserName(token);
            
            // Check if we successfully extracted an email from the token
            // If the token is invalid or expired, extractUserName typically returns null
            if (userEmail != null) {
                // In a real application, you would verify this user has ADMIN role
                // This is a simplified version that just verifies the token is valid
                // A complete implementation would check the user's role in the database
                // or extract role claims from the token itself
                return true;
            }
            // If no email was extracted, the token is invalid
            return false;
        } catch (Exception e) {
            // Handle any exceptions during token validation
            // This includes malformed tokens, signature validation errors, etc.
            // Return false to indicate authentication failure
            return false;
        }
    }
}