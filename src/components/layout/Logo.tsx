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
        viewBox="0 0 130 40" 
        fill="none"
        className={cn("h-10 w-auto", className)} // Increased height from h-9 to h-10, removed explicit width/height attributes
        aria-hidden="true"
        {...props} 
      >
        {/* Document Icon Background - Light Teal */}
        <path 
          d="M5 2C3.34315 2 2 3.34315 2 5V35C2 36.6569 3.34315 38 5 38H35C36.6569 38 38 36.6569 38 35V12L28 2H5Z" 
          fill="#A0D2DB" // Light teal for document body - approximate from image
        />
        {/* Document Fold - Slightly Darker Teal */}
        <path 
          d="M28 2V12H38" 
          fill="#7FA8B0" // Slightly darker teal for fold - approximate
        />
         {/* Justice Scale - Darker Teal */}
        <g fill="#005A5B"> {/* Darker Teal/Blue for scale - approximate */}
          {/* Base of the scale */}
          <path d="M20 27V14H21V27H20Z" /> 
          {/* Beam of the scale */}
          <path d="M12 14H29V15H12V14Z" /> 
          {/* Left Pan support */}
          <path d="M14 15V17L12 18V17L14 15Z" />
          {/* Right Pan support */}
          <path d="M27 15V17L29 18V17L27 15Z" />
          {/* Left Pan */}
          <path d="M10 19C10 18.4477 10.4477 18 11 18H15C15.5523 18 16 18.4477 16 19V21C16 22.1046 15.1046 23 14 23H12C10.8954 23 10 22.1046 10 21V19Z" />
          {/* Right Pan */}
          <path d="M25 19C25 18.4477 25.4477 18 26 18H30C30.5523 18 31 18.4477 31 19V21C31 22.1046 30.1046 23 29 23H27C25.8954 23 25 22.1046 25 21V19Z" />
        </g>
        
        {/* Text Part - Using approximate dark blue/black color from image */}
        {/* "123" - Lighter weight */}
        <text 
            x="48" 
            y="27" 
            fontFamily="Inter, sans-serif" // Using Inter as specified in globals.css as a base
            fontSize="18" 
            fontWeight="300" // Lighter weight
            fill="hsl(var(--foreground))" // Use theme foreground color
        >
            123
        </text>
        {/* "LegalDoc" - Bolder weight */}
         <text 
            x="80" 
            y="27" 
            fontFamily="Inter, sans-serif"
            fontSize="18" 
            fontWeight="600" // Bolder weight
            fill="hsl(var(--foreground))" // Use theme foreground color
        >
            LegalDoc
        </text>
      </svg>
    </Link>
  );
}
