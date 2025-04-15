package com.La.Visual;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("/Lavisual")
public class pageController {

   @GetMapping("/home")
   public String getHomePage() {
      return "homepage";
   }

   @GetMapping("/portfolio")
   public String getPortfolio() {
       return "portfolio page";
   }
   
   @GetMapping("/about")
   public String getAboutPage() {
       return "about us page";
   }

   @GetMapping("/contact")
   public String getContactPage() {
       return "contact us page";
   }
   
   @GetMapping("/packages")
   public String getPackagesPage() {
       return "packages page";
   }
   
   @GetMapping("/booking")
   public String getBookingPage() {
       return "booking page";
   }
   


}
