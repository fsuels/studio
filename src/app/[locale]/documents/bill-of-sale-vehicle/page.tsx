'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';
import BillOfSaleTemplate from '@/templates/BillOfSaleTemplate';

export default function Page() {
  const { locale } = useParams() as { locale: 'en' | 'es' };
  const { i18n } = useTranslation("common");

  // when the URL segment changes, switch i18n
  React.useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale, i18n]);

  return (
    <main className="py-8">
      <BillOfSaleTemplate />
    </main>
  );
}
