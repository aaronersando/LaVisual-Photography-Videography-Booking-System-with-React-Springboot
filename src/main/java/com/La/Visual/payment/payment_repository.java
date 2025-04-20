package com.La.Visual.payment;

import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;

@Repository
public class payment_repository {

   JdbcClient jdbcClient;
   public payment_repository(JdbcClient jdbcClient) {
      this.jdbcClient = jdbcClient;
   }

   public void createPayment(payment payments) {
      var updated = jdbcClient.sql("INSERT INTO payments (amount, payment_type, payment_method, payment_status, remaining_balance) VALUES (?, ?, ?, ?,?)")
         .params(payments.amount(), payments.payment_type(), payments.payment_method(), payments.payment_status(), payments.remaining_balance())
         .update();
      Assert.state(updated == 1, "Failed to create payment");
   }

   public Optional<payment> findPaymentById(Long id) {
      return jdbcClient.sql("SELECT * FROM payments WHERE id = ?")
         .params(id)
         .query(payment.class)
         .optional();
   }

   public List<payment> findAllPayments() {
      return jdbcClient.sql("SELECT * FROM payments")
         .query(payment.class)
         .list();
   }

   public List<payment> findPaymentsByStatus(String status) {
      return jdbcClient.sql("SELECT * FROM payments WHERE payment_status = ?")
         .params(status)
         .query(payment.class)
         .list();
   }
}

