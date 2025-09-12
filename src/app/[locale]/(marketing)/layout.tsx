import React from 'react';
import MarketingClient from '@/app/marketing-client';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <MarketingClient>{children}</MarketingClient>;
}

