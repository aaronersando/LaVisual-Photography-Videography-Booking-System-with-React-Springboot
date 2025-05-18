/**
 * Portfolio Card Component
 * 
 * This component renders an individual portfolio item card that displays
 * an image with hover effects and an optional overlay showing category and title.
 * When clicked, it opens a modal with a larger view of the image and more details.
 * 
 * Key features:
 * - Displays portfolio images in a consistent, stylized card format
 * - Shows image category and title on hover
 * - Implements hover animations including zoom effect and text overlay
 * - Opens a detailed modal view when clicked
 * - Fully responsive design that works across different screen sizes
 * 
 * This component is used primarily in the Portfolio page and Home page portfolio
 * sections to display photography and videography work samples.
 */

import { useState } from 'react'; // Import React useState hook to manage modal open/close state
import ImageModal from './ImageModal'; // Import the modal component that will show the expanded image

function PortfolioCard({ image, category, title }) {
  // State to track whether the modal is open or closed
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Card container with hover effects */}
      <div 
        className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
        onClick={() => setIsModalOpen(true)} // Open modal when card is clicked
      >
        {/* Portfolio image */}
        <img
          src={image} // Image source URL passed as prop
          alt={title} // Accessibility alt text using the title
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" // Image scales up on hover
        />
        {/* Gradient overlay that appears on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Text container at bottom of card */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <span className="text-purple-400 text-sm">{category}</span> {/* Category label with purple text */}
            <h3 className="text-white font-semibold">{title}</h3> {/* Title with white text */}
          </div>
        </div>
      </div>

      {/* Image Modal - only rendered when open */}
      <ImageModal
        isOpen={isModalOpen} // Controls modal visibility
        onClose={() => setIsModalOpen(false)} // Function to close the modal
        image={image} // Pass the same image to the modal
        title={title} // Pass the title to display in modal
        category={category} // Pass the category to display in modal
      />
    </>
  );
}

export default PortfolioCard; // Export the component for use in other files