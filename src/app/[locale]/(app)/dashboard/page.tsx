// src/app/[locale]/dashboard/page.tsx
import React from 'react';
import DashboardClientContent from './dashboard-client-content';

// Force dynamic rendering for user-specific dashboard content
export const dynamic = 'force-dynamic';

interface DashboardPageProps {
  params: {
    locale: 'en' | 'es';
  };
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  return <DashboardClientContent locale={locale} />;
}
