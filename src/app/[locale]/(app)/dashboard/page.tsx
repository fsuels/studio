// src/app/[locale]/dashboard/page.tsx
import React from 'react';
import DashboardView from './dashboard-view';

interface DashboardPageProps {
  params: {
    locale: 'en' | 'es';
  };
}

export default function DashboardPage({ params }: DashboardPageProps) {
  return <DashboardView locale={params.locale} />;
}