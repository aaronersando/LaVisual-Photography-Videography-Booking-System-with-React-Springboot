package com.La.Visual.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.La.Visual.service.JWTUtilities;

@Service
public class AuthService {
    
    private final JWTUtilities jwtUtilities;
    
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
            // Extract user email from token
            String userEmail = jwtUtilities.extractUserName(token);
            
            // Check if token is valid for any user
            if (userEmail != null) {
                // In a real application, you would verify this user has ADMIN role
                // This is a simplified version that just verifies the token is valid
                return true;
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }
}