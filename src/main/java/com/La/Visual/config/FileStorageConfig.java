package com.La.Visual.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class FileStorageConfig {

    @Value("${file.upload-dir:./uploads/payment-proofs}")
    private String uploadDir;

    @Bean
    public Path createUploadDirectories() throws IOException {
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);
        return uploadPath; // Return the path instead of void
    }
}