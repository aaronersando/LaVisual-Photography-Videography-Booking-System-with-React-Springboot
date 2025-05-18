/**
 * JWT Utilities Service
 * 
 * This class provides utilities for working with JSON Web Tokens (JWT) in the application.
 * JWT is a compact, URL-safe means of representing claims securely between two parties.
 * 
 * Key features:
 * - Token generation for authentication
 * - Refresh token generation
 * - Token validation
 * - Claim extraction from tokens
 * - Username extraction from tokens
 * - Token expiration checking
 * 
 * The class is used by the authentication system to create tokens when users log in,
 * validate tokens when protected resources are accessed, and extract user information
 * from tokens to make authorization decisions.
 * 
 * This service works with Spring Security and is used by JWTAuthFilter to secure API endpoints.
 */
package com.La.Visual.service;

// Import standard Java utilities for encoding, dates, and functions
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.function.Function;

// Import cryptography-related classes for handling secret keys
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

// Import Spring Security user details interface
import org.springframework.security.core.userdetails.UserDetails;
// Import Spring component annotation for dependency injection
import org.springframework.stereotype.Component;

// Import JWT library classes for creating and parsing tokens
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

// Mark this class as a Spring component for automatic detection and injection
@Component
public class JWTUtilities {

    // The secret key used for signing and verifying JWT tokens
    private SecretKey Key;
    // Token expiration time (24 hours = 86,400,000 milliseconds)
    private static final long EXPIRATION_TIME = 86400000; // 1 day in milliseconds
    
    /**
     * Constructor - initializes the signing key from a base64-encoded secret
     * In production, this secret should be stored in environment variables or a secure vault
     */
    public JWTUtilities() {
        // Base64 encoded secret key (note: in production, should use environment variables)
        String secretString = "hJmgf4VrBXQNObY1Rq4o3ImGucqoFlrgtzBA+Lf5yJQ="; // To be fixed to make secure and use .getenv with secrektkey on environ var
        // Decode the Base64 string to get the actual key bytes
        byte[] keyBytes = Base64.getDecoder().decode(secretString.getBytes(StandardCharsets.UTF_8));
        // Create a secret key specification for HMAC-SHA256 algorithm
        this.Key = new SecretKeySpec(keyBytes, "HmacSHA256");
    }

    /**
     * Generates a standard JWT authentication token
     * 
     * @param userDetails The user details from Spring Security
     * @return A JWT token string containing the username, issued timestamp and expiration
     */
    public String generateToken(UserDetails userDetails){
        return Jwts.builder()
        .setSubject(userDetails.getUsername())  // Set the subject claim to the username
        .setIssuedAt(new Date(System.currentTimeMillis()))  // Set the issued-at timestamp to now
        .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))  // Set expiration to 24 hours from now
        .signWith(Key)  // Sign the token with our secret key
        .compact();  // Compact it into its final string form
    }

    /**
     * Generates a refresh token that includes custom claims
     * Refresh tokens allow getting a new access token without re-authenticating
     * 
     * @param claims Additional claims to include in the token
     * @param userDetails The user details from Spring Security
     * @return A JWT refresh token string
     */
    public String generateRefreshToken(HashMap<String, Object> claims, UserDetails userDetails){
        return Jwts.builder()
        .setClaims(claims)  // Set additional custom claims
        .setSubject(userDetails.getUsername())  // Set the subject claim to the username
        .setIssuedAt(new Date(System.currentTimeMillis()))  // Set the issued-at timestamp to now
        .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))  // Set expiration to 24 hours from now
        .signWith(Key)  // Sign the token with our secret key
        .compact();  // Compact it into its final string form
    }

    /**
     * Extracts the username (subject) from a token
     * 
     * @param token The JWT token to extract the username from
     * @return The username stored in the token's subject claim
     */
    public String extractUserName(String token){
        return extractClaims(token, Claims::getSubject);  // Extract the 'sub' claim which holds the username
    }

    /**
     * Generic method to extract any claim from a token
     * Uses a function to select which claim to extract
     * 
     * @param token The JWT token to extract claims from
     * @param claimsTFunction A function that selects which claim to extract
     * @return The value of the requested claim
     */
    private <T> T extractClaims(String token, Function<Claims, T> claimsTFunction) {
        return claimsTFunction.apply(
            Jwts.parserBuilder()
                .setSigningKey(Key) // Set the key to verify the token signature
                .build() // Build the parser
                .parseClaimsJws(token) // Parse the token and verify its signature
                .getBody() // Extract the claims body
        );
    }

    /**
     * Validates a token by checking:
     * 1. The username in the token matches the one in UserDetails
     * 2. The token is not expired
     * 
     * @param token The JWT token to validate
     * @param userDetails The user details to validate against
     * @return true if the token is valid, false otherwise
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUserName(token);  // Extract the username from token
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);  // Check username match and expiration
    }

    /**
     * Checks if a token is expired by comparing its expiration date to current time
     * 
     * @param token The JWT token to check
     * @return true if the token is expired, false otherwise
     */
    public boolean isTokenExpired(String token) {
        return extractClaims(token, Claims::getExpiration).before(new Date());  // Extract expiration date and compare to now
    }

}