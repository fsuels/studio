'use client';

import { useCallback, type ReactNode } from 'react';
import Link from 'next/link';
import { track } from '@/lib/analytics';

type OnlineNotaryCTAProps = {
  locale: 'en' | 'es';
  href: string;
  surface: string;
  ctaId: string;
  className?: string;
  children: ReactNode;
};

export function OnlineNotaryCTA({ locale, href, surface, ctaId, className, children }: OnlineNotaryCTAProps) {
  const handleClick = useCallback(() => {
    track('online_notary_cta_click', {
      locale,
      surface,
      cta_id: ctaId,
      destination: href,
    });
  }, [ctaId, href, locale, surface]);

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}