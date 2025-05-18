/**
 * About Page Component
 * 
 * This component renders the About page for the LaVisual photography/videography business website.
 * It provides information about the company's story, values, team members, and a call-to-action
 * section that encourages visitors to get in touch or view the portfolio.
 * 
 * Key features:
 * - Engaging animations using Framer Motion for scroll-triggered reveals and hover effects
 * - Responsive design that adapts to mobile, tablet, and desktop viewports
 * - Typewriter effect for dynamic text presentation in the header
 * - Team member profiles with photos and descriptions
 * - Core values presentation with custom icons
 * - Call-to-action buttons for conversion
 * 
 * This page helps establish credibility and connection with potential clients by sharing
 * the company's background, values, and introducing the team of photographers and videographers.
 */

// Import main dependencies for frontend
import React from 'react'; // Core React library
import TypeWriterEffect from 'react-typewriter-effect'; // For typing animation effect
import { Link } from 'react-router-dom'; // For navigation links to other pages
import { AnimatePresence, motion } from 'framer-motion'; // For animations and transitions

// Import minor components needed
import Navbar from '../../components/common/Navbar'; // Site navigation header
import FooterComp from '../../components/common/FooterComp'; // Site footer

// Fontawesome Icons for the values section
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Icon component
import { faCamera, faUsers, faAward, faVideo } from '@fortawesome/free-solid-svg-icons'; // Specific icons used

// Import pictures for the freelancer team
import tine from '../../assets/about/tine.webp'; // Lead Photographer
import teo from '../../assets/about/teo.webp'; // Portrait Specialist
import nick from '../../assets/about/nick.webp'; // Senior Videographer
import clint from '../../assets/about/clint.webp'; // Event Photographer
import nald from '../../assets/about/nald.webp'; // Event Photographer
import lei from '../../assets/about/lei.webp'; // Image for Our Story section


function About() {

  // Variables for custom animations variants for framer motion for elements on how they appear on the page
  
  // Fade in animation definition - elements start invisible and slightly below position, then fade in while moving up
  const fadeIn = { /* subtle animation moving up 20px */
    hidden: { opacity: 0, y: 20 }, // Initial hidden state
    visible: { 
      opacity: 1, // Fade to full opacity
      y: 0, // Move to correct position
      transition: { duration: 0.6 } // Over 0.6 seconds
    }
  };

  // Fade in left animation - elements enter from the left side of their final position
  const fadeInLeft = { /* fade in slowly from 50px left to natural position */
    hidden: { opacity: 0, x: -50 }, // Start invisible and 50px to the left
    visible: { 
      opacity: 1, // Fade to full opacity
      x: 0, // Move to correct position
      transition: { 
        type: "spring", // Use spring physics animation
        stiffness: 100, // Spring stiffness
        damping: 12 // Spring bounce/damping
      }
    }
  };

  // Fade in right animation - elements enter from the right side of their final position
  const fadeInRight = { /* fade in slowly from 50px right to natural position */
    hidden: { opacity: 0, x: 50 }, // Start invisible and 50px to the right
    visible: { 
      opacity: 1, // Fade to full opacity
      x: 0, // Move to correct position
      transition: { 
        type: "spring", // Use spring physics animation
        stiffness: 100, // Spring stiffness
        damping: 12 // Spring bounce/damping
      }
    }
  };

  // Parent Container Stagger Animation - staggers the animations of its children
  const staggerContainer = {
    hidden: { opacity: 0 }, // Container starts invisible
    visible: {
      opacity: 1, // Container becomes fully visible
      transition: {
        staggerChildren: 0.1, // Delay between each child animation (in seconds)
        delayChildren: 0.2 // Initial delay before starting child animations
      }
    }
  };

  // Stiffer spring effect animation for slightly bouncy animation - used for individual items
  const itemVariant = {
    hidden: { opacity: 0, y: 20 }, // Start invisible and 20px down
    visible: { 
      opacity: 1, // Fade to full opacity
      y: 0, // Move to correct position
      transition: { 
        type: "spring", // Use spring physics animation
        stiffness: 200, // Higher stiffness than fadeInLeft/Right
        damping: 20 // Higher damping for less bounce
      }
    }
  };

  return (
    <>
      {/* Navigation bar at the top of the page */}
      <Navbar/>
      
      {/* AnimatePresence enables exit animations and helps manage component mounting/unmounting */}
      <AnimatePresence>
        {/* Main page container with a fade-in animation */}
        <motion.div /* main container with fading animation */
          className="min-h-screen bg-gray-900 text-gray-400 pt-16 pb-20" // Dark background with padding
          initial={{ opacity: 0 }} // Start invisible
          animate={{ opacity: 1 }} // Animate to fully visible
          transition={{ duration: 0.5}} // Over 0.5 seconds
          exit={{once: true}} // Only animate exit once
        > 
          {/* Content container with responsive padding and max width */}
          <div className="container mx-auto px-4 sm:px-6 md:px-[30px] max-w-7xl">
            {/* Header section with title and typewriter effect */}
            <motion.div /* Container for top part title and typewriter */
              className="text-center mb-16 md:mb-20" // Center text with bottom margin
              initial="hidden" // Start with hidden state
              animate="visible" // Animate to visible state
              variants={fadeIn} // Use the fadeIn animation variant
            >
              {/* Page title with its own animation */}
              <motion.h1  /* Page Title Fade animation */
                className="text-3xl md:text-4xl font-bold mb-4 text-white" // Large bold white text
                initial={{ opacity: 0, y: -30 }} // Start invisible and above position
                animate={{ opacity: 1, y: 0 }} // Animate to visible at correct position
                transition={{ 
                  type: "spring", // Spring animation
                  stiffness: 200, // Spring stiffness
                  damping: 15, // Amount of bounce
                  delay: 0.2 // Delay start by 0.2 seconds
                }}
              > 
                About LaVisual
              </motion.h1>
              {/* Container for typewriter effect */}
              <div className="max-w-2xl mx-auto px-2">
                <TypeWriterEffect /* TypeWriter Effect for the text description */
                  textStyle={{
                    fontFamily: 'inherit', // Use the same font as the rest of the page
                    color: '#9CA3AF', // Gray text color
                    fontWeight: 'normal',
                    fontSize: '1rem',
                    textAlign: 'center',
                  }}
                  startDelay={400} // Wait 400ms before starting
                  cursorColor="#C084FC" // Purple cursor
                  text="A passionate team of photographers and videographers dedicated to capturing your special moments with creativity and professionalism."
                  typeSpeed={30} // Typing speed (characters per second)
                />
              </div>
            </motion.div>

            {/* Team Story Section - appears when scrolled into view */}
            <motion.section 
              className="relative mb-20 md:mb-40" // Bottom margin
              initial="hidden" // Start hidden
              whileInView="visible" // Animate to visible when in viewport
              viewport={{ once: true }} // Only animate once when scrolled into view
              variants={staggerContainer} // Use staggered animation for children
            >
              {/* Flex container that changes to columns on mobile */}
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                {/* Text content column with left-fade animation */}
                <motion.div 
                  className="w-full md:w-1/2 text-gray-400 mb-8 md:mb-0 px-2" // 50% width on desktop
                  variants={fadeInLeft} // Enter from left animation
                >
                  <h2 className="text-2xl font-bold text-white text-center md:text-left mb-6">Our Story</h2>
                  <p className="mb-4">
                    Founded in 2023, LaVisual began as a freelance creatives with a big vision.
                    To create stunning visual content that tells powerful stories and preserves precious memories.
                  </p>
                  <p className="mb-4">
                    Over the years, we've grown into a full-service photography and videography
                    company, working with clients across the country. Our team has expanded to
                    include specialists in various photography and videography niches, allowing
                    us to offer comprehensive services for any occasion.
                  </p>
                  <p>
                    What sets us apart is our commitment to personalized service and artistic excellence.
                    We believe that every client deserves a unique approach tailored to their specific vision and needs.
                  </p>
                </motion.div>
                {/* Image container with right-fade animation */}
                <motion.div 
                  className="w-full md:w-1/2 h-[300px] md:h-[450px] bg-gray-700 rounded-lg overflow-hidden" // 50% width on desktop
                  variants={fadeInRight} // Enter from right animation
                  whileHover={{ scale: 1.02 }} // Slight grow effect on hover
                  transition={{ duration: 0.3 }} // Animation speed
                >
                  <img src={lei} alt="Lei" className="w-full h-full object-cover rounded-lg" />
                </motion.div>
              </div>
            </motion.section>

            {/* Values Section - core company values with icons */}
            <motion.section 
              className="text-center mb-20 md:mb-40" // Center content with bottom margin
              initial="hidden" // Start hidden
              whileInView="visible" // Animate when scrolled into view
              viewport={{ once: true }} // Only trigger animation once
              variants={staggerContainer} // Stagger the animation of child elements
            >
              {/* Section title */}
              <motion.h2 
                className="text-2xl font-bold text-white mb-8" // Bold white text with bottom margin
                variants={itemVariant} // Use item animation variant
              >
                Our Values
              </motion.h2>
              {/* Grid for values cards - responsive layout with 1, 2, or 4 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {/* First value card - Artistic */}
                <motion.div 
                  className="bg-gray-800 p-5 pt-8 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:bg-gray-700 flex flex-col items-center h-full"
                  variants={itemVariant} // Use item animation variant
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(168, 85, 247, 0.1)" }} // Lift up on hover
                >
                  {/* Purple circular icon container */}
                  <div className="w-12 h-12 bg-[#C084FC] rounded-full mb-4 flex justify-center items-center">
                    <FontAwesomeIcon icon={faCamera} className="text-[#9333EA] text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Artistic</h3>
                  <p className="text-gray-400 text-center">We craft visuals that tell stories.</p>
                </motion.div>
                {/* Second value card - Client Focus */}
                <motion.div 
                  className="bg-gray-800 p-5 pt-8 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:bg-gray-700 flex flex-col items-center h-full"
                  variants={itemVariant} // Use item animation variant
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(168, 85, 247, 0.1)" }} // Lift up on hover
                >
                  <div className="w-12 h-12 bg-[#C084FC] rounded-full mb-4 flex justify-center items-center">
                    <FontAwesomeIcon icon={faUsers} className="text-[#9333EA] text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Client Focus</h3>
                  <p className="text-gray-400 text-center">Your vision, our mission.</p>
                </motion.div>
                {/* Third value card - Excellence */}
                <motion.div 
                  className="bg-gray-800 p-5 pt-8 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:bg-gray-700 flex flex-col items-center h-full"
                  variants={itemVariant} // Use item animation variant
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(168, 85, 247, 0.1)" }} // Lift up on hover
                >
                  <div className="w-12 h-12 bg-[#C084FC] rounded-full mb-4 flex justify-center items-center">
                    <FontAwesomeIcon icon={faAward} className="text-[#9333EA] text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Excellence</h3>
                  <p className="text-gray-400 text-center">Details matter, quality define us.</p>
                </motion.div>
                {/* Fourth value card - Innovation */}
                <motion.div 
                  className="bg-gray-800 p-5 pt-8 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:bg-gray-700 flex flex-col items-center h-full"
                  variants={itemVariant} // Use item animation variant
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(168, 85, 247, 0.1)" }} // Lift up on hover
                >
                  <div className="w-12 h-12 bg-[#C084FC] rounded-full mb-4 flex justify-center items-center">
                    <FontAwesomeIcon icon={faVideo} className="text-[#9333EA] text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Innovation</h3>
                  <p className="text-gray-400 text-center">Always evolving, always inspired.</p>
                </motion.div>
              </div>
            </motion.section>

            {/* Team Members Section - profiles of team members with photos */}
            <motion.section 
              className="text-center mb-16" // Center content with bottom margin
              initial="hidden" // Start hidden
              whileInView="visible" // Animate when scrolled into view
              viewport={{ once: true }} // Only trigger animation once
              variants={staggerContainer} // Stagger animation of children
            >
              {/* Section title */}
              <motion.h2 
                className="text-2xl font-bold text-white mb-8" // Bold white text with margin
                variants={itemVariant} // Use item animation variant
              >
                Meet our Team
              </motion.h2>
              
              {/* First row of team members - 3 columns on desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {/* Team member card - Tine */}
                <motion.div 
                  className="bg-gray-800 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:bg-gray-700 h-full"
                  variants={itemVariant} // Use item animation variant
                  whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(168, 85, 247, 0.1)" }} // Lift card on hover
                >
                  {/* Fixed aspect ratio container for image */}
                  <div className="w-full aspect-[295/255]">
                    <img src={tine} alt="Lead Photographer" className="w-full h-full object-cover rounded-t-lg" />
                  </div>
                  {/* Text content */}
                  <div className="p-4 text-left">
                    <h3 className="text-xl font-bold text-white">Tine De Leon</h3>
                    <p className="text-sm" style={{ color: '#C084FC' }}>Lead Photographer</p>
                    <p className="text-gray-400 mt-2">
                      Tine has over 10 years of experience capturing weddings, events, and portraits. His unique style combines
                      photojournalism with artistic composition.
                    </p>
                  </div>
                </motion.div>
                {/* Team member card - Nic */}
                <motion.div 
                  className="bg-gray-800 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:bg-gray-700 h-full"
                  variants={itemVariant} // Use item animation variant
                  whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(168, 85, 247, 0.1)" }} // Lift card on hover
                >
                  <div className="w-full aspect-[295/255]">
                    <img src={nick} alt="Senior Videographer" className="w-full h-full object-cover rounded-t-lg" />
                  </div>
                  <div className="p-4 text-left">
                    <h3 className="text-xl font-bold text-white">Nic Ople</h3>
                    <p className="text-sm" style={{ color: '#C084FC' }}>Senior Videographer</p>
                    <p className="text-gray-400 mt-2">
                      With a background in film production, Nic creates cinematic videos that tell compelling stories.
                      He specializes in wedding films and commercial projects.
                    </p>
                  </div>
                </motion.div>
                {/* Team member card - Teo */}
                <motion.div 
                  className="bg-gray-800 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:bg-gray-700 h-full"
                  variants={itemVariant} // Use item animation variant
                  whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(168, 85, 247, 0.1)" }} // Lift card on hover
                >
                  <div className="w-full aspect-[295/255]">
                    <img src={teo} alt="Portrait Specialist" className="w-full h-full object-cover rounded-t-lg" />
                  </div>
                  <div className="p-4 text-left">
                    <h3 className="text-xl font-bold text-white">Teo Espique</h3>
                    <p className="text-sm" style={{ color: '#C084FC' }}>Portrait Specialist</p>
                    <p className="text-gray-400 mt-2">
                      Teo has a gift for capturing personalities in his portrait work.
                      His relaxed approach puts subjects at ease, resulting in natural and authentic images.
                    </p>
                  </div>
                </motion.div>
              </div>
              
              {/* Second row of team members - 4 columns on desktop but with offset */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Team member card - Nald */}
                <motion.div 
                  className="lg:col-start-2 bg-gray-800 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:bg-gray-700 h-full"
                  variants={itemVariant} // Use item animation variant
                  whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(168, 85, 247, 0.1)" }} // Lift card on hover
                >
                  <div className="w-full aspect-[295/255]">
                    <img src={nald} alt="Event Photographer" className="w-full h-full object-cover rounded-t-lg" />
                  </div>
                  <div className="p-4 text-left">
                    <h3 className="text-xl font-bold text-white">Nald Magana</h3>
                    <p className="text-sm" style={{ color: '#C084FC' }}>Event Photographer</p>
                    <p className="text-gray-400 mt-2">
                      Nald excels at capturing the energy and emotion of events. From corporate gatherings to music festivals, he
                      documents all the key moments.
                    </p>
                  </div>
                </motion.div>
                {/* Team member card - Clint */}
                <motion.div 
                  className="bg-gray-800 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:bg-gray-700 h-full"
                  variants={itemVariant} // Use item animation variant
                  whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(168, 85, 247, 0.1)" }} // Lift card on hover
                >
                  <div className="w-full aspect-[295/255]">
                    <img src={clint} alt="Event Photographer" className="w-full h-full object-cover rounded-t-lg" />
                  </div>
                  <div className="p-4 text-left">
                    <h3 className="text-xl font-bold text-white">Clint Salvador</h3>
                    <p className="text-sm" style={{ color: '#C084FC' }}>Event Photographer</p>
                    <p className="text-gray-400 mt-2">
                      Clint thrives on capturing the atmosphere and emotions on live events, ensuring no memory
                      goes unnoticed.
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.section>

            {/* Contact Us Section - call-to-action at bottom of page */}
            <motion.section 
              className="text-center mt-20 mb-10" // Centered with margins
              initial="hidden" // Start hidden
              whileInView="visible" // Animate when scrolled into view
              viewport={{ once: true }} // Only animate once
              variants={fadeIn} // Use fade in animation
            >
              {/* Text content container */}
              <motion.div 
                className="max-w-2xl mx-auto mb-8" // Constrained width and centered
                variants={itemVariant} // Use item animation variant
              >
                <h2 className="text-2xl font-bold text-white mb-4">Ready to Work with Us?</h2>
                <p className="text-gray-400 px-4">
                  Let's create something beautiful together. Contact us to discuss your project or book a session.
                </p>
              </motion.div>
              {/* Button container - flex column on mobile, row on desktop */}
              <motion.div 
                className="flex flex-col sm:flex-row justify-center gap-4 px-4" // Stack buttons on mobile, side by side on desktop
                variants={itemVariant} // Use item animation variant
              >
                {/* Contact Us button with link */}
                <Link to={'/contact'} className="w-full sm:w-auto">
                  <motion.button 
                    className="bg-[#9333EA] text-white w-full sm:w-[125px] h-[50px] rounded-[6px] hover:bg-purple-700 transition"
                    whileHover={{ scale: 1.05 }} // Grow on hover
                    whileTap={{ scale: 0.95 }} // Shrink when clicked
                    transition={{ 
                      type: "spring", // Spring physics
                      stiffness: 400, // Spring stiffness
                      damping: 17 // Spring bounce amount
                    }}
                  >
                    Contact Us
                  </motion.button>
                </Link>
                {/* View Portfolio button with link */}
                <Link to={'/portfolio'} className="w-full sm:w-auto">
                  <motion.button 
                    className="bg-transparent text-white w-full sm:w-[155px] h-[50px] rounded-[6px] border border-white hover:bg-gray-700 transition"
                    whileHover={{ scale: 1.05 }} // Grow on hover
                    whileTap={{ scale: 0.95 }} // Shrink when clicked
                    transition={{ 
                      type: "spring", // Spring physics
                      stiffness: 400, // Spring stiffness
                      damping: 17 // Spring bounce amount
                    }}
                  >
                    View Our Work
                  </motion.button>
                </Link>
              </motion.div>
            </motion.section>
          </div>
        </motion.div>
      </AnimatePresence>
      {/* Page footer */}
      <FooterComp/>
    </>
  );
}

// Export the component for use in the application
export default About;