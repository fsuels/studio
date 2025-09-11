'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { resolveDocSlug } from '@/lib/slug-alias';

export default function StickyMobileCTA({
  locale,
  docId = 'vehicle-bill-of-sale',
  price = 19.95,
  ctaText = 'Start Document',
}: {
  locale: 'en' | 'es';
  docId?: string;
  price?: number;
  ctaText?: string;
}) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-white/95 shadow-lg md:hidden">
      <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
        <span className="font-semibold">
          ${price.toFixed(2)} • attorney-drafted
        </span>
        <Link href={`/${locale}/docs/${resolveDocSlug(docId)}/start`} className="btn-primary">
          {ctaText}
        </Link>
      </div>
    </div>
  );
}
