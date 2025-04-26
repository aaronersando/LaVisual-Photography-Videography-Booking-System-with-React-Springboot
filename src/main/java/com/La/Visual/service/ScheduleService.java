package com.La.Visual.service;

import com.La.Visual.dto.UnavailableTimeRange;
import com.La.Visual.repository.UnavailableTimeRangeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScheduleService {
    
    private final UnavailableTimeRangeRepository unavailableRepository;
    
    @Autowired
    public ScheduleService(UnavailableTimeRangeRepository unavailableRepository) {
        this.unavailableRepository = unavailableRepository;
    }
    
    @Transactional
    public void saveUnavailableTimeRanges(String date, List<UnavailableTimeRange> unavailableRanges) {
        // First, delete ALL existing unavailable time ranges for this date
        unavailableRepository.deleteByDate(date);
        
        // Then save the new unavailable time ranges
        for (UnavailableTimeRange rangeDto : unavailableRanges) {
            com.La.Visual.entity.UnavailableTimeRange range = new com.La.Visual.entity.UnavailableTimeRange();
            range.setDate(date);
            range.setStartTime(rangeDto.getStartTime());
            range.setEndTime(rangeDto.getEndTime());
            range.setStatus("unavailable");
            
            unavailableRepository.save(range);
        }
    }
    
    public List<com.La.Visual.entity.UnavailableTimeRange> getUnavailableTimeRanges(String date) {
        return unavailableRepository.findByDate(date);
    }
    
    public List<UnavailableTimeRange> getUnavailableTimeRangesDto(String date) {
        List<com.La.Visual.entity.UnavailableTimeRange> ranges = unavailableRepository.findByDate(date);
        
        return ranges.stream()
            .map(model -> {
                UnavailableTimeRange dto = new UnavailableTimeRange();
                dto.setDate(model.getDate());
                dto.setStartTime(model.getStartTime());
                dto.setEndTime(model.getEndTime());
                dto.setStatus(model.getStatus());
                return dto;
            })
            .collect(Collectors.toList());
    }
}