/**
 * FAQ Card Component
 * 
 * This component renders a responsive, styled card for displaying Frequently Asked Questions
 * and their answers. It's designed to be used in FAQ sections throughout the application,
 * particularly on pages like Contact or Support where users might need quick answers.
 * 
 * Key features:
 * - Clean, minimalist design with dark theme styling
 * - Subtle hover effect to enhance user interaction
 * - Clearly distinguished heading and description text
 * - Smooth color transition animation on hover
 * - Fully responsive with appropriate spacing
 * 
 * The component follows a simple structure with the question displayed prominently
 * at the top and the answer below in a lighter color for visual hierarchy.
 * 
 * @param {string} heading - The question or FAQ title
 * @param {string} description - The answer or explanation text
 * @returns {JSX.Element} A styled FAQ card component
 */
function FAQcard({ heading, description }) {
    return (
      // Main container with dark background, rounded corners, padding and hover effect
      // The transition-colors and duration-300 create a smooth color change animation on hover
      <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors duration-300">
        {/* Heading container with bottom margin for spacing */}
        <div className="mb-4">
          {/* Question text styled as prominent heading */}
          <h3 className="text-lg font-medium text-white">{heading}</h3>
        </div>
        {/* Description container */}
        <div>
          {/* Answer text in lighter gray color for visual hierarchy */}
          <p className="text-gray-400">{description}</p>
        </div>
      </div>
    );
  }
  
  // Export the component to make it available for import in other files
  export default FAQcard;