function ServiceCard({ icon, title, description }) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors duration-300">
        <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    );
  }
  
  export default ServiceCard;