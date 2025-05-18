/**
 * Contact Page Component
 * 
 * This component renders the Contact page for the LaVisual photography/videography business.
 * It provides visitors with multiple ways to get in touch with the business, displays essential
 * contact information, and answers common questions through an FAQ section.
 * 
 * Key features:
 * - Interactive contact form for direct customer inquiries
 * - Business contact details (location, phone, email, hours)
 * - Embedded Google Maps location
 * - Frequently Asked Questions section
 * - Engaging animations using Framer Motion for a polished user experience
 * - Typewriter effect for dynamic text presentation
 * - Responsive design that adapts to mobile, tablet, and desktop viewports
 * 
 * This page serves as a crucial conversion point for potential clients to reach out
 * about booking photography and videography services.
 */

import React from "react"; // Core React library
import Navbar from "../../components/common/Navbar"; // Site navigation header
import Footer from "../../components/common/FooterComp"; // Site footer
import Contactform from "../../components/forms/Contactform"; // Form component for customer inquiries
import FAQcard from "../../components/common/FAQcard"; // Component to display FAQ items
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Icon component
import { faPhone, faLocationDot, faEnvelope, faClock } from "@fortawesome/free-solid-svg-icons"; // Specific icons used
import { motion } from "framer-motion"; // Animation library
import TypeWriterEffect from 'react-typewriter-effect'; // Component for typing animation

function Contact() {
  // Animation variant for elements that fade in from slightly below their position
  const fadeIn = {
    hidden: { opacity: 0, y: 20 }, // Start invisible and 20px down
    visible: { 
      opacity: 1, // Fade to full opacity
      y: 0, // Move to normal position
      transition: { duration: 0.6 } // Over 0.6 seconds
    }
  };

  // Animation variant for container elements with children that appear one after another
  const staggerContainer = {
    hidden: { opacity: 0 }, // Container starts invisible
    visible: {
      opacity: 1, // Container becomes visible
      transition: {
        staggerChildren: 0.1, // Delay between each child animation
        delayChildren: 0.3 // Initial delay before first child appears
      }
    }
  };

  // Animation variant for contact information items that enter from left side
  const contactItemAnimation = {
    hidden: { opacity: 0, x: -20 }, // Start invisible and 20px left
    visible: { 
      opacity: 1, // Fade to full opacity
      x: 0, // Move to normal position
      transition: {
        type: "spring", // Spring physics animation
        stiffness: 100, // Spring stiffness (less bouncy)
        damping: 10 // Spring damping
      }
    }
  };

  // Animation variant for elements that scale up while appearing
  const popIn = {
    hidden: { scale: 0.8, opacity: 0 }, // Start smaller and invisible
    visible: { 
      scale: 1, // Grow to full size
      opacity: 1, // Fade to full opacity
      transition: {
        type: "spring", // Spring physics animation
        stiffness: 300, // Higher stiffness (more snappy)
        damping: 15 // Spring damping
      }
    }
  };

  return (
    <>
      {/* Header navigation */}
      <Navbar />
      
      {/* Main content container with fade in animation */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20" // Responsive padding and maximum width
        initial="hidden" // Start with hidden state
        animate="visible" // Animate to visible state
        variants={fadeIn} // Use fade in animation
      >
        {/* Header section with title and description */}
        <motion.div 
          className="text-center mb-12 sm:mb-16 lg:mb-20" // Centered with bottom margin
          variants={popIn} // Use pop in animation
        >
          {/* Page title with custom animation */}
          <motion.h1 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6" // Responsive text size
            initial={{ opacity: 0, y: -50 }} // Start invisible and from above
            animate={{ opacity: 1, y: 0 }} // Animate to visible at normal position
            transition={{ 
              type: "spring", // Spring physics animation
              stiffness: 200, // Spring stiffness
              damping: 10, // Spring damping (bouncy)
              delay: 0.2 // Wait 0.2 seconds before starting
            }}
          >
            Contact Us
          </motion.h1>
          
          {/* Typewriter effect subheading */}
          <div className="mx-auto max-w-2xl">
            <TypeWriterEffect
              textStyle={{
                fontFamily: 'inherit', // Use site's default font
                color: '#9CA3AF', // Gray text
                fontWeight: 'normal',
                fontSize: '1.125rem',
                textAlign: 'center',
              }}
              startDelay={800} // Wait 800ms before starting typing
              cursorColor="#C084FC" // Purple cursor
              text="Have a question or ready to book? Reach out to us and we'll get back to you as soon as possible."
              typeSpeed={50} // Typing speed (characters per second)
            />
          </div>
        </motion.div>

        {/* Main content grid - contact details on left, form on right on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16 sm:mb-20">
          {/* Left column - contact information and map */}
          <motion.div 
            className="space-y-6 sm:space-y-8" // Vertical spacing between items
            variants={staggerContainer} // Use staggered animation for children
            initial="hidden" // Start with hidden state
            animate="visible" // Animate to visible state
          >
            {/* Section title */}
            <motion.h3 
              className="text-xl sm:text-2xl font-semibold text-white mb-6 sm:mb-8"
              variants={contactItemAnimation} // Use contact item animation
            >
              Get In Touch
            </motion.h3>
            
            {/* Location contact item */}
            <motion.div 
              className="flex items-center space-x-4" // Horizontal layout with spacing
              variants={contactItemAnimation} // Use contact item animation
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }} // Subtle grow effect on hover
            >
              {/* Purple circular icon container */}
              <div className="bg-[#a955f722] p-3 rounded-full transform transition-all duration-300 hover:scale-110 hover:bg-[#a955f733]">
                <FontAwesomeIcon icon={faLocationDot} className="h-5 w-5 sm:h-6 sm:w-6 text-[#C084FC]" />
              </div>
              {/* Text content */}
              <div>
                <h5 className="text-white font-medium">Our Location</h5>
                <p className="text-gray-400">San Jose, Paombong, Bulacan, Philippines</p>
              </div>
            </motion.div>

            {/* Phone contact item */}
            <motion.div 
              className="flex items-center space-x-4"
              variants={contactItemAnimation} // Use contact item animation
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }} // Subtle grow effect on hover
            >
              {/* Purple circular icon container */}
              <div className="bg-[#a955f722] p-3 rounded-full transform transition-all duration-300 hover:scale-110 hover:bg-[#a955f733]">
                <FontAwesomeIcon icon={faPhone} className="h-5 w-5 sm:h-6 sm:w-6 text-[#C084FC]" />
              </div>
              {/* Text content */}
              <div>
                <h5 className="text-white font-medium">Phone</h5>
                <p className="text-gray-400">(+63) 926-0515-815</p>
              </div>
            </motion.div>

            {/* Email contact item */}
            <motion.div 
              className="flex items-center space-x-4"
              variants={contactItemAnimation} // Use contact item animation
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }} // Subtle grow effect on hover
            >
              {/* Purple circular icon container */}
              <div className="bg-[#a955f722] p-3 rounded-full transform transition-all duration-300 hover:scale-110 hover:bg-[#a955f733]">
                <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 sm:h-6 sm:w-6 text-[#C084FC]" />
              </div>
              {/* Text content */}
              <div>
                <h5 className="text-white font-medium">Email</h5>
                <p className="text-gray-400">lavisualmedia@gmail.com</p>
              </div>
            </motion.div>

            {/* Business hours contact item */}
            <motion.div 
              className="flex items-center space-x-4"
              variants={contactItemAnimation} // Use contact item animation
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }} // Subtle grow effect on hover
            >
              {/* Purple circular icon container */}
              <div className="bg-[#a955f722] p-3 rounded-full transform transition-all duration-300 hover:scale-110 hover:bg-[#a955f733]">
                <FontAwesomeIcon icon={faClock} className="h-5 w-5 sm:h-6 sm:w-6 text-[#C084FC]" />
              </div>
              {/* Text content */}
              <div>
                <h5 className="text-white font-medium">Business Hours</h5>
                <p className="text-gray-400">Weekdays: 9am - 9pm</p>
                <p className="text-gray-400">Weekends: 7am - 10pm</p>
              </div>
            </motion.div>

            {/* Google Maps embed */}
            <motion.div 
              className="rounded-lg overflow-hidden mt-8 w-full h-[200px] sm:h-[250px] bg-gray-800 shadow-lg" // Map container styling
              variants={fadeIn} // Use fade in animation
              whileHover={{ scale: 1.01, transition: { duration: 0.3 } }} // Subtle grow effect on hover
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6823.980363313562!2d120.78751444563821!3d14.808826089789523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x339651fde8c3e3e1%3A0xcb6b1aee43298929!2sSan%20Jose%2C%20Bulacan!5e0!3m2!1sen!2sph!4v1744600704411!5m2!1sen!2sph"
                className="w-full h-full border-0" // Full width and height
                allowFullScreen="" // Allow fullscreen view
                loading="lazy" // Lazy load iframe for performance
                referrerPolicy="no-referrer-when-downgrade" // Security policy
                title="Google Maps Location" // Accessibility title
              />
            </motion.div>
          </motion.div>

          {/* Right column - contact form */}
          <motion.div 
            className="bg-gray-800 rounded-lg p-6 sm:p-8 shadow-lg" // Card styling for form
            initial={{ opacity: 0, x: 50 }} // Start invisible and from right
            animate={{ opacity: 1, x: 0 }} // Animate to visible at normal position
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }} // Smooth entry with delay
            whileHover={{ boxShadow: "0 0 25px rgba(168, 85, 247, 0.15)" }} // Glow effect on hover
          >
            {/* Contact form component */}
            <Contactform />
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div 
          className="mt-16 sm:mt-20" // Top margin for section spacing
          initial={{ opacity: 0, y: 30 }} // Start invisible and from below
          animate={{ opacity: 1, y: 0 }} // Animate to visible at normal position
          transition={{ duration: 0.8, delay: 0.6 }} // Smooth entry with delay
        >
          {/* FAQ section title */}
          <motion.h3 
            className="text-xl sm:text-2xl font-semibold text-white text-center mb-8 sm:mb-12"
            initial={{ opacity: 0 }} // Start invisible
            animate={{ opacity: 1 }} // Animate to visible
            transition={{ duration: 0.6, delay: 0.8 }} // Fade in with delay
          >
            Frequently Asked Questions
          </motion.h3>
          
          {/* FAQ grid - 1 column on mobile, 2 columns on desktop */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
            variants={staggerContainer} // Use staggered animation for children
            initial="hidden" // Start with hidden state
            animate="visible" // Animate to visible state
          >
            {/* FAQ 1 - Booking timeline */}
            <motion.div 
              variants={fadeIn} // Use fade in animation
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }} // Subtle grow effect on hover
            >
              <FAQcard 
                heading="How far in advance should I book?"
                description="For weddings and major events, we recommend booking at least 6-12 months in advance. For portrait sessions and smaller events, 2-4 weeks notice is usually sufficient, depending on our availability."
              />
            </motion.div>
            
            {/* FAQ 2 - Cancellation policy */}
            <motion.div 
              variants={fadeIn} // Use fade in animation
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }} // Subtle grow effect on hover
            >
              <FAQcard 
                heading="What is your cancellation policy?"
                description="Deposits are non-refundable, but we do offer rescheduling options with adequate notice. Full cancellations made within 30 days of the event may be subject to additional fees."
              />
            </motion.div>
            
            {/* FAQ 3 - Delivery timeline */}
            <motion.div 
              variants={fadeIn} // Use fade in animation
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }} // Subtle grow effect on hover
            >
              <FAQcard 
                heading="How long until I receive my photos/videos?"
                description="Typically, portrait sessions are delivered within 1-2 weeks. Weddings and larger events take 4-6 weeks. Rush delivery is available for an additional fee."
              />
            </motion.div>
            
            {/* FAQ 4 - Travel policy */}
            <motion.div 
              variants={fadeIn} // Use fade in animation
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }} // Subtle grow effect on hover
            >
              <FAQcard 
                heading="Do you travel for photoshoots?"
                description="Yes, we are available for travel both domestically and internationally. Travel fees may apply depending on the location."
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Footer */}
      <Footer />
    </>
  );
}

export default Contact; // Export the component for use in routing