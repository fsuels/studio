// src/components/layout/Logo.tsx
import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  // Allow className override for the Link wrapper
  wrapperClassName?: string;
  // className will apply to the SVG icon itself
  className?: string;
  // Allow passing other SVG props like width, height if needed, but prefer className
  [key: string]: any; // Allow arbitrary other props for SVG
}

export function Logo({ wrapperClassName, className, ...props }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 text-foreground hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm",
        wrapperClassName // Apply wrapper class name
      )}
      aria-label="123LegalDoc Home"
    >
      {/* Icon Part */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32" // Set base size, can be overridden by className
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="none"
        // Apply className to SVG, default h-8 w-8
        className={cn("h-8 w-8", className)}
        aria-hidden="true"
        {...props} // Pass other SVG props
      >
        {/* Document Icon Background - Use Primary Color */}
        <path
          d="M7.5 2.5H14.5L19.5 7.5V19.5C19.5 20.6046 18.6046 21.5 17.5 21.5H6.5C5.39543 21.5 4.5 20.6046 4.5 19.5V4.5C4.5 3.39543 5.39543 2.5 6.5 2.5Z"
          fill="hsl(var(--primary))"
        />
        {/* Folded Corner */}
        <path
          d="M14.5 2.5V7.5H19.5"
           fill="hsl(var(--primary))"
           fillOpacity="0.8" // Subtle visual difference for the fold
        />
        {/* Lines inside - Use Primary Foreground (defined in theme, likely white/light) */}
        <line x1="7.5" y1="9.5" x2="11.5" y2="9.5" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="7.5" y1="12.5" x2="15.5" y2="12.5" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" strokeLinecap="round" />
        {/* Checkmark Circle - Use Primary Foreground */}
        <circle cx="12" cy="17" r="3" fill="hsl(var(--primary-foreground))" />
        {/* Checkmark Path - Use Primary Color */}
        <path d="M10.5 17L11.5 18L13.5 16" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>

      {/* Text Part - Use Foreground Color */}
      {/* Use specific font weights if Geist Sans supports them, otherwise fallback */}
      <span className="text-xl font-sans text-foreground"> {/* Ensure specific font stack if needed */}
        <span className="font-light tracking-tight">123</span> {/* Lighter weight for '123' */}
        <span className="font-semibold tracking-tight">LegalDoc</span> {/* Bolder weight for 'LegalDoc' */}
      </span>
    </Link>
  );
}
