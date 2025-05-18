/**
 * Schedule Service
 * 
 * This service class handles schedule-related operations in the booking system, 
 * specifically focusing on managing time slots that are blocked off as unavailable
 * for booking (such as holidays, maintenance periods, or reserved times).
 * 
 * Key responsibilities:
 * - Managing unavailable time ranges for specific dates
 * - Saving new unavailable time ranges (replacing existing ones for a date)
 * - Retrieving unavailable time ranges for calendar display
 * - Converting between DTO and entity objects for unavailable time ranges
 * 
 * This service acts as an intermediary between the ScheduleController and 
 * UnavailableTimeRangeRepository, implementing business logic for schedule management
 * and providing data transformation between API and database layers.
 * 
 * It's used by the admin system to block off time slots that shouldn't be available
 * for booking by customers.
 */
package com.La.Visual.service;

// Import DTO (Data Transfer Object) for API communications
import com.La.Visual.dto.UnavailableTimeRange;
// Import repository for database operations
import com.La.Visual.repository.UnavailableTimeRangeRepository;
// Import Spring annotations for dependency injection and component scanning
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
// Import Spring annotation for transaction management
import org.springframework.transaction.annotation.Transactional;

// Import Java utility classes for collections and streams
import java.util.List;
import java.util.stream.Collectors;

// Mark this class as a service component in Spring's component scanning
@Service
public class ScheduleService {
    
    // Repository dependency for database operations, marked final for immutability
    private final UnavailableTimeRangeRepository unavailableRepository;
    
    /**
     * Constructor with dependency injection
     * The @Autowired annotation tells Spring to inject the repository bean
     * 
     * @param unavailableRepository Repository for unavailable time range data operations
     */
    @Autowired
    public ScheduleService(UnavailableTimeRangeRepository unavailableRepository) {
        this.unavailableRepository = unavailableRepository;
    }
    
    /**
     * Saves a list of unavailable time ranges for a specific date
     * Uses a "replace all" approach by first deleting existing ranges
     * 
     * @param date The date for which to save unavailable ranges (YYYY-MM-DD format)
     * @param unavailableRanges List of DTO objects with time range information
     */
    @Transactional // Ensures database consistency - all operations succeed or all fail
    public void saveUnavailableTimeRanges(String date, List<UnavailableTimeRange> unavailableRanges) {
        // First, delete ALL existing unavailable time ranges for this date
        unavailableRepository.deleteByDate(date);
        
        // Then save the new unavailable time ranges
        for (UnavailableTimeRange rangeDto : unavailableRanges) {
            // Create a new entity from the DTO data
            com.La.Visual.entity.UnavailableTimeRange range = new com.La.Visual.entity.UnavailableTimeRange();
            range.setDate(date);                             // Set date from parameter
            range.setStartTime(rangeDto.getStartTime());     // Copy start time from DTO
            range.setEndTime(rangeDto.getEndTime());         // Copy end time from DTO
            range.setStatus("unavailable");                  // Set status explicitly
            
            // Save the entity to the database
            unavailableRepository.save(range);
        }
    }
    
    /**
     * Retrieves all unavailable time ranges for a specific date as entity objects
     * 
     * @param date The date to retrieve ranges for (YYYY-MM-DD format)
     * @return List of entity objects representing unavailable time ranges
     */
    public List<com.La.Visual.entity.UnavailableTimeRange> getUnavailableTimeRanges(String date) {
        return unavailableRepository.findByDate(date);
    }
    
    /**
     * Retrieves all unavailable time ranges for a specific date as DTO objects
     * Converts entity objects to DTOs for use in API responses
     * 
     * @param date The date to retrieve ranges for (YYYY-MM-DD format)
     * @return List of DTO objects representing unavailable time ranges
     */
    public List<UnavailableTimeRange> getUnavailableTimeRangesDto(String date) {
        // Get entity objects from the database
        List<com.La.Visual.entity.UnavailableTimeRange> ranges = unavailableRepository.findByDate(date);
        
        // Convert entities to DTOs using Java Stream API
        return ranges.stream()
            .map(model -> {
                // For each entity, create and populate a new DTO
                UnavailableTimeRange dto = new UnavailableTimeRange();
                dto.setDate(model.getDate());                // Copy date
                dto.setStartTime(model.getStartTime());      // Copy start time
                dto.setEndTime(model.getEndTime());          // Copy end time
                dto.setStatus(model.getStatus());            // Copy status
                return dto;
            })
            .collect(Collectors.toList());                   // Collect all DTOs into a List
    }
}