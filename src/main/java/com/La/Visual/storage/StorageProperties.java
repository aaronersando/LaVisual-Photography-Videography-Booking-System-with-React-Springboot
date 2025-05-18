/**
 * Storage Properties
 * 
 * This configuration class defines the properties related to file storage in the application.
 * It uses Spring Boot's @ConfigurationProperties mechanism to bind external configuration 
 * values from application.properties or application.yml to this Java object.
 * 
 * Key responsibilities:
 * - Defining the default upload directory path
 * - Allowing the upload directory to be configured through application properties
 * - Providing getters and setters to access the configured path
 * 
 * The configured upload directory path is used by FileSystemStorageService to determine
 * where uploaded files (such as user images and payment proofs) should be stored on disk.
 * 
 * In application.properties, this is configured with the property:
 * file.upload-dir=E:/SpringBoot_Prac/LaVisual/Visual/upload-dir
 */
package com.La.Visual.storage;

import org.springframework.boot.context.properties.ConfigurationProperties;

// Binds all properties with the prefix "file." from application.properties to fields in this class
@ConfigurationProperties("file")
public class StorageProperties {
    // Default upload directory if none specified in configuration
    // This provides a fallback location for storing files
    private String uploadDir = "upload-dir";
    
    /**
     * Gets the configured upload directory location
     * Note: The method is named getLocation() rather than getUploadDir() for clarity
     * in the calling code, though it returns the uploadDir property
     * 
     * @return The path where files should be stored
     */
    public String getLocation() {
        return uploadDir;
    }
    
    /**
     * Sets the upload directory location
     * This is automatically called by Spring Boot with the value from
     * the application.properties file.upload-dir property
     * 
     * @param location The directory path where files should be stored
     */
    public void setLocation(String location) {
        this.uploadDir = location;
    }
}