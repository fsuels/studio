import React from 'react';
import OnlineNotaryClientContent from './online-notary-client-content';

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

interface OnlineNotaryPageProps {
  params: Promise<{ locale: 'en' | 'es' }>;
}

export default async function OnlineNotaryPage({ params }: OnlineNotaryPageProps) {
  const { locale } = await params;
  return <OnlineNotaryClientContent locale={locale} />;
}
