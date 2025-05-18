/**
 * Service Card Component
 * 
 * This component displays an individual service offering in a card format.
 * It's used on the homepage and services page to showcase the different photography
 * and videography services available to customers.
 * 
 * Key features:
 * - Displays an icon, title, and description for each service
 * - Features a subtle hover animation with a light sweep effect
 * - Provides a direct "Book Now" link to the booking page
 * - Uses consistent styling with the dark theme of the website
 * - Responsive design that works well on all screen sizes
 * 
 * The component receives its content through props, making it reusable
 * across different service types throughout the application.
 */

import {Link} from "react-router-dom"; // Import Link component for navigation without page refresh


function ServiceCard({ icon, title, description }) {
    return (
      <div className="relative group flex bg-[#1F2937] text-center flex-col align-middle justify-center wrap-break-word rounded-lg p-6 border-zinc-700 hover:shadow-xl hover:ring-1 hover:ring-zinc-600 duration 300 overflow-hidden">
        {/* Animated light sweep effect that activates on hover */}
        <div className="h-[400px] w-10 bg-gradient-to-r from-white/10 via-white/50 to-white-10 absolute -left-46 -rotate-20 blur-sm group-hover:left-[150%] duration-700 group-hover:delay-200" />
        {/* Icon container */}
        <div className="mb-4 flex justify-center items-center">
          {icon} {/* Render the icon passed as a prop */}
        </div>
        {/* Service title */}
        <h3 className="text-lg font-semibold text-[#F3F4F6] mb-2">{title}</h3>
        {/* Service description */}
        <p className="text-[#9CA3AF] text-sm mb-4">{description}</p>
        {/* Call-to-action link to booking page */}
        <Link to="/booking" className="text-sm text-[#C084FC] font-thin">Book Now &gt;</Link>
      </div>
    );
  }
  
  export default ServiceCard; // Export component for use in other files