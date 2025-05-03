import {Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from "framer-motion";
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import AnimatedButton from '../common/AnimatedButton';
import TypeWriterEffect from 'react-typewriter-effect';
import React, { useEffect, useState } from 'react';

function HeroSection() {
  const [fontSize, setFontSize] = useState('1rem');

  useEffect(() => {
    const updateFontSize = () => {
      if (window.innerWidth >= 1024) {
        setFontSize('1.25rem'); 
      } else if (window.innerWidth >= 768) {
        setFontSize('1.125rem'); 
      } else {
        setFontSize('1rem'); 
      }
    };

    updateFontSize();
    
    window.addEventListener('resize', updateFontSize);
    
    return () => window.removeEventListener('resize', updateFontSize);
  }, []);

  return (
    <div className="relative min-h-[500px] h-screen w-full">
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
            loading="eager"
          />
        </picture>
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-40">
          <div className="max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto sm:mx-0">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white mb-3 sm:mb-5">
              Capturing Your{" "}
              <span className="block sm:inline text-[#C084FC] whitespace-normal sm:whitespace-nowrap">Perfect Moments</span>
            </h1>
            
            <div className='mb-5 sm:mb-6 md:mb-8 max-w-full overflow-hidden'>
              <TypeWriterEffect
                textStyle={{
                  fontFamily: 'inherit',
                  fontSize: fontSize, 
                  color: '#E5E7EB', 
                  lineHeight: '1.5',
                  maxWidth: '100%',
                  overflowWrap: 'break-word',
                }}
                startDelay={100}
                cursorColor="#C084FC"
                multiText={[
                  'Professional photography and videography services for weddings, events, portraits, and pre-photoshoot projects.',
                ]}
                multiTextDelay={1000}
                typeSpeed={50}
                multiTextLoop={false}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2">
              <Link to="/portfolio" className="w-full sm:w-auto">
                <AnimatedButton className="w-full sm:w-auto bg-purple-500 hover:bg-purple-700 text-sm sm:text-base px-4 py-2.5 sm:py-3">
                  View Portfolio
                </AnimatedButton>
              </Link>
              
              <Link to="/booking" className="w-full sm:w-auto">
                <motion.button 
                  className="relative group flex justify-center items-center w-full sm:w-auto border border-white text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-md hover:bg-white/10 transition-all duration-300 text-sm sm:text-base hover:cursor-pointer overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 17 
                  }}
                >
                  <div className="h-[100px] top-[-30px] w-10 bg-gradient-to-r from-white/10 via-white/50 to-white/10 absolute -left-16 -rotate-28 blur-sm group-hover:left-[150%] duration-700 group-hover:delay-100" />
                  Book a Session
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce hidden sm:block">
        <FontAwesomeIcon icon={faArrowDown} className="text-white text-lg sm:text-xl"/>
      </div>
    </div>
  );
}

export default HeroSection;