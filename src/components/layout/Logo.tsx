// src/components/layout/Logo.tsx
import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface LogoProps {
  wrapperClassName?: string;
  className?: string;
  [key: string]: any;
}

export function Logo({ wrapperClassName, className, ...props }: LogoProps) {
   const { t } = useTranslation();

  // Colors based on the new image:
  const docIconBlue = "#5D9DD5"; // Main blue for document icon
  const docIconFoldBlue = "#4B84C5"; // Darker blue for the fold
  const docIconOutlineAndScale = "#2A3B4D"; // Dark blue-grey for outline and scale

  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 text-foreground hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm",
        wrapperClassName
      )}
      aria-label={t('logoAlt', {defaultValue: "123LegalDoc Home"})}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 130 40" 
        fill="none"
        className={cn("h-9 w-auto", className)} 
        aria-hidden="true"
        {...props}
      >
        {/* Document Icon Background */}
        <path
          d="M5 2C3.34315 2 2 3.34315 2 5V35C2 36.6569 3.34315 38 5 38H28C29.6569 38 31 36.6569 31 35V12L21 2H5Z" // Adjusted right side for a 10-unit fold
          fill={docIconBlue}
          stroke={docIconOutlineAndScale}
          strokeWidth="1" // Thinner stroke for a cleaner look
        />
        {/* Document Fold */}
        <path
          d="M21 2V12H31L21 2Z" // Corrected path for a filled triangular fold
           fill={docIconFoldBlue}
           stroke={docIconOutlineAndScale}
           strokeWidth="1"
        />
         {/* Justice Scale - Centered within the document icon part (approx x=2 to x=31) */}
        <g fill={docIconOutlineAndScale} stroke={docIconOutlineAndScale} strokeWidth="0.5">
          {/* Base of the scale (slightly adjusted for new icon proportions) */}
          <rect x="16" y="27" width="2.5" height="2.5" rx="0.5"/>
          {/* Vertical post */}
          <rect x="17" y="15" width="0.5" height="12" rx="0.25"/>
          {/* Beam of the scale */}
          <rect x="10" y="14.5" width="14" height="1" rx="0.5"/>
          {/* Left Pan support lines */}
          <line x1="10.5" y1="15.5" x2="12.5" y2="18.5" />
          <line x1="14.5" y1="18.5" x2="12.5" y2="18.5" />
          {/* Right Pan support lines */}
          <line x1="23.5" y1="15.5" x2="21.5" y2="18.5" />
          <line x1="19.5" y1="18.5" x2="21.5" y2="18.5" />
          {/* Left Pan (simple arc/curve) */}
          <path d="M9.5 19 Q12.5 22 15.5 19" strokeWidth="0.75" fill="none"/>
          {/* Right Pan (simple arc/curve) */}
          <path d="M18.5 19 Q21.5 22 24.5 19" strokeWidth="0.75" fill="none"/>
        </g>

        {/* Text Part - "123" */}
        <text
            x="45" // Adjusted x for spacing from new icon
            y="19" 
            fontFamily="Inter, sans-serif" 
            fontSize="17" 
            fontWeight="300" // Lighter weight
            fill="hsl(var(--foreground))"
        >
            123
        </text>
        {/* Text Part - "LegalDoc" */}
         <text
            x="45" // Adjusted x for spacing
            y="35" // Adjusted y for second line
            fontFamily="Inter, sans-serif" 
            fontSize="18" // Slightly larger for "LegalDoc"
            fontWeight="600" // Bolder weight
            fill="hsl(var(--foreground))"
        >
            LegalDoc
        </text>
      </svg>
    </Link>
  );
}
