import { useState } from 'react';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-black w-full py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="text-2xl font-bold">
            <span className="text-purple-500">La</span>Visual
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-white hover:text-purple-500 transition-colors duration-200">Home</a>
            <a href="/portfolio" className="text-white hover:text-purple-500 transition-colors duration-200">Portfolio</a>
            <a href="/packages" className="text-white hover:text-purple-500 transition-colors duration-200">Packages</a>
            <a href="/booking" className="text-white hover:text-purple-500 transition-colors duration-200">Booking</a>
            <a href="/about" className="text-white hover:text-purple-500 transition-colors duration-200">About</a>
            <a href="/contact" className="text-white hover:text-purple-500 transition-colors duration-200">Contact</a>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="/login" 
              className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-700 transition-colors duration-200">
              Log in
            </a>
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
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}
          id="mobile-menu"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="/" className="block px-3 py-2 rounded-md text-white hover:bg-gray-800 hover:text-purple-500 transition-colors duration-200">
              Home
            </a>
            <a href="/portfolio" className="block px-3 py-2 rounded-md text-white hover:bg-gray-800 hover:text-purple-500 transition-colors duration-200">
              Portfolio
            </a>
            <a href="/packages" className="block px-3 py-2 rounded-md text-white hover:bg-gray-800 hover:text-purple-500 transition-colors duration-200">
              Packages
            </a>
            <a href="/booking" className="block px-3 py-2 rounded-md text-white hover:bg-gray-800 hover:text-purple-500 transition-colors duration-200">
              Booking
            </a>
            <a href="/about" className="block px-3 py-2 rounded-md text-white hover:bg-gray-800 hover:text-purple-500 transition-colors duration-200">
              About
            </a>
            <a href="/contact" className="block px-3 py-2 rounded-md text-white hover:bg-gray-800 hover:text-purple-500 transition-colors duration-200">
              Contact
            </a>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-800">
            <div className="px-2 space-y-1">
              <a href="/login" className="block px-3 py-2 rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-200">
                Log in
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;