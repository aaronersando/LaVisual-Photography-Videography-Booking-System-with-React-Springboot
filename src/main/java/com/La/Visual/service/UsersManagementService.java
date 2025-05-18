/**
 * Users Management Service
 * 
 * This service class handles all user-related business logic in the application, serving as
 * the intermediary between controllers and repositories for user operations. It provides
 * comprehensive user management functionality including authentication, authorization,
 * and CRUD operations.
 * 
 * Key responsibilities:
 * - User registration and account creation
 * - User authentication (login) and JWT token generation
 * - Token refresh for continued authentication
 * - User information retrieval (individual and all users)
 * - User account updates and deletion
 * - Password encryption for secure storage
 * 
 * This service uses Spring Security components for authentication and JWT for
 * token-based security. All methods return standardized RequestResponse objects
 * to provide consistent API responses with appropriate status codes and messages.
 */
package com.La.Visual.service;

// Import Java utility classes
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

// Import Spring Framework annotations and security components
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

// Import application-specific DTOs, entities and repositories
import com.La.Visual.dto.RequestResponse;
import com.La.Visual.entity.OurUsers;
import com.La.Visual.repository.UsersRepository;

// Mark this class as a service component in Spring's component scanning
@Service
public class UsersManagementService {

    // Authentication provider dependency, marked as final for immutability
    private final AuthenticationProvider authenticationProvider;

    // Repository for database operations with users
    @Autowired
    private UsersRepository usersRepository;
    
    // Utility for JWT token operations
    @Autowired
    private JWTUtilities jwtUtilities;
    
    // Spring Security's authentication manager for verifying credentials
    @Autowired
    private AuthenticationManager authenticationManager;
    
    // Password encoder for hashing passwords before storage
    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Constructor with dependency injection for AuthenticationProvider
     * 
     * @param authenticationProvider Provider for authentication operations
     */
    UsersManagementService(AuthenticationProvider authenticationProvider) {
        this.authenticationProvider = authenticationProvider;
    }

    /**
     * Registers a new user in the system
     * Encrypts the user's password before storage
     * 
     * @param registrationRequest DTO containing registration information
     * @return RequestResponse with status and user information if successful
     */
    public RequestResponse register(RequestResponse registrationRequest) {
        RequestResponse response = new RequestResponse();
    
        try {
            // Create a new OurUsers object with the provided details
            // Using Lombok-generated withX methods for immutable object creation
            OurUsers ourUser = new OurUsers(null, null, null, null, null, null)
                .withEmail(registrationRequest.getEmail())
                .withName(registrationRequest.getName())
                .withPassword(passwordEncoder.encode(registrationRequest.getPassword())) // Encrypt password
                .withCity(registrationRequest.getCity())
                .withRole(registrationRequest.getRole()); // Set user role
    
            // Save the user to the database
            OurUsers ourUserResult = usersRepository.save(ourUser);
    
            // Populate the response with the saved user details
            if (ourUserResult.getId() > 0) {
                // If user was successfully created (has valid ID)
                response.setOurUsers(ourUserResult);
                response.setStatusCode(200);
                response.setMessage("User registered successfully");
            } else {
                // If user creation failed (unlikely path but handled for safety)
                response.setStatusCode(400);
                response.setError("User registration failed");
            }
    
        } catch (Exception e) {
            // Handle any exceptions during registration (e.g., duplicate email)
            response.setStatusCode(500);
            response.setError("Error occurred: " + e.getMessage());
        }
    
        return response;
    }

    /**
     * Authenticates a user and generates JWT tokens
     * 
     * @param loginRequest DTO containing login credentials
     * @return RequestResponse with authentication tokens if successful
     */
    public RequestResponse login(RequestResponse loginRequest) {
        RequestResponse response = new RequestResponse();
        try {
            // Authenticate user credentials using Spring Security
            // This will throw an exception if authentication fails
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), 
                                        loginRequest.getPassword()));

            // If authentication successful, retrieve user details
            var user = usersRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow();
            
            // Generate JWT token and refresh token
            var jwt = jwtUtilities.generateToken(user);
            var refreshToken = jwtUtilities.generateRefreshToken(new HashMap<>(),user);
            
            // Populate response with authentication information
            response.setStatusCode(200);
            response.setToken(jwt);  // Access token
            response.setRole(user.getRole());  // User role for authorization
            response.setRefreshToken(refreshToken);  // Refresh token for later use
            response.setExpirationTime("24Hrs");  // Token validity period
            response.setMessage("Login successful");

        } catch (Exception e) {
            // Handle authentication failures
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    /**
     * Refreshes an existing JWT token to extend the user's session
     * 
     * @param refreshTokenRequest DTO containing the refresh token
     * @return RequestResponse with new access token if successful
     */
    public RequestResponse refreshToken(RequestResponse refreshTokenRequest) {
        RequestResponse response = new RequestResponse();
        try {
            // Extract the username (email) from the token
            String ourEmail = jwtUtilities.extractUserName(refreshTokenRequest.getToken());
            
            // Find the user by email
            OurUsers users = usersRepository.findByEmail(ourEmail).orElseThrow();
            
            // Validate the token belongs to this user and is not expired
            if(jwtUtilities.isTokenValid(refreshTokenRequest.getToken(), users)){
                // Generate a new access token
                var jwt = jwtUtilities.generateToken(users);
                
                // Populate response with new token information
                response.setStatusCode(200);
                response.setToken(jwt);  // New access token
                response.setMessage("Token refreshed successfully");
                response.setExpirationTime("24Hrs");  // Token validity period
                response.setRefreshToken(refreshTokenRequest.getToken());  // Keep same refresh token
            }
            response.setStatusCode(200);
            return response;

        } catch (Exception e) {
            // Handle token refresh failures
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
            return response;
        } 
    }

    /**
     * Retrieves all users from the database
     * Used for administrative user management
     * 
     * @return RequestResponse with list of all users if successful
     */
    public RequestResponse getAllUsers(){
        RequestResponse response = new RequestResponse();
        try {
            // Get all users from the repository
            List<OurUsers> result = usersRepository.findAll();
            
            if(!result.isEmpty()){
                // If users were found, include them in the response
                response.setStatusCode(200);
                response.setOurUsersList(result);
                response.setMessage("Users retrieved successfully");
            } else {
                // If no users were found
                response.setStatusCode(404);
                response.setMessage("No users found");
            }
            return response;
        } catch (Exception e) {
            // Handle exceptions during retrieval
            response.setStatusCode(500);
            response.setMessage("Error Occured" + e.getMessage());
            return response;
        }
    }

    /**
     * Retrieves a specific user by their ID
     * 
     * @param id The ID of the user to retrieve
     * @return RequestResponse with user details if found
     */
    public RequestResponse getUserById(Integer id){
        RequestResponse response = new RequestResponse();
        try {
            // Find user by ID, throw exception if not found
            OurUsers usersById = usersRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found")) ;
            
            // Populate response with user information
            response.setOurUsers(usersById);
            response.setStatusCode(200);
            response.setMessage("Users with " + id + " retrieved successfully");
            
        } catch (Exception e) {
            // Handle exceptions during retrieval
            response.setStatusCode(500);
            response.setMessage("Error Occured" + e.getMessage());
            
        }
        return response;
    }

    /**
     * Deletes a user by their ID
     * 
     * @param id The ID of the user to delete
     * @return RequestResponse indicating success or failure
     */
    public RequestResponse deleteUser(Integer id){
        RequestResponse response = new RequestResponse();
        try {
            // First check if the user exists
            Optional<OurUsers> user = usersRepository.findById(id);
            if (user.isPresent()) {
                // If user exists, delete them
                usersRepository.deleteById(id);
                response.setStatusCode(200);
                response.setMessage("User with " + id + " deleted successfully");
            } else {
                // If user doesn't exist
                response.setStatusCode(404);
                response.setMessage("User not found for deletion");
            }
            
        } catch (Exception e) {
            // Handle exceptions during deletion
            response.setStatusCode(500);
            response.setMessage("Error occured while deleting user" + e.getMessage());

        }
        return response;
    }

    /**
     * Updates a user's information
     * 
     * @param userId The ID of the user to update
     * @param updatedUser The user object with updated information
     * @return RequestResponse with updated user details if successful
     */
    public RequestResponse updateUser(Integer userId, OurUsers updatedUser) {
        RequestResponse response = new RequestResponse();
        try {
            // First check if the user exists
            Optional<OurUsers> userOptional = usersRepository.findById(userId);
            if (userOptional.isPresent()) {
                // If user exists, update their information using immutable pattern
                OurUsers existingUser = userOptional.get()
                    .withName(updatedUser.getName())
                    .withEmail(updatedUser.getEmail())
                    .withCity(updatedUser.getCity())
                    .withRole(updatedUser.getRole());
    
                // Only update password if a new one was provided
                if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                    existingUser = existingUser.withPassword(passwordEncoder.encode(updatedUser.getPassword()));
                }
    
                // Save the updated user
                OurUsers savedUser = usersRepository.update(existingUser);
                
                // Populate response with updated user
                response.setStatusCode(200);
                response.setMessage("User with ID " + userId + " updated successfully");
                response.setOurUsers(savedUser);
            } else {
                // If user doesn't exist
                response.setStatusCode(404);
                response.setMessage("User not found for update");
            }
        } catch (Exception e) {
            // Handle exceptions during update
            response.setStatusCode(500);
            response.setMessage("Error occurred while updating user: " + e.getMessage());
        }
        return response;
    }

    /**
     * Retrieves a user's information by their email address
     * Used for retrieving the current user's profile
     * 
     * @param email The email address of the user to retrieve
     * @return RequestResponse with user details if found
     */
    public RequestResponse getMyInfo(String email){
        RequestResponse response = new RequestResponse();

        try {
            // Find user by email
            Optional<OurUsers> userOptional = usersRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                // If user exists, populate response with their information
                OurUsers user = userOptional.get();
                response.setStatusCode(200);
                response.setMessage("User information retrieved successfully");
                response.setOurUsers(user);
            } else {
                // If user doesn't exist
                response.setStatusCode(404);
                response.setMessage("User not found");
            }
        
        } catch (Exception e) {
            // Handle exceptions during retrieval
            response.setStatusCode(500);
            response.setMessage("Error occurred while retrieving user information: " + e.getMessage());
        
        }
        return response;
    }
    

}