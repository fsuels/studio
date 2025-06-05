import React from 'react';

interface StepCardProps {
  number: number;
  title: string;
  desc?: string;
  icon?: React.ReactNode;
  showConnector?: boolean;
}

const StepCard = React.memo(function StepCard({
  number,
  title,
  desc,
  icon,
  showConnector,
}: StepCardProps) {
  return (
    <div className="group relative flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md focus-within:ring-2 focus-within:ring-emerald-400 transition">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#006EFF] to-[#00C3A3] text-white text-xl font-bold mb-4 shadow">
        {number}
      </div>
      {icon && <div className="mb-3 text-primary">{icon}</div>}
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      {desc && <p className="text-gray-600 text-sm">{desc}</p>}
      {showConnector && (
        <div className="hidden sm:flex absolute right-0 top-6 translate-x-full items-center w-24">
          <div className="flex-1 h-px bg-gray-300 transition-colors group-hover:bg-primary" />
          <svg
            className="w-4 h-4 text-gray-300 transition-colors group-hover:text-primary"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M0 12h20m0 0l-4-4m4 4l-4 4" />
          </svg>
        </div>
      )}
    </div>
  );
});

export default StepCard;
