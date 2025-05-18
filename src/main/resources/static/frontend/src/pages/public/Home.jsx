/**
 * Home Page Component
 * 
 * This is the main homepage component for the LaVisual photography/videography business website.
 * It serves as the landing page and showcases various aspects of the business through several sections:
 * 
 * 1. Hero Section - Main banner with call-to-action buttons
 * 2. Services Section - Overview of available services with icons
 * 3. Portfolio Section - Gallery of photography/videography work samples
 * 4. Packages Section - Pricing and details for different service packages
 * 5. CTA Section - Final call-to-action with booking and contact buttons
 * 
 * Key features:
 * - Scroll-triggered animations using Framer Motion
 * - Responsive design for mobile, tablet, and desktop
 * - Interactive parallax effects
 * - Animated section transitions
 * 
 * The animations are designed to create an engaging, professional experience that
 * highlights the visual nature of the photography/videography business.
 */

// Import main layout components
import Navbar from "../../components/common/Navbar"; // Site navigation header
import Footer from "../../components/common/FooterComp"; // Site footer
import HeroSection from "../../components/home/HeroSection"; // Hero banner component

// Import card components for different sections
import ServiceCard from "../../components/home/ServiceCard"; // Cards for service offerings
import PortfolioCard from "../../components/home/PortfolioCard"; // Cards for portfolio items
import PackageCard from "../../components/home/PackageCard"; // Cards for service packages

// Import routing and animation utilities
import { Link } from 'react-router-dom'; // For navigation between pages
import { motion, useScroll, useTransform, useInView } from "framer-motion"; // Animation library
import AnimatedButton from "../../components/common/AnimatedButton"; // Custom animated button component
import { useRef, useEffect } from "react"; // React hooks for references and side effects

function Home() {
  // Create refs for each section to track when they're visible in the viewport
  const servicesRef = useRef(null);
  const portfolioRef = useRef(null);
  const packagesRef = useRef(null);
  const ctaRef = useRef(null);
  
  // Set up intersection observers to detect when each section scrolls into view
  // amount: 0.2 means the animation triggers when 20% of the section is visible
  // once: false allows the animation to trigger again if the element leaves and re-enters the viewport
  const servicesInView = useInView(servicesRef, { once: false, amount: 0.2 });
  const portfolioInView = useInView(portfolioRef, { once: false, amount: 0.2 });
  const packagesInView = useInView(packagesRef, { once: false, amount: 0.2 });
  const ctaInView = useInView(ctaRef, { once: false, amount: 0.3 });

  // SERVICE SECTION ANIMATIONS
  // Define animation for the entire services section container
  const servicesSectionVariants = {
    hidden: { opacity: 0 }, // Start completely invisible
    visible: { 
      opacity: 1, // Fade in to fully visible
      transition: { 
        when: "beforeChildren", // Animate the container before children
        staggerChildren: 0.2, // Delay between each child animation (in seconds)
        duration: 0.3 // Animation duration
      }
    }
  };
  
  // Animation for the services section title
  const servicesTitleVariants = {
    hidden: { opacity: 0, y: -30 }, // Start invisible and 30px above normal position
    visible: { 
      opacity: 1, // Fade in to fully visible
      y: 0, // Move to normal position
      transition: { 
        duration: 0.6, // Animation duration
        ease: [0.22, 1, 0.36, 1] // Custom easing function for smooth movement
      }
    }
  };
  
  // Animation for each service card
  const servicesCardVariants = {
    hidden: { opacity: 0, x: -50 }, // Start invisible and 50px to the left
    visible: index => ({ // Function that uses the index parameter to create staggered animations
      opacity: 1, // Fade in to fully visible
      x: 0, // Move to normal position
      transition: { 
        duration: 0.5, // Animation duration
        delay: index * 0.1, // Delay based on item index (first card starts sooner than last)
        type: "spring", // Spring physics for bouncy effect
        stiffness: 100, // Spring stiffness
        damping: 10 // Spring damping (lower = more bounce)
      }
    })
  };

  // PORTFOLIO SECTION ANIMATIONS
  // Define animation for the entire portfolio section container
  const portfolioSectionVariants = {
    hidden: { opacity: 0 }, // Start completely invisible
    visible: { 
      opacity: 1, // Fade in to fully visible
      transition: { 
        when: "beforeChildren", // Animate the container before children
        staggerChildren: 0.1, // Delay between each child animation (in seconds)
        duration: 0.5 // Animation duration
      }
    }
  };
  
  // Animation for the portfolio section title
  const portfolioTitleVariants = {
    hidden: { opacity: 0, scale: 0.8 }, // Start invisible and slightly smaller
    visible: { 
      opacity: 1, // Fade in to fully visible
      scale: 1, // Grow to normal size
      transition: { 
        duration: 0.7, // Animation duration
        ease: "easeOut" // Ease out for smooth finish
      }
    }
  };
  
  // Animation for each portfolio item card
  const portfolioItemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 30 }, // Start invisible, smaller, and 30px below
    visible: (index) => ({ // Function that uses the index parameter for staggered animations
      opacity: 1, // Fade in to fully visible
      scale: 1, // Grow to normal size
      y: 0, // Move to normal position
      transition: { 
        duration: 0.6, // Animation duration
        delay: index * 0.07, // Delay based on item index
        type: "spring", // Spring physics for bouncy effect
        damping: 20 // Spring damping (higher = less bounce)
      }
    })
  };

  // PACKAGES SECTION ANIMATIONS
  // Define animation for the entire packages section container
  const packagesSectionVariants = {
    hidden: { opacity: 0 }, // Start completely invisible
    visible: { 
      opacity: 1, // Fade in to fully visible
      transition: { 
        when: "beforeChildren", // Animate the container before children
        staggerChildren: 0.3 // Delay between each child animation (in seconds)
      }
    }
  };
  
  // Animation for the packages section title
  const packagesTitleVariants = {
    hidden: { opacity: 0, x: 100 }, // Start invisible and 100px to the right
    visible: { 
      opacity: 1, // Fade in to fully visible
      x: 0, // Move to normal position
      transition: { 
        duration: 0.6, // Animation duration
        type: "spring", // Spring physics for bouncy effect
        stiffness: 100 // Spring stiffness
      }
    }
  };
  
  // Animation for each package card with 3D rotation effect
  const packagesCardVariants = {
    hidden: { opacity: 0, rotateY: 30, z: -100 }, // Start invisible, rotated in 3D space
    visible: { 
      opacity: 1, // Fade in to fully visible
      rotateY: 0, // Reset rotation
      z: 0, // Reset depth
      transition: { 
        duration: 0.8, // Animation duration
        type: "spring", // Spring physics for bouncy effect
        damping: 15 // Spring damping (lower = more bounce)
      }
    }
  };

  // CTA SECTION ANIMATIONS
  // Define animation for the entire call-to-action section container
  const ctaSectionVariants = {
    hidden: { opacity: 0 }, // Start completely invisible
    visible: { 
      opacity: 1, // Fade in to fully visible
      transition: { 
        when: "beforeChildren", // Animate the container before children
        staggerChildren: 0.15 // Delay between each child animation (in seconds)
      }
    }
  };
  
  // Animation for CTA titles with clip path reveal
  const ctaTitleVariants = {
    hidden: { opacity: 0, clipPath: "inset(0 0 100% 0)" }, // Start with clip path hiding text
    visible: { 
      opacity: 1, // Fade in to fully visible
      clipPath: "inset(0 0 0% 0)", // Reveal text by adjusting clip path
      transition: { 
        duration: 1, // Animation duration
        ease: [0.22, 1, 0.36, 1] // Custom easing function for smooth reveal
      }
    }
  };
  
  // Animation for CTA buttons
  const ctaButtonVariants = {
    hidden: { opacity: 0, y: 50 }, // Start invisible and 50px below
    visible: { 
      opacity: 1, // Fade in to fully visible
      y: 0, // Move to normal position
      transition: { 
        duration: 0.6, // Animation duration
        type: "spring", // Spring physics for bouncy effect
        stiffness: 200, // Higher stiffness for snappier animation
        damping: 20 // Spring damping (higher = less bounce)
      }
    }
  };

  return (
    <>
      {/* Site header navigation */}
      <Navbar />
      
      <main className="overflow-hidden">
        {/* Hero section - main banner at top of page */}
        <HeroSection />

        {/* Services Section - Slide in from left with bounce */}
        <motion.section 
          ref={servicesRef} // Attach ref for intersection observer
          className="py-16 sm:py-20 bg-[#111827]" // Padding and dark background
          initial="hidden" // Start with hidden state
          animate={servicesInView ? "visible" : "hidden"} // Animate when in viewport
          variants={servicesSectionVariants} // Apply the animation variants
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full sm:w-11/12">
            {/* Services section heading */}
            <motion.div 
              className="text-center mb-8 sm:mb-12" // Center text with bottom margin
              variants={servicesTitleVariants} // Apply title animation variants
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">Our Services</h2>
              <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">We offer a wide range of professional photography and videography services to capture your special moments.</p>
            </motion.div>
            
            {/* Services cards grid - responsive layout with 1-4 columns depending on screen size */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 px-2 sm:px-6 lg:px-11">
              {/* Map through service data to create cards */}
              {[
                {
                  icon: <img src={"/src/assets/home/p.webp"} alt="Photography" className="w-12 h-12 sm:w-16 sm:h-16" />,
                  title: "Photography",
                  description: "Portfolio of exclusive photography for weddings, events, portraits and more."
                },
                {
                  icon: <img src={"/src/assets/home/v.webp"} alt="Videography" className="w-12 h-12 sm:w-16 sm:h-16" />,
                  title: "Videography",
                  description: "Cinematic videos for weddings, commercials, music videos, and events."
                },
                {
                  icon: <img src={"/src/assets/home/e.webp"} alt="Events" className="w-12 h-12 sm:w-16 sm:h-16" />,
                  title: "Events",
                  description: "Comprehensive coverage for corporate events, parties, and gatherings."
                },
                {
                  icon: <img src={"/src/assets/home/b.webp"} alt="Bookings" className="w-12 h-12 sm:w-16 sm:h-16" />,
                  title: "Bookings",
                  description: "Easy online booking system to schedule your photography sessions."
                }
              ].map((service, index) => (
                // Animated container for each service card
                <motion.div 
                  key={index} // React key for list items
                  custom={index} // Pass index to animation for staggered effect
                  variants={servicesCardVariants} // Apply card animation variants
                >
                  {/* Service card component with icon, title, and description */}
                  <ServiceCard
                    icon={service.icon}
                    title={service.title}
                    description={service.description}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Portfolio Section - Scale in with stagger */}
        <motion.section 
          ref={portfolioRef} // Attach ref for intersection observer
          className="py-16 sm:py-20 bg-black relative overflow-hidden perspective-1000" // Padding, black background, 3D perspective
          initial="hidden" // Start with hidden state
          animate={portfolioInView ? "visible" : "hidden"} // Animate when in viewport
          variants={portfolioSectionVariants} // Apply the animation variants
        >
          {/* Background component with parallax scrolling effect */}
          <PortfolioBackground />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full sm:w-11/12 relative z-10">
            {/* Portfolio section heading */}
            <motion.div 
              className="text-center mb-8 sm:mb-12" // Center text with bottom margin
              variants={portfolioTitleVariants} // Apply title animation variants
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">Our Portfolio</h2>
              <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">Browse through our collection of stunning photography and videography projects.</p>
            </motion.div>
            
            {/* Portfolio cards grid - responsive layout with 1-3 columns depending on screen size */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Map through portfolio data to create cards */}
              {[
                { image: "/src/assets/home/h_wedding.webp", category: "Wedding", title: "Dino & Jasmine's Wedding" },
                { image: "/src/assets/home/h_portrait.webp", category: "Portrait", title: "Ann's Portrait" },
                { image: "/src/assets/home/h_debut.webp", category: "18th-Birthday/Debut", title: "Kimberly's Pre-Debut" },
                { image: "/src/assets/home/h_prenup.webp", category: "Pre-Nuptial", title: "Keight's & Shaira Pre-Nuptial" },
                { image: "/src/assets/home/h_baptism.webp", category: "Baptismal", title: "Astrid's Baptism" },
                { image: "/src/assets/home/h_sports.webp", category: "Sports", title: "San Jose Basketball League" },
                { image: "/src/assets/home/h_occassion.webp", category: "Occasion", title: "Zeny's 60th Birthday" },
                { image: "/src/assets/home/h_videos.webp", category: "Videos", title: "Khay & Jha's SDE Video" }
              ].map((item, index) => (
                // Animated container for each portfolio card
                <motion.div 
                  key={index} // React key for list items
                  variants={portfolioItemVariants} // Apply card animation variants
                  custom={index} // Pass index to animation for staggered effect
                >
                  {/* Portfolio card component with image, category, and title */}
                  <PortfolioCard
                    key={index}
                    image={item.image}
                    category={item.category}
                    title={item.title}
                  />
                </motion.div>
              ))}

              {/* Special "View Full Portfolio" card with hover effects */}
              <motion.div 
                variants={portfolioItemVariants} // Apply card animation variants
                custom={8} // Last item in sequence (index 8)
                className="transform hover:scale-[1.03] transition-all duration-300" // Subtle grow effect on hover
              >
                <Link to="/portfolio" className="block relative group overflow-hidden rounded-lg">
                  {/* Base portfolio card */}
                  <PortfolioCard image="/src/assets/home/h_final.webp" />
                  {/* Overlay with call-to-action text */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/70 transition-all duration-500">
                    <div className="text-center px-4">
                      <h1 className="text-[#C084FC] text-xl sm:text-2xl font-extralight transform group-hover:scale-110 group-hover:text-2xl sm:group-hover:text-3xl transition-all duration-500 hover:animate-pulse">
                        View Full Portfolio
                        {/* Hidden text that appears on hover */}
                        <span className="block scale-0 group-hover:scale-100 transition-transform duration-500 text-sm sm:text-base mt-2">
                          Click to explore more →
                        </span>
                      </h1>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Packages Section - Rotate in 3D space */}
        <motion.section 
          ref={packagesRef} // Attach ref for intersection observer
          className="py-16 sm:py-20 bg-[#111827] perspective-1000" // Padding, dark background, 3D perspective
          initial="hidden" // Start with hidden state
          animate={packagesInView ? "visible" : "hidden"} // Animate when in viewport
          variants={packagesSectionVariants} // Apply the animation variants
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
            {/* Packages section heading */}
            <motion.div 
              className="text-center mb-8 sm:mb-12" // Center text with bottom margin
              variants={packagesTitleVariants} // Apply title animation variants
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">Our Packages</h2>
              <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
                Choose from our carefully crafted packages or contact us for custom solutions tailored to your specific needs.
              </p>
            </motion.div>

            {/* Packages cards grid - responsive layout with 1-3 columns depending on screen size */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
              {/* Photography package card */}
              <motion.div variants={packagesCardVariants} className="h-full">
                <PackageCard
                  category="Photography"
                  title="Intimate Session"
                  price="3,000"
                  description="Perfect for individuals wanting professional portraits."
                  features={[
                    '3-Hours Photography Session',
                    '1 Location',
                    '150 Digital Edited Photos',
                    'Online Gallery',
                    'Personal Use Rights',
                  ]}
                />
              </motion.div>

              {/* Videography package card */}
              <motion.div variants={packagesCardVariants} className="h-full">
                <PackageCard
                  category="Videography"
                  title="Event Highlight"
                  price="7,000"
                  description="Perfect for capturing highlights of your special event."
                  features={[
                    '4-Hours of Coverage',
                    'Edited Highlight Reel (3-5 Minutes)',
                    'Professional Audio',
                    'Digital Delivery',
                    'Background Music',
                  ]}
                />
              </motion.div>

              {/* Combined photo+video package card */}
              <motion.div variants={packagesCardVariants} className="h-full">
                <PackageCard
                  category="Photography + Videography"
                  title="Event Complete"
                  price="13,000"
                  description="Full Photo & Video Coverage For Your Special Event"
                  features={[
                    '8-Hours of Coverage',
                    '2 Photographers & 1 Videographer',
                    '400+ Edited Photos',
                    'Highlight Video (3-5 Minutes)',
                    'Online Gallery',
                    'Digital Delivery',
                  ]}
                />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section - Reveal clip path animation */}
        <motion.section 
          ref={ctaRef} // Attach ref for intersection observer
          className="py-16 sm:py-20 bg-gradient-to-b from-[#581C87] to-[#111827] relative overflow-hidden" // Padding with purple-to-dark gradient
          initial="hidden" // Start with hidden state
          animate={ctaInView ? "visible" : "hidden"} // Animate when in viewport
          variants={ctaSectionVariants} // Apply the animation variants
        >
          {/* Commented out floating particles effect */}
          {/* <EnhancedFloatingParticles /> */}
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            {/* CTA heading with reveal animation */}
            <motion.h2 
              variants={ctaTitleVariants} // Apply title animation variants
              className="text-2xl sm:text-3xl font-bold text-[#F3F4F6] mb-2 sm:mb-4" // Light text with responsive size
            >
              Ready to Capture Your Special Moments?
            </motion.h2>
            {/* CTA description with reveal animation */}
            <motion.p 
              variants={ctaTitleVariants} // Apply title animation variants
              className="text-[#D1D5DB] text-sm sm:text-base mb-6 sm:mb-8 max-w-xl mx-auto" // Light gray text with responsive size
            >
              Book your photography or videography session today and let us create lasting memories for you.
            </motion.p>
            {/* Buttons container with responsive layout (stack on mobile, side-by-side on larger screens) */}
            <motion.div 
              variants={ctaButtonVariants} // Apply button animation variants
              className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6"
            >
              {/* Book a Session button - links to booking page */}
              <Link to="/booking" className="w-full sm:w-auto">
                <AnimatedButton className="w-full sm:w-auto bg-purple-500 hover:bg-purple-700 text-white font-medium px-6 py-3 text-sm sm:text-base rounded-md">
                  Book a Session
                </AnimatedButton>
              </Link>
              
              {/* Contact Us button - links to contact page */}
              <Link to="/contact" className="w-full sm:w-auto">
                <motion.button 
                  className="relative group flex justify-center items-center w-full sm:w-auto border border-white text-white px-6 py-3 rounded-md hover:bg-white/10 transition-all duration-300 text-sm sm:text-base font-medium overflow-hidden"
                  whileHover={{ scale: 1.05 }} // Grow slightly on hover
                  whileTap={{ scale: 0.95 }} // Shrink slightly when clicked
                  transition={{ 
                    type: "spring", // Spring physics for bouncy effect
                    stiffness: 400, // Spring stiffness
                    damping: 17 // Spring damping
                  }}
                >
                  {/* Animated gradient line that slides across button on hover */}
                  <div className="h-[100px] top-[-20px] w-10 bg-gradient-to-r from-white/10 via-white/50 to-white/10 absolute -left-16 -rotate-28 blur-sm group-hover:left-[150%] duration-700 group-hover:delay-200" />
                  Contact Us
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </main>

      {/* Site footer */}
      <Footer />
    </>
  );
}

/**
 * Portfolio Background Component
 * 
 * This sub-component creates a subtle animated background for the portfolio section.
 * It uses Framer Motion's scroll-based animation to create a parallax effect where
 * the background moves at a different rate than the content as the user scrolls.
 */
function PortfolioBackground() {
  // Get scroll progress value (0-1) as user scrolls down the page
  const { scrollYProgress } = useScroll();
  
  // Transform scroll progress into movement and animation values
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]); // Move background down as user scrolls
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 5]); // Slightly rotate background as user scrolls
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1.1]); // Slightly scale background as user scrolls
  
  return (
    <motion.div 
      className="absolute inset-0 z-0 opacity-10" // Position behind content with low opacity
      style={{ y, rotateZ: rotate, scale }} // Apply scroll-based transformations
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-black" />
      {/* Grid pattern overlay */}
      <div className="w-full h-full bg-[url('/src/assets/home/grid-pattern.png')] bg-repeat opacity-30" />
    </motion.div>
  );
}


export default Home;