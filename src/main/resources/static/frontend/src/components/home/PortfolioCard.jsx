function PortfolioCard({ image, category, title }) {
    return (
      <div className="group relative overflow-hidden rounded-lg">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <span className="text-purple-400 text-sm">{category}</span>
            <h3 className="text-white font-semibold">{title}</h3>
          </div>
        </div>
      </div>
    );
  }
  
  export default PortfolioCard;