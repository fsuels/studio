// src/components/BillOfSalePreview.tsx
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

interface BillOfSalePreviewProps {
  height: number;
  locale?: 'en' | 'es'; // Make locale optional if not always passed or used directly
}

const BillOfSalePreview: React.FC<BillOfSalePreviewProps> = ({ height, locale = 'en' }) => {
  const { t } = useTranslation();
  return (
    <div
      style={{ height: `${height}px` }}
      className="flex items-center justify-center bg-muted border-t border-border text-muted-foreground p-4"
      data-ai-hint="document preview"
    >
      <p className="text-center">
        {t('Document Preview Placeholder', { ns: 'translation' })}
        <br />
        ({locale === 'es' ? t('Contrato de Compraventa de Vehículo', { ns: 'translation'}) : t('Vehicle Bill of Sale', {ns: 'translation'})})
      </p>
    </div>
  );
};

export default BillOfSalePreview;
