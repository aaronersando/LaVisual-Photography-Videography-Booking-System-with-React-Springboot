/**
 * Error Page Component
 * 
 * This component serves as the 404 error page for the LaVisual photography/videography website.
 * It's displayed whenever a user tries to access a URL that doesn't exist within the application.
 * 
 * Key features:
 * - Clean, minimalist error display with large 404 indicator
 * - Clear error message explaining the issue to the user
 * - Direct navigation button back to the homepage
 * - Consistent branding with the site's main navigation and footer
 * - Responsive design that works well on all device sizes
 * 
 * This component maintains the overall website layout and navigation structure
 * even when displaying the error, making it easy for users to recover from
 * mistyped URLs or broken links.
 */

// Import shared components for website structure
import FooterComp from "../../components/common/FooterComp"; // Import site footer
import Navbar from "../../components/common/Navbar"; // Import site navigation header
import React from 'react'; // Import React core library
import { Link } from 'react-router-dom'; // Import Link for client-side navigation


function Error(){

    return(
        
        <>
        {/* Include the standard site navigation bar */}
        <Navbar/>

        {/* Error Section - Main content area for the 404 display */}
        <div className="flex min-h-screen flex-col items-center  px-4 py-12 sm:px-6 lg:px-8">
            {/* Container with maximum width and centered content */}
            <div className="mx-auto max-w-md text-center">
                {/* Empty circular container (possibly for an icon) */}
                <div className="mx-auto h-12 w-12 rounded-full" />
                    {/* Large error code with responsive sizing (larger on desktop) */}
                    <h1 className="mt-4 text-6xl font-bold tracking-tight text-[#FFFFFF] sm:text-8xl">404</h1>
                    {/* Error explanation message with white text */}
                    <p className="mt-4 text-2xl text-[#FFFFFF]">
                    Oops, it looks like the page you're looking for doesn't exist.
                    </p>
                    {/* Container for the navigation button with top margin */}
                    <div className="mt-6">
                    {/* Link to homepage with styled button appearance */}
                    <Link
                        to="/" // Navigate to the root/home page
                        className="inline-flex items-center rounded-md bg-[#A855F7] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Go to Homepage
                    </Link>
                </div>
            </div>
        </div>

        {/* Include the standard site footer */}
        <FooterComp/>
        </>
    )


}

// Export the component for use in routing configuration
export default Error;