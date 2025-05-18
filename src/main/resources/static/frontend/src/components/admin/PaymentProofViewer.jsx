/**
 * Payment Proof Viewer Component
 * 
 * This component displays payment proof images uploaded by customers during the booking process.
 * It's primarily used in the admin dashboard to view payment receipts and screenshots submitted
 * as evidence of payment.
 * 
 * Key features:
 * - Handles different URL formats and transforms them to proper image URLs
 * - Shows a loading spinner while the image is being fetched
 * - Provides error handling with fallback image for missing or inaccessible files
 * - Allows opening the full-size image in a new tab
 * - Displays appropriate feedback messages based on loading/error states
 * 
 * The component automatically processes the provided URL and handles all loading states,
 * making it simple to implement across different parts of the admin interface.
 */

import React, { useState, useEffect } from 'react'; // Import React and hooks for state and side effects

function PaymentProofViewer({ proofUrl, altText = "Payment Proof" }) {
    // State for tracking image loading process
    const [loading, setLoading] = useState(true); // Tracks if the image is still loading
    const [error, setError] = useState(false); // Tracks if there was an error loading the image
    const [fullUrl, setFullUrl] = useState(''); // Stores the processed URL for the image
    
    // Process the URL when the component mounts or when proofUrl changes
    useEffect(() => {
        if (proofUrl) {
            console.log("Original payment proof URL:", proofUrl); // Log for debugging
            
            // Handle different URL formats
            let formattedUrl;
            
            if (proofUrl.startsWith('http')) {
                // Already a full URL - use as is
                formattedUrl = proofUrl;
            } else if (proofUrl.startsWith('/api/')) {
                // Relative URL starting with /api/ - prepend server base URL
                formattedUrl = `http://localhost:8080${proofUrl}`;
            } else {
                // Just a filename - construct full API endpoint URL
                formattedUrl = `http://localhost:8080/api/files/view/${proofUrl}`;
            }
            
            console.log("Formatted payment proof URL:", formattedUrl); // Log processed URL
            setFullUrl(formattedUrl); // Update state with formatted URL
        } else {
            console.warn("No payment proof URL provided"); // Warning if no URL was provided
        }
    }, [proofUrl]); // Only re-run when proofUrl changes
    
    // Called when the image successfully loads
    const handleImageLoad = () => {
        console.log("Image loaded successfully");
        setLoading(false); // Hide loading indicator
        setError(false); // Clear any error state
    };
    
    // Called when there's an error loading the image
    const handleImageError = (e) => {
        console.log("Failed to load image:", proofUrl);
        console.log("Full URL that failed:", fullUrl);
        setLoading(false); // Hide loading indicator
        setError(true); // Set error state to true
        e.target.onerror = null; // Prevent infinite loop of error events
        e.target.src = '/images/payment-placeholder.png'; // Use fallback image
    };
    
    // Function to open the image in a new tab at full size
    const openFullSize = () => {
        if (fullUrl && !error) {
            window.open(fullUrl, '_blank'); // Open the image in a new tab
        }
    };
    
    return (
        <div className="bg-gray-700 p-2 rounded-lg"> {/* Container with dark background */}
            {/* Loading spinner shown while image is loading */}
            {loading && (
                <div className="flex justify-center items-center py-10">
                    <div className="animate-pulse text-center">
                        <div className="w-16 h-16 border-4 border-t-purple-500 border-gray-600 rounded-full animate-spin mx-auto"></div>
                        <p className="text-gray-400 mt-3">Loading image...</p>
                    </div>
                </div>
            )}
            
            {/* The actual image element */}
            <img 
                src={fullUrl} // Use the processed URL
                alt={altText} // Use provided alt text or default
                className={`w-full max-h-60 object-contain rounded ${!error ? "cursor-pointer" : ""}`} // Make clickable if no error
                style={{ display: loading ? 'none' : 'block' }} // Hide while loading
                onClick={openFullSize} // Open full size on click
                onLoad={handleImageLoad} // Handle successful load
                onError={handleImageError} // Handle loading failure
            />
            
            {/* Instruction message shown when image is loaded successfully */}
            {!error && !loading && (
                <p className="text-xs text-gray-400 text-center mt-2">Click to view full image</p>
            )}
            
            {/* Error message shown when image fails to load */}
            {error && (
                <p className="text-xs text-red-400 text-center mt-2">
                    Could not load image. The file may be missing or inaccessible.
                </p>
            )}
        </div>
    );
}

export default PaymentProofViewer; // Export the component for use in other parts of the application