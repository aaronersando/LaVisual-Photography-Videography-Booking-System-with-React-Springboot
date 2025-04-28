import {Link} from 'react-router-dom';


function FooterComp() {
  return (
    <footer className="bg-black w-full pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Branding Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">
              <span className="text-purple-500">La</span>Visual
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Capturing moments that last a lifetime.
              <br />
              Premium photography and videography services for all your special occasions.
            </p>
            <div className="flex space-x-4">
              <Link to="https://www.facebook.com/share/1Fj1cgEdN6/?mibextid=wwXIfr" className="text-white hover:text-purple-500 transition-colors duration-200">
                <i className="fa-brands fa-facebook"></i>
              </Link>
              
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/portfolio" className="text-gray-400 hover:text-purple-500 text-sm transition-colors duration-200">Portfolio</Link></li>
              <li><Link to="/packages" className="text-gray-400 hover:text-purple-500 text-sm transition-colors duration-200">Packages</Link></li>
              <li><Link to="/booking" className="text-gray-400 hover:text-purple-500 text-sm transition-colors duration-200">Book a Session</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-purple-500 text-sm transition-colors duration-200">About Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm">Services</h4>
            <ul className="space-y-2">
              <li><Link to="/portfolio" className="text-gray-400 hover:text-purple-500 text-sm transition-colors duration-200">Wedding Photography</Link></li>
              <li><Link to="/portfolio" className="text-gray-400 hover:text-purple-500 text-sm transition-colors duration-200">Portrait Sessions</Link></li>
              <li><Link to="/portfolio" className="text-gray-400 hover:text-purple-500 text-sm transition-colors duration-200">Pre-Photoshoot</Link></li>
              <li><Link to="/portfolio" className="text-gray-400 hover:text-purple-500 text-sm transition-colors duration-200">Event Coverage</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm">Contact Us</h4>
            <div className="space-y-2">
              <p className="flex items-center text-gray-400 text-sm">
                <i className="fas fa-map-marker-alt mr-2"></i>
                San Jose, Paombong, Bulacan, Philippines
              </p>
              <p className="flex items-center text-gray-400 text-sm">
                <i className="fas fa-phone mr-2"></i>
                +63 926-0515-815
              </p>
              <p className="flex items-center text-gray-400 text-sm">
                <i className="fas fa-envelope mr-2"></i>
                lavisualmedia@gmail.com
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-gray-800"></div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-gray-400 text-xs">
            &copy; {new Date().getFullYear()} LaVisual. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default FooterComp;