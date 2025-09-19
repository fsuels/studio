'use client';

import { useCallback, type ReactNode } from 'react';
import Link from 'next/link';
import { track } from '@/lib/analytics';

type PartnersCTAProps = {
  locale: 'en' | 'es';
  href: string;
  ctaId: string;
  surface: string;
  className: string;
  children: ReactNode;
  as?: 'link' | 'anchor';
};

export function PartnersCTA({
  locale,
  href,
  ctaId,
  surface,
  className,
  children,
  as = 'link',
}: PartnersCTAProps) {
  const handleClick = useCallback(() => {
    track('partners_cta_click', {
      locale,
      cta_id: ctaId,
      surface,
      destination: href,
    });
  }, [ctaId, href, locale, surface]);

  if (as === 'anchor' || href.startsWith('mailto:')) {
    return (
      <a href={href} className={className} onClick={handleClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}