import React from 'react';

interface StepCardProps {
  number: number;
  title: string;
  desc?: string;
  icon: React.ReactNode;
}

const StepCard = React.memo(function StepCard({
  number,
  title,
  desc,
  icon,
}: StepCardProps) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-card rounded-xl border border-border shadow-sm">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold mb-4">
        {number}
      </div>
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-card-foreground">{title}</h3>
      {desc && <p className="text-muted-foreground text-sm">{desc}</p>}
    </div>
  );
});

export default StepCard;
