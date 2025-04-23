package com.La.Visual.repository;

import com.La.Visual.entity.Booking;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class BookingRepository {

    private final JdbcTemplate jdbcTemplate;

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
        .createdAt(rs.getTimestamp("created_at").toLocalDateTime())
        .build();

    public BookingRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Booking save(Booking booking) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                "INSERT INTO bookings (guest_name, guest_email, guest_phone, " +
                "booking_date, booking_time_start, booking_time_end, booking_hours, " +
                "location, category_name, package_name, package_price, " +
                "special_requests, booking_status, booking_reference, payment_id) " + // Add booking_reference
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                Statement.RETURN_GENERATED_KEYS
            );
            ps.setString(1, booking.guestName());
            ps.setString(2, booking.guestEmail());
            ps.setString(3, booking.guestPhone());
            ps.setDate(4, java.sql.Date.valueOf(booking.bookingDate()));
            ps.setTime(5, java.sql.Time.valueOf(booking.bookingTimeStart()));
            ps.setTime(6, java.sql.Time.valueOf(booking.bookingTimeEnd()));
            ps.setInt(7, booking.bookingHours());
            ps.setString(8, booking.location());
            ps.setString(9, booking.categoryName());
            ps.setString(10, booking.packageName());
            ps.setDouble(11, booking.packagePrice());
            ps.setString(12, booking.specialRequests());
            ps.setString(13, booking.bookingStatus());
            ps.setString(14, booking.bookingReference()); // Add this line
            ps.setInt(15, booking.paymentId());
            return ps;
        }, keyHolder);
        
        Integer id = keyHolder.getKey().intValue();
        return booking.withBookingId(id);
    }

    public Optional<Booking> findById(Integer id) {
        List<Booking> bookings = jdbcTemplate.query(
            "SELECT * FROM bookings WHERE booking_id = ?",
            bookingRowMapper,
            id
        );
        
        return bookings.isEmpty() ? Optional.empty() : Optional.of(bookings.get(0));
    }

    public List<Booking> findAll() {
        return jdbcTemplate.query(
            "SELECT * FROM bookings ORDER BY booking_date DESC", 
            bookingRowMapper
        );
    }
    
    public List<Booking> findByGuestEmail(String email) {
        return jdbcTemplate.query(
            "SELECT * FROM bookings WHERE guest_email = ? ORDER BY booking_date DESC",
            bookingRowMapper,
            email
        );
    }
    
    public List<Booking> findByDate(LocalDate date) {
        return jdbcTemplate.query(
            "SELECT * FROM bookings WHERE booking_date = ?",
            bookingRowMapper,
            java.sql.Date.valueOf(date)
        );
    }
    
    public boolean deleteById(Integer id) {
        int rowsAffected = jdbcTemplate.update("DELETE FROM bookings WHERE booking_id = ?", id);
        return rowsAffected > 0;
    }
    
    public Booking update(Booking booking) {
        jdbcTemplate.update(
            "UPDATE bookings SET guest_name = ?, guest_email = ?, guest_phone = ?, " +
            "booking_date = ?, booking_time_start = ?, booking_time_end = ?, booking_hours = ?, " +
            "location = ?, category_name = ?, package_name = ?, package_price = ?, " +
            "special_requests = ?, booking_status = ?, booking_reference = ? " + // Add booking_reference
            "WHERE booking_id = ?",
            booking.guestName(),
            booking.guestEmail(),
            booking.guestPhone(),
            booking.bookingDate(),
            booking.bookingTimeStart(),
            booking.bookingTimeEnd(),
            booking.bookingHours(),
            booking.location(),
            booking.categoryName(),
            booking.packageName(),
            booking.packagePrice(),
            booking.specialRequests(),
            booking.bookingStatus(),
            booking.bookingReference(), // Add this line
            booking.bookingId()
        );
        
        return booking;
    }

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
}