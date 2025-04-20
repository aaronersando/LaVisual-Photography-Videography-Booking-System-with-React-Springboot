function ImageModal({ isOpen, onClose, image, title, category }) {
    if (!isOpen) return null;
  
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90" 
        onClick={onClose}
      >
        <div 
          className="relative w-full max-w-5xl" 
          onClick={e => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 text-white/80 hover:text-white"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
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