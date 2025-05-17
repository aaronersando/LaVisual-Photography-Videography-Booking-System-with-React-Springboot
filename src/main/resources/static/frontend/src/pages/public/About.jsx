// Import main dependencies for frontend
import React from 'react';
import TypeWriterEffect from 'react-typewriter-effect';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Import minor components needed
import Navbar from '../../components/common/Navbar';
import FooterComp from '../../components/common/FooterComp';

// Fontawesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faUsers, faAward, faVideo } from '@fortawesome/free-solid-svg-icons';

// Import pictures for the freelancer team
import tine from '../../assets/about/tine.webp';
import teo from '../../assets/about/teo.webp';
import nick from '../../assets/about/nick.webp';
import clint from '../../assets/about/clint.webp';
import nald from '../../assets/about/nald.webp';
import lei from '../../assets/about/lei.webp';


function About() {

  // Variables for custom animations variants for framer motion for elements on how they appear on the page
  
  // Fade in animation definition 
  const fadeIn = { /* subtle animation moving up 20px */
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  // Fade in left animation 
  const fadeInLeft = { /* fade in slowly from 50px left to natural position */
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  // Fade in right animation 
  const fadeInRight = { /* fade in slowly from 50px right to natural position */
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  // Parent Container Stagger Animation 
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  // Stiffer spring effect animation for slightly bouncy animation 
  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  return (
    <>
      <Navbar/>
      <AnimatePresence>
        <motion.div /* main container with fading animation */
          className="min-h-screen bg-gray-900 text-gray-400 pt-16 pb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5}}
          exit={{once: true}}
        > 
          <div className="container mx-auto px-4 sm:px-6 md:px-[30px] max-w-7xl">
            <motion.div /* Container for top part title and typewriter */
              className="text-center mb-16 md:mb-20"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <motion.h1  /* Page Title Fade animation */
                className="text-3xl md:text-4xl font-bold mb-4 text-white"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 15, 
                  delay: 0.2 
                }}
              > 
                About LaVisual
              </motion.h1>
              <div className="max-w-2xl mx-auto px-2">
                <TypeWriterEffect /* TypeWriter Effect for the text description */
                  textStyle={{
                    fontFamily: 'inherit',
                    color: '#9CA3AF',
                    fontWeight: 'normal',
                    fontSize: '1rem',
                    textAlign: 'center',
                  }}
                  startDelay={400}
                  cursorColor="#C084FC"
                  text="A passionate team of photographers and videographers dedicated to capturing your special moments with creativity and professionalism."
                  typeSpeed={30}
                />
              </div>
            </motion.div>

            {/* Team Story Section */}
            <motion.section 
              className="relative mb-20 md:mb-40"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                <motion.div 
                  className="w-full md:w-1/2 text-gray-400 mb-8 md:mb-0 px-2"
                  variants={fadeInLeft}
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
                <motion.div 
                  className="w-full md:w-1/2 h-[300px] md:h-[450px] bg-gray-700 rounded-lg overflow-hidden"
                  variants={fadeInRight}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img src={lei} alt="Lei" className="w-full h-full object-cover rounded-lg" />
                </motion.div>
              </div>
            </motion.section>

            {/* Values Section */}
            <motion.section 
              className="text-center mb-20 md:mb-40"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 
                className="text-2xl font-bold text-white mb-8"
                variants={itemVariant}
              >
                Our Values
              </motion.h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                <motion.div 
                  className="bg-gray-800 p-5 pt-8 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:bg-gray-700 flex flex-col items-center h-full"
                  variants={itemVariant}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(168, 85, 247, 0.1)" }}
                >
                  <div className="w-12 h-12 bg-[#C084FC] rounded-full mb-4 flex justify-center items-center">
                    <FontAwesomeIcon icon={faCamera} className="text-[#9333EA] text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Artistic</h3>
                  <p className="text-gray-400 text-center">We craft visuals that tell stories.</p>
                </motion.div>
                <motion.div 
                  className="bg-gray-800 p-5 pt-8 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:bg-gray-700 flex flex-col items-center h-full"
                  variants={itemVariant}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(168, 85, 247, 0.1)" }}
                >
                  <div className="w-12 h-12 bg-[#C084FC] rounded-full mb-4 flex justify-center items-center">
                    <FontAwesomeIcon icon={faUsers} className="text-[#9333EA] text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Client Focus</h3>
                  <p className="text-gray-400 text-center">Your vision, our mission.</p>
                </motion.div>
                <motion.div 
                  className="bg-gray-800 p-5 pt-8 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:bg-gray-700 flex flex-col items-center h-full"
                  variants={itemVariant}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(168, 85, 247, 0.1)" }}
                >
                  <div className="w-12 h-12 bg-[#C084FC] rounded-full mb-4 flex justify-center items-center">
                    <FontAwesomeIcon icon={faAward} className="text-[#9333EA] text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Excellence</h3>
                  <p className="text-gray-400 text-center">Details matter, quality define us.</p>
                </motion.div>
                <motion.div 
                  className="bg-gray-800 p-5 pt-8 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:bg-gray-700 flex flex-col items-center h-full"
                  variants={itemVariant}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(168, 85, 247, 0.1)" }}
                >
                  <div className="w-12 h-12 bg-[#C084FC] rounded-full mb-4 flex justify-center items-center">
                    <FontAwesomeIcon icon={faVideo} className="text-[#9333EA] text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Innovation</h3>
                  <p className="text-gray-400 text-center">Always evolving, always inspired.</p>
                </motion.div>
              </div>
            </motion.section>

            {/* Team Members Section */}
            <motion.section 
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 
                className="text-2xl font-bold text-white mb-8"
                variants={itemVariant}
              >
                Meet our Team
              </motion.h2>
              
              {/* First row of team members */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <motion.div 
                  className="bg-gray-800 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:bg-gray-700 h-full"
                  variants={itemVariant}
                  whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(168, 85, 247, 0.1)" }}
                >
                  <div className="w-full aspect-[295/255]">
                    <img src={tine} alt="Lead Photographer" className="w-full h-full object-cover rounded-t-lg" />
                  </div>
                  <div className="p-4 text-left">
                    <h3 className="text-xl font-bold text-white">Tine De Leon</h3>
                    <p className="text-sm" style={{ color: '#C084FC' }}>Lead Photographer</p>
                    <p className="text-gray-400 mt-2">
                      Tine has over 10 years of experience capturing weddings, events, and portraits. His unique style combines
                      photojournalism with artistic composition.
                    </p>
                  </div>
                </motion.div>
                <motion.div 
                  className="bg-gray-800 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:bg-gray-700 h-full"
                  variants={itemVariant}
                  whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(168, 85, 247, 0.1)" }}
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
                <motion.div 
                  className="bg-gray-800 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:bg-gray-700 h-full"
                  variants={itemVariant}
                  whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(168, 85, 247, 0.1)" }}
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
              
              {/* Second row of team members */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <motion.div 
                  className="lg:col-start-2 bg-gray-800 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:bg-gray-700 h-full"
                  variants={itemVariant}
                  whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(168, 85, 247, 0.1)" }}
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
                <motion.div 
                  className="bg-gray-800 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:bg-gray-700 h-full"
                  variants={itemVariant}
                  whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(168, 85, 247, 0.1)" }}
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

            {/* Contact Us Section */}
            <motion.section 
              className="text-center mt-20 mb-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <motion.div 
                className="max-w-2xl mx-auto mb-8"
                variants={itemVariant}
              >
                <h2 className="text-2xl font-bold text-white mb-4">Ready to Work with Us?</h2>
                <p className="text-gray-400 px-4">
                  Let's create something beautiful together. Contact us to discuss your project or book a session.
                </p>
              </motion.div>
              <motion.div 
                className="flex flex-col sm:flex-row justify-center gap-4 px-4"
                variants={itemVariant}
              >
                <Link to={'/contact'} className="w-full sm:w-auto">
                  <motion.button 
                    className="bg-[#9333EA] text-white w-full sm:w-[125px] h-[50px] rounded-[6px] hover:bg-purple-700 transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 17 
                    }}
                  >
                    Contact Us
                  </motion.button>
                </Link>
                <Link to={'/portfolio'} className="w-full sm:w-auto">
                  <motion.button 
                    className="bg-transparent text-white w-full sm:w-[155px] h-[50px] rounded-[6px] border border-white hover:bg-gray-700 transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 17 
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
      <FooterComp/>
    </>
  );
}

export default About;