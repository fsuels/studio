import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import FieldRenderer from './FieldRenderer';
import { Button } from '@/components/ui/button';
import type { LegalDocument } from '@/types/documents';

interface PartyGroupFieldProps {
  role: 'seller' | 'buyer';
  locale: 'en' | 'es';
  doc: LegalDocument;
}

export default function PartyGroupField({ role, locale, doc }: PartyGroupFieldProps) {
  const { watch } = useFormContext();
  const { t } = useTranslation('common');
  const [showSecond, setShowSecond] = useState(() => !!watch(`${role}2_name` as any));

  return (
    <div className="space-y-4">
      <FieldRenderer fieldKey={`${role}_name`} locale={locale} doc={doc} />
      <FieldRenderer fieldKey={`${role}_phone`} locale={locale} doc={doc} />
      <FieldRenderer fieldKey={`${role}_address`} locale={locale} doc={doc} />
      {showSecond && (
        <>
          <FieldRenderer fieldKey={`${role}2_name`} locale={locale} doc={doc} />
          <FieldRenderer fieldKey={`${role}2_phone`} locale={locale} doc={doc} />
        </>
      )}
      {!showSecond && (
        <Button type="button" variant="outline" onClick={() => setShowSecond(true)}>
          {role === 'seller' ? t('Add Another Seller') : t('Add Another Buyer')}
        </Button>
      )}
    </div>
  );
}
