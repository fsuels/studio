// src/app/[locale]/dashboard/page.tsx
import React from 'react';
import DashboardView from './dashboard-view';

export default function DashboardPage({ params }: any) {
  return <DashboardView locale={params.locale} />;
}
