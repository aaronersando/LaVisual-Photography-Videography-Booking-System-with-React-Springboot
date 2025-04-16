import { useState } from "react";
import FooterComp from "../../components/common/FooterComp";
import Navbar from "../../components/common/Navbar";
import PortfolioCard from "../../components/home/PortfolioCard";

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



];

function Portfolio() {
  const [category, setCategory] = useState("Wedding");

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

  return (
    <>
      <Navbar />
      <section className="py-20 bg-[#111827] min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Portfolio</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Browse our collection of photography and videography projects. Filter by category to find specific work.
            </p>
          </div>

          {/* Category Buttons */}
          <div className="flex justify-center mb-10">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition ${
                    category === cat
                      ? "bg-purple-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 mx-16 md:mx-4 lg:mx-20 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <PortfolioCard key={index} {...item} />
            ))}
          </div>
        </div>
      </section>
      <FooterComp />
    </>
  );
}

export default Portfolio;
