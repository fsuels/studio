'use client';

import { useCallback, type ReactNode } from 'react';
import Link from 'next/link';
import { track } from '@/lib/analytics';

type SupportCTAProps = {
  locale: 'en' | 'es';
  href: string;
  ctaId: string;
  surface: string;
  className: string;
  children: ReactNode;
};

export function SupportCTA({ locale, href, ctaId, surface, className, children }: SupportCTAProps) {
  const handleClick = useCallback(() => {
    track('support_cta_click', {
      locale,
      cta_id: ctaId,
      surface,
      destination: href,
    });
  }, [ctaId, href, locale, surface]);

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}