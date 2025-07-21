import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

import { cn } from '@/lib/utils';

export default function CarouselNavArrow({
  direction,
  onClick,
  disabled,
  className,
  ...props
}: {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled?: boolean;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-40 disabled:cursor-not-allowed',
        className,
      )}
      style={{ padding: 0, lineHeight: 0 }}
      {...props}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      <span className="sr-only">
        {direction === 'prev' ? 'Previous review' : 'Next review'}
      </span>
    </button>
  );
}
