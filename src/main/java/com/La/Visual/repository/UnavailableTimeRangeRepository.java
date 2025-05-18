/**
 * UnavailableTimeRange Repository
 * 
 * This repository class is responsible for database operations related to unavailable time ranges.
 * It provides methods to create, read, update, and delete time slots that are marked as unavailable
 * in the booking system's calendar.
 * 
 * Key features:
 * - Direct JDBC database access using Spring's JdbcTemplate
 * - SQL query execution for persisting unavailable time ranges 
 * - Row mapping from database results to UnavailableTimeRange entity objects
 * - Support for batch operations (deleting all ranges for a date)
 * - Automatic ID generation for new records
 * 
 * This repository is used by the ScheduleService to manage unavailable time slots,
 * allowing administrators to block off periods that should not be available for booking.
 * It works with the entity version of UnavailableTimeRange rather than the DTO version
 * used for API communications.
 */
package com.La.Visual.repository;

// Import the entity class that this repository manages
import com.La.Visual.entity.UnavailableTimeRange;
// Import Spring annotations and JDBC components
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

// Import Java SQL and utility classes
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

// Mark this class as a repository component in Spring's component scanning
@Repository
public class UnavailableTimeRangeRepository {
    
    // Spring's JdbcTemplate for executing SQL queries safely
    private final JdbcTemplate jdbcTemplate;
    
    /**
     * Row mapper to convert database result rows into UnavailableTimeRange objects
     * Maps columns from database records to constructor parameters for the entity
     */
    private final RowMapper<UnavailableTimeRange> unavailableTimeRangeRowMapper = (rs, rowNum) -> 
        new UnavailableTimeRange(
            rs.getInt("id"),                // Primary key
            rs.getString("date"),           // Date in string format (YYYY-MM-DD)
            rs.getString("start_time"),     // Start time in string format (HH:mm)
            rs.getString("end_time"),       // End time in string format (HH:mm)
            rs.getString("status")          // Status (typically "unavailable")
        );
    
    /**
     * Constructor with dependency injection
     * @param jdbcTemplate Spring's JdbcTemplate for database operations
     */
    @Autowired
    public UnavailableTimeRangeRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    
    /**
     * Finds all unavailable time ranges for a specific date
     * 
     * @param date The date to search for in string format (YYYY-MM-DD)
     * @return List of UnavailableTimeRange objects for the specified date
     */
    public List<UnavailableTimeRange> findByDate(String date) {
        return jdbcTemplate.query(
            "SELECT * FROM unavailable_time_ranges WHERE date = ?",
            unavailableTimeRangeRowMapper,
            date
        );
    }
    
    /**
     * Deletes all unavailable time ranges for a specific date
     * Used when replacing all ranges for a date with a new set
     * 
     * @param date The date to delete ranges for in string format (YYYY-MM-DD)
     */
    public void deleteByDate(String date) {
        jdbcTemplate.update(
            "DELETE FROM unavailable_time_ranges WHERE date = ?",
            date
        );
    }
    
    /**
     * Saves an unavailable time range to the database
     * Delegates to either insert or update based on whether the ID is null
     * 
     * @param range The UnavailableTimeRange object to save
     * @return The saved UnavailableTimeRange with ID populated if it was an insert
     */
    public UnavailableTimeRange save(UnavailableTimeRange range) {
        if (range.getId() == null) {
            return insert(range);  // New record, needs to be inserted
        } else {
            return update(range);  // Existing record, needs to be updated
        }
    }
    
    /**
     * Inserts a new unavailable time range into the database
     * 
     * @param range The UnavailableTimeRange object to insert
     * @return The UnavailableTimeRange with its newly generated ID
     */
    private UnavailableTimeRange insert(UnavailableTimeRange range) {
        // KeyHolder to retrieve auto-generated primary key
        KeyHolder keyHolder = new GeneratedKeyHolder();
        
        jdbcTemplate.update(connection -> {
            // Create prepared statement with generated keys
            PreparedStatement ps = connection.prepareStatement(
                "INSERT INTO unavailable_time_ranges (date, start_time, end_time, status) VALUES (?, ?, ?, ?)",
                Statement.RETURN_GENERATED_KEYS
            );
            // Set parameters for the prepared statement to prevent SQL injection
            ps.setString(1, range.getDate());       // Date
            ps.setString(2, range.getStartTime());  // Start time
            ps.setString(3, range.getEndTime());    // End time
            ps.setString(4, range.getStatus());     // Status
            return ps;
        }, keyHolder);
        
        // Set the generated ID in the entity and return it
        range.setId(keyHolder.getKey().intValue());
        return range;
    }
    
    /**
     * Updates an existing unavailable time range in the database
     * 
     * @param range The UnavailableTimeRange object to update
     * @return The updated UnavailableTimeRange
     */
    private UnavailableTimeRange update(UnavailableTimeRange range) {
        jdbcTemplate.update(
            "UPDATE unavailable_time_ranges SET date = ?, start_time = ?, end_time = ?, status = ? WHERE id = ?",
            range.getDate(),       // Date
            range.getStartTime(),  // Start time
            range.getEndTime(),    // End time
            range.getStatus(),     // Status
            range.getId()          // Primary key for WHERE clause
        );
        
        return range;
    }
}