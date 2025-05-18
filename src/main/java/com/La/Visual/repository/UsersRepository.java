/**
 * Users Repository
 * 
 * This repository class is responsible for all database operations related to users in the application.
 * It provides methods for creating, reading, updating, and deleting user records in the database.
 * Unlike other repositories in the application that use JdbcTemplate, this repository uses the more
 * modern JdbcClient API, which provides a fluent interface for database operations.
 * 
 * Key features:
 * - Database operations for user management (CRUD)
 * - Uses Spring's JdbcClient for simplified SQL operations
 * - Manages user authentication data storage
 * - Handles user profile information
 * - Supports role-based user management
 * 
 * This repository is used by the UsersManagementService to perform data access operations
 * and by the authentication system for user login and verification.
 */
package com.La.Visual.repository;


import java.util.List;
import java.util.Optional;

// Import Spring's JdbcClient for database operations
import org.springframework.jdbc.core.simple.JdbcClient;
// Import Spring's Repository annotation for component scanning
import org.springframework.stereotype.Repository;

// Import the OurUsers entity class
import com.La.Visual.entity.OurUsers;

// Mark this class as a repository component in Spring's component scanning
@Repository
public class UsersRepository {

    // Spring's JdbcClient for executing SQL queries with a fluent API
    private final JdbcClient jdbcClient;

    /**
     * Constructor with dependency injection
     * 
     * @param jdbcClient Spring's JdbcClient for database operations
     */
    public UsersRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    /**
     * Finds a user by their email address
     * Used for authentication and user lookup
     * 
     * @param email The email address to search for
     * @return Optional containing the user if found, empty otherwise
     */
    public Optional<OurUsers> findByEmail(String email) {
        return jdbcClient.sql("SELECT * FROM our_users WHERE email = :email")
                .param("email", email)                  // Bind parameter to prevent SQL injection
                .query(OurUsers.class)                  // Map results to OurUsers class
                .optional();                            // Return as Optional (may be empty)
    }

    /**
     * Saves a new user to the database
     * Note: There was an issue with the previous version using .one() method which is now .single() in newer versions
     * 
     * @param ourUser The user entity to save
     * @return The saved user with its generated ID
     * @throws IllegalStateException if the insert operation fails
     */
    // Ito yung problema sa save since hindi siya nagssave sa database pero di pumapasok sa if since walang .one() sa version ngayon na single() na
    public OurUsers save(OurUsers ourUser) {
        // SQL query to insert a new user using text block for multiline SQL
        String sql = """
            INSERT INTO our_users (email, name, password, city, role)
            VALUES (:email, :name, :password, :city, :role)
        """;
    
        // Execute the INSERT query with named parameters
        int rowsAffected = jdbcClient.sql(sql)
            .param("email", ourUser.getEmail())         // User's email address
            .param("name", ourUser.getName())           // User's name
            .param("password", ourUser.getPassword())   // User's encrypted password
            .param("city", ourUser.getCity())           // User's city
            .param("role", ourUser.getRole())           // User's role (e.g., "USER", "ADMIN")
            .update();                                  // Execute update and get affected rows count
    
        if (rowsAffected > 0) {
            // If insert was successful, retrieve the generated ID
            String selectSql = "SELECT id FROM our_users WHERE email = :email";
            Integer generatedId = jdbcClient.sql(selectSql)
                .param("email", ourUser.getEmail())
                .query(Integer.class)                   // Map query result to Integer
                .single();                              // Get exactly one result (throws exception if not found)
    
            // Return a new OurUsers object with the generated ID (immutable entity pattern)
            return ourUser.withId(generatedId);
        } else {
            // If no rows were affected, throw an exception
            throw new IllegalStateException("Failed to insert user into the database");
        }
    }

    /**
     * Retrieves all users from the database
     * Used for administrative user management
     * 
     * @return List of all users
     */
    public List<OurUsers> findAll() {
        return jdbcClient.sql("SELECT * FROM our_users")
                .query(OurUsers.class)                  // Map results to OurUsers class
                .list();                                // Return as a List
    }

    /**
     * Finds a user by their ID
     * 
     * @param id The user ID to search for
     * @return Optional containing the user if found, empty otherwise
     */
    public Optional<OurUsers> findById(Integer id) {
        return jdbcClient.sql("SELECT * FROM our_users WHERE id = :id")
                .param("id", id)                        // Bind parameter to prevent SQL injection
                .query(OurUsers.class)                  // Map results to OurUsers class
                .optional();                            // Return as Optional (may be empty)
    }

    /**
     * Deletes a user by their ID
     * 
     * @param id The user ID to delete
     */
    public void deleteById(Integer id) {
        jdbcClient.sql("DELETE FROM our_users WHERE id = :id")
                .param("id", id)                        // Bind parameter to prevent SQL injection
                .update();                              // Execute the delete operation
    }

    /**
     * Updates an existing user in the database
     * 
     * @param ourUser The user with updated information
     * @return The updated user
     * @throws IllegalStateException if the update operation fails
     */
    public OurUsers update(OurUsers ourUser) {
        // SQL query to update user using text block for multiline SQL
        String sql = """
            UPDATE our_users
            SET name = :name, email = :email, password = :password, city = :city, role = :role
            WHERE id = :id
        """;
    
        // Execute the UPDATE query with named parameters
        int rowsAffected = jdbcClient.sql(sql)
            .param("id", ourUser.getId())               // User ID for WHERE clause
            .param("name", ourUser.getName())           // Updated name
            .param("email", ourUser.getEmail())         // Updated email
            .param("password", ourUser.getPassword())   // Updated password (should be encrypted)
            .param("city", ourUser.getCity())           // Updated city
            .param("role", ourUser.getRole())           // Updated role
            .update();                                  // Execute update and get affected rows count
    
        if (rowsAffected > 0) {
            // If update was successful, return the updated user object
            return ourUser;
        } else {
            // If no rows were affected, throw an exception
            throw new IllegalStateException("Failed to update user with ID: " + ourUser.getId());
        }
    }

}