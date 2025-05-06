tsx
import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps = 3,
}) => {
  const percent = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-6">
      <div
        className="h-full bg-primary-600 transition-all duration-300"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};