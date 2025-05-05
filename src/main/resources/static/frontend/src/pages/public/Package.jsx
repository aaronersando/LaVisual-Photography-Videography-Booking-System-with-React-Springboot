import React, { useState, useRef, useEffect } from "react";
import Navbar from "../../components/common/Navbar";
import FooterComp from "../../components/common/FooterComp";
import PackageCard from "../../components/home/PackageCard";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TypeWriterEffect from 'react-typewriter-effect';

function Package() {
  const [category, setCategory] = useState("Photography");
  const categoryRefs = useRef({});
  const [indicator, setIndicator] = useState({ width: 0, left: 0 });
  
  const description = "Choose from our carefully crafted packages or contact us for custom solutions tailored to your specific needs.";
  
  // Update indicator position when category changes
  useEffect(() => {
    const currentRef = categoryRefs.current[category];
    if (currentRef) {
      const rect = currentRef.getBoundingClientRect();
      const parentRect = currentRef.parentElement.getBoundingClientRect();
      
      setIndicator({
        width: rect.width,
        left: rect.left - parentRect.left,
      });
    }
  }, [category]);

  // Handle window resize to update indicator
  useEffect(() => {
    const handleResize = () => {
      const currentRef = categoryRefs.current[category];
      if (currentRef) {
        const rect = currentRef.getBoundingClientRect();
        const parentRect = currentRef.parentElement.getBoundingClientRect();
        
        setIndicator({
          width: rect.width,
          left: rect.left - parentRect.left,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [category]);

  const packages = [
    // Photography
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

    // Videography
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

    // Combo Packages
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

  const filteredPackages = packages.filter((pkg) => pkg.category === category);

  // Staggered animation for cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      }
    }
  };

  return (
    <>
      <Navbar />
      <motion.section 
        className="py-12 sm:py-16 lg:py-20 bg-[#111827] min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-7xl">
          <motion.div 
            className="text-center mb-2 sm:mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
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
                  startDelay={100}
                  cursorColor="#C084FC"
                  multiText={[description]}
                  multiTextDelay={1000}
                  typeSpeed={30}
                  multiTextLoop={false}
                />
              </div>
            </div>
          </motion.div>

          {/* Category Selector with Slider */}
          <div className="mb-8 sm:mb-12">
            <div className="flex justify-center">
              <div className="relative inline-flex bg-gray-800 rounded-lg shadow-lg p-1">
                {/* Sliding Indicator */}
                <motion.div 
                  className="absolute bg-purple-600 rounded-md z-0"
                  initial={false}
                  animate={{
                    width: indicator.width,
                    left: indicator.left,
                    height: "calc(100% - 8px)",
                    top: 4
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    duration: 0.4,
                  }}
                />

                {/* Category Buttons */}
                {["Photography", "Videography", "Photo + Video"].map((cat) => (
                  <button
                    key={cat}
                    ref={el => categoryRefs.current[cat] = el}
                    onClick={() => setCategory(cat)}
                    className={`relative z-10 px-4 sm:px-6 py-2 text-sm font-medium transition-colors duration-200 rounded-md
                      ${category === cat ? "text-white" : "text-gray-300 hover:text-white"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Packages Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={category}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredPackages.map((pkg, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <PackageCard {...pkg} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Custom Package Section */}
          <motion.div 
            className="mt-16 sm:mt-20 bg-gray-800 rounded-xl px-6 py-8 sm:py-12 text-center mx-auto max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">
              Need a Custom Package?
            </h3>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto text-sm sm:text-base">
              Don't see what you're looking for? We offer custom packages tailored to your specific needs and budget.
            </p>
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block rounded-md bg-[#9333EA] px-6 py-3 text-sm font-medium text-white hover:bg-purple-700 transition-all duration-300"
              >
                Contact Us for Custom Quote
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.section>
      <FooterComp />
    </>
  );
}

export default Package;