/**
 * Booking Steps Component
 * 
 * This component renders a progress indicator showing the steps in the booking process.
 * It visually displays which steps have been completed, which is the current step,
 * and which steps are upcoming, using different colors and icons to indicate status.
 * 
 * Key features:
 * - Color-coded step indicators (green for completed, purple for current, gray for upcoming)
 * - Checkmark icons for completed steps, numbers for current and upcoming steps
 * - Connected steps with colored bars to show progress flow
 * - Fully responsive design that adapts to different screen sizes
 * - Horizontal scrolling support for small screens with many steps
 * 
 * This component is used in the booking flow to help users understand where they are
 * in the multi-step booking process and how many steps remain.
 */

import { faCheck } from "@fortawesome/free-solid-svg-icons"; // Import checkmark icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesome component

function BookingSteps({ steps, currentStep }) {
  return (
    <div className="flex justify-center items-center mb-6 sm:mb-8 overflow-x-auto py-2 w-full">
      {steps.map((step, index) => {
        // Determine the status of each step
        const isCompleted = step.id < currentStep; // Steps with IDs less than current are completed
        const isCurrent = step.id === currentStep; // Step with ID matching current is active
        const isUpcoming = step.id > currentStep; // Steps with IDs greater than current are upcoming

        // Determine background color for the step circle based on status
        const circleColor = 
          isCompleted
          ? 'bg-[#22C55E]' // Green for completed steps
          : isCurrent
          ? 'bg-[#9333EA]' // Purple for current step
          : isUpcoming
          ? 'bg-[#374151]' // Dark gray for upcoming steps
          : '';

        // Determine color for connector bar - green if the step before it is completed
        const connectorColor = isCompleted
          ? 'bg-[#22C55E]' // Green for connectors after completed steps
          : 'bg-[#374151]'; // Dark gray for other connectors

        return (
          <div key={step.id} className="flex items-center flex-shrink-0">
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${circleColor}`}
              >
                {isCompleted ? (
                  // Checkmark for completed steps
                  <FontAwesomeIcon icon={faCheck} className="text-xs sm:text-sm" />
                ) : (
                  // Step number for current/upcoming
                  <span className="text-white text-xs sm:text-sm">{step.id}</span>
                )}
              </div>
              <span className="text-white text-[10px] sm:text-xs mt-1 hidden xs:block">{step.title}</span>
            </div>

            {/* Connector bar - only show between steps, not after the last step */}
            {index < steps.length - 1 && (
              <div className={`w-10 xs:w-14 sm:w-16 md:w-20 h-1 mx-1 sm:mx-2 ${connectorColor}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default BookingSteps; // Export the component for use in other files