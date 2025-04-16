import { useState } from 'react';
import VideoModal from './VideoModal';

function VideoCard({ videoUrl, thumbnail, category, title }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div 
        className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Thumbnail */}
        <div className="relative">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg 
              className="w-16 h-16 text-white/90" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Info Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <span className="text-purple-400 text-sm">{category}</span>
            <h3 className="text-white font-semibold">{title}</h3>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoUrl={videoUrl}
        title={title}
      />
    </>
  );
}

export default VideoCard;