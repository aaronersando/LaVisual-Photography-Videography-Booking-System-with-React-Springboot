/**
 * Payment Repository
 * 
 * This repository class is responsible for all database operations related to payment records.
 * It serves as the data access layer for the payment functionality in the application, providing
 * methods to create, read, update, and delete payment information in the database.
 * 
 * Key features:
 * - Direct JDBC database access using Spring's JdbcTemplate
 * - Handles payment creation, updating, and retrieval
 * - Manages payment proof uploads references
 * - Handles the relationship between payments and bookings
 * - Supports different payment types (full payment vs. down payment)
 * - Calculates remaining balances for partial payments
 * 
 * The repository uses a special workflow to handle the circular dependency between
 * bookings and payments where initial payments are created without a booking ID,
 * then updated with the booking ID after the booking is created.
 */
package com.La.Visual.repository;

// Import the Payment entity class
import com.La.Visual.entity.Payment;
// Import Spring JDBC components for database access
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

// Import Java SQL classes for database operations
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
// Import Java utility classes
import java.util.List;
import java.util.Optional;

// Mark this class as a repository component in Spring's component scanning
@Repository
public class PaymentRepository {

    // Spring's JdbcTemplate for executing SQL queries safely
    private final JdbcTemplate jdbcTemplate;

    /**
     * Row mapper to convert database result rows into Payment objects
     * Uses the builder pattern from the Payment entity to create instances
     */
    private final RowMapper<Payment> paymentRowMapper = (rs, rowNum) -> Payment.builder()
        .paymentId(rs.getInt("payment_id"))
        .bookingId(rs.getInt("booking_id"))
        .amount(rs.getDouble("amount"))
        .paymentType(rs.getString("payment_type"))
        .paymentMethod(rs.getString("payment_method"))
        .paymentStatus(rs.getString("payment_status"))
        .remainingBalance(rs.getDouble("remaining_balance"))
        .gcashNumber(rs.getString("gcash_number")) 
        .paymentProof(rs.getString("payment_proof"))
        .paymentDate(rs.getTimestamp("payment_date").toLocalDateTime())
        .build();

    /**
     * Constructor with dependency injection
     * @param jdbcTemplate Spring's JdbcTemplate for database operations
     */
    public PaymentRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Creates an initial payment record without a booking ID to avoid circular references
     * This is used in the first step of the booking process, before a booking record exists
     * 
     * @param payment Optional existing payment object (not used currently)
     * @param amount Payment amount
     * @param paymentType Type of payment ("FULL" or "DOWNPAYMENT")
     * @param paymentMethod Method of payment (e.g., "CASH", "GCASH")
     * @param gcashNumber GCash number (if applicable)
     * @return A new Payment object with the generated ID
     */
    // Initial save - without booking_id (for circular reference handling)
    public Payment saveInitial(Payment payment, Double amount, String paymentType, String paymentMethod, String gcashNumber) {
        // KeyHolder will store the generated primary key after insert
        KeyHolder keyHolder = new GeneratedKeyHolder();
        
        // Calculate initial remaining balance based on payment type
        Double remainingBalance = 0.0;
        if ("DOWNPAYMENT".equals(paymentType)) {
            remainingBalance = amount; // Will be updated later with correct balance
        }
        
        // Create a final copy that can be used in the lambda
        final Double finalRemainingBalance = remainingBalance;
        final String finalGcashNumber = gcashNumber;
        
        // Execute the SQL insert statement
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                "INSERT INTO payments (booking_id, amount, payment_type, payment_method, payment_status, remaining_balance, gcash_number) " +
                "VALUES (NULL, ?, ?, ?, 'PENDING', ?, ?)",
                Statement.RETURN_GENERATED_KEYS
            );
            // Set parameters for the prepared statement to prevent SQL injection
            ps.setDouble(1, amount);
            ps.setString(2, paymentType);
            ps.setString(3, paymentMethod);
            ps.setDouble(4, finalRemainingBalance);
            ps.setString(5, finalGcashNumber);
            return ps;
        }, keyHolder);
        
        // Get the generated ID and build a new Payment object
        Integer id = keyHolder.getKey().intValue();
        return Payment.builder()
            .paymentId(id)
            .amount(amount)
            .paymentType(paymentType)
            .paymentMethod(paymentMethod)
            .paymentStatus("PENDING")
            .remainingBalance(remainingBalance)
            .gcashNumber(gcashNumber)
            .build();
    }

    /**
     * Updates a payment record with a reference to a payment proof file
     * 
     * @param paymentId ID of the payment to update
     * @param paymentProof Filename of the uploaded payment proof
     */
    public void updatePaymentProof(Integer paymentId, String paymentProof) {
        jdbcTemplate.update(
            "UPDATE payments SET payment_proof = ? WHERE payment_id = ?",
            paymentProof,
            paymentId
        );
    }

    /**
     * Updates a payment with a booking ID and calculates the remaining balance
     * This is used in the second step of the booking process, after the booking is created
     * 
     * @param paymentId ID of the payment to update
     * @param bookingId ID of the booking to link to the payment
     * @param packagePrice Total price of the package to calculate remaining balance
     */
    // Update payment with booking_id once booking is created
    public void updateBookingId(Integer paymentId, Integer bookingId, Double packagePrice) {
        Double remainingBalance = 0.0;
        
        // If payment type is DOWNPAYMENT, calculate remaining balance
        Payment payment = findById(paymentId).orElse(null);
        if (payment != null && "DOWNPAYMENT".equals(payment.getPaymentType())) {
            remainingBalance = packagePrice - payment.getAmount();
        }
        
        // Update the payment record with booking ID and calculated remaining balance
        jdbcTemplate.update(
            "UPDATE payments SET booking_id = ?, remaining_balance = ? WHERE payment_id = ?",
            bookingId,
            remainingBalance,
            paymentId
        );
    }

    /**
     * Finds a payment by its ID
     * 
     * @param id The payment ID to search for
     * @return Optional containing the payment if found, empty otherwise
     */
    public Optional<Payment> findById(Integer id) {
        List<Payment> payments = jdbcTemplate.query(
            "SELECT * FROM payments WHERE payment_id = ?",
            paymentRowMapper,
            id
        );
        
        return payments.isEmpty() ? Optional.empty() : Optional.of(payments.get(0));
    }

    /**
     * Finds all payments associated with a specific booking
     * Ordered by payment date (newest first)
     * 
     * @param bookingId The booking ID to search for
     * @return List of payments for the booking
     */
    public List<Payment> findByBookingId(Integer bookingId) {
        return jdbcTemplate.query(
            "SELECT * FROM payments WHERE booking_id = ? ORDER BY payment_date DESC",
            paymentRowMapper,
            bookingId
        );
    }
    
    /**
     * Updates an existing payment's details
     * 
     * @param payment The payment with updated information
     * @return The updated payment
     */
    public Payment update(Payment payment) {
        jdbcTemplate.update(
            "UPDATE payments SET payment_type = ?, payment_method = ?, amount = ?, " +
            "payment_status = ?, remaining_balance = ? " +
            "WHERE payment_id = ?",
            payment.getPaymentType(),
            payment.getPaymentMethod(),
            payment.getAmount(),
            payment.getPaymentStatus(),
            payment.getRemainingBalance(),
            payment.getPaymentId()
        );
        
        return payment;
    }
    
    /**
     * Deletes a payment by its ID
     * 
     * @param id The payment ID to delete
     * @return true if deleted successfully, false otherwise
     */
    public boolean deleteById(Integer id) {
        int rowsAffected = jdbcTemplate.update("DELETE FROM payments WHERE payment_id = ?", id);
        return rowsAffected > 0;
    }

    /**
     * Removes the association between payments and a booking
     * Used before deleting a booking to prevent foreign key constraint violations
     * 
     * @param bookingId The booking ID to unlink payments from
     */
    public void unlinkPaymentsFromBooking(Integer bookingId) {
        jdbcTemplate.update(
            "UPDATE payments SET booking_id = NULL WHERE booking_id = ?",
            bookingId
        );
    }
}