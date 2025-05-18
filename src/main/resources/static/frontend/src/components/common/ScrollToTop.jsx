/**
 * ScrollToTop Component
 * 
 * This utility component automatically scrolls the window to the top when navigating
 * between different routes in the application. Without this component, React Router
 * would maintain the scroll position when changing routes, which can create a poor
 * user experience (users would have to manually scroll up after navigation).
 * 
 * Key features:
 * - Automatically scrolls to top of page on route changes
 * - Invisible component (renders nothing in the DOM)
 * - Uses React Router's useLocation hook to detect navigation
 * - Implemented as a "side effect" using React's useEffect hook
 * 
 * This component is placed inside BrowserRouter in App.jsx, making it active
 * throughout the entire application without needing to add it to each page.
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  // Extract the current pathname from the location object
  // This will change whenever the user navigates to a different route
  const { pathname } = useLocation();

  // Set up a side effect that runs when the component mounts
  // and whenever the pathname changes
  useEffect(() => {
    // Scroll the window to coordinates (0,0) - the top left corner of the page
    // This effectively scrolls the page back to the top
    window.scrollTo(0, 0); 
  }, [pathname]); // The dependency array - effect runs when pathname changes 

  // This component doesn't render anything visible in the DOM
  // It only performs the scrolling behavior as a side effect
  return null;
}

export default ScrollToTop;