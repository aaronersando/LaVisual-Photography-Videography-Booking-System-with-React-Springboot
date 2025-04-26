package com.La.Visual.repository;

import com.La.Visual.entity.UnavailableTimeRange;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class UnavailableTimeRangeRepository {
    
    private final JdbcTemplate jdbcTemplate;
    
    private final RowMapper<UnavailableTimeRange> unavailableTimeRangeRowMapper = (rs, rowNum) -> 
        new UnavailableTimeRange(
            rs.getInt("id"),
            rs.getString("date"),
            rs.getString("start_time"),
            rs.getString("end_time"),
            rs.getString("status")
        );
    
    @Autowired
    public UnavailableTimeRangeRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    
    public List<UnavailableTimeRange> findByDate(String date) {
        return jdbcTemplate.query(
            "SELECT * FROM unavailable_time_ranges WHERE date = ?",
            unavailableTimeRangeRowMapper,
            date
        );
    }
    
    public void deleteByDate(String date) {
        jdbcTemplate.update(
            "DELETE FROM unavailable_time_ranges WHERE date = ?",
            date
        );
    }
    
    public UnavailableTimeRange save(UnavailableTimeRange range) {
        if (range.getId() == null) {
            return insert(range);
        } else {
            return update(range);
        }
    }
    
    private UnavailableTimeRange insert(UnavailableTimeRange range) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                "INSERT INTO unavailable_time_ranges (date, start_time, end_time, status) VALUES (?, ?, ?, ?)",
                Statement.RETURN_GENERATED_KEYS
            );
            ps.setString(1, range.getDate());
            ps.setString(2, range.getStartTime());
            ps.setString(3, range.getEndTime());
            ps.setString(4, range.getStatus());
            return ps;
        }, keyHolder);
        
        range.setId(keyHolder.getKey().intValue());
        return range;
    }
    
    private UnavailableTimeRange update(UnavailableTimeRange range) {
        jdbcTemplate.update(
            "UPDATE unavailable_time_ranges SET date = ?, start_time = ?, end_time = ?, status = ? WHERE id = ?",
            range.getDate(),
            range.getStartTime(),
            range.getEndTime(),
            range.getStatus(),
            range.getId()
        );
        
        return range;
    }
}