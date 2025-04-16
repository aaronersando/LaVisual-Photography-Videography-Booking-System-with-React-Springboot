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
      price: packageItem.price
    });
    onNext();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      {/* Category Selection */}
      <div className="mb-8">
        <h2 className="text-xl text-white mb-4">Select a Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.keys(packages).map((category) => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`p-4 border rounded-lg transition-all ${
                selectedCategory === category
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-gray-600 hover:border-purple-500'
              }`}
            >
              <h3 className="text-white">{category}</h3>
            </button>
          ))}
        </div>
      </div>

      {/* Package Selection */}
      {selectedCategory && (
        <div>
          <h2 className="text-xl text-white mb-4">Select a Package</h2>
          <div className="grid grid-cols-1 gap-4">
            {packages[selectedCategory].map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => handlePackageSelect(pkg)}
                className="p-4 border border-gray-600 rounded-lg hover:border-purple-500 text-left"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-semibold">{pkg.name}</h3>
                    <p className="text-gray-400 text-sm">{pkg.description}</p>
                  </div>
                  <div className="text-purple-400 font-semibold">
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