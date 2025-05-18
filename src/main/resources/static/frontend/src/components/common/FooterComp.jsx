/**
 * Footer Component
 * 
 * This component renders the website footer which appears at the bottom of all pages.
 * It provides important site navigation, branding elements, service information, 
 * and contact details for the LaVisual photography business.
 * 
 * Key features:
 * - Responsive grid layout (stacks on mobile, 2 columns on tablet, 4 columns on desktop)
 * - Brand identity with logo and tagline
 * - Quick navigation links to key pages
 * - Services overview with links to portfolio sections
 * - Contact information with address, phone, and email
 * - Social media links
 * - Dynamic copyright year that updates automatically
 * 
 * The component uses Tailwind CSS for styling and Font Awesome for icons.
 * It leverages React Router's Link component for client-side navigation between pages.
 */
import {Link} from 'react-router-dom'; // Import Link for client-side navigation without page reload


function FooterComp() {
  return (
    // Main footer container with black background, full width, and vertical padding
    <footer className="bg-black w-full pt-12 pb-6">
      {/* Content container with responsive max width and horizontal padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Responsive grid layout - 1 column on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Branding Column */}
          <div className="space-y-4"> {/* Vertical spacing between child elements */}
            {/* Company logo/name with stylized colors */}
            <h3 className="text-lg font-bold">
              <span className="text-purple-500">La</span>Visual {/* "La" in purple, "Visual" in white */}
            </h3>
            {/* Company tagline/description */}
            <p className="text-gray-400 text-sm leading-relaxed">
              Capturing moments that last a lifetime.
              <br /> {/* Line break for visual separation */}
              Premium photography and videography services for all your special occasions.
            </p>
            {/* Social media links container with horizontal spacing */}
            <div className="flex space-x-4">
              {/* Facebook link with hover effect */}
              <Link to="https://www.facebook.com/share/1Fj1cgEdN6/?mibextid=wwXIfr" className="text-white hover:text-purple-500 transition-colors duration-200">
                <i className="fa-brands fa-facebook"></i> {/* Facebook icon from Font Awesome */}
              </Link>
              
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4"> {/* Vertical spacing between elements */}
            <h4 className="text-white font-bold text-sm">Quick Links</h4>
            {/* Navigation list with vertical spacing */}
            <ul className="space-y-2">
              {/* Each list item contains a link with hover effect */}
              <li><Link to="/portfolio" className="text-gray-400 hover:text-purple-500 text-sm transition-colors duration-200">Portfolio</Link></li>
              <li><Link to="/packages" className="text-gray-400 hover:text-purple-500 text-sm transition-colors duration-200">Packages</Link></li>
              <li><Link to="/booking" className="text-gray-400 hover:text-purple-500 text-sm transition-colors duration-200">Book a Session</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-purple-500 text-sm transition-colors duration-200">About Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm">Services</h4>
            {/* List of specific photography services offered */}
            <ul className="space-y-2">
              {/* All service links point to portfolio but could be filtered to specific categories */}
              <li><Link to="/portfolio" className="text-gray-400 hover:text-purple-500 text-sm transition-colors duration-200">Wedding Photography</Link></li>
              <li><Link to="/portfolio" className="text-gray-400 hover:text-purple-500 text-sm transition-colors duration-200">Portrait Sessions</Link></li>
              <li><Link to="/portfolio" className="text-gray-400 hover:text-purple-500 text-sm transition-colors duration-200">Pre-Photoshoot</Link></li>
              <li><Link to="/portfolio" className="text-gray-400 hover:text-purple-500 text-sm transition-colors duration-200">Event Coverage</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm">Contact Us</h4>
            <div className="space-y-2"> {/* Vertical spacing between contact items */}
              {/* Address with location icon */}
              <p className="flex items-center text-gray-400 text-sm">
                <i className="fas fa-map-marker-alt mr-2"></i> {/* Location icon with right margin */}
                San Jose, Paombong, Bulacan, Philippines
              </p>
              {/* Phone number with phone icon */}
              <p className="flex items-center text-gray-400 text-sm">
                <i className="fas fa-phone mr-2"></i> {/* Phone icon with right margin */}
                +63 926-0515-815
              </p>
              {/* Email with envelope icon */}
              <p className="flex items-center text-gray-400 text-sm">
                <i className="fas fa-envelope mr-2"></i> {/* Email icon with right margin */}
                lavisualmedia@gmail.com
              </p>
            </div>
          </div>
        </div>

        {/* Divider - horizontal line separating main content from copyright */}
        <div className="my-8 border-t border-gray-800"></div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-gray-400 text-xs">
            &copy; {new Date().getFullYear()} LaVisual. All rights reserved. {/* Dynamic current year */}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default FooterComp; // Export the component for use in other files