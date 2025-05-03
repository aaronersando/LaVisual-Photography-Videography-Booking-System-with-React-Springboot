import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/FooterComp";
import HeroSection from "../../components/home/HeroSection";
import ServiceCard from "../../components/home/ServiceCard";
import PortfolioCard from "../../components/home/PortfolioCard";
import PackageCard from "../../components/home/PackageCard";
import {Link} from 'react-router-dom';
import { motion } from "framer-motion";
import AnimatedButton from "../../components/common/AnimatedButton";

function Home() {
  return (
    <>
      <Navbar />
      
      <main className="overflow-hidden">
        <HeroSection />

        <section className="py-16 sm:py-20 bg-[#111827]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full sm:w-11/12">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">Our Services</h2>
              <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">We offer a wide range of professional photography and videography services to capture your special moments.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 px-2 sm:px-6 lg:px-11">
              <ServiceCard
                icon={<img src={"/src/assets/home/p.webp"} alt="Photography" className="w-12 h-12 sm:w-16 sm:h-16" />}
                title="Photography"
                description="Portfolio photography for weddings, events, portraits and more."
              />

              <ServiceCard
                icon={<img src={"/src/assets/home/v.webp"} alt="Videography" className="w-12 h-12 sm:w-16 sm:h-16" />}
                title="Videography"
                description="Cinematic videos for weddings, commercials, music videos, and events."
              />

              <ServiceCard
                icon={<img src={"/src/assets/home/e.webp"} alt="Events" className="w-12 h-12 sm:w-16 sm:h-16" />}
                title="Events"
                description="Comprehensive coverage for corporate events, parties, and gatherings."
              />

              <ServiceCard
                icon={<img src={"/src/assets/home/b.webp"} alt="Bookings" className="w-12 h-12 sm:w-16 sm:h-16" />}
                title="Bookings"
                description="Easy online booking system to schedule your photography sessions."
              />
            </div>
          </div>
        </section>


        <section className="py-16 sm:py-20 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full sm:w-11/12">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">Our Portfolio</h2>
              <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">Browse through our collection of stunning photography and videography projects.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <PortfolioCard
                image="/src/assets/home/h_wedding.webp"
                category="Wedding"
                title="Dino & Jasmine's Wedding"
              />

              <PortfolioCard    
                image="/src/assets/home/h_portrait.webp"
                category="Portrait"
                title="Ann's Portrait"
              />

              <PortfolioCard
                image="/src/assets/home/h_debut.webp"
                category="18th-Birthday/Debut"
                title="Kimberly's Pre-Debut"
              />

              <PortfolioCard
                image="/src/assets/home/h_prenup.webp"
                category="Pre-Nuptial"
                title="Keight's & Shaira Pre-Nuptial"
              />

              <PortfolioCard
                image="/src/assets/home/h_baptism.webp"
                category="Baptismal"
                title="Astrid's Baptism"
              />

              <PortfolioCard    
                image="/src/assets/home/h_sports.webp"
                category="Sports"
                title="San Jose Basketball League"
              />

              <PortfolioCard    
                image="/src/assets/home/h_occassion.webp"
                category="Occasion"
                title="Zeny's 60th Birthday"
              />

              <PortfolioCard    
                image="/src/assets/home/h_videos.webp"
                category="Videos"
                title="Khay & Jha's SDE Video"
              />

              <Link to="/portfolio" className="block relative group overflow-hidden rounded-lg">
                <PortfolioCard    
                  image="/src/assets/home/h_final.webp"
                />
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
            </div>
          </div>
        </section>


        <section className="py-16 sm:py-20 bg-[#111827]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">Our Packages</h2>
              <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
                Choose from our carefully crafted packages or contact us for custom solutions tailored to your specific needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
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
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-gradient-to-b from-[#581C87] to-[#111827]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F3F4F6] mb-2 sm:mb-4">
              Ready to Capture Your Special Moments?
            </h2>
            <p className="text-[#D1D5DB] text-sm sm:text-base mb-6 sm:mb-8 max-w-xl mx-auto">
              Book your photography or videography session today and let us create lasting memories for you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
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
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Home;