package com.La.Visual.payment;
import java.sql.Date;

import jakarta.validation.constraints.NotEmpty;
import lombok.Builder;
import lombok.With;

@Builder
@With
public record payment(

   Integer payment_id,
   Integer booking_id,
   @NotEmpty
   Double amount,
   @NotEmpty
   PaymentType payment_type,
   @NotEmpty
   String payment_method,
   @NotEmpty
   PaymentStatus payment_status,
   @NotEmpty
   Double remaining_balance,
   @NotEmpty
   Date payment_date

) {}


enum PaymentType {
    FULL,
    DOWNPAYMENT
}
enum PaymentStatus {
    PENDING,
    COMPLETED,
    FAILED
}
