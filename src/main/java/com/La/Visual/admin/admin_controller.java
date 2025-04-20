package com.La.Visual.admin;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.La.Visual.booking.booking_repository;

@RestController
@RequestMapping("/Lavisual/admin")
public class admin_controller {
   booking_repository bookingRepository;
   admin_repository adminRepository;
   public admin_controller(booking_repository bookingRepository , admin_repository adminRepository) {
      this.adminRepository = adminRepository;
      this.bookingRepository = bookingRepository;
   }

}
