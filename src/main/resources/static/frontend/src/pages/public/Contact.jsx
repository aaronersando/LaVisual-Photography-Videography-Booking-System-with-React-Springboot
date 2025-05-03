import React from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/FooterComp";
import Contactform from "../../components/forms/Contactform";
import FAQcard from "../../components/common/FAQcard";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faLocationDot, faEnvelope, faClock } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import TypeWriterEffect from 'react-typewriter-effect';

function Contact() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const contactItemAnimation = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const popIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    }
  };

  return (
    <>
      <Navbar />
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <motion.div 
          className="text-center mb-12 sm:mb-16 lg:mb-20"
          variants={popIn}
        >
          <motion.h1 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 10, 
              delay: 0.2 
            }}
          >
            Contact Us
          </motion.h1>
          <div className="mx-auto max-w-2xl">
            <TypeWriterEffect
              textStyle={{
                fontFamily: 'inherit',
                color: '#9CA3AF',
                fontWeight: 'normal',
                fontSize: '1.125rem',
                textAlign: 'center',
              }}
              startDelay={800}
              cursorColor="#C084FC"
              text="Have a question or ready to book? Reach out to us and we'll get back to you as soon as possible."
              typeSpeed={50}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16 sm:mb-20">
          <motion.div 
            className="space-y-6 sm:space-y-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h3 
              className="text-xl sm:text-2xl font-semibold text-white mb-6 sm:mb-8"
              variants={contactItemAnimation}
            >
              Get In Touch
            </motion.h3>
            
            <motion.div 
              className="flex items-center space-x-4"
              variants={contactItemAnimation}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <div className="bg-[#a955f722] p-3 rounded-full transform transition-all duration-300 hover:scale-110 hover:bg-[#a955f733]">
                <FontAwesomeIcon icon={faLocationDot} className="h-5 w-5 sm:h-6 sm:w-6 text-[#C084FC]" />
              </div>
              <div>
                <h5 className="text-white font-medium">Our Location</h5>
                <p className="text-gray-400">San Jose, Paombong, Bulacan, Philippines</p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center space-x-4"
              variants={contactItemAnimation}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <div className="bg-[#a955f722] p-3 rounded-full transform transition-all duration-300 hover:scale-110 hover:bg-[#a955f733]">
                <FontAwesomeIcon icon={faPhone} className="h-5 w-5 sm:h-6 sm:w-6 text-[#C084FC]" />
              </div>
              <div>
                <h5 className="text-white font-medium">Phone</h5>
                <p className="text-gray-400">(+63) 926-0515-815</p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center space-x-4"
              variants={contactItemAnimation}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <div className="bg-[#a955f722] p-3 rounded-full transform transition-all duration-300 hover:scale-110 hover:bg-[#a955f733]">
                <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 sm:h-6 sm:w-6 text-[#C084FC]" />
              </div>
              <div>
                <h5 className="text-white font-medium">Email</h5>
                <p className="text-gray-400">lavisualmedia@gmail.com</p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center space-x-4"
              variants={contactItemAnimation}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <div className="bg-[#a955f722] p-3 rounded-full transform transition-all duration-300 hover:scale-110 hover:bg-[#a955f733]">
                <FontAwesomeIcon icon={faClock} className="h-5 w-5 sm:h-6 sm:w-6 text-[#C084FC]" />
              </div>
              <div>
                <h5 className="text-white font-medium">Business Hours</h5>
                <p className="text-gray-400">Weekdays: 9am - 9pm</p>
                <p className="text-gray-400">Weekends: 7am - 10pm</p>
              </div>
            </motion.div>

            <motion.div 
              className="rounded-lg overflow-hidden mt-8 w-full h-[200px] sm:h-[250px] bg-gray-800 shadow-lg"
              variants={fadeIn}
              whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6823.980363313562!2d120.78751444563821!3d14.808826089789523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x339651fde8c3e3e1%3A0xcb6b1aee43298929!2sSan%20Jose%2C%20Bulacan!5e0!3m2!1sen!2sph!4v1744600704411!5m2!1sen!2sph"
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Location"
              />
            </motion.div>
          </motion.div>

          <motion.div 
            className="bg-gray-800 rounded-lg p-6 sm:p-8 shadow-lg"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
            whileHover={{ boxShadow: "0 0 25px rgba(168, 85, 247, 0.15)" }}
          >
            <Contactform />
          </motion.div>
        </div>

        <motion.div 
          className="mt-16 sm:mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.h3 
            className="text-xl sm:text-2xl font-semibold text-white text-center mb-8 sm:mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Frequently Asked Questions
          </motion.h3>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              variants={fadeIn}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <FAQcard 
                heading="How far in advance should I book?"
                description="For weddings and major events, we recommend booking at least 6-12 months in advance. For portrait sessions and smaller events, 2-4 weeks notice is usually sufficient, depending on our availability."
              />
            </motion.div>
            <motion.div 
              variants={fadeIn}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <FAQcard 
                heading="What is your cancellation policy?"
                description="Deposits are non-refundable, but we do offer rescheduling options with adequate notice. Full cancellations made within 30 days of the event may be subject to additional fees."
              />
            </motion.div>
            <motion.div 
              variants={fadeIn}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <FAQcard 
                heading="How long until I receive my photos/videos?"
                description="Typically, portrait sessions are delivered within 1-2 weeks. Weddings and larger events take 4-6 weeks. Rush delivery is available for an additional fee."
              />
            </motion.div>
            <motion.div 
              variants={fadeIn}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <FAQcard 
                heading="Do you travel for photoshoots?"
                description="Yes, we are available for travel both domestically and internationally. Travel fees may apply depending on the location."
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
      <Footer />
    </>
  );
}

export default Contact;