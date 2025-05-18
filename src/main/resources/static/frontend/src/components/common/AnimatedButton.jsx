/**
 * AnimatedButton Component
 * 
 * This component creates a reusable, visually appealing button with smooth animations.
 * It leverages Framer Motion (a popular React animation library) to add professional
 * interaction effects like scaling and color transitions when users hover or click.
 * 
 * Key features:
 * - Elegant hover effect with scaling and gradient background transition
 * - Subtle click/tap animation feedback
 * - Configurable spring-based physics for natural-feeling motion
 * - Fully customizable through className and other props
 * - Maintains all native button functionality
 * 
 * This component is used throughout the application for action buttons, creating
 * a consistent and engaging user experience across different sections like navigation,
 * forms, and call-to-action elements.
 */

import { motion } from "framer-motion"; // Import the motion component from Framer Motion library

/**
 * AnimatedButton functional component
 * 
 * @param {ReactNode} children - Content to be displayed inside the button
 * @param {string} className - Additional CSS classes to apply to the button
 * @param {Object} props - Any additional props to pass to the button element
 * @returns {JSX.Element} The animated button component
 */
function AnimatedButton({ children, className, ...props }) {
  return (
    <motion.button
      // Base styling combined with any custom classes passed through props
      // - relative: For proper positioning of child elements
      // - overflow-hidden: Contains any overflow from animations
      // - px-6, py-3: Horizontal and vertical padding
      // - rounded-md: Rounded corners for modern look
      // - text-white, font-medium: Text styling defaults
      className={`relative overflow-hidden px-6 py-3 rounded-md text-white font-medium ${className}`}
      
      // Animation effect that triggers when hovering over the button
      whileHover={{
        scale: 1.1, // Button grows slightly to 110% of original size
        background: "linear-gradient(90deg, #9333EA, #C084FC)", // Animates to purple gradient
      }}
      
      // Animation effect that triggers when pressing/clicking the button
      whileTap={{ scale: 0.95 }} // Button shrinks slightly to 95% to give feedback
      
      // Physics configuration for the animations
      transition={{
        type: "spring", // Uses spring physics for natural motion
        stiffness: 300, // Higher stiffness means faster animation
        damping: 20,    // Controls how quickly the spring settles
      }}
      
      // Spreads any additional props passed to the component
      {...props}
    >
      {children} {/* Renders the content passed between component tags */}
    </motion.button>
  );
}

export default AnimatedButton; // Makes the component available for import in other files