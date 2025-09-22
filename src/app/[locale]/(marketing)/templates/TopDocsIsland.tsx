'use client';

import React from 'react';
import TopDocsChips from '@/components/shared/TopDocsChips';

export default function TopDocsIsland() {
  const locale =
    typeof document !== 'undefined' && document.documentElement.getAttribute('lang') === 'es'
      ? 'es'
      : 'en';

  return <TopDocsChips locale={locale} />;
}
