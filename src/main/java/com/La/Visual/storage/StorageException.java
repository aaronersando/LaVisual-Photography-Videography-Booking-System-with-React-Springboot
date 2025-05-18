/**
 * Storage Exception
 * 
 * This class defines a custom exception specifically for file storage operations
 * in the application. It extends RuntimeException, making it an unchecked exception
 * that doesn't require explicit try-catch blocks in calling code.
 * 
 * Key characteristics:
 * - Used throughout the storage service to signal various file handling errors
 * - Provides meaningful error messages for debugging and logging
 * - Can wrap original exceptions to preserve the full error context
 * - Allows centralized handling of all storage-related errors
 * 
 * Common scenarios where this exception is thrown:
 * - File upload failures
 * - Storage initialization errors
 * - Permission problems when accessing the filesystem
 * - Security violations (like path traversal attempts)
 * - Missing or corrupted files
 * 
 * By using a custom exception rather than generic exceptions, the application
 * can provide more specific error handling and better error messages to users.
 */
package com.La.Visual.storage;

// Extends RuntimeException rather than Exception, making it unchecked
// This means methods don't need to declare that they throw this exception
public class StorageException extends RuntimeException {

    /**
     * Constructor for creating an exception with just an error message
     * Used when no underlying cause exception exists
     * 
     * @param message A descriptive message explaining what went wrong
     */
    public StorageException(String message) {
        super(message);  // Calls the constructor of RuntimeException with the message
    }

    /**
     * Constructor for creating an exception with both a message and a cause
     * Used to wrap another exception that was the root cause of this error
     * This preserves the full stack trace and error context
     * 
     * @param message A descriptive message explaining what went wrong
     * @param cause The original exception that caused this storage exception
     */
    public StorageException(String message, Throwable cause) {
        super(message, cause);  // Calls the constructor of RuntimeException with message and cause
    }
}