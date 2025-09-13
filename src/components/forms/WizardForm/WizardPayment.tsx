// src/components/forms/WizardForm/WizardPayment.tsx
'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { LegalDocument } from '@/types/documents';

const PaymentModal = dynamic(() =>
  import('@/components/shared').then((m) => ({ default: m.PaymentModal })),
);

interface WizardPaymentProps {
  showPaymentModal: boolean;
  paymentClientSecret: string | null;
  doc: LegalDocument;
  locale: 'en' | 'es';
  onClose: () => void;
  onSuccess: () => void;
}

export default function WizardPayment({
  showPaymentModal,
  paymentClientSecret,
  doc,
  locale,
  onClose,
  onSuccess,
}: WizardPaymentProps) {
  const documentName =
    locale === 'es'
      ? doc.translations?.es?.name || doc.translations?.en?.name || doc.name
      : doc.translations?.en?.name || doc.name || doc.translations?.es?.name;

  return (
    <PaymentModal
      open={showPaymentModal}
      onClose={onClose}
      clientSecret={paymentClientSecret}
      documentName={documentName}
      priceCents={(doc.basePrice || 35) * 100}
      onSuccess={onSuccess}
    />
  );
}
