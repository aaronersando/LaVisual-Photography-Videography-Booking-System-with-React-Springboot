import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation(); // Get the current location

  const isActive = (path) => location.pathname === path; // Check if the path matches the current location

  return (
    <header className="bg-black w-full py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to={"/"}>
            <div className="text-2xl font-bold">
              <span className="text-purple-500">La</span>Visual
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm transition-colors duration-200 ${
                isActive("/") ? "text-purple-500" : "text-white hover:text-purple-500"
              }`}
            >
              Home
            </Link>
            <Link
              to="/portfolio"
              className={`text-sm transition-colors duration-200 ${
                isActive("/portfolio") ? "text-purple-500" : "text-white hover:text-purple-500"
              }`}
            >
              Portfolio
            </Link>
            <Link
              to="/packages"
              className={`text-sm transition-colors duration-200 ${
                isActive("/packages") ? "text-purple-500" : "text-white hover:text-purple-500"
              }`}
            >
              Packages
            </Link>
            <Link
              to="/booking"
              className={`text-sm transition-colors duration-200 ${
                isActive("/booking") ? "text-purple-500" : "text-white hover:text-purple-500"
              }`}
            >
              Booking
            </Link>
            <Link
              to="/about"
              className={`text-sm transition-colors duration-200 ${
                isActive("/about") ? "text-purple-500" : "text-white hover:text-purple-500"
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`text-sm transition-colors duration-200 ${
                isActive("/contact") ? "text-purple-500" : "text-white hover:text-purple-500"
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* <Link
              to="/login"
              className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-700 transition-colors duration-200"
            >
              Log in
            </Link> */}
          </div>

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
        <div className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden`} id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-sm ${
                isActive("/") ? "text-purple-500" : "text-white hover:bg-gray-800 hover:text-purple-500"
              }`}
            >
              Home
            </Link>
            <Link
              to="/portfolio"
              className={`block px-3 py-2 rounded-md text-sm ${
                isActive("/portfolio") ? "text-purple-500" : "text-white hover:bg-gray-800 hover:text-purple-500"
              }`}
            >
              Portfolio
            </Link>
            <Link
              to="/packages"
              className={`block px-3 py-2 rounded-md text-sm ${
                isActive("/packages") ? "text-purple-500" : "text-white hover:bg-gray-800 hover:text-purple-500"
              }`}
            >
              Packages
            </Link>
            <Link
              to="/booking"
              className={`block px-3 py-2 rounded-md text-sm ${
                isActive("/booking") ? "text-purple-500" : "text-white hover:bg-gray-800 hover:text-purple-500"
              }`}
            >
              Booking
            </Link>
            <Link
              to="/about"
              className={`block px-3 py-2 rounded-md text-sm ${
                isActive("/about") ? "text-purple-500" : "text-white hover:bg-gray-800 hover:text-purple-500"
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`block px-3 py-2 rounded-md text-sm ${
                isActive("/contact") ? "text-purple-500" : "text-white hover:bg-gray-800 hover:text-purple-500"
              }`}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;