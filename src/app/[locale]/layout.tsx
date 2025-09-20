// src/app/[locale]/layout.tsx

import type { ReactNode } from 'react';

interface LocaleLayoutProps {
  children: ReactNode;
  params: { locale?: string };
}

// Minimal locale layout; segment-specific layouts add providers and app chrome.
export default async function LocaleLayout({ children }: LocaleLayoutProps) {
  return <>{children}</>;
}
