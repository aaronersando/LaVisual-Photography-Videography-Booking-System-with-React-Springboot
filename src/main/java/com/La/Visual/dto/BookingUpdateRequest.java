package com.La.Visual.dto;

public record BookingUpdateRequest(
    Long bookingId,
    String packageName,
    String category,
    String guestName,
    String phoneNumber,
    String location,
    String specialRequest
) {}