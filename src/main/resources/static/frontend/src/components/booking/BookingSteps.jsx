function BookingSteps({ steps, currentStep }) {
  return (
    <div className="flex justify-center items-center mb-8">
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
          <div key={step.id} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${circleColor}`}
            >
              {isCompleted ? (
                // ✅ Checkmark for completed steps
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                // Step number for current/upcoming
                <span className="text-white text-sm">{step.id}</span>
              )}
            </div>

            {/* Connector bar */}
            {index < steps.length - 1 && (
              <div className={`w-20 h-1 mx-2 ${connectorColor}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default BookingSteps;
