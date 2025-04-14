function PackageCard({ title, price, features }) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors duration-300">
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <div className="mb-4">
          <span className="text-3xl font-bold text-white">₱{price}</span>
          <span className="text-gray-400">/session</span>
        </div>
        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-400">
              <svg className="w-4 h-4 mr-2 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
        <button className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors">
          Select Package
        </button>
      </div>
    );
  }
  
  export default PackageCard;