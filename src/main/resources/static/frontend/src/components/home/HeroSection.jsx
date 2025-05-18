/**
 * Hero Section Component
 * 
 * This component renders the main landing banner section that appears at the top of the home page.
 * It features a full-screen background image with animated text elements, a typewriter effect
 * for the service description, and call-to-action buttons.
 * 
 * Key features:
 * - Responsive design that adapts to different screen sizes
 * - Animated entrance effects using Framer Motion
 * - Typewriter text effect for engaging content presentation
 * - Interactive buttons with hover animations
 * - Bouncing down arrow to guide users to scroll down
 * 
 * The component serves as the primary entry point and first impression for visitors,
 * highlighting the photography and videography services while providing quick navigation
 * to portfolio and booking pages.
 */

import {Link} from 'react-router-dom'; // Import Link for navigation between pages
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome component
import { motion } from "framer-motion"; // Import motion for animations
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'; // Import specific icon
import AnimatedButton from '../common/AnimatedButton'; // Import custom button component
import TypeWriterEffect from 'react-typewriter-effect'; // Import typewriter animation
import React, { useEffect, useState } from 'react'; // Import React and hooks

function HeroSection() {
  const [fontSize, setFontSize] = useState('1rem'); // State to store responsive font size

  // Effect to handle responsive font sizing based on screen width
  useEffect(() => {
    const updateFontSize = () => {
      if (window.innerWidth >= 1024) {
        setFontSize('1.25rem'); // Larger text for desktop
      } else if (window.innerWidth >= 768) {
        setFontSize('1.125rem'); // Medium text for tablets
      } else {
        setFontSize('1rem'); // Default text size for mobile
      }
    };

    updateFontSize(); // Run once on component mount
    
    window.addEventListener('resize', updateFontSize); // Add listener for window resize
    
    return () => window.removeEventListener('resize', updateFontSize); // Cleanup on unmount
  }, []);

  // Animation configuration for the title container
  const titleContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Delay between animating each child
        delayChildren: 0.2, // Initial delay before starting child animations
      }
    }
  };

  // Animation configuration for individual title items
  const titleItem = {
    hidden: { y: 20, opacity: 0 }, // Start 20px below and invisible
    visible: {
      y: 0, // Move to original position
      opacity: 1, // Fade in
      transition: {
        type: "spring", // Use spring physics
        damping: 12, // Less damping for more bounce
        stiffness: 100 // Spring stiffness
      }
    }
  };

  return (
    <div className="relative min-h-[500px] h-screen w-full">
      {/* Background image container */}
      <div className="absolute inset-0 overflow-hidden">
        <picture className="w-full h-full">
          {/* Desktop */}
          <source 
            media="(min-width: 1024px)" 
            srcSet="/src/assets/home/hero.webp"
            className="w-full h-full object-cover"
          />
          {/* Tablet */}
          <source 
            media="(min-width: 768px)" 
            srcSet="/src/assets/home/hero.webp"
            className="w-full h-full object-cover"
          />
          {/* Mobile - default */}
          <img 
            src="/src/assets/home/hero.webp" 
            alt="hero background" 
            className="w-full h-full object-cover object-center"
            loading="eager" // Priority loading for hero image
          />
        </picture>
        <div className="absolute inset-0 bg-black/40" /> {/* Semi-transparent overlay */}
      </div>
      
      {/* Content container */}
      <div className="relative z-10 h-full flex items-start pt-[20vh]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-40">
          <div className="max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto sm:mx-0">
            {/* Animated Title */}
            <motion.div
              variants={titleContainer}
              initial="hidden"
              animate="visible"
              className="mb-3 sm:mb-5"
            >
              <motion.h1 
                variants={titleItem}
                className="text-5xl sm:text-7xl md:text-7xl lg:text-8xl font-bold text-white"
              >
                Capturing Your{" "}
              </motion.h1>
              <motion.span 
                variants={titleItem}
                className="block sm:inline text-5xl sm:text-7xl md:text-6xl lg:text-8xl font-bold text-[#C084FC] whitespace-normal sm:whitespace-nowrap"
              >
                Perfect Moments
              </motion.span>
            </motion.div>
            
            {/* Typewriter effect text */}
            <div className='mb-5 sm:mb-6 md:mb-8 max-w-full overflow-hidden'>
              <TypeWriterEffect
                textStyle={{
                  fontFamily: 'inherit',
                  fontSize: fontSize, // Responsive font size from state
                  color: '#E5E7EB', 
                  lineHeight: '1.5',
                  maxWidth: '100%',
                  overflowWrap: 'break-word',
                }}
                startDelay={100}  // Start after 100ms
                cursorColor="#C084FC" // Purple cursor
                multiText={[
                  'Professional photography and videography services for weddings, events, portraits, and pre-photoshoot projects.',
                ]}
                multiTextDelay={1000} // Delay between text iterations
                typeSpeed={50} // Speed of typing
                multiTextLoop={false} // Only type once, don't loop
              />
            </div>
            
            {/* Call to action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2">
              {/* View Portfolio button */}
              <Link to="/portfolio" className="w-full sm:w-auto">
                <AnimatedButton className="w-full sm:w-auto bg-purple-500 hover:bg-purple-700 text-sm sm:text-base px-4 py-2.5 sm:py-3">
                  View Portfolio
                </AnimatedButton>
              </Link>
              
              {/* Book a Session button with custom animation */}
              <Link to="/booking" className="w-full sm:w-auto">
                <motion.button 
                  className="relative group flex justify-center items-center w-full sm:w-auto border border-white text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-md hover:bg-white/10 transition-all duration-300 text-sm sm:text-base hover:cursor-pointer overflow-hidden"
                  whileHover={{ scale: 1.05 }} // Grow slightly on hover
                  whileTap={{ scale: 0.95 }} // Shrink slightly when clicked
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 17 
                  }}
                >
                  {/* Animated gradient line that slides across button on hover */}
                  <div className="h-[100px] top-[-30px] w-10 bg-gradient-to-r from-white/10 via-white/50 to-white/10 absolute -left-16 -rotate-28 blur-sm group-hover:left-[150%] duration-700 group-hover:delay-100" />
                  Book a Session
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bouncing down arrow - hidden on mobile, visible on larger screens */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce hidden sm:block">
        <FontAwesomeIcon icon={faArrowDown} className="text-white text-lg sm:text-xl"/>
      </div>
    </div>
  );
}

export default HeroSection;