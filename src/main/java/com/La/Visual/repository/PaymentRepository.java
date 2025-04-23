package com.La.Visual.repository;

import com.La.Visual.entity.Payment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Repository
public class PaymentRepository {

    private final JdbcTemplate jdbcTemplate;

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

    public PaymentRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Initial save - without booking_id (for circular reference handling)
    public Payment saveInitial(Payment payment, Double amount, String paymentType, String paymentMethod, String gcashNumber) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        
        Double remainingBalance = 0.0;
        if ("DOWNPAYMENT".equals(paymentType)) {
            remainingBalance = amount; // Will be updated later with correct balance
        }
        
        // Create a final copy that can be used in the lambda
        final Double finalRemainingBalance = remainingBalance;
        final String finalGcashNumber = gcashNumber;
        
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                "INSERT INTO payments (booking_id, amount, payment_type, payment_method, payment_status, remaining_balance, gcash_number) " +
                "VALUES (NULL, ?, ?, ?, 'PENDING', ?, ?)",
                Statement.RETURN_GENERATED_KEYS
            );
            ps.setDouble(1, amount);
            ps.setString(2, paymentType);
            ps.setString(3, paymentMethod);
            ps.setDouble(4, finalRemainingBalance);
            ps.setString(5, finalGcashNumber);
            return ps;
        }, keyHolder);
        
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

    public void updatePaymentProof(Integer paymentId, String paymentProof) {
        jdbcTemplate.update(
            "UPDATE payments SET payment_proof = ? WHERE payment_id = ?",
            paymentProof,
            paymentId
        );
    }

    // Update payment with booking_id once booking is created
    public void updateBookingId(Integer paymentId, Integer bookingId, Double packagePrice) {
        Double remainingBalance = 0.0;
        
        // If payment type is DOWNPAYMENT, calculate remaining balance
        Payment payment = findById(paymentId).orElse(null);
        if (payment != null && "DOWNPAYMENT".equals(payment.paymentType())) {
            remainingBalance = packagePrice - payment.amount();
        }
        
        jdbcTemplate.update(
            "UPDATE payments SET booking_id = ?, remaining_balance = ? WHERE payment_id = ?",
            bookingId,
            remainingBalance,
            paymentId
        );
    }

    public Optional<Payment> findById(Integer id) {
        List<Payment> payments = jdbcTemplate.query(
            "SELECT * FROM payments WHERE payment_id = ?",
            paymentRowMapper,
            id
        );
        
        return payments.isEmpty() ? Optional.empty() : Optional.of(payments.get(0));
    }

    public List<Payment> findByBookingId(Integer bookingId) {
        return jdbcTemplate.query(
            "SELECT * FROM payments WHERE booking_id = ? ORDER BY payment_date DESC",
            paymentRowMapper,
            bookingId
        );
    }
    
    public Payment update(Payment payment) {
        jdbcTemplate.update(
            "UPDATE payments SET payment_type = ?, payment_method = ?, amount = ?, " +
            "payment_status = ?, remaining_balance = ? " +
            "WHERE payment_id = ?",
            payment.paymentType(),
            payment.paymentMethod(),
            payment.amount(),
            payment.paymentStatus(),
            payment.remainingBalance(),
            payment.paymentId()
        );
        
        return payment;
    }
    
    public boolean deleteById(Integer id) {
        int rowsAffected = jdbcTemplate.update("DELETE FROM payments WHERE payment_id = ?", id);
        return rowsAffected > 0;
    }
}