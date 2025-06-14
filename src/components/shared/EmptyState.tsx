'use client';
import React from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="p-6 text-center text-sm text-muted-foreground">
      <h2 className="text-lg font-medium">{title}</h2>
      {description ? <p className="mt-2">{description}</p> : null}
    </div>
  );
}
