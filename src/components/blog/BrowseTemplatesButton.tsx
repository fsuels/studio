'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';

interface BrowseTemplatesButtonProps {
  children: React.ReactNode;
  className?: string;
}

export default function BrowseTemplatesButton({ children, className }: BrowseTemplatesButtonProps) {
  const router = useRouter();
  const params = (useParams<{ locale?: string }>() ?? {}) as { locale?: string };
  const locale = params?.locale === 'es' ? 'es' : 'en';
  const destination = `/${locale}/marketplace`;

  return (
    <button
      onClick={() => router.push(destination)}
      className={className}
    >
      {children}
    </button>
  );
}
