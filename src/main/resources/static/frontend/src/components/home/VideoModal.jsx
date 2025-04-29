import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function VideoModal({ isOpen, onClose, videoUrl, title }) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90" onClick={onClose}>
        <div className="relative w-full max-w-4xl" onClick={e => e.stopPropagation()}>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 text-white/80 hover:text-white"
          >
            <FontAwesomeIcon icon={faX} className="text-xl pt-2 pr-2"/>
          </button>
  
          {/* Video Player */}
          <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden">
            <video
              className="absolute inset-0 w-full h-full"
              control
              autoPlay
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
  
          {/* Video Title */}
          <h3 className="text-white text-lg font-medium mt-4">{title}</h3>
        </div>
      </div>
    );
  }
  
  export default VideoModal;