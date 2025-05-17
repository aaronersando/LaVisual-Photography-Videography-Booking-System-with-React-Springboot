package com.La.Visual.controller;

import com.La.Visual.dto.RequestResponse;
import com.La.Visual.entity.Booking;
import com.La.Visual.repository.BookingRepository;
import com.La.Visual.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AnalyticsController {

    private final BookingRepository bookingRepository;
    private final AuthService authService;
    
    @Autowired
    public AnalyticsController(BookingRepository bookingRepository, AuthService authService) {
        this.bookingRepository = bookingRepository;
        this.authService = authService;
    }
    
    @GetMapping("/dashboard")
    public ResponseEntity<RequestResponse> getDashboardData(
            @RequestParam(defaultValue = "year") String range,
            @RequestHeader("Authorization") String authHeader) {
        
        // Check if admin is authenticated
        if (!authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(new RequestResponse(
                "Unauthorized access",
                null,
                401,
                false
            ));
        }
        
        String token = authHeader.substring(7);
        if (!authService.isAdminAuthenticated(token)) {
            return ResponseEntity.status(403).body(new RequestResponse(
                "Access forbidden",
                null,
                403,
                false
            ));
        }
        
        try {
            // Determine date range based on parameter
            LocalDate startDate;
            LocalDate endDate = LocalDate.now();
            
            switch (range.toLowerCase()) {
                case "month":
                    startDate = endDate.minusMonths(1);
                    break;
                case "quarter":
                    startDate = endDate.minusMonths(3);
                    break;
                default: // year
                    startDate = endDate.minusMonths(12);
            }
            
            // Fetch all bookings (use confirmed/completed only for revenue)
            List<Booking> allBookings = bookingRepository.findAll();
            List<Booking> confirmedBookings = allBookings.stream()
                .filter(booking -> "CONFIRMED".equals(booking.getBookingStatus()) || 
                                 "COMPLETED".equals(booking.getBookingStatus()))
                .collect(Collectors.toList());
            
            // Calculate total bookings and revenue
            int totalBookings = confirmedBookings.size();
            double totalProfit = confirmedBookings.stream()
                .mapToDouble(Booking::getPackagePrice)
                .sum();
            
            // Calculate monthly averages
            Map<YearMonth, List<Booking>> bookingsByMonth = confirmedBookings.stream()
                .collect(Collectors.groupingBy(booking -> 
                    YearMonth.from(booking.getBookingDate())));
            
            double monthlyAvgBookings = bookingsByMonth.isEmpty() ? 0 : 
                (double) totalBookings / bookingsByMonth.size();
            
            double monthlyAvgProfit = bookingsByMonth.isEmpty() ? 0 : 
                totalProfit / bookingsByMonth.size();
            
            // Get current month stats
            YearMonth currentMonth = YearMonth.now();
            List<Booking> currentMonthBookings = bookingsByMonth.getOrDefault(currentMonth, Collections.emptyList());
            
            int currentMonthBookingsCount = currentMonthBookings.size();
            double currentMonthProfit = currentMonthBookings.stream()
                .mapToDouble(Booking::getPackagePrice)
                .sum();
            
            // Prepare monthly data for charts
            List<Map<String, Object>> monthlyBookingsData = new ArrayList<>();
            List<Map<String, Object>> monthlyProfitData = new ArrayList<>();
            
            DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MMM yyyy");
            
            // Generate a sequence of months based on the requested range
            List<YearMonth> months = new ArrayList<>();
            YearMonth month = YearMonth.from(startDate);
            while (!month.isAfter(YearMonth.from(endDate))) {
                months.add(month);
                month = month.plusMonths(1);
            }
            
            // Fill in data for each month
            for (YearMonth m : months) {
                String monthLabel = m.format(monthFormatter);
                List<Booking> monthBookings = bookingsByMonth.getOrDefault(m, Collections.emptyList());
                
                // Add bookings count
                Map<String, Object> bookingData = new HashMap<>();
                bookingData.put("month", monthLabel);
                bookingData.put("value", monthBookings.size());
                monthlyBookingsData.add(bookingData);
                
                // Add profit
                Map<String, Object> profitData = new HashMap<>();
                profitData.put("month", monthLabel);
                profitData.put("value", monthBookings.stream()
                    .mapToDouble(Booking::getPackagePrice)
                    .sum());
                monthlyProfitData.add(profitData);
            }
            
            // Calculate category distribution
            Map<String, Integer> categoryDistribution = confirmedBookings.stream()
                .collect(Collectors.groupingBy(
                    Booking::getCategoryName,
                    Collectors.summingInt(booking -> 1)
                ));
            
            // Calculate package popularity
            Map<String, Integer> packagePopularity = confirmedBookings.stream()
                .collect(Collectors.groupingBy(
                    Booking::getPackageName,
                    Collectors.summingInt(booking -> 1)
                ));
            
            // Build response data
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("totalBookings", totalBookings);
            responseData.put("totalProfit", totalProfit);
            responseData.put("monthlyAvgBookings", Math.round(monthlyAvgBookings));
            responseData.put("monthlyAvgProfit", Math.round(monthlyAvgProfit));
            responseData.put("currentMonthBookings", currentMonthBookingsCount);
            responseData.put("currentMonthProfit", currentMonthProfit);
            responseData.put("monthlyBookings", monthlyBookingsData);
            responseData.put("monthlyProfit", monthlyProfitData);
            responseData.put("categoryDistribution", categoryDistribution);
            responseData.put("packagePopularity", packagePopularity);
            
            return ResponseEntity.ok(new RequestResponse(
                "Analytics data retrieved successfully",
                responseData,
                200,
                true
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new RequestResponse(
                "Error retrieving analytics data: " + e.getMessage(),
                null,
                500,
                false
            ));
        }
    }
}