/**
 * Login Page Component
 * 
 * This component serves as the admin login page for the LaVisual photography/videography business.
 * It provides a structured layout that combines navigation, the login form, and footer components
 * into a complete page. The actual authentication functionality is handled within the LoginBox 
 * component that this page imports and renders.
 * 
 * Key features:
 * - Presents a consistent branded interface with shared navigation and footer
 * - Contains the login form for administrator authentication
 * - Uses minimum height to ensure the page fills the viewport
 * - Provides proper spacing with padding to position content appropriately
 * 
 * This page is typically accessed via the /login route and is publicly accessible,
 * but the admin dashboard it provides access to is protected by authentication.
 */

// Import the shared navigation component used across the site
import Navbar from "../../components/common/Navbar";
// Import the shared footer component used across the site
import Footer from "../../components/common/FooterComp";
// Import the actual login form component that handles authentication
import LoginBox from "../../components/forms/Loginform";

function Login() {
  return (
    // React fragment to group multiple elements without adding extra DOM nodes
    <>
      {/* Navigation bar at the top of the page */}
      <Navbar />
      
      {/* Main content area with minimum full viewport height and vertical padding */}
      <main className="min-h-screen py-20">
        {/* Login form component that handles authentication */}
        <LoginBox />
      </main>
      
      {/* Footer at the bottom of the page */}
      <Footer />
    </>
  );
}

// Export the component for use in the application's routing
export default Login;