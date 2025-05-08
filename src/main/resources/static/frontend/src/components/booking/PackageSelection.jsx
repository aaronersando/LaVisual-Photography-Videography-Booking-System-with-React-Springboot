import { useState } from 'react';
import { packages } from '../booking/PricingData';

function PackageSelection({ onNext, updateData, data }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    updateData({ category, package: null, price: 0 });
  };

  const handlePackageSelect = (packageItem) => {
    updateData({
      package: packageItem.name,
      price: packageItem.price,
      packageDetails: {
        hours: packageItem.hours,
        category: packageItem.category,
        description: packageItem.description
      }
    });
    onNext();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 sm:p-5 md:p-6">
      {/* Category Selection */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl text-white mb-3 sm:mb-4">Select a Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {Object.keys(packages).map((category) => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`p-3 sm:p-4 border rounded-lg transition-all ${
                selectedCategory === category
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-gray-600 hover:border-purple-500'
              }`}
            >
              <h3 className="text-white text-sm sm:text-base">{category}</h3>
            </button>
          ))}
        </div>
      </div>

      {/* Package Selection */}
      {selectedCategory && (
        <div>
          <h2 className="text-lg sm:text-xl text-white mb-3 sm:mb-4">Select a Package</h2>
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {packages[selectedCategory].map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => handlePackageSelect(pkg)}
                className="p-3 sm:p-4 border border-gray-600 rounded-lg hover:border-purple-500 text-left"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-sm sm:text-base">
                      {pkg.name} <span className="text-gray-400 text-xs sm:text-sm">({pkg.hours}-Hours)</span>
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">{pkg.description}</p>
                  </div>
                  <div className="text-purple-400 font-semibold text-right sm:text-base">
                    ₱{pkg.price.toLocaleString()}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PackageSelection;