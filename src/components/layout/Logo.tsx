// src/components/layout/Logo.tsx
import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface LogoProps {
  wrapperClassName?: string;
  svgClassName?: string; // Class for the SVG icon
  textClassName?: string; // Class for the text block
}

export function Logo({
  wrapperClassName,
  svgClassName,
  textClassName,
  ...props
}: LogoProps) {
  const { t } = useTranslation('header');

  return (
    <Link
      href="/"
      className={cn(
        'flex flex-col items-center gap-1 text-foreground hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm',
        wrapperClassName,
      )}
      aria-label={t('logoAlt', { defaultValue: '123LegalDoc Home' })}
    >
      {/* Icon Part */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32" // Square viewBox for the icon itself
        fill="none"
        className={cn('h-8 w-8', svgClassName)} // Default size, can be overridden
        aria-hidden="true"
        {...props} // Pass other SVG props
      >
        {/* Document Outline */}
        <rect
          x="4"
          y="3"
          width="24"
          height="26"
          rx="3"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Lines inside document */}
        <line
          x1="8"
          y1="9"
          x2="24"
          y2="9"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="8"
          y1="14"
          x2="24"
          y2="14"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="8"
          y1="19"
          x2="18"
          y2="19"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Checkmark Circle */}
        <circle cx="23" cy="24" r="4.5" fill="hsl(var(--primary))" />
        {/* Checkmark Path */}
        <path
          d="M21 24l1.5 1.5L25.5 23"
          stroke="hsl(var(--primary-foreground))" // White or light color for checkmark
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {/* Text Part - HTML text below the icon, styled with primary color */}
      <span
        className={cn('font-sans text-base leading-tight', textClassName)} // Adjusted text size for balance
        style={{ color: 'hsl(var(--primary))' }}
      >
        <span className="font-light tracking-tight">123</span>
        <span className="font-semibold tracking-tight">LegalDoc</span>
      </span>
    </Link>
  );
}
