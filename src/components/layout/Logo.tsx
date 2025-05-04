// src/components/layout/Logo.tsx
import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-primary hover:opacity-90 transition-opacity", className)} aria-label="123LegalDoc Home">
       {/* Icon Part */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28" // Slightly increased size
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor" // Use currentColor to inherit color
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-7 w-7" // Adjusted size
        aria-hidden="true" // Hide decorative icon from screen readers
        {...props}
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        {/* Lines inside */}
        <line x1="8" x2="16" y1="13" y2="13" />
        <line x1="8" x2="16" y1="17" y2="17" />
        {/* Checkmark - adjusted points for clarity */}
         <polyline points="8 17 10 19 16 13" strokeWidth="2.5" />
      </svg>
      {/* Text Part */}
      <span className="text-xl font-bold text-primary"> {/* Ensure text uses primary color */}
        123LegalDoc
      </span>
    </Link>
  );
}
