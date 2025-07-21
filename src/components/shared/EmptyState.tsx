'use client';
import React from 'react';

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

export default function EmptyState({ 
  title = "No data available", 
  description, 
  className,
  ...props 
}: EmptyStateProps) {
  return (
    <div 
      className={`p-6 text-center text-sm text-muted-foreground ${className || ''}`}
      {...props}
    >
      <h2 className="text-lg font-medium">{title}</h2>
      {description ? <p className="mt-2">{description}</p> : null}
    </div>
  );
}
