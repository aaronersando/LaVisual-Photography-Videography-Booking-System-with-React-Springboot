/**
 * User Management Controller
 * 
 * This controller handles all user-related operations in the application through RESTful endpoints.
 * It provides functionality for:
 * - Authentication (registration, login, token refresh)
 * - User profile management
 * - Admin user management (listing, viewing, updating, and deleting users)
 * 
 * The controller uses role-based access control to protect sensitive operations:
 * - Public endpoints (/auth/*) for registration and authentication
 * - Admin-only endpoints (/admin/*) for user management operations
 * - Shared endpoints (/adminuser/*) for operations available to both admins and regular users
 * 
 * It works with the UsersManagementService to handle business logic and uses JWT-based
 * authentication through Spring Security.
 */
package com.La.Visual.controller;


// Import Spring Framework components for web and security
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RestController;

// Import application-specific components
import com.La.Visual.dto.RequestResponse;
import com.La.Visual.entity.OurUsers;
import com.La.Visual.service.UsersManagementService;
// Import Spring Web annotations for HTTP method mappings
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.RequestParam;


// Mark this class as a REST controller to handle HTTP requests
@RestController
public class UserManagementController {

    // Inject the service that contains the business logic for user management
    @Autowired
    private UsersManagementService usersManagementService;

    /**
     * User Registration Endpoint
     * POST /auth/register
     * 
     * Creates a new user account with the provided details.
     * This is a public endpoint that doesn't require authentication.
     */
    @PostMapping("/auth/register")
    public ResponseEntity<RequestResponse> register(@RequestBody RequestResponse registrationRequest) {
        return ResponseEntity.ok(usersManagementService.register(registrationRequest));
    }
    
    /**
     * User Login Endpoint
     * POST /auth/login
     * 
     * Authenticates a user and returns a JWT token for subsequent requests.
     * This is a public endpoint that doesn't require authentication.
     */
    @PostMapping("/auth/login")
    public ResponseEntity<RequestResponse> login(@RequestBody RequestResponse loginRequest) {
        return ResponseEntity.ok(usersManagementService.login(loginRequest));
    }

    /**
     * Token Refresh Endpoint
     * POST /auth/refresh
     * 
     * Refreshes an existing JWT token to extend the user's session.
     * This is a public endpoint that requires a valid refresh token.
     */
    @PostMapping("/auth/refresh")
    public ResponseEntity<RequestResponse> refreshToken(@RequestBody RequestResponse refreshRequest) {
        return ResponseEntity.ok(usersManagementService.refreshToken(refreshRequest));
    }

    /**
     * Get All Users Endpoint (Admin Only)
     * GET /admin/get-all-users
     * 
     * Retrieves a list of all users in the system.
     * This endpoint is restricted to administrators only.
     */
    @GetMapping("/admin/get-all-users")
    public ResponseEntity<RequestResponse> getAllUsers() {
        return ResponseEntity.ok(usersManagementService.getAllUsers());
    }
    
    /**
     * Get User by ID Endpoint (Admin Only)
     * GET /admin/get-users/{userId}
     * 
     * Retrieves details for a specific user by their ID.
     * This endpoint is restricted to administrators only.
     */
    @GetMapping("/admin/get-users/{userId}")
    public ResponseEntity<RequestResponse> getUserById(@PathVariable Integer userId) {
        return ResponseEntity.ok(usersManagementService.getUserById(userId));
    }

    /**
     * Update User Endpoint (Admin Only)
     * PUT /admin/update/{userId}
     * 
     * Updates a user's information based on the provided data.
     * This endpoint is restricted to administrators only.
     */
    @PutMapping("/admin/update/{userId}")
    public ResponseEntity<RequestResponse> updateUser(@PathVariable Integer userId, @RequestBody OurUsers reqres) {
        return ResponseEntity.ok(usersManagementService.updateUser(userId, reqres));
    }

    /**
     * Get Current User Profile Endpoint (Admin and User)
     * GET /adminuser/get-profile
     * 
     * Retrieves the profile information for the currently authenticated user.
     * This endpoint is available to both administrators and regular users.
     * It uses Spring Security's context to identify the current user by email.
     */
    @GetMapping("/adminuser/get-profile")
    public ResponseEntity<RequestResponse> getMyProfile() {
        // Get the current authenticated user's context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // Extract the email (username) from the authentication object
        String email = authentication.getName(); // Get the email from the authentication object
        // Retrieve user information using the email
        RequestResponse response = usersManagementService.getMyInfo(email);
        // Return response with appropriate status code
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    /**
     * Delete User Endpoint (Admin Only)
     * DELETE /admin/delete/{userId}
     * 
     * Permanently removes a user from the system.
     * This endpoint is restricted to administrators only.
     */
    @DeleteMapping("/admin/delete/{userId}")
    public ResponseEntity<RequestResponse> deleteUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(usersManagementService.deleteUser(userId));
    }



}