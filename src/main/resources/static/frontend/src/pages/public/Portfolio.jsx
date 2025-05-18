/**
 * Portfolio Page Component
 * 
 * This component renders the Portfolio page for the LaVisual photography/videography business.
 * It displays a filterable gallery of photography and videography work organized by categories 
 * (Wedding, Portrait, Pre-Birthday, etc.).
 * 
 * Key features:
 * - Interactive category filter with animated sliding indicator
 * - Animated page and gallery item transitions
 * - Responsive grid layout for different screen sizes
 * - Support for both image and video portfolio items
 * - Typewriter effect for description text
 * 
 * Users can browse through different categories of work to see samples of the business's
 * photography and videography capabilities.
 */

// React core imports for state management, references, and lifecycle hooks
import { useState, useRef, useEffect } from "react";
// Site layout components
import FooterComp from "../../components/common/FooterComp"; // Site footer
import Navbar from "../../components/common/Navbar"; // Navigation header
// Portfolio item display components
import PortfolioCard from "../../components/home/PortfolioCard"; // Card for displaying image items
import VideoCard from "../../components/home/VideoCard"; // Card for displaying video items
// Animation libraries
import { motion, AnimatePresence } from "framer-motion"; // For animated transitions
import TypeWriterEffect from 'react-typewriter-effect'; // For typing text animation

// Array containing all portfolio items data
// This large array is organized by category and contains all the portfolio items to be displayed
const portfolioItems = [
// Wedding photos collection
  {
    image: "/src/assets/portfolio/wedding/new/1.webp", // Path to image file
    title: "Dino and Jasmine's Wedding", // Title to display on card
    category: "Wedding", // Category for filtering
  },
  {
    image: "/src/assets/portfolio/wedding/new/2.webp",
    title: "Dino and Jasmine's Wedding",
    category: "Wedding",
  },
  {
    image: "/src/assets/portfolio/wedding/new/3.webp",
    title: "Dino and Jasmine's Wedding",
    category: "Wedding",
  },
  {
    image: "/src/assets/portfolio/wedding/new/4.webp",
    title: "Dino and Jasmine's Wedding",
    category: "Wedding",
  },
  {
    image: "/src/assets/portfolio/wedding/new/5.webp",
    title: "Dino and Jasmine's Wedding",
    category: "Wedding",
  },
  {
    image: "/src/assets/portfolio/wedding/new/6.webp",
    title: "Dino and Jasmine's Wedding",
    category: "Wedding",
  },


// Portrait photos collection
    {
    image: "/src/assets/portfolio/portrait/new/1.webp",
    title: "Ann's Portrait",
    category: "Portrait",
  },
    {
    image: "/src/assets/portfolio/portrait/new/2.webp",
    title: "Ann's Portrait",
    category: "Portrait",
  },
    {
    image: "/src/assets/portfolio/portrait/new/3.webp",
    title: "Ann's Portrait",
    category: "Portrait",
  },
    {
    image: "/src/assets/portfolio/portrait/new/4.webp",
    title: "Ann's Portrait",
    category: "Portrait",
  },
    {
    image: "/src/assets/portfolio/portrait/new/5.webp",
    title: "Ann's Portrait",
    category: "Portrait",
  },
    {
    image: "/src/assets/portfolio/portrait/new/6.webp",
    title: "Ann's Portrait",
    category: "Portrait",
  },
    {
    image: "/src/assets/portfolio/portrait/new/7.webp",
    title: "Ann's Portrait",
    category: "Portrait",
  },
    {
    image: "/src/assets/portfolio/portrait/new/8.webp",
    title: "Ann's Portrait",
    category: "Portrait",
  },
    {
    image: "/src/assets/portfolio/portrait/new/9.webp",
    title: "Ann's Portrait",
    category: "Portrait",
  },
    {
    image: "/src/assets/portfolio/portrait/new/10.webp",
    title: "Ann's Portrait",
    category: "Portrait",
  },
    {
    image: "/src/assets/portfolio/portrait/new/11.webp",
    title: "Ann's Portrait",
    category: "Portrait",
  },
    {
    image: "/src/assets/portfolio/portrait/new/12.webp",
    title: "Ann's Portrait",
    category: "Portrait",
  },

// Pre-Birthday/Debut photos collection
{
    image: "/src/assets/portfolio/pre-birthday/new/1.webp",
    title: "Kimberyly's Pre-Debut",
    category: "Pre-Birthday",
  },
{
    image: "/src/assets/portfolio/pre-birthday/new/2.webp",
    title: "Kimberyly's Pre-Debut",
    category: "Pre-Birthday",
  },
{
    image: "/src/assets/portfolio/pre-birthday/new/3.webp",
    title: "Kimberyly's Pre-Debut",
    category: "Pre-Birthday",
  },
{
    image: "/src/assets/portfolio/pre-birthday/new/4.webp",
    title: "Kimberyly's Pre-Debut",
    category: "Pre-Birthday",
  },
{
    image: "/src/assets/portfolio/pre-birthday/new/5.webp",
    title: "Kimberyly's Pre-Debut",
    category: "Pre-Birthday",
  },
{
    image: "/src/assets/portfolio/pre-birthday/new/6.webp",
    title: "Kimberyly's Pre-Debut",
    category: "Pre-Birthday",
  },
{
    image: "/src/assets/portfolio/pre-birthday/new/7.webp",
    title: "Kimberyly's Pre-Debut",
    category: "Pre-Birthday",
  },
{
    image: "/src/assets/portfolio/pre-birthday/new/8.webp",
    title: "Kimberyly's Pre-Debut",
    category: "Pre-Birthday",
  },
{
    image: "/src/assets/portfolio/pre-birthday/new/9.webp",
    title: "Kimberyly's Pre-Debut",
    category: "Pre-Birthday",
  },
{
    image: "/src/assets/portfolio/pre-birthday/new/10.webp",
    title: "Kimberyly's Pre-Debut",
    category: "Pre-Birthday",
  },
{
    image: "/src/assets/portfolio/pre-birthday/new/11.webp",
    title: "Kimberyly's Pre-Debut",
    category: "Pre-Birthday",
  },
{
    image: "/src/assets/portfolio/pre-birthday/new/12.webp",
    title: "Kimberyly's Pre-Debut",
    category: "Pre-Birthday",
  },

// Pre-Nuptial photos collection
  {
    image: "/src/assets/portfolio/pre-nup/new/1.webp",
    title: "Keight & Shaira's Pre-Nup",
    category: "Pre-Nup",
  },
  {
    image: "/src/assets/portfolio/pre-nup/new/2.webp",
    title: "Keight & Shaira's Pre-Nup",
    category: "Pre-Nup",
  },
  {
    image: "/src/assets/portfolio/pre-nup/new/3.webp",
    title: "Keight & Shaira's Pre-Nup",
    category: "Pre-Nup",
  },
  {
    image: "/src/assets/portfolio/pre-nup/new/4.webp",
    title: "Keight & Shaira's Pre-Nup",
    category: "Pre-Nup",
  },
  {
    image: "/src/assets/portfolio/pre-nup/new/5.webp",
    title: "Keight & Shaira's Pre-Nup",
    category: "Pre-Nup",
  },
  {
    image: "/src/assets/portfolio/pre-nup/new/6.webp",
    title: "Keight & Shaira's Pre-Nup",
    category: "Pre-Nup",
  },
  {
    image: "/src/assets/portfolio/pre-nup/new/7.webp",
    title: "Keight & Shaira's Pre-Nup",
    category: "Pre-Nup",
  },
  {
    image: "/src/assets/portfolio/pre-nup/new/8.webp",
    title: "Keight & Shaira's Pre-Nup",
    category: "Pre-Nup",
  },
  {
    image: "/src/assets/portfolio/pre-nup/new/9.webp",
    title: "Keight & Shaira's Pre-Nup",
    category: "Pre-Nup",
  },
  {
    image: "/src/assets/portfolio/pre-nup/new/10.webp",
    title: "Keight & Shaira's Pre-Nup",
    category: "Pre-Nup",
  },
  {
    image: "/src/assets/portfolio/pre-nup/new/11.webp",
    title: "Keight & Shaira's Pre-Nup",
    category: "Pre-Nup",
  },
  {
    image: "/src/assets/portfolio/pre-nup/new/12.webp",
    title: "Keight & Shaira's Pre-Nup",
    category: "Pre-Nup",
  },

// Baptismal photos collection
  {
    image: "/src/assets/portfolio/baptismal/new/1.webp",
    title: "Astrid's Baptism",
    category: "Baptismal",
  },
  {
    image: "/src/assets/portfolio/baptismal/new/2.webp",
    title: "Astrid's Baptism",
    category: "Baptismal",
  },
  {
    image: "/src/assets/portfolio/baptismal/new/3.webp",
    title: "Astrid's Baptism",
    category: "Baptismal",
  },
  {
    image: "/src/assets/portfolio/baptismal/new/4.webp",
    title: "Astrid's Baptism",
    category: "Baptismal",
  },
  {
    image: "/src/assets/portfolio/baptismal/new/5.webp",
    title: "Astrid's Baptism",
    category: "Baptismal",
  },
  {
    image: "/src/assets/portfolio/baptismal/new/6.webp",
    title: "Astrid's Baptism",
    category: "Baptismal",
  },
  {
    image: "/src/assets/portfolio/baptismal/new/7.webp",
    title: "Astrid's Baptism",
    category: "Baptismal",
  },
  {
    image: "/src/assets/portfolio/baptismal/new/8.webp",
    title: "Astrid's Baptism",
    category: "Baptismal",
  },
  {
    image: "/src/assets/portfolio/baptismal/new/9.webp",
    title: "Astrid's Baptism",
    category: "Baptismal",
  },
  {
    image: "/src/assets/portfolio/baptismal/new/10.webp",
    title: "Astrid's Baptism",
    category: "Baptismal",
  },
  {
    image: "/src/assets/portfolio/baptismal/new/11.webp",
    title: "Astrid's Baptism",
    category: "Baptismal",
  },
  {
    image: "/src/assets/portfolio/baptismal/new/12.webp",
    title: "Astrid's Baptism",
    category: "Baptismal",
  },

// Occasion photos collection (birthday events)
  {
    image: "/src/assets/portfolio/occasion/new/1.webp",
    title: "Zeny's 60th Birthday",
    category: "Occasion",
  },
  {
    image: "/src/assets/portfolio/occasion/new/2.webp",
    title: "Zeny's 60th Birthday",
    category: "Occasion",
  },
  {
    image: "/src/assets/portfolio/occasion/new/3.webp",
    title: "Zeny's 60th Birthday",
    category: "Occasion",
  },
  {
    image: "/src/assets/portfolio/occasion/new/4.webp",
    title: "Zeny's 60th Birthday",
    category: "Occasion",
  },
  {
    image: "/src/assets/portfolio/occasion/new/5.webp",
    title: "Zeny's 60th Birthday",
    category: "Occasion",
  },
  {
    image: "/src/assets/portfolio/occasion/new/6.webp",
    title: "Zeny's 60th Birthday",
    category: "Occasion",
  },
  {
    image: "/src/assets/portfolio/occasion/new/7.webp",
    title: "Zeny's 60th Birthday",
    category: "Occasion",
  },
  {
    image: "/src/assets/portfolio/occasion/new/8.webp",
    title: "Zeny's 60th Birthday",
    category: "Occasion",
  },
  {
    image: "/src/assets/portfolio/occasion/new/9.webp",
    title: "Zeny's 60th Birthday",
    category: "Occasion",
  },
  {
    image: "/src/assets/portfolio/occasion/new/10.webp",
    title: "Zeny's 60th Birthday",
    category: "Occasion",
  },
  {
    image: "/src/assets/portfolio/occasion/new/11.webp",
    title: "Zeny's 60th Birthday",
    category: "Occasion",
  },
  {
    image: "/src/assets/portfolio/occasion/new/12.webp",
    title: "Zeny's 60th Birthday",
    category: "Occasion",
  },

  // Sports photos collection
  {
    image: "/src/assets/portfolio/sports/new/1.webp",
    title: "San Jose Basketball League",
    category: "Sports",
  },
  {
    image: "/src/assets/portfolio/sports/new/2.webp",
    title: "San Jose Basketball League",
    category: "Sports",
  },
  {
    image: "/src/assets/portfolio/sports/new/3.webp",
    title: "San Jose Basketball League",
    category: "Sports",
  },
  {
    image: "/src/assets/portfolio/sports/new/4.webp",
    title: "San Jose Basketball League",
    category: "Sports",
  },
  {
    image: "/src/assets/portfolio/sports/new/5.webp",
    title: "San Jose Basketball League",
    category: "Sports",
  },
  {
    image: "/src/assets/portfolio/sports/new/6.webp",
    title: "San Jose Basketball League",
    category: "Sports",
  },
  {
    image: "/src/assets/portfolio/sports/new/7.webp",
    title: "San Jose Basketball League",
    category: "Sports",
  },
  {
    image: "/src/assets/portfolio/sports/new/8.webp",
    title: "San Jose Basketball League",
    category: "Sports",
  },
  {
    image: "/src/assets/portfolio/sports/new/9.webp",
    title: "San Jose Basketball League",
    category: "Sports",
  },
  {
    image: "/src/assets/portfolio/sports/new/10.webp",
    title: "San Jose Basketball League",
    category: "Sports",
  },
  {
    image: "/src/assets/portfolio/sports/new/11.webp",
    title: "San Jose Basketball League",
    category: "Sports",
  },
  {
    image: "/src/assets/portfolio/sports/new/12.webp",
    title: "San Jose Basketball League",
    category: "Sports",
  },

  // Video items collection - note these have a different structure including videoUrl and thumbnail
  {
    type: "video", // Indicates this is a video, not an image
    videoUrl: "/src/assets/portfolio/video/kj.mp4", // Path to video file
    thumbnail: "/src/assets/portfolio/video/1.webp", // Thumbnail image to display before playing
    title: "Khay & Jha's SDE Video", // Video title
    category: "Video" // Category for filtering
  },
  {
    type: "video",
    videoUrl: "/src/assets/portfolio/video/j-bday.mp4",
    thumbnail: "/src/assets/portfolio/video/2.webp",
    title: "Joesan's Birthday Highlights",
    category: "Video"
  },
  {
    type: "video",
    videoUrl: "/src/assets/portfolio/video/ks.mp4",
    thumbnail: "/src/assets/portfolio/video/3.webp",
    title: "Keight and Shaira's Photo Highlights",
    category: "Video"
  },
];

function Portfolio() {
  // State to track which category is currently selected (defaults to Wedding)
  const [category, setCategory] = useState("Wedding");
  
  // References to the category button DOM elements for measuring their position
  const categoryRefs = useRef({});
  
  // State to track the position of the sliding indicator element
  const [indicator, setIndicator] = useState({ width: 0, left: 0 });

  // Filter the portfolio items to only show those matching the selected category
  const filteredItems = portfolioItems.filter((item) => item.category === category);

  // List of all available categories for the filter buttons
  const categories = [
    "Wedding",
    "Portrait", 
    "Pre-Birthday",
    "Pre-Nup",
    "Video",
    "Baptismal",
    "Occasion",
    "Sports",
  ];

  // Effect to update the indicator position when selected category changes
  useEffect(() => {
    const currentRef = categoryRefs.current[category]; // Get reference to selected category button
    if (currentRef) {
      // Get precise measurements of the button element
      const rect = currentRef.getBoundingClientRect();
      const parentRect = currentRef.parentElement.getBoundingClientRect();
      
      // Update indicator position to match the selected button
      setIndicator({
        width: rect.width, // Set width to match button width
        left: rect.left - parentRect.left, // Calculate position relative to parent
      });
    }
  }, [category]); // Re-run when category changes

  // Effect to handle window resize and recalculate indicator position
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

  // Helper function to render either a VideoCard or PortfolioCard based on item type
  const renderPortfolioItem = (item, index) => {
    if (item.type === "video") {
      // Render video item with VideoCard component
      return (
        <VideoCard
          key={index}
          videoUrl={item.videoUrl}
          thumbnail={item.thumbnail}
          category={item.category}
          title={item.title}
        />
      );
    }
    
    // Render image item with PortfolioCard component
    return <PortfolioCard key={index} {...item} />;
  };

  // Animation configuration for the container that holds all portfolio items
  const containerVariants = {
    hidden: { opacity: 0 }, // Start state - completely invisible
    visible: {
      opacity: 1, // End state - fully visible
      transition: {
        staggerChildren: 0.08 // Delay between each child animation (0.08 seconds)
      }
    }
  };

  // Animation configuration for individual portfolio item cards
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

  // Animation configuration for the title element
  const titleVariants = {
    hidden: { y: -30, opacity: 0 }, // Start state - above position and invisible
    visible: {
      y: 0, // End state - normal position
      opacity: 1, // End state - fully visible
      transition: { 
        type: "spring", // Spring physics for natural movement
        stiffness: 200, // Stiffness for animation speed
        damping: 20 // Damping to control bounce
      }
    }
  };

  return (
    <>
      {/* Site navigation header */}
      <Navbar />
      
      {/* Main section with fade-in animation */}
      <motion.section 
        className="py-20 bg-[#111827] min-h-screen" // Dark background with padding and min height
        initial={{ opacity: 0 }} // Start invisible
        animate={{ opacity: 1 }} // Fade in
        transition={{ duration: 0.5 }} // Over 0.5 seconds
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          {/* Title and description container with staggered animations */}
          <motion.div 
            className="text-center mb-6" // Center text with bottom margin
            initial="hidden" // Start with hidden state
            animate="visible" // Animate to visible state
            variants={containerVariants} // Use container animation configuration
          >
            {/* Page title with animation */}
            <motion.h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6" // Responsive text sizing
              variants={titleVariants} // Use title animation configuration
            >
              Our Portfolio
            </motion.h2>
            
            {/* Description text with typewriter effect */}
            <motion.div 
              className="max-w-xl mx-auto" // Width constraint with center alignment
              variants={itemVariants} // Use item animation configuration
            >
              <TypeWriterEffect
                textStyle={{
                  fontFamily: 'inherit',
                  color: '#9CA3AF', // Gray text color
                  fontWeight: 'normal',
                  fontSize: '1rem',
                  maxWidth: '100%',
                  textAlign: 'center',
                }}
                startDelay={100} // Wait 100ms before starting
                cursorColor="#C084FC" // Purple cursor
                text="Browse our collection of photography and videography projects. Filter by category to find specific work."
                typeSpeed={40} // Characters per second
              />
            </motion.div>
          </motion.div>

          {/* Category selector with animated sliding indicator */}
          <div className="flex justify-center mb-10">
            <div className="relative inline-flex bg-gray-800 rounded-lg shadow-lg p-1">
              {/* Animated purple background that slides under the selected category */}
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
              
              {/* Container for category buttons */}
              <div className="flex flex-wrap justify-center gap-1 relative z-10">
                {/* Map through categories array to create filter buttons */}
                {categories.map((cat) => (
                  <button
                    key={cat} // React key using category name
                    ref={el => categoryRefs.current[cat] = el} // Store reference to button element
                    onClick={() => setCategory(cat)} // Handle category selection
                    className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md
                      ${category === cat ? "text-white" : "text-gray-300 hover:text-white"}`} // Highlight selected tab
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Portfolio items grid with animated transitions between categories */}
          <AnimatePresence mode="wait"> {/* Handle animations when switching categories */}
            <motion.div 
              key={category} // React key to trigger re-render on category change
              className="grid grid-cols-1 mx-16 md:mx-4 lg:mx-20 sm:grid-cols-2 md:grid-cols-3 gap-6" // Responsive grid layout
              variants={containerVariants} // Use container animation configuration
              initial="hidden" // Start with hidden state
              animate="visible" // Animate to visible state
              exit={{ opacity: 0 }} // Fade out when component is removed
            >
              {/* Map through filtered items to create portfolio cards */}
              {filteredItems.map((item, index) => (
                <motion.div key={index} variants={itemVariants}> {/* Animation wrapper for each item */}
                  {renderPortfolioItem(item, index)} {/* Render appropriate card component (image or video) */}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.section>
      
      {/* Site footer */}
      <FooterComp />
    </>
  );
}

export default Portfolio; // Export the component for use in routing