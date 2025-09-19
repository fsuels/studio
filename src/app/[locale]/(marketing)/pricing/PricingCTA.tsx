'use client';

import { useCallback, type ReactNode } from 'react';
import Link from 'next/link';
import { track } from '@/lib/analytics';

type PricingCTASurface = 'plan_card' | 'quiz_banner' | string;

type PricingCTAProps = {
  locale: 'en' | 'es';
  href: string;
  className: string;
  analytics: {
    ctaId: string;
    planId?: string;
    surface: PricingCTASurface;
  };
  children: ReactNode;
  as?: 'anchor' | 'link';
};

export function PricingCTA({
  locale,
  href,
  className,
  analytics,
  children,
  as = 'anchor',
}: PricingCTAProps) {
  const { ctaId, planId, surface } = analytics;

  const handleClick = useCallback(() => {
    const payload: Record<string, unknown> = {
      page: 'pricing',
      locale,
      cta_id: ctaId,
      surface,
      destination: href,
    };

    if (planId) {
      payload.plan_id = planId;
    }

    track('pricing_cta_click', payload);
  }, [ctaId, href, locale, planId, surface]);

  if (as === 'link') {
    return (
      <Link href={href} className={className} onClick={handleClick}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
