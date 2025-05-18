/**
 * CORS Configuration File
 * 
 * This file configures Cross-Origin Resource Sharing (CORS) for the application.
 * CORS is a security feature implemented by web browsers that restricts web pages
 * from making requests to domains different from the one that served the original page.
 * 
 * This configuration allows our Spring Boot backend to accept API requests from
 * our specified frontend application that runs on a different origin (domain/port).
 * Without this configuration, browser requests from the frontend would be blocked
 * by the browser's same-origin security policy.
 */
package com.La.Visual.config;

// Import necessary Spring components for configuration
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// Marks this class as a configuration class that will be processed by Spring
// during application startup to register beans and configure the application
@Configuration
public class CorsConfig {

    // @Bean annotation indicates that this method produces a bean
    // that should be managed by the Spring container
    @Bean
    public WebMvcConfigurer webMvcConfigurer(){
        // Return an anonymous implementation of WebMvcConfigurer interface
        // This is a common pattern in Spring for simple configuration implementations
        return new WebMvcConfigurer() {
            // Override the method that configures CORS mappings
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")  // Apply these CORS settings to all paths in the application
                .allowedOrigins("http://localhost:5173") // Your frontend URL
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // Specify which HTTP methods are allowed
                .allowedHeaders("*")  // Allow all headers in requests ("*" is a wildcard)
                .allowCredentials(true);  // Allow cookies and authentication headers to be included
                                          // This is essential for maintaining sessions or authentication
            }
        };
    }
}