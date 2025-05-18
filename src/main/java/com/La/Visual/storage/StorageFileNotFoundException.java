/**
 * Storage File Not Found Exception
 * 
 * This class defines a specialized exception that indicates a file couldn't be found
 * in the storage system. It extends the more general StorageException class to provide
 * more specific error indication for file not found scenarios.
 * 
 * Key characteristics:
 * - More specific than StorageException for "file not found" errors
 * - Allows for more precise exception handling in catch blocks
 * - Preserves the error message and original cause (if any)
 * - Inherits the unchecked nature of StorageException (extends RuntimeException)
 * 
 * This exception is typically thrown when:
 * - A user or system requests a file that doesn't exist
 * - The storage service tries to load a resource by name but can't find it
 * - A file was expected to be in storage but has been deleted or moved
 * 
 * By using this specialized exception, the application can provide more 
 * specific error handling for missing files (like showing a 404 error page)
 * versus other types of storage errors (like permission issues).
 */
package com.La.Visual.storage;

// Extends StorageException rather than creating a direct RuntimeException
// This maintains the exception hierarchy (StorageFileNotFoundException is a type of StorageException)
public class StorageFileNotFoundException extends StorageException {

    /**
     * Constructor that takes only an error message
     * Used when no underlying cause exception exists
     * 
     * @param message A descriptive message explaining which file wasn't found and why
     */
    public StorageFileNotFoundException(String message) {
        super(message);  // Passes the message to the parent StorageException constructor
    }

    /**
     * Constructor that takes both a message and a cause
     * Used when another exception led to this file not found condition
     * 
     * @param message A descriptive message explaining which file wasn't found
     * @param cause The original exception that indicated the file wasn't found
     */
    public StorageFileNotFoundException(String message, Throwable cause) {
        super(message, cause);  // Passes both message and cause to the parent constructor
    }
}