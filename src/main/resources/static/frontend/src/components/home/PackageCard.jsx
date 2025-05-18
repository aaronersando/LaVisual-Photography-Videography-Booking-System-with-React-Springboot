/**
 * Package Card Component
 * 
 * This component displays a stylized card representing a photography/videography service package.
 * It's used throughout the application to showcase different service packages with their pricing
 * and included features in a visually consistent way.
 * 
 * Key features:
 * - Displays category, title, price, and description of a service package
 * - Lists all included features with checkmark icons
 * - Provides a direct "Book Now" button that navigates to the booking page
 * - Features responsive styling with hover effects for better user interaction
 * - Maintains consistent sizing across different content lengths
 * 
 * The component is primarily used in the Package listing page and the Home page packages section,
 * where it helps potential customers explore and compare different service offerings.
 */

import {Link} from "react-router-dom"; // Import Link component for navigation to booking page

function PackageCard({ category, title, price, description, features }) {
  return (
    // Main card container with styling for border, background, and hover effect
    // Uses group class for coordinating hover effects across child elements
    <div className="group rounded-xl overflow-hidden border border-gray-700 bg-[#111827] text-white w-full transition-colors duration-300 hover:border-purple-500 flex flex-col" style={{ minHeight: "600px" }}>
      {/* Top section - contains package info and booking button */}
      <div className="bg-[#1f2937] p-6" style={{ minHeight: "240px" }}>
        {/* Category label with purple text */}
        <p className="text-sm text-[#C084FC] font-light mb-1">{category}</p>

        {/* Package title */}
        <h3 className="text-xl font-semibold mb-1">{title}</h3>

        {/* Price information with peso sign and "starting price" label */}
        <div className="mb-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold">₱{price}</span>
          <span className="text-gray-400 text-sm">starting price</span>
        </div>

        {/* Package description text */}
        <p className="text-sm text-gray-300 mb-5">{description}</p>

        {/* Booking button with link to booking page */}
        <Link to={"/booking"}>
          <button className="w-full bg-[#374151] transition text-white py-2 rounded-md font-medium hover:cursor-pointer group-hover:bg-purple-600">
            Book Now
          </button>
        </Link>
      </div>

      {/* Divider line between top and bottom sections */}
      <div className="h-[1px] bg-gray-700 w-full" />

      {/* Bottom section - contains the features list */}
      <div className="p-6 pb-12 bg-transparent flex-grow" style={{ minHeight: "320px" }}>
        <h4 className="text-sm font-semibold mb-3 text-white">What's included:</h4>
        {/* List of features with check marks */}
        <ul className="space-y-3 text-sm text-gray-200">
          {/* Map through each feature in the features array */}
          {features?.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">✔️</span> {/* Checkmark icon */}
              <span>{feature}</span> {/* Feature text */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PackageCard; // Export the component for use in other files