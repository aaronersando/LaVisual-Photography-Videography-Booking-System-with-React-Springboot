/**
 * Package Page Component
 * 
 * This component renders the Packages page for the LaVisual photography/videography business.
 * It displays the various service packages offered, organized by category (Photography, 
 * Videography, and combined Photo + Video packages).
 * 
 * Key features:
 * - Interactive category selector with animated sliding indicator
 * - Responsive grid layout that adapts to different screen sizes
 * - Animated entry of package cards with staggered timing
 * - Detailed cards showing pricing, descriptions, and included features
 * - Section for custom package inquiries with direct link to Contact page
 * - Animated transitions when switching between categories
 * 
 * This page helps potential clients browse different service options and
 * find a package that matches their needs and budget.
 */

import React, { useState, useRef, useEffect } from "react"; // Core React imports for component, state, and lifecycle hooks
import Navbar from "../../components/common/Navbar"; // Site navigation header
import FooterComp from "../../components/common/FooterComp"; // Site footer 
import PackageCard from "../../components/home/PackageCard"; // Card component for displaying package details
import { Link } from "react-router-dom"; // For navigation to other pages
import { motion, AnimatePresence } from "framer-motion"; // Animation library components
import TypeWriterEffect from 'react-typewriter-effect'; // Component for typing animation effect

function Package() {
  // State to track which category is currently selected (defaults to Photography)
  const [category, setCategory] = useState("Photography");
  
  // References to the category button DOM elements for measuring their position
  const categoryRefs = useRef({});
  
  // State to track the position of the sliding indicator element
  const [indicator, setIndicator] = useState({ width: 0, left: 0 });
  
  // Text description that will be displayed with typewriter effect
  const description = "Choose from our carefully crafted packages or contact us for custom solutions tailored to your specific needs.";
  
  // Update indicator position when selected category changes
  useEffect(() => {
    const currentRef = categoryRefs.current[category]; // Get reference to selected category button
    if (currentRef) {
      // Get precise measurements of the button element
      const rect = currentRef.getBoundingClientRect();
      const parentRect = currentRef.parentElement.getBoundingClientRect();
      
      // Update indicator position to match the selected button
      setIndicator({
        width: rect.width, // Match button width
        left: rect.left - parentRect.left, // Calculate relative position
      });
    }
  }, [category]); // Re-run when category changes

  // Handle window resize to recalculate indicator position
  useEffect(() => {
    const handleResize = () => {
      const currentRef = categoryRefs.current[category];
      if (currentRef) {
        const rect = currentRef.getBoundingClientRect();
        const parentRect = currentRef.parentElement.getBoundingClientRect();
        
        // Update positions after resize
        setIndicator({
          width: rect.width,
          left: rect.left - parentRect.left,
        });
      }
    };

    // Add resize event listener
    window.addEventListener('resize', handleResize);
    // Clean up listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, [category]);

  // Array of package data objects containing all service packages
  const packages = [
    // Photography section - packages for photo services
    {
      category: "Photography",
      title: "Intimate Session",
      price: "3,000",
      description: "Perfect For Individuals & Couples Wanting Professional Portraits.",
      features: [
        "3-Hours Photography Session",
        "1 Location",
        "150 Digital Edited Photos",
        "Online Gallery",
        "Personal Use Rights",
      ],
    },
    {
      category: "Photography",
      title: "Pre-Photoshoot",
      price: "3,500",
      description: "Exclusive Photo Coverage For Your Special Day With All The Essentials.",
      features: [
        "4-Hours Photography Session",
        "1 Photographer",
        "150+ Digital Edited Photos",
        "Online Gallery",
        "Personal Use Rights",
      ],
    },
    {
      category: "Photography",
      title: "Event Coverage",
      price: "4,500",
      description: "Ideal For Families Wanting To Capture Special Moments Together.",
      features: [
        "5-Hours Photography Session",
        "1 Location",
        "200+ Digital Edited Photos",
        "Online Gallery",
        "Personal Use Rights",
      ],
    },
    {
      category: "Photography",
      title: "Wedding",
      price: "5,000",
      description: "Coverage For Your Special Day With All The Essentials.",
      features: [
        "7-Hours Photography Session",
        "1 Photographer",
        "200+ Digital Edited Photos",
        "Engagement Session",
        "Online Gallery",
        "Personal Use Rights",
      ],
    },
    {
      category: "Photography",
      title: "Wedding Premium",
      price: "11,000",
      description: "Comprehensive Coverage For Your Wedding Day.",
      features: [
        "10-Hours Photography Session",
        "2 Photographers",
        "300+ Digital Edited Photos",
        "Engagement Session",
        "Online Gallery",
        "Wedding Album Design",
        "Personal Use Rights",
      ],
    },

    // Videography section - packages for video services
    {
      category: "Videography",
      title: "Event Highlight",
      price: "7,000",
      description: "Perfect For Capturing Highlights Of Your Special Event.",
      features: [
        "4-Hours of Coverage",
        "Edited Highlight Reel (3-5 Minutes)",
        "Professional Audio",
        "Digital Delivery",
        "Background Music",
      ],
    },
    {
      category: "Videography",
      title: "Same Day Edit",
      price: "12,000",
      description: "Professional Video Coverage For Your Business & Product",
      features: [
        "6-Hours of Coverage",
        "Edited Video (1-3 Minutes)",
        "Professional Audio",
        "1 Round of Revisions",
        "Digital Delivery",
        "Commercial Use Rights",
      ],
    },
    {
      category: "Videography",
      title: "Wedding Film",
      price: "15,000",
      description: "Fully Exclusive Cinematic Coverage Of Your Wedding Day.",
      features: [
        "8-Hours of Coverage",
        "Highlight Film (5-7 Minutes)",
        "Full Ceremony Edit",
        "Professional Audio",
        "Drone Footage",
        "Same Day Edit",
      ],
    },

    // Combo Packages section - combined photo and video packages
    {
      category: "Photo + Video",
      title: "Pre-Shoot Combo",
      price: "10,000",
      description: "Full Pre-Shot Photo & Video Coverage Combo For Your Special Event.",
      features: [
        "6-Hours of Coverage",
        "1 Photographer & 1 Videographer",
        "200+ Edited Photos",
        "Highlight Video (3-5 Minutes)",
        "Online Gallery",
        "Digital Delivery",
      ],
    },
    {
      category: "Photo + Video",
      title: "Event Complete",
      price: "13,000",
      description: "Full Exclusive Photo & Video Coverage For Your Special Event.",
      features: [
        "8-Hours of Coverage",
        "2 Photographers & 1 Videographer",
        "400+ Edited Photos",
        "Highlight Video (3-5 Minutes)",
        "Online Gallery",
        "Digital Delivery",
      ],
    },
    {
      category: "Photo + Video",
      title: "Wedding Complete",
      price: "35,000",
      description: "The Ultimate & Complete Wedding Package With Photo & Video Coverage.",
      features: [
        "10-Hours of Coverage",
        "2 Photographers & 2 Videographers",
        "500+ Edited Photos",
        "Cinematic Highlight Film (7-10 Minutes)",
        "Full Ceremony Video",
        "Drone Footage",
        "Engagement Session",
        "Wedding Album",
        "Online Gallery",
      ],
    },
  ];

  // Filter packages to only show those in the currently selected category
  const filteredPackages = packages.filter((pkg) => pkg.category === category);

  // Animation configuration for the container that holds all package cards
  const containerVariants = {
    hidden: { opacity: 0 }, // Start state - completely invisible
    visible: {
      opacity: 1, // End state - fully visible
      transition: {
        staggerChildren: 0.1 // Delay between each child animation (0.1 seconds)
      }
    }
  };

  // Animation configuration for individual package cards
  const itemVariants = {
    hidden: { y: 20, opacity: 0 }, // Start state - below position and invisible
    visible: {
      y: 0, // End state - normal position
      opacity: 1, // End state - fully visible
      transition: { 
        type: "spring", // Spring physics for natural movement
        stiffness: 300, // Higher stiffness for snappier animation
        damping: 24 // Damping to prevent too much bounce
      }
    }
  };

  return (
    <>
      {/* Site navigation header */}
      <Navbar />
      
      {/* Main section with fade-in animation */}
      <motion.section 
        className="py-12 sm:py-16 lg:py-20 bg-[#111827] min-h-screen" // Dark background with responsive padding
        initial={{ opacity: 0 }} // Start invisible
        animate={{ opacity: 1 }} // Fade in
        transition={{ duration: 0.5 }} // Over 0.5 seconds
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-7xl">
          {/* Page title and description with animation */}
          <motion.div 
            className="text-center mb-2 sm:mb-6" // Centered text with responsive spacing
            initial={{ y: -20, opacity: 0 }} // Start above position and invisible
            animate={{ y: 0, opacity: 1 }} // Move down and fade in
            transition={{ duration: 0.6, delay: 0.1 }} // Animation timing
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Our Packages
            </h2>
            {/* Fixed container for TypeWriter with proper height */}
            <div className="min-h-[4rem] flex items-center justify-center">
              <div className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
                <TypeWriterEffect
                  textStyle={{
                    fontFamily: 'inherit',
                    fontSize: '1rem',
                    color: '#9CA3AF',
                    maxWidth: '100%',
                    textAlign: 'center',
                    lineHeight: '1.5',
                  }}
                  startDelay={100} // Wait 100ms before starting
                  cursorColor="#C084FC" // Purple cursor
                  multiText={[description]} // Text to type
                  multiTextDelay={1000} // Delay before typing next text
                  typeSpeed={30} // Typing speed (characters per second)
                  multiTextLoop={false} // Don't loop the text
                />
              </div>
            </div>
          </motion.div>

          {/* Category Selector with Slider */}
          <div className="mb-8 sm:mb-12">
            <div className="flex justify-center">
              <div className="relative inline-flex bg-gray-800 rounded-lg shadow-lg p-1">
                {/* Sliding Indicator - purple background that moves under the selected category */}
                <motion.div 
                  className="absolute bg-purple-600 rounded-md z-0" // Purple background behind text
                  initial={false} // Don't animate on initial render
                  animate={{
                    width: indicator.width, // Match width of selected button
                    left: indicator.left, // Match position of selected button
                    height: "calc(100% - 8px)", // Nearly full height
                    top: 4 // Small offset from top
                  }}
                  transition={{
                    type: "spring", // Spring physics for smooth movement
                    stiffness: 300, // Higher stiffness for responsive movement
                    damping: 30, // Enough damping to prevent overshooting
                    duration: 0.4, // Maximum duration
                  }}
                />

                {/* Category Buttons */}
                {["Photography", "Videography", "Photo + Video"].map((cat) => (
                  <button
                    key={cat} // React key using category name
                    ref={el => categoryRefs.current[cat] = el} // Store reference to button element
                    onClick={() => setCategory(cat)} // Handle category selection
                    className={`relative z-10 px-4 sm:px-6 py-2 text-sm font-medium transition-colors duration-200 rounded-md
                      ${category === cat ? "text-white" : "text-gray-300 hover:text-white"}`} // Highlight selected tab
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Packages Grid - displays the filtered package cards */}
          <AnimatePresence mode="wait"> {/* Handle animations when switching categories */}
            <motion.div
              key={category} // React key to trigger re-render on category change
              variants={containerVariants} // Use container animation configuration
              initial="hidden" // Start with hidden state
              animate="visible" // Animate to visible state
              exit={{ opacity: 0 }} // Fade out when component is removed
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" // Responsive grid layout
            >
              {/* Map through filtered packages to create cards */}
              {filteredPackages.map((pkg, index) => (
                <motion.div key={index} variants={itemVariants}> {/* Animation for each card */}
                  <PackageCard {...pkg} /> {/* Render package card with all props */}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Custom Package Section - CTA for custom quotes */}
          <motion.div 
            className="mt-16 sm:mt-20 bg-gray-800 rounded-xl px-6 py-8 sm:py-12 text-center mx-auto max-w-4xl" // Card styling
            initial={{ opacity: 0, y: 20 }} // Start below position and invisible
            animate={{ opacity: 1, y: 0 }} // Move up and fade in
            transition={{ delay: 0.5, duration: 0.5 }} // Animation timing
          >
            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">
              Need a Custom Package?
            </h3>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto text-sm sm:text-base">
              Don't see what you're looking for? We offer custom packages tailored to your specific needs and budget.
            </p>
            <Link to="/contact"> {/* Link to contact page */}
              <motion.button
                whileHover={{ scale: 1.05 }} // Grow slightly on hover
                whileTap={{ scale: 0.95 }} // Shrink slightly when clicked
                className="inline-block rounded-md bg-[#9333EA] px-6 py-3 text-sm font-medium text-white hover:bg-purple-700 transition-all duration-300" // Button styling
              >
                Contact Us for Custom Quote
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Site footer */}
      <FooterComp />
    </>
  );
}

export default Package; // Export the component for use in routing