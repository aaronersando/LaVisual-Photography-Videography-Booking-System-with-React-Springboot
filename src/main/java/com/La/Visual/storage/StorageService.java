/**
 * Storage Service Interface
 * 
 * This interface defines the contract for file storage operations in the application.
 * It specifies the methods that any storage implementation must provide, allowing
 * for different storage strategies (local filesystem, cloud storage, etc.) to be used
 * interchangeably.
 * 
 * Key responsibilities:
 * - Defining standard operations for file storage and retrieval
 * - Abstracting the details of how files are stored from the rest of the application
 * - Providing a consistent API for file operations across the system
 * 
 * This interface is implemented by FileSystemStorageService which provides the actual
 * functionality using the local file system. By using this interface, the application
 * could be extended to support other storage options (like AWS S3, Google Cloud Storage)
 * without changing the code that uses the storage service.
 */
package com.La.Visual.storage;

// Import Spring's Resource abstraction for representing file resources
import org.springframework.core.io.Resource;
// Import Spring's representation of an uploaded file
import org.springframework.web.multipart.MultipartFile;

// Import Java's file path handling and stream API
import java.nio.file.Path;
import java.util.stream.Stream;

// Interface defining the contract for all storage implementations
public interface StorageService {

    /**
     * Initializes the storage system
     * For example, creating necessary directories
     */
    void init();

    /**
     * Stores a file using its original filename
     * 
     * @param file The file to store
     */
    void store(MultipartFile file);
    
    /**
     * Stores a file with a custom filename
     * Useful when you want to rename files or prevent filename collisions
     * 
     * @param file The file to store
     * @param filename The name to use when storing the file
     */
    void store(MultipartFile file, String filename);

    /**
     * Lists all files in the storage
     * 
     * @return A stream of paths to all stored files
     */
    Stream<Path> loadAll();

    /**
     * Gets the path to a specific file
     * 
     * @param filename The name of the file to locate
     * @return The path to the requested file
     */
    Path load(String filename);

    /**
     * Loads a file as a Resource that can be returned in HTTP responses
     * 
     * @param filename The name of the file to load
     * @return A Resource representing the file
     */
    Resource loadAsResource(String filename);

    /**
     * Deletes all files in storage
     * Typically used for cleanup or resetting the storage system
     */
    void deleteAll();
}