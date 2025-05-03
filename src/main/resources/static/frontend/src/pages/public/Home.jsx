import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/FooterComp";
import HeroSection from "../../components/home/HeroSection";
import ServiceCard from "../../components/home/ServiceCard";
import PortfolioCard from "../../components/home/PortfolioCard";
import PackageCard from "../../components/home/PackageCard";
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import AnimatedButton from "../../components/common/AnimatedButton";
import { useRef, useEffect } from "react";

function Home() {
  // Refs for each section
  const servicesRef = useRef(null);
  const portfolioRef = useRef(null);
  const packagesRef = useRef(null);
  const ctaRef = useRef(null);
  
  // In view states
  const servicesInView = useInView(servicesRef, { once: false, amount: 0.2 });
  const portfolioInView = useInView(portfolioRef, { once: false, amount: 0.2 });
  const packagesInView = useInView(packagesRef, { once: false, amount: 0.2 });
  const ctaInView = useInView(ctaRef, { once: false, amount: 0.3 });

  // SERVICE SECTION ANIMATIONS
  const servicesSectionVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.3
      }
    }
  };
  
  const servicesTitleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1] 
      }
    }
  };
  
  const servicesCardVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: index => ({ 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.5, 
        delay: index * 0.1,
        type: "spring", 
        stiffness: 100,
        damping: 10
      }
    })
  };

  // PORTFOLIO SECTION ANIMATIONS
  const portfolioSectionVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.5
      }
    }
  };
  
  const portfolioTitleVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.7, 
        ease: "easeOut"
      }
    }
  };
  
  const portfolioItemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 30 },
    visible: (index) => ({ 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.6, 
        delay: index * 0.07,
        type: "spring", 
        damping: 20
      }
    })
  };

  // PACKAGES SECTION ANIMATIONS
  const packagesSectionVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.3
      }
    }
  };
  
  const packagesTitleVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.6, 
        type: "spring", 
        stiffness: 100
      }
    }
  };
  
  const packagesCardVariants = {
    hidden: { opacity: 0, rotateY: 30, z: -100 },
    visible: { 
      opacity: 1, 
      rotateY: 0,
      z: 0,
      transition: { 
        duration: 0.8, 
        type: "spring",
        damping: 15
      }
    }
  };

  // CTA SECTION ANIMATIONS
  const ctaSectionVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.15
      }
    }
  };
  
  const ctaTitleVariants = {
    hidden: { opacity: 0, clipPath: "inset(0 0 100% 0)" },
    visible: { 
      opacity: 1, 
      clipPath: "inset(0 0 0% 0)",
      transition: { 
        duration: 1, 
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  
  const ctaButtonVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  return (
    <>
      <Navbar />
      
      <main className="overflow-hidden">
        <HeroSection />

        {/* Services Section - Slide in from left with bounce */}
        <motion.section 
          ref={servicesRef}
          className="py-16 sm:py-20 bg-[#111827]"
          initial="hidden"
          animate={servicesInView ? "visible" : "hidden"}
          variants={servicesSectionVariants}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full sm:w-11/12">
            <motion.div 
              className="text-center mb-8 sm:mb-12"
              variants={servicesTitleVariants}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">Our Services</h2>
              <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">We offer a wide range of professional photography and videography services to capture your special moments.</p>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 px-2 sm:px-6 lg:px-11">
              {[
                {
                  icon: <img src={"/src/assets/home/p.webp"} alt="Photography" className="w-12 h-12 sm:w-16 sm:h-16" />,
                  title: "Photography",
                  description: "Portfolio photography for weddings, events, portraits and more."
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
                <motion.div 
                  key={index}
                  custom={index}
                  variants={servicesCardVariants}
                >
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
          ref={portfolioRef}
          className="py-16 sm:py-20 bg-black relative overflow-hidden perspective-1000"
          initial="hidden"
          animate={portfolioInView ? "visible" : "hidden"}
          variants={portfolioSectionVariants}
        >
          <PortfolioBackground />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full sm:w-11/12 relative z-10">
            <motion.div 
              className="text-center mb-8 sm:mb-12"
              variants={portfolioTitleVariants}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">Our Portfolio</h2>
              <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">Browse through our collection of stunning photography and videography projects.</p>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                <motion.div 
                  key={index} 
                  variants={portfolioItemVariants}
                  custom={index}
                  className="transform hover:scale-[1.03] transition-all duration-300"
                >
                  <PortfolioCard
                    image={item.image}
                    category={item.category}
                    title={item.title}
                  />
                </motion.div>
              ))}

              <motion.div 
                variants={portfolioItemVariants}
                custom={8}
                className="transform hover:scale-[1.03] transition-all duration-300"
              >
                <Link to="/portfolio" className="block relative group overflow-hidden rounded-lg">
                  <PortfolioCard image="/src/assets/home/h_final.webp" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/70 transition-all duration-500">
                    <div className="text-center px-4">
                      <h1 className="text-[#C084FC] text-xl sm:text-2xl font-extralight transform group-hover:scale-110 group-hover:text-2xl sm:group-hover:text-3xl transition-all duration-500 hover:animate-pulse">
                        View Full Portfolio
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
          ref={packagesRef}
          className="py-16 sm:py-20 bg-[#111827] perspective-1000"
          initial="hidden"
          animate={packagesInView ? "visible" : "hidden"}
          variants={packagesSectionVariants}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
            <motion.div 
              className="text-center mb-8 sm:mb-12"
              variants={packagesTitleVariants}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">Our Packages</h2>
              <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
                Choose from our carefully crafted packages or contact us for custom solutions tailored to your specific needs.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
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
          ref={ctaRef}
          className="py-16 sm:py-20 bg-gradient-to-b from-[#581C87] to-[#111827] relative overflow-hidden"
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
          variants={ctaSectionVariants}
        >
          <EnhancedFloatingParticles />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.h2 
              variants={ctaTitleVariants}
              className="text-2xl sm:text-3xl font-bold text-[#F3F4F6] mb-2 sm:mb-4"
            >
              Ready to Capture Your Special Moments?
            </motion.h2>
            <motion.p 
              variants={ctaTitleVariants}
              className="text-[#D1D5DB] text-sm sm:text-base mb-6 sm:mb-8 max-w-xl mx-auto"
            >
              Book your photography or videography session today and let us create lasting memories for you.
            </motion.p>
            <motion.div 
              variants={ctaButtonVariants}
              className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6"
            >
              <Link to="/booking" className="w-full sm:w-auto">
                <AnimatedButton className="w-full sm:w-auto bg-purple-500 hover:bg-purple-700 text-white font-medium px-6 py-3 text-sm sm:text-base rounded-md">
                  Book a Session
                </AnimatedButton>
              </Link>
              
              <Link to="/contact" className="w-full sm:w-auto">
                <motion.button 
                  className="relative group flex justify-center items-center w-full sm:w-auto border border-white text-white px-6 py-3 rounded-md hover:bg-white/10 transition-all duration-300 text-sm sm:text-base font-medium overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 17 
                  }}
                >
                  <div className="h-[100px] top-[-20px] w-10 bg-gradient-to-r from-white/10 via-white/50 to-white/10 absolute -left-16 -rotate-28 blur-sm group-hover:left-[150%] duration-700 group-hover:delay-200" />
                  Contact Us
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </>
  );
}

// Background with enhanced parallax effect for portfolio section
function PortfolioBackground() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 5]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1.1]);
  
  return (
    <motion.div 
      className="absolute inset-0 z-0 opacity-10"
      style={{ y, rotateZ: rotate, scale }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-black" />
      <div className="w-full h-full bg-[url('/src/assets/home/grid-pattern.png')] bg-repeat opacity-30" />
    </motion.div>
  );
}

// Enhanced floating particles for CTA section
function EnhancedFloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(30)].map((_, i) => {
        const size = Math.random() * 12 + 2;
        const isLarge = Math.random() > 0.8;
        const isGlowing = Math.random() > 0.7;
        
        return (
          <motion.div
            key={i}
            className={`absolute rounded-full ${isGlowing ? 'shadow-glow' : ''}`}
            initial={{ 
              x: `${Math.random() * 100}%`, 
              y: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
              scale: 0
            }}
            animate={{ 
              y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              opacity: [Math.random() * 0.3 + 0.2, Math.random() * 0.5 + 0.3],
              scale: [0, 1, isLarge ? 1.5 : 1, 0],
              rotate: isLarge ? [0, 360] : [0, 0]
            }}
            transition={{ 
              duration: 15 + Math.random() * 20,
              times: [0, 0.2, 0.8, 1],
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut"
            }}
            style={{ 
              width: `${size}px`,
              height: `${size}px`,
              background: isGlowing 
                ? `radial-gradient(circle at center, rgba(196, 130, 252, 0.8) 0%, rgba(196, 130, 252, 0.4) 60%, rgba(196, 130, 252, 0) 100%)`
                : `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.1})`,
              boxShadow: isGlowing ? '0 0 10px 2px rgba(196, 130, 252, 0.5)' : 'none'
            }}
          />
        );
      })}
    </div>
  );
}

export default Home;