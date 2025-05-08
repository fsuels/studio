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
        viewBox="0 0 130 40" // Maintained viewBox based on content
        fill="none"
        className={cn("h-9 w-auto", className)} // Adjusted height to h-9, width auto preserves aspect ratio
        aria-hidden="true"
        {...props}
      >
        {/* Document Icon Background - Light Teal from image: approx #A0D2DB */}
        <path
          d="M5 2C3.34315 2 2 3.34315 2 5V35C2 36.6569 3.34315 38 5 38H35C36.6569 38 38 36.6569 38 35V12L28 2H5Z"
          fill="#A0D2DB"
        />
        {/* Document Fold - Slightly Darker Teal for fold - approx #7FA8B0 (slightly darker than #A0D2DB) */}
        <path
          d="M28 2V12H38"
          fill="#7FA8B0"
        />
         {/* Justice Scale - Darker Teal/Blue from image: approx #005A5B */}
        <g fill="#005A5B">
          {/* Base of the scale */}
          <rect x="19.5" y="14" width="1" height="13" rx="0.5"/>
          {/* Beam of the scale */}
          <rect x="12" y="13.5" width="16" height="1" rx="0.5"/>
          {/* Left Pan support */}
          <path d="M14.5 14.5L12.5 15.5V16.5L14.5 17.5V14.5Z" />
          {/* Right Pan support */}
          <path d="M25.5 14.5L27.5 15.5V16.5L25.5 17.5V14.5Z" />
          {/* Left Pan */}
          <path d="M10 18.5C10 17.9477 10.4477 17.5 11 17.5H15C15.5523 17.5 16 17.9477 16 18.5V20.5C16 21.3284 15.3284 22 14.5 22H11.5C10.6716 22 10 21.3284 10 20.5V18.5Z" />
          {/* Right Pan */}
          <path d="M24 18.5C24 17.9477 24.4477 17.5 25 17.5H29C29.5523 17.5 30 17.9477 30 18.5V20.5C30 21.3284 29.3284 22 28.5 22H25.5C24.6716 22 24 21.3284 24 20.5V18.5Z" />
        </g>

        {/* Text Part - Using approximate dark blue/black color from image: approx #1A2B3C (matches --foreground dark) */}
        {/* "123" - Lighter weight */}
        <text
            x="48"
            y="19" // Adjusted Y for vertical centering with new text
            fontFamily="Inter, sans-serif" // Explicitly use Inter
            fontSize="17" // Slightly increased for better balance
            fontWeight="300"
            fill="hsl(var(--foreground))"
        >
            123
        </text>
        {/* "LegalDoc" - Bolder weight */}
         <text
            x="48"
            y="34" // Adjusted Y for second line
            fontFamily="Inter, sans-serif" // Explicitly use Inter
            fontSize="17" // Slightly increased
            fontWeight="600"
            fill="hsl(var(--foreground))"
        >
            LegalDoc
        </text>
      </svg>
    </Link>
  );
}
