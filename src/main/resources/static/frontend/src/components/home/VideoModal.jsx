/**
 * Video Modal Component
 * 
 * This component displays a fullscreen modal that plays video content when opened.
 * It's typically used in portfolio galleries or video collections to provide a focused
 * video viewing experience when a user clicks on a video thumbnail.
 * 
 * Key features:
 * - Fullscreen overlay with semi-transparent black background
 * - Responsive video player that maintains aspect ratio
 * - Close button to dismiss the modal
 * - Click-outside behavior to close the modal
 * - Event propagation handling to prevent unwanted closing
 * - Displays video title below the player
 * 
 * The component takes the following props:
 * - isOpen: Boolean flag to control the visibility of the modal
 * - onClose: Function to call when the modal should be closed
 * - videoUrl: URL of the video to play
 * - title: Title text to display below the video
 */

import { faX } from "@fortawesome/free-solid-svg-icons"; // Import X icon for close button
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesome component

function VideoModal({ isOpen, onClose, videoUrl, title }) {
    // Don't render anything if the modal is not open
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90" onClick={onClose}>
        {/* Modal container - covers entire viewport with semi-transparent background */}
        {/* When clicked outside the content area, it will trigger onClose */}
        <div className="relative w-full max-w-4xl" onClick={e => e.stopPropagation()}>
          {/* Close Button - positioned at top right */}
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 text-white/80 hover:text-white"
          >
            <FontAwesomeIcon icon={faX} className="text-xl pt-2 pr-2"/>
          </button>
  
          {/* Video Player Container - maintains 16:9 aspect ratio with padding trick */}
          <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden">
            <video
              className="absolute inset-0 w-full h-full" // Fill the container completely
              control // Video controls (play, pause, etc.)
              autoPlay // Start playing automatically when modal opens
            >
              <source src={videoUrl} type="video/mp4" /> {/* Video source */}
              Your browser does not support the video tag. {/* Fallback text */}
            </video>
          </div>
  
          {/* Video Title - displayed below the video */}
          <h3 className="text-white text-lg font-medium mt-4">{title}</h3>
        </div>
      </div>
    );
  }
  
  export default VideoModal; // Export the component for use in other files