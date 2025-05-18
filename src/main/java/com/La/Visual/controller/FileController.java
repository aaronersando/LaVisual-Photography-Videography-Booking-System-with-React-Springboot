/**
 * File Controller
 * 
 * This controller manages all file-related operations in the application through a RESTful API.
 * It provides endpoints for:
 * - Uploading files (images and other documents)
 * - Downloading files
 * - Viewing files directly in the browser (optimized for images)
 * 
 * The controller handles file storage, content type detection, unique filename generation,
 * and provides appropriate HTTP responses for successful operations or errors.
 * 
 * It works with the StorageService to perform actual file operations, keeping the controller
 * focused on HTTP request/response handling while delegating storage logic to a dedicated service.
 */
package com.La.Visual.controller;

// Import Spring Framework components for web, HTTP, and file handling
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

// Import application-specific components
import com.La.Visual.storage.StorageService;
import com.La.Visual.storage.StorageFileNotFoundException;
import com.La.Visual.dto.RequestResponse;

// Import Java I/O and utility classes
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

// Mark this class as a REST controller that handles HTTP requests
@RestController
// Set the base URL path for all endpoints in this controller
@RequestMapping("/api/files")
// Allow cross-origin requests from specified frontend development servers
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class FileController {

    // File storage service to handle file operations
    private final StorageService storageService;
    
    // Inject upload directory from application properties (with 'upload-dir' as default)
    @Value("${file.upload-dir:upload-dir}")
    private String uploadDir;

    // Constructor with dependency injection for StorageService
    @Autowired
    public FileController(StorageService storageService) {
        this.storageService = storageService;
    }

    /**
     * Download a file
     * GET /api/files/download/{fileName}
     * 
     * Retrieves a file from storage and sends it as a downloadable resource
     */
    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        // Load the file from storage
        Resource file = storageService.loadAsResource(fileName);
        
        // Return 404 if file not found
        if (file == null) {
            return ResponseEntity.notFound().build();
        }
        
        // Default content type if detection fails
        String contentType = "application/octet-stream";
        try {
            // Try to get content type from file URL connection
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
        
        // Return the file with appropriate content type and header
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }
    
    /**
     * View a file in browser
     * GET /api/files/view/{fileName}
     * 
     * Optimized for displaying images directly in the browser
     */
    @GetMapping("/view/{fileName:.+}")
    public ResponseEntity<Resource> viewFile(@PathVariable String fileName) {
        try {
            System.out.println("Attempting to serve file: " + fileName);
            Resource file = storageService.loadAsResource(fileName);
            
            // Return 404 if file not found
            if (!file.exists()) {
                System.out.println("File not found: " + fileName);
                return ResponseEntity.notFound().build();
            }
            
            // Determine content type using helper method
            String contentType = determineContentType(file);
            System.out.println("Serving file: " + fileName + " with content type: " + contentType);
            
            // Return the file configured for inline display (not download)
            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFilename() + "\"")
                .body(file);
        } catch (Exception e) {
            // Log error and return 500 status
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Helper method to determine file content type
     * Returns appropriate MIME type based on file extension or content analysis
     */
    private String determineContentType(Resource file) {
        try {
            // Check common image types by file extension
            String filename = file.getFilename().toLowerCase();
            if (filename.endsWith(".png")) return "image/png";
            if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) return "image/jpeg";
            if (filename.endsWith(".gif")) return "image/gif";
            if (filename.endsWith(".pdf")) return "application/pdf";
            
            // Try to probe content type from file system if extension check fails
            Path path = Paths.get(file.getURI());
            return Files.probeContentType(path) != null 
                ? Files.probeContentType(path) 
                : "application/octet-stream";
        } catch (IOException e) {
            // Default to binary stream if detection fails
            return "application/octet-stream";
        }
    }

    /**
     * Upload a file
     * POST /api/files/upload
     * 
     * Accepts multipart file upload, generates unique name, and stores the file
     */
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
            
            // Generate a unique filename using UUID to prevent collisions
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String newFilename = UUID.randomUUID().toString() + extension;
            
            // Store file with the generated unique name
            storageService.store(file, newFilename);
            
            // Build URL for accessing the uploaded file
            String fileUrl = "/api/files/view/" + newFilename;
            
            // Prepare response data with file information
            Map<String, Object> data = new HashMap<>();
            data.put("fileName", newFilename);
            data.put("originalName", originalFilename);
            data.put("url", fileUrl);
            
            System.out.println("File uploaded successfully: " + newFilename);
            
            // Return success response with file data
            return ResponseEntity.ok(new RequestResponse(
                "File uploaded successfully", 
                data, 
                200, 
                true
            ));
        } catch (Exception e) {
            // Log error and return failure response
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new RequestResponse(
                "Failed to upload file: " + e.getMessage(), 
                null, 
                500, 
                false
            ));
        }
    }

    /**
     * Exception handler for file not found errors
     * Maps StorageFileNotFoundException to a 404 response with error details
     */
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