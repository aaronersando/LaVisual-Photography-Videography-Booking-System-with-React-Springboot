import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function BookingSteps({ steps, currentStep }) {
  return (
    <div className="flex justify-center items-center mb-6 sm:mb-8 overflow-x-auto py-2 w-full">
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isCurrent = step.id === currentStep;
        const isUpcoming = step.id > currentStep;

        const circleColor = 
          isCompleted
          ? 'bg-[#22C55E]'
          : isCurrent
          ? 'bg-[#9333EA]'
          : isUpcoming
          ? 'bg-[#374151]'
          : '';

        const connectorColor = isCompleted
          ? 'bg-[#22C55E]'
          : 'bg-[#374151]';

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

            {/* Connector bar */}
            {index < steps.length - 1 && (
              <div className={`w-10 xs:w-14 sm:w-16 md:w-20 h-1 mx-1 sm:mx-2 ${connectorColor}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default BookingSteps;