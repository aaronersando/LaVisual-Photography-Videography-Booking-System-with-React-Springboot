package com.La.Visual.booking;

import java.sql.Date;
import java.util.Optional;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;

@Repository
public class booking_repository {
   JdbcClient jdbcClient;
   public booking_repository(JdbcClient jdbcClient) {
      this.jdbcClient = jdbcClient;
   }

   public Optional<booking> findAllBookings() {
      return jdbcClient.sql("SELECT * FROM bookings")
         .query(booking.class)
         .optional();
   }

   public void createBooking(booking bookings) {
      var updated = jdbcClient.sql("INSERT INTO bookings (guest_name, guest_phone, booking_date, booking_time location, category_name, package_name, package_price, special_requests, booking_status ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
         .params(bookings.guest_name(), bookings.guest_email(), bookings.guest_phone(), bookings.booking_date(), bookings.booking_time(), bookings.category_name(), bookings.package_name(), bookings.package_price(), bookings.special_requests(), bookings.booking_status())
         .update();
      Assert.state(updated == 1, "Failed to create booking");
   }

   public void updateBooking(booking bookings) {
      var updated = jdbcClient.sql("UPDATE bookings SET guest_name = ?, guest_email = ?, guest_phone = ?, booking_date = ?, booking_time = ?, location = ?, category_name = ?, package_name = ?, package_price = ?, special_requests = ?, booking_status = ? WHERE booking_id = ?")
         .params(bookings.guest_name(), bookings.guest_email(), bookings.guest_phone(), bookings.booking_date(), bookings.booking_time(), bookings.location(), bookings.category_name(), bookings.package_name(), bookings.package_price(), bookings.special_requests(), bookings.booking_status())
         .update();
      Assert.state(updated == 1, "Failed to update booking");
   }

   public void deleteBooking(Integer booking_id) {
      var updated = jdbcClient.sql("DELETE FROM bookings WHERE booking_id = ?")
         .params(booking_id)
         .update();
      Assert.state(updated == 1, "Failed to delete booking");
   }

   public Optional<booking> findBookingById(Integer booking_id) {
     return jdbcClient.sql("SELECT * FROM bookings WHERE booking_id = :id")
         .param("id", booking_id)
         .query(booking.class)
         .optional();
   }

   public Optional<booking> findBookingByDate(Date booking_date) {
      return jdbcClient.sql("SELECT * FROM bookings WHERE booking_date = :date")
         .param("date", booking_date)
         .query(booking.class)
         .optional();
   }

}
