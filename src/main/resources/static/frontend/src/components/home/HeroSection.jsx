import {Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faArrowDown, faArrowDown19, faArrowDownAZ, faDownload, faDownLong, faUpDown } from '@fortawesome/free-solid-svg-icons';

function HeroSection() {
  return (
    <div className="relative min-h-[500px] h-screen w-full">
      {/* Background Image Container */}
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
        {/* Dark Overlay with responsive opacity */}
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      {/* Content with responsive padding and spacing */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-40">
          <div className="max-w-3xl mx-auto sm:mx-0">
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6">
              Capturing Your{" "}
              <span className="block sm:inline text-[#C084FC] whitespace-nowrap">Perfect Moments</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-200 mb-6 sm:mb-8">
              Professional photography and videography services for weddings, events, portraits, and pre-photoshoot projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link to="/portfolio">
                <button className="w-full lg:px-12 sm:w-auto bg-[#9333EA] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-md hover:bg-purple-800 transition-all duration-300 text-sm sm:text-base hover:cursor-pointer">
                  View Portfolio
                </button>
              </Link>
              <Link to="/booking">
                <button className="w-full lg:px-16 sm:w-auto border border-white text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-md hover:bg-white/10 transition-all duration-300 text-sm sm:text-base hover:cursor-pointer">
                  Book a Session
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Scroll Indicator */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce hidden sm:block">
        <FontAwesomeIcon icon={faArrowDown} className='text-xl'/>
      </div>
    </div>
  );
}

export default HeroSection;