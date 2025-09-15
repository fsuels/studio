import React from 'react';

// Providers are applied at src/app/[locale]/layout.tsx.
// This segment-specific layout just renders its children.
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
