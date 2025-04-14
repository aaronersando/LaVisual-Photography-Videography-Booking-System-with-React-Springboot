import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/FooterComp";
import HeroSection from "../../components/home/HeroSection";
import ServiceCard from "../../components/home/ServiceCard";
import PortfolioCard from "../../components/home/PortfolioCard";
import PackageCard from "../../components/home/PackageCard";

function Home() {
  return (
    <>
      <Navbar />
      
      <main>
        <HeroSection />

        {/* Services Section */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Our Services</h2>
              <p className="text-gray-400">Professional photography and videography services</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ServiceCard
                icon={<svg className="w-6 h-6 text-purple-500" /* Add icon SVG path */ />}
                title="Weddings"
                description="Capture your special day with our professional wedding photography services."
              />
              {/* Add more ServiceCards */}
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Our Portfolio</h2>
              <p className="text-gray-400">Browse through our recent work</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <PortfolioCard
                image="/path-to-image.jpg"
                category="Wedding"
                title="John & Sarah's Wedding"
              />
              {/* Add more PortfolioCards */}
            </div>
          </div>
        </section>

        {/* Packages Section */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Our Packages</h2>
              <p className="text-gray-400">Choose the perfect package for your needs</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PackageCard
                title="Basic Package"
                price="15,000"
                features={[
                  "4 Hours Coverage",
                  "100 Edited Photos",
                  "Online Gallery",
                  "Basic Retouching"
                ]}
              />
              {/* Add more PackageCards */}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-purple-600">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Capture Your Special Moments?</h2>
            <p className="text-white/80 mb-8">Let's create memories that will last a lifetime</p>
            <div className="flex justify-center space-x-4">
              <button className="bg-white text-purple-600 px-6 py-3 rounded-md hover:bg-gray-100 transition-colors">
                Book Now
              </button>
              <button className="border border-white text-white px-6 py-3 rounded-md hover:bg-white/10 transition-colors">
                Contact Us
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Home;