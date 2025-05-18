/**
 * OurUsers Entity
 * 
 * This class represents a user in the system and serves as the core user entity.
 * It implements Spring Security's UserDetails interface, allowing it to integrate
 * directly with Spring Security's authentication and authorization mechanisms.
 * 
 * Key features:
 * - Immutable design with final fields to ensure data integrity
 * - Integration with Spring Security for authentication and authorization
 * - Role-based access control via the role field and getAuthorities() method
 * - Lombok annotations to reduce boilerplate code
 * 
 * This entity is used throughout the application for user management operations including:
 * - User registration and login
 * - Authentication and authorization checks
 * - User profile management
 * - Administrative user operations
 */
package com.La.Visual.entity;

// Import Lombok annotations to reduce boilerplate code
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;
import lombok.With;
// Import Spring Security interfaces and classes for authentication
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

// Import Java collections for authority handling
import java.util.Collection;
import java.util.List;

// Lombok annotations to generate common methods
@Getter                 // Automatically generates getter methods for all fields
@With                   // Creates withX methods that return a new instance with the changed field
@Builder(toBuilder = true)  // Provides a builder pattern, toBuilder allows creating a builder from an instance
@AllArgsConstructor     // Creates a constructor with all fields as parameters
@ToString               // Generates a toString method that includes all fields
@EqualsAndHashCode      // Generates equals and hashCode methods based on all fields
public class OurUsers implements UserDetails {
    // Core user identity fields
    private final Integer id;        // Unique identifier for the user
    private final String email;      // User's email address (also serves as username)
    private final String name;       // User's full name
    private final String password;   // User's encrypted password
    private final String city;       // User's city or location
    private final String role;       // User's role for authorization (e.g., "USER", "ADMIN")

    /**
     * Returns the authorities granted to the user based on their role.
     * This method is required by the UserDetails interface and is used by
     * Spring Security for authorization decisions.
     * 
     * @return a collection containing a single authority based on the user's role
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role));
    }

    /**
     * Returns the username used to authenticate the user.
     * In this application, the email address is used as the username.
     * 
     * @return the user's email address
     */
    @Override
    public String getUsername() {
        return email;
    }

    /**
     * Returns the password used to authenticate the user.
     * 
     * @return the user's password
     */
    @Override
    public String getPassword() {
        return password;
    }

    /**
     * Indicates whether the user's account has expired.
     * An expired account cannot be authenticated.
     * 
     * @return true if the user's account is valid (not expired)
     */
    @Override
    public boolean isAccountNonExpired() {
        return true; // Customize this logic if needed
    }

    /**
     * Indicates whether the user is locked or unlocked.
     * A locked user cannot be authenticated.
     * 
     * @return true if the user is not locked
     */
    @Override
    public boolean isAccountNonLocked() {
        return true; // Customize this logic if needed
    }

    /**
     * Indicates whether the user's credentials (password) has expired.
     * Expired credentials prevent authentication.
     * 
     * @return true if the user's credentials are valid (not expired)
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Customize this logic if needed
    }

    /**
     * Indicates whether the user is enabled or disabled.
     * A disabled user cannot be authenticated.
     * 
     * @return true if the user is enabled
     */
    @Override
    public boolean isEnabled() {
        return true; // Customize this logic if needed
    }

    /**
     * Returns the user's ID as an int primitive.
     * Provides a null-safe way to get the ID with a default value of 0.
     * 
     * @return the user's ID, or 0 if the ID is null
     */
    public int getId() {
        return id != null ? id : 0; // Return 0 if id is null
    }
}