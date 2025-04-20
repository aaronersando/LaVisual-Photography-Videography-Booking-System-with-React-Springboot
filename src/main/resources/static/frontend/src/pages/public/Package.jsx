import React, {useState} from "react";
import Navbar from "../../components/common/Navbar";
import FooterComp from "../../components/common/FooterComp";
import PackageCard from "../../components/home/PackageCard";

function Package() {
    const [category, setCategory] = useState("Photography");
  
    const packages = [
    // Photography
      {
        category: "Photography",
        title: "Intimate Session",
        price: "3,000",
        description: "Perfect For Individuals & Couples Wanting Professional Portraits.",
        features: [
          "3-Hours Photography Session",
          "1 Location",
          "150 Digital Edited Photos",
          "Online Gallery",
          "Personal Use Rights",
        ],
      },
      {
        category: "Photography",
        title: "Pre-Photoshoot",
        price: "3,500",
        description: "Coverage For Your Special Day With All The Essentials.",
        features: [
          "4-Hours Photography Session",
          "1 Photographer",
          "150+ Digital Edited Photos",
          "Online Gallery",
          "Personal Use Rights",
        ],
      },
      {
        category: "Photography",
        title: "Event Coverage",
        price: "4,500",
        description: "Ideal For Families Wanting To Capture Special Moments Together.",
        features: [
          "5-Hours Photography Session",
          "1 Location",
          "200+ Digital Edited Photos",
          "Online Gallery",
          "Personal Use Rights",
        ],
      },
      {
        category: "Photography",
        title: "Wedding",
        price: "5,000",
        description: "Coverage For Your Special Day With All The Essentials.",
        features: [
          "7-Hours Photography Session",
          "1 Photographer",
          "200+ Digital Edited Photos",
          "Engagement Session",
          "Online Gallery",
          "Personal Use Rights",
        ],
      },
      {
        category: "Photography",
        title: "Wedding Premium",
        price: "11,000",
        description: "Comprehensive Coverage For Your Wedding Day.",
        features: [
          "10-Hours Photography Session",
          "2 Photographers",
          "300+ Digital Edited Photos",
          "Engagement Session",
          "Online Gallery",
          "Wedding Album Design",
          "Personal Use Rights",
        ],
      },

    //   Videography
      {
        category: "Videography",
        title: "Event Highlight",
        price: "7,000",
        description: "Perfect For Capturing Highlights Of Your Special Event.",
        features: [
          "4-Hours of Coverage",
          "Edited Highlight Reel (3-5 Minutes)",
          "Professional Audio",
          "Digital Delivery",
          "Background Music",
        ],
      },
      {
        category: "Videography",
        title: "Same Day Edit",
        price: "12,000",
        description: "Professional Video For Your Business & Product",
        features: [
          "6-Hours of Coverage",
          "Edited Video (1-3 Minutes)",
          "Professional Audio",
          "1 Round of Revisions",
          "Digital Delivery",
          "Commercial Use Rights",
        ],
      },
      {
        category: "Videography",
        title: "Wedding Film",
        price: "15,000",
        description: "Cinematic Coverage Of Your Wedding Day.",
        features: [
          "8-Hours of Coverage",
          "Highlight Film (5-7 Minutes)",
          "Full Ceremony Edit",
          "Professional Audio",
          "Drone Footage",
          "Same Day Edit",
        ],
      },



    //   Combo Packages
      {
        category: "Photo + Video",
        title: "Pre-Shoot Combo",
        price: "10,000",
        description: "Full Photo & Video Coverage For Your Special Event",
        features: [
          "6-Hours of Coverage",
          "1 Photographer & 1 Videographer",
          "200+ Edited Photos",
          "Highlight Video (3-5 Minutes)",
          "Online Gallery",
          "Digital Delivery",
        ],
      },
      {
        category: "Photo + Video",
        title: "Event Complete",
        price: "13,000",
        description: "Full Photo & Video Coverage For Your Special Event.",
        features: [
          "8-Hours of Coverage",
          "2 Photographers & 1 Videographer",
          "400+ Edited Photos",
          "Highlight Video (3-5 Minutes)",
          "Online Gallery",
          "Digital Delivery",
        ],
      },
      {
        category: "Photo + Video",
        title: "Wedding Complete",
        price: "35,000",
        description: "The Ultimate Wedding Package With Photo & Video Coverage.",
        features: [
          "10-Hours of Coverage",
          "2 Photographers & 2 Videographers",
          "500+ Edited Photos",
          "Cinematic Highlight Film (7-10 Minutes)",
          "Full Ceremony Video",
          "Drone Footage",
          "Engagement Session",
          "Wedding Album",
          "Online Gallery",
          
        ],
      },
      
    ];
  
    const filteredPackages = packages.filter((pkg) => pkg.category === category);
  
    return (
      <>
        <Navbar />
        <section className="py-20 bg-[#111827]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-34">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Our Packages</h2>
              <p className="text-gray-400">
                Choose from our carefully crafted packages or contact us for custom
                solutions tailored to your specific needs.
              </p>
            </div>
  
            {/* Category Buttons */}
            <div className="flex justify-center mb-10">
                <div className="inline-flex shadow-md">
                    <button
                    onClick={() => setCategory("Photography")}
                    className={`px-4 py-2 text-sm font-medium ${
                        category === "Photography"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    } rounded-l-md`}
                    >
                    Photography
                    </button>
                    <button
                    onClick={() => setCategory("Videography")}
                    className={`px-4 py-2 text-sm font-medium ${
                        category === "Videography"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                    >
                    Videography
                    </button>
                    <button
                    onClick={() => setCategory("Photo + Video")}
                    className={`px-4 py-2 text-sm font-medium ${
                        category === "Photo + Video"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    } rounded-r-md`}
                    >
                    Combo Packages
                    </button>
                </div>
                </div>

  
            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {filteredPackages.map((pkg, index) => (
                <PackageCard key={index} {...pkg} />
              ))}
            </div>
          </div>
        </section>

        {/* Custom Package Section */}
        <div className="mx-35 mb-26 mt-0 bg-gray-800 rounded-xl px-6 py-12 text-center">
            <h3 className="text-2xl font-semibold text-white mb-4">
                Need a Custom Package?
            </h3>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                Don't see what you're looking for? We offer custom packages tailored to your specific needs and budget.
            </p>
            <a
                href="/custom-quote"
                className="inline-block rounded-md bg-[#9333EA] px-6 py-3 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
            >
                Contact Us for Custom Quote
            </a>
        </div>

        <FooterComp />
      </>
    );
  }
  
  export default Package;