import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/FooterComp";
import HeroSection from "../../components/home/HeroSection";
import ServiceCard from "../../components/home/ServiceCard";
import PortfolioCard from "../../components/home/PortfolioCard";
import PackageCard from "../../components/home/PackageCard";
import {Link} from 'react-router-dom';

function Home() {
  return (
    <>
      <Navbar />
      
      <main>
        <HeroSection />

        {/* Services Section */}
        <section className="py-20 bg-[#111827]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-11/12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Our Services</h2>
              <p className="text-gray-400">We offer a wide range of professional photography and videography services to capture your special moments.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 px-11">
              <ServiceCard
                icon={<img src={"/src/assets/home/p.webp"} />}
                title="Photography"
                description="Portfolio photography for weddings, events, portraits and more."
              />

              <ServiceCard
                icon={<img src={"/src/assets/home/v.webp"} />}
                title="Videography"
                description="Cinematic videos for weddings, commercials, music videos, and events."
              />

              <ServiceCard
                icon={<img src={"/src/assets/home/e.webp"} />}
                title="Events"
                description="Comprehensive coverage for corporate events, parties, and gatherings."
              />

              <ServiceCard
                icon={<img src={"/src/assets/home/b.webp"} />}
                title="Bookings"
                description="Easy online booking system to schedule your photography sessions."
              />
              </div>
          </div>
        </section>


        {/* Portfolio Section */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-20 w-11/12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Our Portfolio</h2>
              <p className="text-gray-400">Browse through our collection of stunning photography and videography projects.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

              <Link to="/portfolio" className="block relative group overflow-hidden">
                <PortfolioCard    
                  image="/src/assets/home/h_final.webp"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/70 transition-all duration-500">
                  <h1 className="text-[#C084FC] text-2xl font-extralight transform group-hover:scale-110 group-hover:text-3xl transition-all duration-500 hover:animate-pulse">
                    View Full Portfolio
                    <span className="block scale-0 group-hover:scale-100 transition-transform duration-500 text-base mt-2">
                      Click to explore more →
                    </span>
                  </h1>
                </div>
              </Link>
            </div>
          </div>
        </section>


        {/* Packages Section */}
        <section className="py-20 bg-[#111827]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-34">
          {/* Heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Packages</h2>
            <p className="text-gray-400">
            Choose from our carefully crafted packages or contact us for custom solutions tailored to your specific needs.
            </p>
          </div>

          {/* Grid of Packages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
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

        {/* Final Section */}
        <section className="py-20 bg-gradient-to-b from-[#581C87] to-[#111827]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#F3F4F6] mb-4">
            Ready to Capture Your Special Moments?
          </h2>
          <p className="text-[#D1D5DB] mb-8">
            Book your photography or videography session today and let us create lasting memories for you.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to={"/booking"}>
              <button className="flex items-center bg-white text-[#581C87] px-8 py-3 rounded-md hover:bg-gray-100 transition-colors hover:cursor-pointer">
                Book a Session
              </button>
            </Link>
            <Link to={"/contact"}>
              <button className="border border-white text-white px-6 py-3 rounded-md hover:bg-white/10 transition-colors hover:cursor-pointer">
                Contact Us
              </button>
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