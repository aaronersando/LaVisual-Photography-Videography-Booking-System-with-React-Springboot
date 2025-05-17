package com.La.Visual.storage;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("file")
public class StorageProperties {
    private String uploadDir = "upload-dir";
    
    public String getLocation() {
        return uploadDir;
    }
    
    public void setLocation(String location) {
        this.uploadDir = location;
    }
}
