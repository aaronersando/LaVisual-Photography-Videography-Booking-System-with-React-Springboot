/**
 * Image Modal Component
 * 
 * This component displays a fullscreen modal that shows an enlarged version of an image with its details.
 * It's typically used in portfolio galleries or image collections to provide a focused view of a selected image.
 * 
 * Key features:
 * - Fullscreen overlay with semi-transparent black background
 * - Responsive image display that maintains aspect ratio
 * - Close button and click-outside behavior to dismiss
 * - Information overlay showing image category and title
 * - Event propagation handling to prevent unwanted modal closing
 * 
 * The component takes the following props:
 * - isOpen: Boolean flag to control the visibility of the modal
 * - onClose: Function to call when the modal should be closed
 * - image: URL of the image to display
 * - title: Title text to display with the image
 * - category: Category text to display with the image
 */

import { faX } from "@fortawesome/free-solid-svg-icons"; // Import X icon for close button
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesome component

function ImageModal({ isOpen, onClose, image, title, category }) {
    // Don't render anything if the modal is not open
    if (!isOpen) return null;
  
    return (
      <div 
        // Modal overlay - covers the entire viewport with semi-transparent black background
        // When clicked, it will close the modal (via the onClose function)
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90" 
        onClick={onClose}
      >
        <div 
          // Modal content container - contains the image and prevents clicks from closing the modal
          className="relative w-full max-w-5xl mt-5" 
          onClick={e => e.stopPropagation()} // Prevent click events from bubbling up to the overlay
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute z-51 -top-0 right-5 text-white/80 hover:text-white"
          >
            <FontAwesomeIcon icon={faX} className="text-lg pr-4 pt-4 hover:cursor-pointer"/>
          </button>
  
          {/* Image Container */}
          <div className="relative bg-black rounded-lg overflow-hidden">
            <img
              src={image} // The image URL passed as a prop
              alt={title} // Use the title as alt text for accessibility
              className="w-full h-auto max-h-[80vh] object-contain" // Responsive sizing with max height
            />
            {/* Caption overlay - gradient background at bottom of image */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <span className="text-purple-400 text-sm block">{category}</span>
              <h3 className="text-white text-xl font-semibold">{title}</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default ImageModal; // Export the component for use in other parts of the application