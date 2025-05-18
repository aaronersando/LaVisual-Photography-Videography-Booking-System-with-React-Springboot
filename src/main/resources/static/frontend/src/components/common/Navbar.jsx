/**
 * Navigation Bar Component
 * 
 * This component creates a responsive navigation bar that appears at the top of all pages in the application.
 * It features an animated highlight indicator for the current/hovered navigation item on desktop and
 * a collapsible hamburger menu on mobile devices.
 * 
 * Key features:
 * - Responsive design with different layouts for mobile and desktop
 * - Animated purple indicator that follows the active/hovered menu item on desktop
 * - Mobile hamburger menu with smooth open/close animations
 * - Interactive logo with spring animation on tap/click
 * - Active page highlighting
 * - Proper accessibility attributes for screen readers
 * 
 * The component uses React hooks for state management, Framer Motion for animations, 
 * and Font Awesome for icons. It adapts to window resizing and maintains the correct
 * indicator position at all times.
 */
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

function Navbar() {
  // State for controlling mobile menu visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Get current route location for highlighting active page
  const location = useLocation(); 
  // Track which navigation item is currently being hovered
  const [hovered, setHovered] = useState(null); 
  // Store references to each navigation link element for measurements
  const navRefs = useRef({}); 
  // Store position and dimensions of the active/hover indicator
  const [activeIndicator, setActiveIndicator] = useState({ width: 0, left: 0, height: 0 });

  // Helper function to determine if a path matches the current location
  const isActive = (path) => location.pathname === path; 
  
  // Update indicator position when hovered item or current page changes
  useEffect(() => {
    // Use the hovered item if available, otherwise use current page path
    const activePath = hovered || location.pathname;
    // Get reference to the active navigation element
    const currentRef = navRefs.current[activePath];

    if (currentRef) {
      // Get element dimensions and position
      const rect = currentRef.getBoundingClientRect();
      const parentRect = currentRef.parentElement.getBoundingClientRect();

      // Update indicator position and size to match the navigation item
      setActiveIndicator({
        width: rect.width,
        left: rect.left - parentRect.left, // Position relative to parent container
        height: rect.height,
      });
    }
  }, [hovered, location.pathname]);

  // Handle window resize to keep indicator properly positioned
  useEffect(() => {
    const handleResize = () => {
      // Same logic as above, recalculates positions when window size changes
      const activePath = hovered || location.pathname;
      const currentRef = navRefs.current[activePath];

      if (currentRef) {
        const rect = currentRef.getBoundingClientRect();
        const parentRect = currentRef.parentElement.getBoundingClientRect();

        setActiveIndicator({
          width: rect.width,
          left: rect.left - parentRect.left,
          height: rect.height,
        });
      }
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    // Cleanup function to remove event listener when component unmounts
    return () => window.removeEventListener('resize', handleResize);
  }, [hovered, location.pathname]);

  return (
    // Main header container - black background, sticky positioning at top of viewport
    <header className="bg-black w-full py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo with animation effect when tapped */}
          <motion.div
            whileTap={{ scale: 0.9, rotate: -5 }} // Shrink and rotate slightly when tapped
            transition={{ type: "spring", stiffness: 300, damping: 20 }} // Bouncy spring animation
          >
            <Link to={"/"}>
              <div className="text-2xl font-bold cursor-pointer">
                <span className="text-purple-500">La</span>Visual {/* "La" in purple, "Visual" in white */}
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation - hidden on mobile, visible on medium screens and up */}
          <nav className="hidden md:flex items-center space-x-8 relative">
            {/* Animated background indicator that moves to the active/hovered link */}
            <motion.div
              className="absolute bg-purple-700 rounded-md"
              layoutId="nav-indicator" // Unique ID for layout animations
              initial={false} // Don't animate on first render
              animate={{
                width: activeIndicator.width,
                left: activeIndicator.left,
                height: activeIndicator.height,
              }}
              transition={{
                type: "spring", // Springy movement
                stiffness: 300, // More responsive spring
                damping: 30,   // Less bouncy
                duration: 0.6, 
              }}
              style={{ zIndex: -1 }} // Position behind the text
            />

            {/* Navigation items mapped from an array */}
            {[
              { path: "/", label: "Home" },
              { path: "/booking", label: "Booking" },
              { path: "/portfolio", label: "Portfolio" },
              { path: "/packages", label: "Packages" },
              { path: "/contact", label: "Contact" },
              { path: "/about", label: "About Us" },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                ref={(el) => (navRefs.current[item.path] = el)} // Store reference to this element
                onMouseEnter={() => setHovered(item.path)} // Update hovered state on mouse enter
                onMouseLeave={() => setHovered(null)}      // Clear hovered state on mouse leave
                className={`relative text-sm transition-transform duration-300 ease-in-out px-3 py-2 rounded-md ${
                  isActive(item.path) ? "text-white" : "text-white hover:scale-110"
                }`}
                style={{ zIndex: 1 }} // Ensure text stays above the background
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button - visible only on mobile devices */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} // Toggle mobile menu
            className="md:hidden text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-expanded={isMobileMenuOpen} // Accessibility attribute
            aria-controls="mobile-menu"      // References the mobile menu ID
          >
            <span className="sr-only">Open main menu</span> {/* For screen readers */}
            {!isMobileMenuOpen ? (
              <FontAwesomeIcon icon={faBars} className="h-6 w-6" /> // Hamburger icon when closed
            ) : (
              <FontAwesomeIcon icon={faTimes} className="h-6 w-6" /> // X icon when open
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu - animated dropdown */}
        <motion.div
          className={`${
            isMobileMenuOpen ? "block" : "hidden" // Toggle visibility based on state
          } md:hidden transition-all duration-500 ease-in-out transform ${
            isMobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0" // Additional CSS transitions
          }`}
          id="mobile-menu"
          initial={{ opacity: 0, y: -10 }} // Initial animation state
          animate={{ opacity: isMobileMenuOpen ? 1 : 0, y: isMobileMenuOpen ? 0 : -10 }} // Animated state
          transition={{ duration: 0.5, ease: "easeInOut" }} // Animation timing
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* Mobile navigation items */}
            {[
              { path: "/", label: "Home" },
              { path: "/about", label: "About Us" },
              { path: "/portfolio", label: "Portfolio" },
              { path: "/packages", label: "Packages" },
              { path: "/booking", label: "Booking" },
              { path: "/contact", label: "Contact" },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-sm transition-transform duration-300 ease-in-out ${
                  isActive(item.path)
                    ? "text-purple-700" // Purple text for active page
                    : "text-white hover:bg-gray-800 hover:scale-105" // White text with hover effects
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </header>
  );
}

export default Navbar;