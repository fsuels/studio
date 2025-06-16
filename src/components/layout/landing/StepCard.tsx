import React from 'react';

interface StepCardProps {
  number: number;
  title: string;
  desc?: string;
  icon?: React.ReactNode;
}

const StepCard = React.memo(function StepCard({
  number,
  title,
  desc,
  icon,
}: StepCardProps) {
  return (
    <div className="group relative flex flex-col items-center text-center p-6 bg-card rounded-xl shadow-md hover:shadow-lg border border-border h-full transition-all duration-200 ease-in-out hover:-translate-y-1">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-[#00C3A3] text-white text-xl font-bold mb-4 shadow-sm shrink-0">
        {number}
      </div>
      {icon && <div className="mb-4 text-primary">{icon}</div>}
      <h3 className="text-xl font-semibold mb-2 text-card-foreground">{title}</h3>
      {desc && <p className="text-muted-foreground text-sm flex-grow">{desc}</p>}
    </div>
  );
});

export default StepCard;