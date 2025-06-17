// src/components/layout/Logo.tsx
import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface LogoProps {
  wrapperClassName?: string;
  svgClassName?: string;
  textClassName?: string;
}

const Logo = React.memo(function Logo({
  wrapperClassName,
  svgClassName,
  textClassName,
  ...props
}: LogoProps) {
  // Use the 'header' namespace for logo translations
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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="none"
        className={cn('h-7 w-7', svgClassName)}
        aria-hidden="true"
        {...props}
      >
        <rect
          x="4"
          y="3"
          width="24"
          height="26"
          rx="3"
          stroke="#008080"
          strokeWidth="1.5"
          fill="#D1E9FF"
        />
        <path
          d="M19 3L19 9L28 9"
          stroke="#006666"
          strokeWidth="1.5"
          fill="#AED7FF"
          strokeLinejoin="round"
        />
        <line
          x1="8"
          y1="13"
          x2="24"
          y2="13"
          stroke="#008080"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="8"
          y1="18"
          x2="24"
          y2="18"
          stroke="#008080"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="8"
          y1="23"
          x2="18"
          y2="23"
          stroke="#008080"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle
          cx="23"
          cy="24"
          r="4.5"
          fill="white"
          stroke="#008080"
          strokeWidth="1"
        />
        <path
          d="M21 24l1.5 1.5L25.5 23"
          stroke="#008080"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      <span
        className={cn('font-sans text-xs leading-tight', textClassName)}
        style={{ color: '#008080' }}
      >
        <span className="font-light tracking-tight">123</span>
        <span className="font-semibold tracking-tight">LegalDoc</span>
      </span>
    </Link>
  );
});
export default Logo;
