/**
 * Package Selection Component
 * 
 * This component represents the first step in the booking process, allowing users to select
 * a service category and a specific package within that category. It's a two-stage selection:
 * 
 * 1. First, users select a service category (Photography, Videography, Photo + Video)
 * 2. Then, they select a specific package from the available options in that category
 * 
 * The component dynamically displays available categories and their packages from the imported
 * pricing data. It handles user selections and passes the selected data up to the parent
 * component for further processing in the booking flow.
 * 
 * Key features:
 * - Responsive grid layout that adapts to different screen sizes
 * - Visual feedback for selected category with purple highlighting
 * - Package cards showing name, duration, description, and price
 * - Automatic advancement to the next step upon package selection
 * 
 * This component is typically the first step in a multi-step booking process.
 */

import { useState } from 'react'; // Import React's useState hook for state management
import { packages } from '../booking/PricingData'; // Import package and pricing data from a separate file

function PackageSelection({ onNext, updateData, data }) {
  // State to track which category is currently selected
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Handler for when a category is selected
  const handleCategorySelect = (category) => {
    setSelectedCategory(category); // Update local state with the selected category
    updateData({ category, package: null, price: 0 }); // Update parent component's data, resetting package and price
  };

  // Handler for when a specific package is selected
  const handlePackageSelect = (packageItem) => {
    // Update the parent component's data with complete package information
    updateData({
      package: packageItem.name, // Store the package name
      price: packageItem.price, // Store the package price
      packageDetails: {
        hours: packageItem.hours, // Store session duration in hours
        category: packageItem.category, // Store category name again
        description: packageItem.description // Store package description
      }
    });
    onNext(); // Move to the next step in the booking process
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 sm:p-5 md:p-6">
      {/* Category Selection Section */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl text-white mb-3 sm:mb-4">Select a Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {/* Generate a button for each available category */}
          {Object.keys(packages).map((category) => (
            <button
              key={category} // Use category name as unique key
              onClick={() => handleCategorySelect(category)} // Call handler when category is clicked
              className={`p-3 sm:p-4 border rounded-lg transition-all ${
                selectedCategory === category
                  ? 'border-purple-500 bg-purple-500/20' // Visual highlight for selected category
                  : 'border-gray-600 hover:border-purple-500' // Default style with hover effect
              }`}
            >
              <h3 className="text-white text-sm sm:text-base">{category}</h3>
            </button>
          ))}
        </div>
      </div>

      {/* Package Selection Section - Only shown after a category is selected */}
      {selectedCategory && (
        <div>
          <h2 className="text-lg sm:text-xl text-white mb-3 sm:mb-4">Select a Package</h2>
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {/* Generate a card button for each package in the selected category */}
            {packages[selectedCategory].map((pkg) => (
              <button
                key={pkg.id} // Use package ID as unique key
                onClick={() => handlePackageSelect(pkg)} // Call handler when package is clicked
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
                    ₱{pkg.price.toLocaleString()} {/* Display price in Philippine Pesos with thousands separator */}
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

export default PackageSelection; // Export the component for use in the booking flow