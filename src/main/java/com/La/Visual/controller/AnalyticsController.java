/**
 * Analytics Controller
 * 
 * This controller provides data analytics endpoints for the application's admin dashboard.
 * It processes booking data to generate statistics, metrics, and chart data that help administrators
 * understand business performance, trends, and patterns.
 * 
 * Key features:
 * - Retrieves and processes booking data for different time ranges (month, quarter, year)
 * - Calculates key performance indicators like total bookings, revenue, averages
 * - Generates time-series data for charts (monthly bookings and profit)
 * - Produces distribution statistics (by category and package type)
 * - Implements admin-only access with JWT authentication
 * 
 * The data provided by this controller powers the analytics dashboard in the admin frontend,
 * allowing administrators to visualize business performance through charts and statistics.
 */
package com.La.Visual.controller;

// Import necessary components for DTO, entity handling, repository access, and response construction
import com.La.Visual.dto.RequestResponse;
import com.La.Visual.entity.Booking;
import com.La.Visual.repository.BookingRepository;
import com.La.Visual.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// Import Java date/time handling and utilities for data processing
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

// Define this class as a REST controller that handles requests to "/api/analytics"
@RestController
@RequestMapping("/api/analytics")
// Allow requests from the frontend development servers (React applications)
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AnalyticsController {

    // Repository for accessing booking data from the database
    private final BookingRepository bookingRepository;
    // Service for handling authentication-related operations
    private final AuthService authService;
    
    // Constructor that uses dependency injection to obtain required services
    @Autowired
    public AnalyticsController(BookingRepository bookingRepository, AuthService authService) {
        this.bookingRepository = bookingRepository;
        this.authService = authService;
    }
    
    /**
     * Dashboard data endpoint that provides comprehensive analytics
     * for visualizing in the admin dashboard
     * 
     * @param range - The time range to analyze (month, quarter, year)
     * @param authHeader - JWT token for authorization verification
     * @return Structured analytics data for the dashboard
     */
    @GetMapping("/dashboard")
    public ResponseEntity<RequestResponse> getDashboardData(
            // Default to "year" if no range is specified
            @RequestParam(defaultValue = "year") String range,
            // Require Authorization header with JWT token
            @RequestHeader("Authorization") String authHeader) {
        
        // Verify the Authorization header starts with "Bearer " (JWT standard)
        if (!authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(new RequestResponse(
                "Unauthorized access",
                null,
                401,
                false
            ));
        }
        
        // Extract the token from the Authorization header by removing "Bearer " prefix
        String token = authHeader.substring(7);
        // Verify that the user has admin privileges using the auth service
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
            LocalDate endDate = LocalDate.now(); // End date is always today
            
            // Set the start date based on the requested range
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
            
            // Fetch all bookings from repository
            List<Booking> allBookings = bookingRepository.findAll();
            // Filter to only include confirmed or completed bookings for revenue calculations
            List<Booking> confirmedBookings = allBookings.stream()
                .filter(booking -> "CONFIRMED".equals(booking.getBookingStatus()) || 
                                 "COMPLETED".equals(booking.getBookingStatus()))
                .collect(Collectors.toList());
            
            // Calculate total bookings and revenue
            int totalBookings = confirmedBookings.size();
            double totalProfit = confirmedBookings.stream()
                .mapToDouble(Booking::getPackagePrice) // Extract price from each booking
                .sum();                                 // Sum all prices
            
            // Group bookings by month for monthly statistics
            Map<YearMonth, List<Booking>> bookingsByMonth = confirmedBookings.stream()
                .collect(Collectors.groupingBy(booking -> 
                    YearMonth.from(booking.getBookingDate())));
            
            // Calculate monthly average bookings (avoid division by zero with isEmpty check)
            double monthlyAvgBookings = bookingsByMonth.isEmpty() ? 0 : 
                (double) totalBookings / bookingsByMonth.size();
            
            // Calculate monthly average profit (avoid division by zero with isEmpty check)
            double monthlyAvgProfit = bookingsByMonth.isEmpty() ? 0 : 
                totalProfit / bookingsByMonth.size();
            
            // Get current month statistics
            YearMonth currentMonth = YearMonth.now();
            // Get bookings for current month (or empty list if none)
            List<Booking> currentMonthBookings = bookingsByMonth.getOrDefault(currentMonth, Collections.emptyList());
            
            // Count of bookings in current month
            int currentMonthBookingsCount = currentMonthBookings.size();
            // Sum of profit in current month
            double currentMonthProfit = currentMonthBookings.stream()
                .mapToDouble(Booking::getPackagePrice)
                .sum();
            
            // Prepare data structures for monthly chart visualizations
            List<Map<String, Object>> monthlyBookingsData = new ArrayList<>();
            List<Map<String, Object>> monthlyProfitData = new ArrayList<>();
            
            // Format month as "MMM yyyy" (e.g., "Jan 2023")
            DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MMM yyyy");
            
            // Generate a sequence of all months in the selected range
            List<YearMonth> months = new ArrayList<>();
            YearMonth month = YearMonth.from(startDate);
            while (!month.isAfter(YearMonth.from(endDate))) {
                months.add(month);
                month = month.plusMonths(1);
            }
            
            // Fill in data for each month in the range
            for (YearMonth m : months) {
                // Format month as user-friendly string (e.g., "Jan 2023")
                String monthLabel = m.format(monthFormatter);
                // Get bookings for this month (or empty list if none)
                List<Booking> monthBookings = bookingsByMonth.getOrDefault(m, Collections.emptyList());
                
                // Create data point for bookings count chart
                Map<String, Object> bookingData = new HashMap<>();
                bookingData.put("month", monthLabel);
                bookingData.put("value", monthBookings.size());
                monthlyBookingsData.add(bookingData);
                
                // Create data point for profit chart
                Map<String, Object> profitData = new HashMap<>();
                profitData.put("month", monthLabel);
                profitData.put("value", monthBookings.stream()
                    .mapToDouble(Booking::getPackagePrice)
                    .sum());
                monthlyProfitData.add(profitData);
            }
            
            // Calculate category distribution (count bookings per category)
            Map<String, Integer> categoryDistribution = confirmedBookings.stream()
                .collect(Collectors.groupingBy(
                    Booking::getCategoryName,      // Group by category name
                    Collectors.summingInt(booking -> 1)  // Count each booking as 1
                ));
            
            // Calculate package popularity (count bookings per package)
            Map<String, Integer> packagePopularity = confirmedBookings.stream()
                .collect(Collectors.groupingBy(
                    Booking::getPackageName,      // Group by package name
                    Collectors.summingInt(booking -> 1)  // Count each booking as 1
                ));
            
            // Build complete response data structure with all analytics data
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
            
            // Return success response with all the analytics data
            return ResponseEntity.ok(new RequestResponse(
                "Analytics data retrieved successfully",
                responseData,
                200,
                true
            ));
            
        } catch (Exception e) {
            // Return error response if anything fails
            return ResponseEntity.status(500).body(new RequestResponse(
                "Error retrieving analytics data: " + e.getMessage(),
                null,
                500,
                false
            ));
        }
    }
}