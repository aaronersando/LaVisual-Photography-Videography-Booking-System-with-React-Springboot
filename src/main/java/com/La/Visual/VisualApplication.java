/**
 * Visual Application - Main Spring Boot Application Class
 * 
 * This is the entry point of the Spring Boot application that serves as the main configuration
 * and bootstrap class. It starts the entire application and configures essential components.
 * 
 * Key responsibilities:
 * - Application startup and initialization
 * - Bootstrapping the Spring context
 * - Enabling configuration properties
 * - Setting up the file storage system at application startup
 * 
 * The class combines several Spring Boot annotations to enable auto-configuration
 * and component scanning. It also includes a CommandLineRunner bean that initializes
 * the file storage system when the application starts, ensuring a clean storage state.
 * 
 * This approach provides a consistent storage environment on each application restart,
 * which is useful during development and testing to prevent file accumulation.
 */
package com.La.Visual;

// Import Spring Boot's application startup and configuration classes
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;

// Import the storage-related classes
import com.La.Visual.storage.StorageProperties;
import com.La.Visual.storage.StorageService;

// Main Spring Boot annotation that combines @Configuration, @EnableAutoConfiguration, and @ComponentScan
@SpringBootApplication
// Enable the StorageProperties configuration class to bind properties from application.properties
@EnableConfigurationProperties(StorageProperties.class)
public class VisualApplication {

    /**
     * Main method - application entry point
     * Delegates to Spring Boot to start the application
     * 
     * @param args Command line arguments passed to the application
     */
    public static void main(String[] args) {
        SpringApplication.run(VisualApplication.class, args);
    }

    /**
     * Defines a CommandLineRunner bean that executes on application startup
     * This runner initializes the file storage system by first clearing any existing files
     * and then creating the necessary directory structure
     * 
     * @param storageService The storage service that's automatically injected by Spring
     * @return A CommandLineRunner that initializes the storage system
     */
    @Bean
    CommandLineRunner init(StorageService storageService) {
        return (args) -> {
            storageService.deleteAll();  // Remove any existing files in the storage location
            storageService.init();       // Create the necessary directory structure
        };
    }
}