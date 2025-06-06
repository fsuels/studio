// src/app/[locale]/dashboard/page.tsx
import React from 'react';
import DashboardClientContent from './dashboard-client-content';

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

interface DashboardPageProps {
  params: {
    locale: 'en' | 'es';
  };
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  return <DashboardClientContent locale={locale} />;
}
