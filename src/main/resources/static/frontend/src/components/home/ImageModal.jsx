import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ImageModal({ isOpen, onClose, image, title, category }) {
    if (!isOpen) return null;
  
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90" 
        onClick={onClose}
      >
        <div 
          className="relative w-full max-w-5xl mt-5" 
          onClick={e => e.stopPropagation()}
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
              src={image}
              alt={title}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <span className="text-purple-400 text-sm block">{category}</span>
              <h3 className="text-white text-xl font-semibold">{title}</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default ImageModal;