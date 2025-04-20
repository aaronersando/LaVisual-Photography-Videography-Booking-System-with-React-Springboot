package com.La.Visual.dto;


import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.La.Visual.entity.OurUsers;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class RequestResponse {

    private int statusCode;
    private String message;
    private String error;
    private String token;
    private String refreshToken;
    private String expirationTime;
    private String name;
    private String email;
    private String city;
    private String role;
    private String password;
    private OurUsers ourUsers; // Include the OurUsers object
    private List<OurUsers> ourUsersList; // For lists of users
}
