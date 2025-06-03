import React from 'react';

export const StepOneIllustration = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <rect x="22" y="14" width="26" height="30" rx="2" />
    <line x1="28" y1="22" x2="44" y2="22" />
    <line x1="28" y1="28" x2="44" y2="28" />
    <line x1="28" y1="34" x2="44" y2="34" />
    <path d="M12 24h12v8h4l-4 4v-4H12z" />
  </svg>
);

export const StepTwoIllustration = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <rect x="12" y="14" width="26" height="36" rx="2" />
    <circle cx="40" cy="32" r="6" />
    <path d="M40 22v4M40 38v4M49 32h4M31 32h-4M46.2 25.8l2.8-2.8M33.8 38.2l-2.8 2.8M46.2 38.2l2.8 2.8M33.8 25.8l-2.8-2.8" />
  </svg>
);

export const StepThreeIllustration = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <rect x="22" y="14" width="26" height="36" rx="2" />
    <path d="M35 28v12" />
    <polyline points="30 36 35 40 40 36" />
  </svg>
);

