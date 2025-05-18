/**
 * Video Card Component
 * 
 * This component displays video items in a card format, primarily used in the
 * portfolio section to showcase video content. When clicked, it opens a modal
 * that plays the full video.
 * 
 * Key features:
 * - Displays a thumbnail image with a play button overlay
 * - Shows category and title information on hover
 * - Includes hover animations (scale effect on image, fade-in overlay)
 * - Opens a video player modal when clicked
 * - Consistent styling with the portfolio card design
 * 
 * This component works together with the VideoModal component to provide
 * a complete video browsing and playback experience.
 */

import { useState } from 'react'; // Import useState hook to manage modal open/close state
import VideoModal from './VideoModal'; // Import the modal component for video playback
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome component
import { faPlay } from '@fortawesome/free-solid-svg-icons'; // Import play button icon

function VideoCard({ videoUrl, thumbnail, category, title }) {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to track if video modal is open

  return (
    <>
      <div 
        className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
        onClick={() => setIsModalOpen(true)} // Open the video modal when card is clicked
      >
        {/* Thumbnail container */}
        <div className="relative">
          <img
            src={thumbnail} // Image preview of the video
            alt={title} // Accessibility text
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" // Image scales up slightly on hover
          />
          {/* Play Button Overlay - appears on hover */}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <FontAwesomeIcon icon={faPlay} className='text-4xl'/> {/* Play icon */}
          </div>
        </div>

        {/* Info Overlay - appears on hover with gradient background */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <span className="text-purple-400 text-sm">{category}</span> {/* Category label */}
            <h3 className="text-white font-semibold">{title}</h3> {/* Video title */}
          </div>
        </div>
      </div>

      {/* Video Modal - only rendered when isModalOpen is true */}
      <VideoModal
        isOpen={isModalOpen} // Controls whether modal is displayed
        onClose={() => setIsModalOpen(false)} // Function to close the modal
        videoUrl={videoUrl} // URL of the video to play
        title={title} // Title to display in the modal
      />
    </>
  );
}

export default VideoCard; // Export component for use in other files