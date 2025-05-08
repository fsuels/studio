// app/[locale]/layout.tsx
import type { ReactNode } from 'react';
// No 'use client' needed if it's just passing children and not using hooks directly.
// No ClientProviders here as it's handled by the root layout.

interface LocaleLayoutProps {
  children: ReactNode;
  params: { locale: string }; // Next.js ensures params.locale is available
}

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
  // This layout doesn't need to do much other than provide the children.
  // The locale from params is used by ClientProviders in the root layout.
  // The 'use client' directive and useParams hook were moved to ClientProviders
  // to ensure hooks are only called in client components.
  return <>{children}</>;
}
