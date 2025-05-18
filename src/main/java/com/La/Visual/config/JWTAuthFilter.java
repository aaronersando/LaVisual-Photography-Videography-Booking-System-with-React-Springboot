/**
 * JWT Authentication Filter
 * 
 * This class implements a filter that intercepts all incoming HTTP requests to validate JWT tokens.
 * It extends OncePerRequestFilter to ensure the filter is only executed once per request.
 * 
 * When a request comes in with a valid JWT token in the Authorization header (with "Bearer " prefix),
 * this filter:
 *   1. Extracts the token
 *   2. Validates the token
 *   3. Loads the user details associated with the token
 *   4. Sets up the Spring Security context with the authenticated user
 * 
 * This enables authenticated users to access protected resources without re-authenticating
 * for each request, implementing stateless authentication.
 */
package com.La.Visual.config;

// Import necessary Java and Spring Security components for HTTP handling, security, and authentication
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

// Import our custom services for JWT handling and user details loading
import com.La.Visual.service.JWTUtilities;
import com.La.Visual.service.OurUserDetailsService;

// Import Servlet components for HTTP request and response handling
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Mark this class as a Spring Component so it's automatically detected and registered
@Component
public class JWTAuthFilter extends OncePerRequestFilter{

    // Autowire the JWT utilities service that handles token operations (validation, extraction, etc.)
    @Autowired
    private JWTUtilities jwtUtilities;

    // Autowire the user details service that loads user information from the database
    @Autowired
    private OurUserDetailsService ourUserDetailsService;

    // This method is called for each HTTP request that passes through the filter chain
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        // Extract the Authorization header from the HTTP request
        final String authHeader = request.getHeader("Authorization");
        final String jwtToken;
        final String userEmail;
        
        // If no Authorization header is present or it's empty, continue to the next filter
        // without authentication (the request will be handled as anonymous)
        if (authHeader == null || authHeader.isBlank()) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extract the JWT token by removing the "Bearer " prefix
        jwtToken = authHeader.substring(7);
        
        // Extract the user email (or username) from the token
        userEmail = jwtUtilities.extractUserName(jwtToken);
        
        // Proceed with authentication only if:
        // 1. We successfully extracted a user email from the token
        // 2. The user is not already authenticated in the current security context
        if(userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null){
            // Load the user details from the database using the email from the token
            UserDetails userDetails = ourUserDetailsService.loadUserByUsername(userEmail);
            
            // Verify that the token is valid for this user (not expired, signature valid, etc.)
            if(jwtUtilities.isTokenValid(jwtToken, userDetails)){
                // Create a new empty security context
                SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
                
                // Create an authentication token with the user details and authorities (roles)
                // The second parameter (credentials) is null as we don't need the password after authentication
                UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                
                // Add details about the request to the authentication token (IP address, session ID, etc.)
                token.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                // Set the authentication in the security context
                securityContext.setAuthentication(token);
                
                // Update the SecurityContextHolder with our populated security context
                // This marks the user as authenticated for this request
                SecurityContextHolder.setContext(securityContext);
            }
        }
        
        // Continue the filter chain with the request, which is now authenticated if a valid token was provided
        filterChain.doFilter(request, response);
    }
}