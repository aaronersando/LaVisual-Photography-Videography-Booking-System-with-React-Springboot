package com.La.Visual.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.La.Visual.storage.StorageService;
import com.La.Visual.storage.StorageFileNotFoundException;
import com.La.Visual.dto.RequestResponse;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class FileController {

    private final StorageService storageService;
    
    @Value("${file.upload-dir:upload-dir}")
    private String uploadDir;

    @Autowired
    public FileController(StorageService storageService) {
        this.storageService = storageService;
    }

    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        Resource file = storageService.loadAsResource(fileName);
        
        if (file == null) {
            return ResponseEntity.notFound().build();
        }
        
        String contentType = "application/octet-stream";
        try {
            contentType = file.getFile().toURL().openConnection().getContentType();
            if (contentType == null) {
                // Fallback to common types based on extension
                String name = file.getFilename().toLowerCase();
                if (name.endsWith(".jpg") || name.endsWith(".jpeg")) {
                    contentType = "image/jpeg";
                } else if (name.endsWith(".png")) {
                    contentType = "image/png";
                } else if (name.endsWith(".gif")) {
                    contentType = "image/gif";
                }
            }
        } catch (IOException e) {
            System.out.println("Could not determine file type: " + e.getMessage());
        }
        
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }
    
    // Method to view/open file directly in browser, optimized for images
    @GetMapping("/view/{fileName:.+}")
    public ResponseEntity<Resource> viewFile(@PathVariable String fileName) {
        try {
            System.out.println("Attempting to serve file: " + fileName);
            Resource file = storageService.loadAsResource(fileName);
            
            if (!file.exists()) {
                System.out.println("File not found: " + fileName);
                return ResponseEntity.notFound().build();
            }
            
            String contentType = determineContentType(file);
            System.out.println("Serving file: " + fileName + " with content type: " + contentType);
            
            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFilename() + "\"")
                .body(file);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    private String determineContentType(Resource file) {
        try {
            String filename = file.getFilename().toLowerCase();
            if (filename.endsWith(".png")) return "image/png";
            if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) return "image/jpeg";
            if (filename.endsWith(".gif")) return "image/gif";
            if (filename.endsWith(".pdf")) return "application/pdf";
            
            // Try to determine content type from file
            Path path = Paths.get(file.getURI());
            return Files.probeContentType(path) != null 
                ? Files.probeContentType(path) 
                : "application/octet-stream";
        } catch (IOException e) {
            return "application/octet-stream";
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<RequestResponse> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            // Check if file is not empty
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(new RequestResponse(
                    "File is empty", 
                    null, 
                    400, 
                    false
                ));
            }
            
            // Generate a unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String newFilename = UUID.randomUUID().toString() + extension;
            
            // Store file with new name
            storageService.store(file, newFilename);
            
            // Build response
            String fileUrl = "/api/files/view/" + newFilename;
            
            Map<String, Object> data = new HashMap<>();
            data.put("fileName", newFilename);
            data.put("originalName", originalFilename);
            data.put("url", fileUrl);
            
            System.out.println("File uploaded successfully: " + newFilename);
            
            return ResponseEntity.ok(new RequestResponse(
                "File uploaded successfully", 
                data, 
                200, 
                true
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new RequestResponse(
                "Failed to upload file: " + e.getMessage(), 
                null, 
                500, 
                false
            ));
        }
    }

    @ExceptionHandler(StorageFileNotFoundException.class)
    public ResponseEntity<RequestResponse> handleStorageFileNotFound(StorageFileNotFoundException exc) {
        return ResponseEntity.status(404).body(new RequestResponse(
            "File not found: " + exc.getMessage(),
            null,
            404,
            false
        ));
    }
}