import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation(); 
  const [hovered, setHovered] = useState(null); 
  const navRefs = useRef({}); 
  const [activeIndicator, setActiveIndicator] = useState({ width: 0, left: 0, height: 0 });

  const isActive = (path) => location.pathname === path; 
  useEffect(() => {
    const activePath = hovered || location.pathname;
    const currentRef = navRefs.current[activePath];

    if (currentRef) {
      const rect = currentRef.getBoundingClientRect();
      const parentRect = currentRef.parentElement.getBoundingClientRect();

      setActiveIndicator({
        width: rect.width,
        left: rect.left - parentRect.left,
        height: rect.height,
      });
    }
  }, [hovered, location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      const activePath = hovered || location.pathname;
      const currentRef = navRefs.current[activePath];

      if (currentRef) {
        const rect = currentRef.getBoundingClientRect();
        const parentRect = currentRef.parentElement.getBoundingClientRect();

        setActiveIndicator({
          width: rect.width,
          left: rect.left - parentRect.left,
          height: rect.height,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hovered, location.pathname]);

  return (
    <header className="bg-black w-full py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            whileTap={{ scale: 0.9, rotate: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Link to={"/"}>
              <div className="text-2xl font-bold cursor-pointer">
                <span className="text-purple-500">La</span>Visual
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 relative">
            <motion.div
              className="absolute bg-purple-700 rounded-md"
              layoutId="nav-indicator"
              initial={false}
              animate={{
                width: activeIndicator.width,
                left: activeIndicator.left,
                height: activeIndicator.height,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.6, 
              }}
              style={{ zIndex: -1 }}
            />

            {[
              { path: "/", label: "Home" },
              { path: "/booking", label: "Booking" },
              { path: "/portfolio", label: "Portfolio" },
              { path: "/packages", label: "Packages" },
              { path: "/contact", label: "Contact" },
              { path: "/about", label: "About Us" },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                ref={(el) => (navRefs.current[item.path] = el)}
                onMouseEnter={() => setHovered(item.path)}
                onMouseLeave={() => setHovered(null)}
                className={`relative text-sm transition-transform duration-300 ease-in-out px-3 py-2 rounded-md ${
                  isActive(item.path) ? "text-white" : "text-white hover:scale-110"
                }`}
                style={{ zIndex: 1 }} // Ensure text stays above the background
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="sr-only">Open main menu</span>
            {!isMobileMenuOpen ? (
              <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
            ) : (
              <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          className={`${
            isMobileMenuOpen ? "block" : "hidden"
          } md:hidden transition-all duration-500 ease-in-out transform ${
            isMobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
          }`}
          id="mobile-menu"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: isMobileMenuOpen ? 1 : 0, y: isMobileMenuOpen ? 0 : -10 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {[
              { path: "/", label: "Home" },
              { path: "/about", label: "About Us" },
              { path: "/portfolio", label: "Portfolio" },
              { path: "/packages", label: "Packages" },
              { path: "/booking", label: "Booking" },
              { path: "/contact", label: "Contact" },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-sm transition-transform duration-300 ease-in-out ${
                  isActive(item.path)
                    ? "text-purple-700"
                    : "text-white hover:bg-gray-800 hover:scale-105"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </header>
  );
}

export default Navbar;