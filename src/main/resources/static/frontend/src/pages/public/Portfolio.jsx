import { useState, useRef, useEffect } from "react";
import FooterComp from "../../components/common/FooterComp";
import Navbar from "../../components/common/Navbar";
import PortfolioCard from "../../components/home/PortfolioCard";
import VideoCard from "../../components/home/VideoCard";
import { motion, AnimatePresence } from "framer-motion";
import TypeWriterEffect from 'react-typewriter-effect';

const portfolioItems = [
// Wedding
  {
    image: "/src/assets/portfolio/wedding/new/1.webp",
    title: "Dino and Jasmine's Wedding",
    category: "Wedding",
  },
  {
    image: "/src/assets/portfolio/wedding/new/2.webp",
    title: "Dino and Jasmine's Wedding",
    category: "Wedding",
  },
  {
    image: "/src/assets/portfolio/wedding/new/3.webp",
    title: "Dino and Jasmine's Wedding",
    category: "Wedding",
  },
  {
    image: "/src/assets/portfolio/wedding/new/4.webp",
    title: "Dino and Jasmine's Wedding",
    category: "Wedding",
  },
  {
    image: "/src/assets/portfolio/wedding/new/5.webp",
    title: "Dino and Jasmine's Wedding",
    category: "Wedding",
  },
  {
    image: "/src/assets/portfolio/wedding/new/6.webp",
    title: "Dino and Jasmine's Wedding",
    category: "Wedding",
  },


// Portrait
    {
    image: "/src/assets/portfolio/portrait/new/1.webp",
    title: "Ann's Portrait",
    category: "Portrait",
  },
    {
    image: "/src/assets/portfolio/portrait/new/2.webp",
    title: "Ann's Portrait",
    category: "Portrait",
  },
    {
    image: "/src/assets/portfolio/portrait/new/3.webp",
    title: "Ann's Portrait",
    category: "Portrait",
  },
    {
    image: "/src/assets/portfolio/portrait/new/4.webp",
    title: "Ann's Portrait",
    category: "Portrait",
  },
    {
    image: "/src/assets/portfolio/portrait/new/5.webp",
    title: "Ann's Portrait",
    category: "Portrait",
  },
    {
    image: "/src/assets/portfolio/portrait/new/6.webp",
    title: "Ann's Portrait",
    category: "Portrait",
  },
    {
    image: "/src/assets/portfolio/portrait/new/7.webp",
    title: "Ann's Portrait",
    category: "Portrait",
  },
    {
    image: "/src/assets/portfolio/portrait/new/8.webp",
    title: "Ann's Portrait",
    category: "Portrait",
  },
    {
    image: "/src/assets/portfolio/portrait/new/9.webp",
    title: "Ann's Portrait",
    category: "Portrait",
  },
    {
    image: "/src/assets/portfolio/portrait/new/10.webp",
    title: "Ann's Portrait",
    category: "Portrait",
  },
    {
    image: "/src/assets/portfolio/portrait/new/11.webp",
    title: "Ann's Portrait",
    category: "Portrait",
  },
    {
    image: "/src/assets/portfolio/portrait/new/12.webp",
    title: "Ann's Portrait",
    category: "Portrait",
  },

//   prebirthday
{
    image: "/src/assets/portfolio/pre-birthday/new/1.webp",
    title: "Kimberyly's Pre-Debut",
    category: "Pre-Birthday",
  },
{
    image: "/src/assets/portfolio/pre-birthday/new/2.webp",
    title: "Kimberyly's Pre-Debut",
    category: "Pre-Birthday",
  },
{
    image: "/src/assets/portfolio/pre-birthday/new/3.webp",
    title: "Kimberyly's Pre-Debut",
    category: "Pre-Birthday",
  },
{
    image: "/src/assets/portfolio/pre-birthday/new/4.webp",
    title: "Kimberyly's Pre-Debut",
    category: "Pre-Birthday",
  },
{
    image: "/src/assets/portfolio/pre-birthday/new/5.webp",
    title: "Kimberyly's Pre-Debut",
    category: "Pre-Birthday",
  },
{
    image: "/src/assets/portfolio/pre-birthday/new/6.webp",
    title: "Kimberyly's Pre-Debut",
    category: "Pre-Birthday",
  },
{
    image: "/src/assets/portfolio/pre-birthday/new/7.webp",
    title: "Kimberyly's Pre-Debut",
    category: "Pre-Birthday",
  },
{
    image: "/src/assets/portfolio/pre-birthday/new/8.webp",
    title: "Kimberyly's Pre-Debut",
    category: "Pre-Birthday",
  },
{
    image: "/src/assets/portfolio/pre-birthday/new/9.webp",
    title: "Kimberyly's Pre-Debut",
    category: "Pre-Birthday",
  },
{
    image: "/src/assets/portfolio/pre-birthday/new/10.webp",
    title: "Kimberyly's Pre-Debut",
    category: "Pre-Birthday",
  },
{
    image: "/src/assets/portfolio/pre-birthday/new/11.webp",
    title: "Kimberyly's Pre-Debut",
    category: "Pre-Birthday",
  },
{
    image: "/src/assets/portfolio/pre-birthday/new/12.webp",
    title: "Kimberyly's Pre-Debut",
    category: "Pre-Birthday",
  },

// prenup
  {
    image: "/src/assets/portfolio/pre-nup/new/1.webp",
    title: "Keight & Shaira's Pre-Nup",
    category: "Pre-Nup",
  },
  {
    image: "/src/assets/portfolio/pre-nup/new/2.webp",
    title: "Keight & Shaira's Pre-Nup",
    category: "Pre-Nup",
  },
  {
    image: "/src/assets/portfolio/pre-nup/new/3.webp",
    title: "Keight & Shaira's Pre-Nup",
    category: "Pre-Nup",
  },
  {
    image: "/src/assets/portfolio/pre-nup/new/4.webp",
    title: "Keight & Shaira's Pre-Nup",
    category: "Pre-Nup",
  },
  {
    image: "/src/assets/portfolio/pre-nup/new/5.webp",
    title: "Keight & Shaira's Pre-Nup",
    category: "Pre-Nup",
  },
  {
    image: "/src/assets/portfolio/pre-nup/new/6.webp",
    title: "Keight & Shaira's Pre-Nup",
    category: "Pre-Nup",
  },
  {
    image: "/src/assets/portfolio/pre-nup/new/7.webp",
    title: "Keight & Shaira's Pre-Nup",
    category: "Pre-Nup",
  },
  {
    image: "/src/assets/portfolio/pre-nup/new/8.webp",
    title: "Keight & Shaira's Pre-Nup",
    category: "Pre-Nup",
  },
  {
    image: "/src/assets/portfolio/pre-nup/new/9.webp",
    title: "Keight & Shaira's Pre-Nup",
    category: "Pre-Nup",
  },
  {
    image: "/src/assets/portfolio/pre-nup/new/10.webp",
    title: "Keight & Shaira's Pre-Nup",
    category: "Pre-Nup",
  },
  {
    image: "/src/assets/portfolio/pre-nup/new/11.webp",
    title: "Keight & Shaira's Pre-Nup",
    category: "Pre-Nup",
  },
  {
    image: "/src/assets/portfolio/pre-nup/new/12.webp",
    title: "Keight & Shaira's Pre-Nup",
    category: "Pre-Nup",
  },

// Baptismal
  {
    image: "/src/assets/portfolio/baptismal/new/1.webp",
    title: "Astrid's Baptism",
    category: "Baptismal",
  },
  {
    image: "/src/assets/portfolio/baptismal/new/2.webp",
    title: "Astrid's Baptism",
    category: "Baptismal",
  },
  {
    image: "/src/assets/portfolio/baptismal/new/3.webp",
    title: "Astrid's Baptism",
    category: "Baptismal",
  },
  {
    image: "/src/assets/portfolio/baptismal/new/4.webp",
    title: "Astrid's Baptism",
    category: "Baptismal",
  },
  {
    image: "/src/assets/portfolio/baptismal/new/5.webp",
    title: "Astrid's Baptism",
    category: "Baptismal",
  },
  {
    image: "/src/assets/portfolio/baptismal/new/6.webp",
    title: "Astrid's Baptism",
    category: "Baptismal",
  },
  {
    image: "/src/assets/portfolio/baptismal/new/7.webp",
    title: "Astrid's Baptism",
    category: "Baptismal",
  },
  {
    image: "/src/assets/portfolio/baptismal/new/8.webp",
    title: "Astrid's Baptism",
    category: "Baptismal",
  },
  {
    image: "/src/assets/portfolio/baptismal/new/9.webp",
    title: "Astrid's Baptism",
    category: "Baptismal",
  },
  {
    image: "/src/assets/portfolio/baptismal/new/10.webp",
    title: "Astrid's Baptism",
    category: "Baptismal",
  },
  {
    image: "/src/assets/portfolio/baptismal/new/11.webp",
    title: "Astrid's Baptism",
    category: "Baptismal",
  },
  {
    image: "/src/assets/portfolio/baptismal/new/12.webp",
    title: "Astrid's Baptism",
    category: "Baptismal",
  },

// Occasion
  {
    image: "/src/assets/portfolio/occasion/new/1.webp",
    title: "Zeny's 60th Birthday",
    category: "Occasion",
  },
  {
    image: "/src/assets/portfolio/occasion/new/2.webp",
    title: "Zeny's 60th Birthday",
    category: "Occasion",
  },
  {
    image: "/src/assets/portfolio/occasion/new/3.webp",
    title: "Zeny's 60th Birthday",
    category: "Occasion",
  },
  {
    image: "/src/assets/portfolio/occasion/new/4.webp",
    title: "Zeny's 60th Birthday",
    category: "Occasion",
  },
  {
    image: "/src/assets/portfolio/occasion/new/5.webp",
    title: "Zeny's 60th Birthday",
    category: "Occasion",
  },
  {
    image: "/src/assets/portfolio/occasion/new/6.webp",
    title: "Zeny's 60th Birthday",
    category: "Occasion",
  },
  {
    image: "/src/assets/portfolio/occasion/new/7.webp",
    title: "Zeny's 60th Birthday",
    category: "Occasion",
  },
  {
    image: "/src/assets/portfolio/occasion/new/8.webp",
    title: "Zeny's 60th Birthday",
    category: "Occasion",
  },
  {
    image: "/src/assets/portfolio/occasion/new/9.webp",
    title: "Zeny's 60th Birthday",
    category: "Occasion",
  },
  {
    image: "/src/assets/portfolio/occasion/new/10.webp",
    title: "Zeny's 60th Birthday",
    category: "Occasion",
  },
  {
    image: "/src/assets/portfolio/occasion/new/11.webp",
    title: "Zeny's 60th Birthday",
    category: "Occasion",
  },
  {
    image: "/src/assets/portfolio/occasion/new/12.webp",
    title: "Zeny's 60th Birthday",
    category: "Occasion",
  },

  // Sports
  {
    image: "/src/assets/portfolio/sports/new/1.webp",
    title: "San Jose Basketball League",
    category: "Sports",
  },
  {
    image: "/src/assets/portfolio/sports/new/2.webp",
    title: "San Jose Basketball League",
    category: "Sports",
  },
  {
    image: "/src/assets/portfolio/sports/new/3.webp",
    title: "San Jose Basketball League",
    category: "Sports",
  },
  {
    image: "/src/assets/portfolio/sports/new/4.webp",
    title: "San Jose Basketball League",
    category: "Sports",
  },
  {
    image: "/src/assets/portfolio/sports/new/5.webp",
    title: "San Jose Basketball League",
    category: "Sports",
  },
  {
    image: "/src/assets/portfolio/sports/new/6.webp",
    title: "San Jose Basketball League",
    category: "Sports",
  },
  {
    image: "/src/assets/portfolio/sports/new/7.webp",
    title: "San Jose Basketball League",
    category: "Sports",
  },
  {
    image: "/src/assets/portfolio/sports/new/8.webp",
    title: "San Jose Basketball League",
    category: "Sports",
  },
  {
    image: "/src/assets/portfolio/sports/new/9.webp",
    title: "San Jose Basketball League",
    category: "Sports",
  },
  {
    image: "/src/assets/portfolio/sports/new/10.webp",
    title: "San Jose Basketball League",
    category: "Sports",
  },
  {
    image: "/src/assets/portfolio/sports/new/11.webp",
    title: "San Jose Basketball League",
    category: "Sports",
  },
  {
    image: "/src/assets/portfolio/sports/new/12.webp",
    title: "San Jose Basketball League",
    category: "Sports",
  },

  // Video Items
  {
    type: "video",
    videoUrl: "/src/assets/portfolio/video/kj.mp4",
    thumbnail: "/src/assets/portfolio/video/1.webp",
    title: "Khay & Jha's SDE Video",
    category: "Video"
  },
  {
    type: "video",
    videoUrl: "/src/assets/portfolio/video/j-bday.mp4",
    thumbnail: "/src/assets/portfolio/video/2.webp",
    title: "Joesan's Birthday Highlights",
    category: "Video"
  },
  {
    type: "video",
    videoUrl: "/src/assets/portfolio/video/ks.mp4",
    thumbnail: "/src/assets/portfolio/video/3.webp",
    title: "Keight and Shaira's Photo Highlights",
    category: "Video"
  },
];

function Portfolio() {
  const [category, setCategory] = useState("Wedding");
  const categoryRefs = useRef({});
  const [indicator, setIndicator] = useState({ width: 0, left: 0 });

  const filteredItems = portfolioItems.filter((item) => item.category === category);

  const categories = [
    "Wedding",
    "Portrait", 
    "Pre-Birthday",
    "Pre-Nup",
    "Video",
    "Baptismal",
    "Occasion",
    "Sports",
  ];

  useEffect(() => {
    const currentRef = categoryRefs.current[category];
    if (currentRef) {
      const rect = currentRef.getBoundingClientRect();
      const parentRect = currentRef.parentElement.getBoundingClientRect();
      
      setIndicator({
        width: rect.width,
        left: rect.left - parentRect.left,
      });
    }
  }, [category]);

  useEffect(() => {
    const handleResize = () => {
      const currentRef = categoryRefs.current[category];
      if (currentRef) {
        const rect = currentRef.getBoundingClientRect();
        const parentRect = currentRef.parentElement.getBoundingClientRect();
        
        setIndicator({
          width: rect.width,
          left: rect.left - parentRect.left,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [category]);

  const renderPortfolioItem = (item, index) => {
    if (item.type === "video") {
      return (
        <VideoCard
          key={index}
          videoUrl={item.videoUrl}
          thumbnail={item.thumbnail}
          category={item.category}
          title={item.title}
        />
      );
    }
    
    return <PortfolioCard key={index} {...item} />;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const titleVariants = {
    hidden: { y: -30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  return (
    <>
      <Navbar />
      <motion.section 
        className="py-20 bg-[#111827] min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          <motion.div 
            className="text-center mb-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
              variants={titleVariants}
            >
              Our Portfolio
            </motion.h2>
            <motion.div 
              className="max-w-xl mx-auto"
              variants={itemVariants}
            >
              <TypeWriterEffect
                textStyle={{
                  fontFamily: 'inherit',
                  color: '#9CA3AF',
                  fontWeight: 'normal',
                  fontSize: '1rem',
                  maxWidth: '100%',
                  textAlign: 'center',
                }}
                startDelay={100}
                cursorColor="#C084FC"
                text="Browse our collection of photography and videography projects. Filter by category to find specific work."
                typeSpeed={40}
              />
            </motion.div>
          </motion.div>

          <div className="flex justify-center mb-10">
            <div className="relative inline-flex bg-gray-800 rounded-lg shadow-lg p-1">
              <motion.div 
                className="absolute bg-purple-600 rounded-md z-0"
                initial={false}
                animate={{
                  width: indicator.width,
                  left: indicator.left,
                  height: "calc(100% - 8px)",
                  top: 4
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  duration: 0.4,
                }}
              />
              
              <div className="flex flex-wrap justify-center gap-1 relative z-10">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    ref={el => categoryRefs.current[cat] = el}
                    onClick={() => setCategory(cat)}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md
                      ${category === cat ? "text-white" : "text-gray-300 hover:text-white"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={category}
              className="grid grid-cols-1 mx-16 md:mx-4 lg:mx-20 sm:grid-cols-2 md:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
            >
              {filteredItems.map((item, index) => (
                <motion.div key={index} variants={itemVariants}>
                  {renderPortfolioItem(item, index)}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.section>
      <FooterComp />
    </>
  );
}

export default Portfolio;