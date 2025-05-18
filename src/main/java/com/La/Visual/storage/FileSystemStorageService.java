/**
 * File System Storage Service
 * 
 * This service class provides file storage and retrieval functionality for the application.
 * It implements the StorageService interface to provide concrete implementations of
 * file operations using the local file system.
 * 
 * Key responsibilities:
 * - Storing uploaded files to the configured directory
 * - Loading files from storage for download/viewing
 * - Managing file paths and resources
 * - Providing security checks to prevent directory traversal attacks
 * - Initializing and managing the storage location
 * 
 * This service is used by controllers (like FileController) to handle file uploads
 * from users, especially for photos and payment proofs in the booking system.
 * It allows storing files with either their original filename or a custom filename.
 * 
 * The service uses Java NIO API for efficient file operations and Spring's Resource
 * abstraction for representing file resources.
 */
package com.La.Visual.storage;


// Import Java IO and file handling classes
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.stream.Stream;

// Import Spring Framework annotations and utilities
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

// Mark this class as a Spring service component
@Service
public class FileSystemStorageService implements StorageService {

    // The root directory where files will be stored
    private final Path rootLocation;

    /**
     * Constructor that initializes the storage location
     * The @Autowired annotation tells Spring to inject the StorageProperties bean
     * 
     * @param properties Contains the configured storage location
     */
    @Autowired
    public FileSystemStorageService(StorageProperties properties) {
        // Convert the configured location string to a Path object
        this.rootLocation = Paths.get(properties.getLocation());
        // Log the absolute path for debugging purposes
        System.out.println("Storage location initialized: " + this.rootLocation.toAbsolutePath());
        try {
            // Create the directory if it doesn't exist
            Files.createDirectories(this.rootLocation);
        } catch (Exception e) {
            // Log error but don't throw exception - allows application to start even if directory creation fails
            System.err.println("Could not create upload directory: " + e.getMessage());
        }
    }

    

    /**
     * Stores a file with a specific filename
     * This overloaded method allows specifying a custom filename rather than using the original
     * 
     * @param file The uploaded file from client
     * @param filename The name to save the file as
     * @throws StorageException if file is empty or cannot be stored
     */
    @Override
    public void store(MultipartFile file, String filename) {
        try {
            // Check if the file is empty (no content)
            if (file.isEmpty()) {
                throw new StorageException("Failed to store empty file.");
            }
            
            // Create the destination path by resolving the filename against the root location
            Path destinationFile = this.rootLocation.resolve(
                    Paths.get(filename))  // Convert filename to Path
                    .normalize().toAbsolutePath();  // Normalize and get absolute path
            
            // Security check to prevent directory traversal attacks
            // Ensures the file will be stored within the root location
            if (!destinationFile.getParent().equals(this.rootLocation.toAbsolutePath())) {
                // This is a security check
                throw new StorageException(
                        "Cannot store file outside current directory.");
            }
            
            // Copy the file to the destination path
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile,
                    StandardCopyOption.REPLACE_EXISTING);  // Replace if file already exists
            }
        }
        catch (IOException e) {
            // Wrap IOException in a custom StorageException
            throw new StorageException("Failed to store file.", e);
        }
    }


    /**
     * Stores a file using its original filename
     * Similar to the other store method but uses the original file name
     * 
     * @param file The uploaded file from client
     * @throws StorageException if file is empty or cannot be stored
     */
    @Override
    public void store(MultipartFile file) {
        try {
            // Check if the file is empty
            if (file.isEmpty()) {
                throw new StorageException("Failed to store empty file.");
            }
            
            // Create destination path using the original filename
            Path destinationFile = this.rootLocation.resolve(
                    Paths.get(file.getOriginalFilename()))
                    .normalize().toAbsolutePath();
            
            // Security check to prevent directory traversal attacks
            if (!destinationFile.getParent().equals(this.rootLocation.toAbsolutePath())) {
                // This is a security check
                throw new StorageException(
                        "Cannot store file outside current directory.");
            }
            
            // Copy the file to the destination
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile,
                    StandardCopyOption.REPLACE_EXISTING);
            }
        }
        catch (IOException e) {
            throw new StorageException("Failed to store file.", e);
        }
    }

    /**
     * Lists all files in the storage location
     * 
     * @return A Stream of Path objects representing all stored files
     * @throws StorageException if files cannot be read
     */
    @Override
    public Stream<Path> loadAll() {
        try {
            // Walk the directory tree to depth 1 (just the files in the root directory)
            return Files.walk(this.rootLocation, 1)
                .filter(path -> !path.equals(this.rootLocation))  // Exclude the root directory itself
                .map(this.rootLocation::relativize);  // Convert absolute paths to relative paths
        }
        catch (IOException e) {
            throw new StorageException("Failed to read stored files", e);
        }

    }

    /**
     * Gets the path to a specific file
     * 
     * @param filename The name of the file to load
     * @return Path object representing the file location
     */
    @Override
    public Path load(String filename) {
        return rootLocation.resolve(filename);  // Resolves the filename against the root location
    }

    /**
     * Loads a file as a Resource that can be returned in HTTP responses
     * 
     * @param filename The name of the file to load
     * @return Resource object representing the file
     * @throws RuntimeException if the file doesn't exist or can't be read
     */
    @Override
    public Resource loadAsResource(String filename) {
        try {
            // Get the path to the file
            Path file = load(filename);
            // Create a resource from the file URI
            Resource resource = new UrlResource(file.toUri());
            
            // Debug logging
            System.out.println("Loading file: " + filename);
            System.out.println("Full path: " + file.toAbsolutePath());
            System.out.println("Resource exists: " + resource.exists());
            
            // Check if the resource exists and is readable
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Could not read file: " + filename);
            }
        } catch (Exception e) {
            throw new RuntimeException("Could not read file: " + filename, e);
        }
    }

    /**
     * Deletes all files in the storage location
     * Completely removes the directory and its contents
     */
    @Override
    public void deleteAll() {
        FileSystemUtils.deleteRecursively(rootLocation.toFile());  // Spring utility to recursively delete a directory
    }

    /**
     * Initializes the storage by creating the root directory
     * 
     * @throws StorageException if the directory cannot be created
     */
    @Override
    public void init() {
        try {
            Files.createDirectories(rootLocation);  // Create the root directory if it doesn't exist
        }
        catch (IOException e) {
            throw new StorageException("Could not initialize storage", e);
        }
    }
}