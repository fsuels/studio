// src/app/[locale]/dashboard/page.tsx
import React from 'react';
import DashboardView from './dashboard-view';

type Locale = 'en' | 'es';

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <DashboardView locale={locale} />;
}
