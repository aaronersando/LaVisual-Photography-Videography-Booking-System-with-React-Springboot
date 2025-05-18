/**
 * Booking Repository
 * 
 * This repository class is responsible for all database operations related to bookings in the application.
 * It provides methods for creating, reading, updating, and deleting booking records, as well as
 * specialized query methods for finding bookings by various criteria (date, status, email, etc.).
 * 
 * Key features:
 * - Direct JDBC database access using Spring's JdbcTemplate
 * - SQL query execution for all booking-related database operations
 * - Row mapping from database results to Booking entity objects
 * - Transaction management for data consistency
 * - Specialized query methods for calendar and scheduling functionality
 * 
 * This repository is used by the BookingService to perform data access operations
 * without exposing database details to higher layers of the application.
 */
package com.La.Visual.repository;

// Import the Booking entity
import com.La.Visual.entity.Booking;
// Import Spring JDBC components for database access
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

// Import Java SQL and time APIs
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
// Import Java collection utilities
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

// Mark this class as a repository component in Spring's component scanning
@Repository
public class BookingRepository {

    // Spring's JdbcTemplate for executing SQL queries safely
    private final JdbcTemplate jdbcTemplate;

    /**
     * Row mapper to convert database result rows into Booking objects
     * Uses the builder pattern from the Booking entity to create instances
     */
    private final RowMapper<Booking> bookingRowMapper = (rs, rowNum) -> Booking.builder()
        .bookingId(rs.getInt("booking_id"))
        .guestName(rs.getString("guest_name"))
        .guestEmail(rs.getString("guest_email"))
        .guestPhone(rs.getString("guest_phone"))
        .bookingDate(rs.getDate("booking_date").toLocalDate())
        .bookingTimeStart(rs.getTime("booking_time_start").toLocalTime())
        .bookingTimeEnd(rs.getTime("booking_time_end").toLocalTime())
        .bookingHours(rs.getInt("booking_hours"))
        .location(rs.getString("location"))
        .categoryName(rs.getString("category_name"))
        .packageName(rs.getString("package_name"))
        .packagePrice(rs.getDouble("package_price"))
        .specialRequests(rs.getString("special_requests"))
        .bookingStatus(rs.getString("booking_status"))
        .bookingReference(rs.getString("booking_reference"))
        .paymentId(rs.getInt("payment_id"))
        .paymentProof(rs.getString("payment_proof"))
        .createdAt(rs.getTimestamp("created_at").toLocalDateTime())
        .build();

    /**
     * Constructor with dependency injection
     * @param jdbcTemplate Spring's JdbcTemplate for database operations
     */
    public BookingRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Saves a new booking to the database
     * 
     * @param booking The booking entity to save
     * @return The saved booking with its generated ID
     */
    public Booking save(Booking booking) {
        // KeyHolder to retrieve auto-generated primary key
        KeyHolder keyHolder = new GeneratedKeyHolder();
        
        jdbcTemplate.update(connection -> {
            // Create prepared statement with generated keys
            PreparedStatement ps = connection.prepareStatement(
                "INSERT INTO bookings (guest_name, guest_email, guest_phone, " +
                "booking_date, booking_time_start, booking_time_end, booking_hours, " +
                "location, category_name, package_name, package_price, " +
                "special_requests, booking_status, booking_reference, payment_id, payment_proof, created_at) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                Statement.RETURN_GENERATED_KEYS
            );
            // Set parameters for the prepared statement to prevent SQL injection
            ps.setString(1, booking.getGuestName());
            ps.setString(2, booking.getGuestEmail());
            ps.setString(3, booking.getGuestPhone());
            ps.setDate(4, java.sql.Date.valueOf(booking.getBookingDate()));
            ps.setTime(5, java.sql.Time.valueOf(booking.getBookingTimeStart()));
            ps.setTime(6, java.sql.Time.valueOf(booking.getBookingTimeEnd()));
            ps.setInt(7, booking.getBookingHours());
            ps.setString(8, booking.getLocation());
            ps.setString(9, booking.getCategoryName());
            ps.setString(10, booking.getPackageName());
            ps.setDouble(11, booking.getPackagePrice());
            ps.setString(12, booking.getSpecialRequests());
            ps.setString(13, booking.getBookingStatus());
            ps.setString(14, booking.getBookingReference());
            ps.setInt(15, booking.getPaymentId());
            ps.setString(16, booking.getPaymentProof());
            ps.setTimestamp(17, Timestamp.valueOf(booking.getCreatedAt() != null ? 
                      booking.getCreatedAt() : LocalDateTime.now()));
            return ps;
        }, keyHolder);
        
        // Get the generated ID and return an updated booking object with this ID
        Integer id = keyHolder.getKey().intValue();
        return booking.withBookingId(id);
    }

    /**
     * Finds a booking by its ID
     * 
     * @param id The booking ID to search for
     * @return Optional containing the booking if found, empty otherwise
     */
    public Optional<Booking> findById(Integer id) {
        List<Booking> bookings = jdbcTemplate.query(
            "SELECT * FROM bookings WHERE booking_id = ?",
            bookingRowMapper,
            id
        );
        
        return bookings.isEmpty() ? Optional.empty() : Optional.of(bookings.get(0));
    }

    /**
     * Retrieves all bookings from the database, ordered by date (newest first)
     * 
     * @return List of all bookings
     */
    public List<Booking> findAll() {
        return jdbcTemplate.query(
            "SELECT * FROM bookings ORDER BY booking_date DESC", 
            bookingRowMapper
        );
    }
    
    /**
     * Finds all bookings for a specific guest email, ordered by date (newest first)
     * 
     * @param email The guest's email address
     * @return List of bookings for that email
     */
    public List<Booking> findByGuestEmail(String email) {
        return jdbcTemplate.query(
            "SELECT * FROM bookings WHERE guest_email = ? ORDER BY booking_date DESC",
            bookingRowMapper,
            email
        );
    }
    
    /**
     * Finds all bookings for a specific date
     * 
     * @param date The date to search for
     * @return List of bookings on that date
     */
    public List<Booking> findByDate(LocalDate date) {
        return jdbcTemplate.query(
            "SELECT * FROM bookings WHERE booking_date = ?",
            bookingRowMapper,
            java.sql.Date.valueOf(date)
        );
    }
    
    /**
     * Deletes a booking by its ID
     * 
     * @param id The booking ID to delete
     * @return true if deleted successfully, false otherwise
     */
    public boolean deleteById(Integer id) {
        int rowsAffected = jdbcTemplate.update("DELETE FROM bookings WHERE booking_id = ?", id);
        return rowsAffected > 0;
    }
    
    /**
     * Updates an existing booking
     * 
     * @param booking The booking with updated information
     * @return The updated booking
     * @throws RuntimeException if update fails
     */
    public Booking update(Booking booking) {
        try {
            jdbcTemplate.update(
                "UPDATE bookings SET guest_name = ?, guest_email = ?, guest_phone = ?, " +
                "booking_date = ?, booking_time_start = ?, booking_time_end = ?, booking_hours = ?, " +
                "location = ?, category_name = ?, package_name = ?, package_price = ?, " +
                "special_requests = ?, booking_status = ?, booking_reference = ?, payment_id = ?, " +
                "payment_proof = ?, admin_notes = ? WHERE booking_id = ?",
                booking.getGuestName(),
                booking.getGuestEmail(),
                booking.getGuestPhone(),
                java.sql.Date.valueOf(booking.getBookingDate()),
                java.sql.Time.valueOf(booking.getBookingTimeStart()),
                java.sql.Time.valueOf(booking.getBookingTimeEnd()),
                booking.getBookingHours(),
                booking.getLocation(),
                booking.getCategoryName(),
                booking.getPackageName(),
                booking.getPackagePrice(),
                booking.getSpecialRequests(),
                booking.getBookingStatus(),
                booking.getBookingReference(),
                booking.getPaymentId(),
                booking.getPaymentProof(),
                booking.getAdminNotes(),
                booking.getBookingId()
            );
            return booking;
        } catch (Exception e) {
            System.err.println("Error in update: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error updating booking: " + e.getMessage());
        }
    }

    /**
     * Finds all upcoming (future) bookings that are not cancelled
     * 
     * @return List of upcoming bookings
     */
    public List<Booking> findUpcomingBookings() {
        try {
            LocalDate today = LocalDate.now();
            System.out.println("Finding bookings from date: " + today);
            
            List<Booking> bookings = jdbcTemplate.query(
                "SELECT * FROM bookings WHERE booking_date >= ? AND booking_status != 'CANCELLED' ORDER BY booking_date, booking_time_start",
                bookingRowMapper,
                java.sql.Date.valueOf(today)
            );
            
            System.out.println("SQL query executed successfully");
            return bookings;
        } catch (Exception e) {
            System.err.println("Error in findUpcomingBookings: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();  // Return empty list instead of throwing exception
        }
    }

    /**
     * Finds bookings that overlap with a given time range on a specific date
     * Used to check for scheduling conflicts when creating or updating bookings
     * 
     * @param date The date to check
     * @param startTime The start time of the range
     * @param endTime The end time of the range
     * @param excludeBookingId ID of booking to exclude from check (for updates)
     * @return List of overlapping bookings
     */
    public List<Booking> findOverlappingBookings(LocalDate date, LocalTime startTime, LocalTime endTime, Integer excludeBookingId) {
        try {
            return jdbcTemplate.query(
                "SELECT * FROM bookings " +
                "WHERE booking_date = ? " +
                "AND booking_id != ? " +
                "AND booking_status != 'CANCELLED' " +
                "AND (" +
                "  (booking_time_start < ? AND booking_time_end > ?) OR " + // starts before, ends after our start
                "  (booking_time_start < ? AND booking_time_end > ?) OR " + // starts before, ends after our end
                "  (booking_time_start >= ? AND booking_time_end <= ?)" +   // contained within our range
                ")",
                bookingRowMapper,
                java.sql.Date.valueOf(date),
                excludeBookingId,
                java.sql.Time.valueOf(endTime), java.sql.Time.valueOf(startTime),
                java.sql.Time.valueOf(startTime), java.sql.Time.valueOf(startTime),
                java.sql.Time.valueOf(startTime), java.sql.Time.valueOf(endTime)
            );
        } catch (Exception e) {
            System.err.println("Error in findOverlappingBookings: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    /**
     * Finds all bookings with a specific status
     * 
     * @param status The status to search for (e.g., "PENDING", "CONFIRMED", "CANCELLED")
     * @return List of bookings with the specified status
     */
    public List<Booking> findByStatus(String status) {
        try {
            // Add debugging
            System.out.println("Finding bookings with status: " + status);
            
            List<Booking> bookings = jdbcTemplate.query(
                "SELECT * FROM bookings WHERE booking_status = ? ORDER BY booking_date DESC",
                bookingRowMapper,
                status
            );
            
            // More debugging
            System.out.println("Found " + bookings.size() + " bookings with status " + status);
            
            return bookings;
        } catch (Exception e) {
            System.err.println("Error in findByStatus: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    /**
     * Finds all approved bookings (CONFIRMED or COMPLETED) for a specific date
     * Used for calendar views and availability checking
     * 
     * @param date The date to check
     * @return List of approved bookings for that date
     */
    public List<Booking> findApprovedBookingsByDate(LocalDate date) {
        return jdbcTemplate.query(
            "SELECT * FROM bookings WHERE booking_date = ? AND booking_status IN ('CONFIRMED', 'COMPLETED') ORDER BY booking_time_start",
            bookingRowMapper,
            java.sql.Date.valueOf(date)
        );
    }
    
    /**
     * Finds all approved bookings for a specific month and year
     * Used for monthly calendar views
     * 
     * @param year The year
     * @param month The month (1-12)
     * @return List of approved bookings in that month
     */
    public List<Booking> findApprovedBookingsInMonth(int year, int month) {
        // Calculate the first and last day of the month
        LocalDate startOfMonth = LocalDate.of(year, month, 1);
        LocalDate endOfMonth = startOfMonth.plusMonths(1).minusDays(1);
        
        return jdbcTemplate.query(
            "SELECT * FROM bookings WHERE booking_date BETWEEN ? AND ? AND booking_status IN ('CONFIRMED', 'COMPLETED') ORDER BY booking_date, booking_time_start",
            bookingRowMapper,
            java.sql.Date.valueOf(startOfMonth),
            java.sql.Date.valueOf(endOfMonth)
        );
    }
}