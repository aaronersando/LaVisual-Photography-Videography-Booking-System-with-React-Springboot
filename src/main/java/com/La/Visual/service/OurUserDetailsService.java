/**
 * User Details Service
 * 
 * This service class is a critical component of Spring Security's authentication system.
 * It implements the UserDetailsService interface, which bridges the gap between Spring Security
 * and the application's custom user database.
 * 
 * Key responsibilities:
 * - Loading user data from the database during authentication attempts
 * - Converting application-specific user entities (OurUsers) to Spring Security's UserDetails objects
 * - Providing user lookup functionality for the authentication process
 * 
 * Spring Security uses this service during login to:
 * 1. Retrieve the user by their username (email in this application)
 * 2. Verify the provided password against the stored password
 * 3. Load the user's authorities (roles) for authorization decisions
 * 
 * This class works with the UsersRepository to find users and integrates with
 * Spring Security's authentication providers to validate credentials.
 */
package com.La.Visual.service;


// Import Spring annotations for component scanning and dependency injection
import org.springframework.beans.factory.annotation.Autowired;
// Import Spring Security interfaces for user authentication
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
// Import Spring Service annotation for component registration
import org.springframework.stereotype.Service;

// Import the repository for database access
import com.La.Visual.repository.UsersRepository;

// Mark this class as a service component in Spring's component scanning
@Service
public class OurUserDetailsService implements UserDetailsService{

    // Inject the UsersRepository dependency for database operations
    // The @Autowired annotation tells Spring to inject this dependency
    @Autowired
    private UsersRepository usersRepository;

    /**
     * Loads a user by their username (email in this application)
     * This method is called by Spring Security during the authentication process
     * 
     * @param username The username (email) to search for in the database
     * @return A UserDetails object containing the user's credentials and authorities
     * @throws UsernameNotFoundException if no user is found with the given email
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return usersRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
        // The above code does the following:
        // 1. Call the repository to find a user by email
        // 2. If found, return the user (which implements UserDetails interface)
        // 3. If not found, throw a UsernameNotFoundException with a descriptive message
    }

}