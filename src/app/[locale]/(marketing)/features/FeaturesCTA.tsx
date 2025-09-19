"use client";

import { useCallback, type ReactNode } from 'react';
import Link from 'next/link';
import { track } from '@/lib/analytics';

type FeaturesCTAVariant = 'primary' | 'outline';

type FeaturesCTAProps = {
  locale: 'en' | 'es';
  href: string;
  surface: string;
  variant?: FeaturesCTAVariant;
  children: ReactNode;
};

export function FeaturesCTA({
  locale,
  href,
  surface,
  variant = 'primary',
  children,
}: FeaturesCTAProps) {
  const handleClick = useCallback(() => {
    track('features_cta_click', {
      locale,
      surface,
      destination: href,
    });
  }, [href, locale, surface]);

  const baseClass =
    'inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';
  const variantClass =
    variant === 'outline'
      ? 'border border-primary text-primary bg-transparent hover:bg-primary/10'
      : 'bg-primary text-primary-foreground hover:bg-primary/90';

  return (
    <Link href={href} className={`${baseClass} ${variantClass}`} onClick={handleClick}>
      {children}
    </Link>
  );
}
