package com.La.Visual.booking;

import java.sql.Date;
import java.sql.Time;

import jakarta.validation.constraints.NotEmpty;

public record booking(
  Integer booking_id,
  @NotEmpty
  String guest_name,
  @NotEmpty
  String guest_email,
  @NotEmpty
  String guest_phone, 
  @NotEmpty  
  Date booking_date,
  @NotEmpty
  Time booking_time,     
  @NotEmpty
  String location,
  @NotEmpty
  String category_name,
  @NotEmpty
  String package_name,
  @NotEmpty
  Double package_price,
  @NotEmpty
  String special_requests ,
  @NotEmpty
  BookingStatus booking_status,
  Integer payment_id,
  @NotEmpty
  Date created_at 

){}

enum BookingStatus {
    PENDING,
    CONFIRMED,
    CANCELLED,
    COMPLETED
}

