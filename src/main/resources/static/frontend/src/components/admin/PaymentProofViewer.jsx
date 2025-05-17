import React, { useState, useEffect } from 'react';

function PaymentProofViewer({ proofUrl, altText = "Payment Proof" }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [fullUrl, setFullUrl] = useState('');
    
    useEffect(() => {
        if (proofUrl) {
            console.log("Original payment proof URL:", proofUrl);
            
            // Handle different URL formats
            let formattedUrl;
            
            if (proofUrl.startsWith('http')) {
                // Already a full URL
                formattedUrl = proofUrl;
            } else if (proofUrl.startsWith('/api/')) {
                // Relative URL starting with /api/
                formattedUrl = `http://localhost:8080${proofUrl}`;
            } else {
                // Just a filename
                formattedUrl = `http://localhost:8080/api/files/view/${proofUrl}`;
            }
            
            console.log("Formatted payment proof URL:", formattedUrl);
            setFullUrl(formattedUrl);
        } else {
            console.warn("No payment proof URL provided");
        }
    }, [proofUrl]);
    
    const handleImageLoad = () => {
        console.log("Image loaded successfully");
        setLoading(false);
        setError(false);
    };
    
    const handleImageError = (e) => {
        console.log("Failed to load image:", proofUrl);
        console.log("Full URL that failed:", fullUrl);
        setLoading(false);
        setError(true);
        e.target.onerror = null; // Prevent infinite loop
        e.target.src = '/images/payment-placeholder.png';
    };
    
    const openFullSize = () => {
        if (fullUrl && !error) {
            window.open(fullUrl, '_blank');
        }
    };
    
    return (
        <div className="bg-gray-700 p-2 rounded-lg">
            {loading && (
                <div className="flex justify-center items-center py-10">
                    <div className="animate-pulse text-center">
                        <div className="w-16 h-16 border-4 border-t-purple-500 border-gray-600 rounded-full animate-spin mx-auto"></div>
                        <p className="text-gray-400 mt-3">Loading image...</p>
                    </div>
                </div>
            )}
            
            <img 
                src={fullUrl}
                alt={altText}
                className={`w-full max-h-60 object-contain rounded ${!error ? "cursor-pointer" : ""}`}
                style={{ display: loading ? 'none' : 'block' }}
                onClick={openFullSize}
                onLoad={handleImageLoad}
                onError={handleImageError}
            />
            
            {!error && !loading && (
                <p className="text-xs text-gray-400 text-center mt-2">Click to view full image</p>
            )}
            
            {error && (
                <p className="text-xs text-red-400 text-center mt-2">
                    Could not load image. The file may be missing or inaccessible.
                </p>
            )}
        </div>
    );
}

export default PaymentProofViewer;