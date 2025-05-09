// src/components/ReviewStep.tsx
'use client';

import React, { useMemo } from 'react'; // Imported useMemo
import { useFormContext } from 'react-hook-form';
import type { LegalDocument } from '@/lib/document-library';
import { prettify } from '@/lib/schema-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';


interface ReviewStepProps {
  doc: LegalDocument;
  locale: 'en' | 'es';
  onEdit: (fieldId: string) => void;
}

export default function ReviewStep({ doc, locale, onEdit }: ReviewStepProps) {
  const { getValues } = useFormContext();
  const { t } = useTranslation();
  const formData = getValues();

  const documentDisplayName = locale === 'es' && doc.name_es ? doc.name_es : doc.name;

  // Determine which fields to display based on schema or questions
  const fieldsToReview = useMemo(() => {
    if (doc.questions && doc.questions.length > 0) {
        return doc.questions.map(q => ({ 
            id: q.id, 
            label: q.label, 
            tooltip: q.tooltip 
        }));
    } else if (doc.schema) {
        let shapeObject: Record<string, any> | undefined;
        const schemaDef = doc.schema._def;

        if (schemaDef?.typeName === 'ZodObject') {
            shapeObject = doc.schema.shape;
        } else if (schemaDef?.typeName === 'ZodEffects' && schemaDef.schema?._def?.typeName === 'ZodObject') {
            shapeObject = schemaDef.schema.shape;
        }

        if (shapeObject && typeof shapeObject === 'object' && Object.keys(shapeObject).length > 0) {
            return Object.keys(shapeObject).map(key => ({
                id: key,
                label: (shapeObject![key] && (shapeObject![key] as any)._def && typeof (shapeObject![key] as any)._def.description === 'string' && (shapeObject![key] as any)._def.description) 
                       ? (shapeObject![key] as any)._def.description 
                       : prettify(key),
                tooltip: (shapeObject![key] && (shapeObject![key] as any)._def && typeof (shapeObject![key] as any)._def.tooltip === 'string') 
                         ? (shapeObject![key] as any)._def.tooltip 
                         : undefined
            }));
        }
    }
    return [];
  }, [doc]);


  return (
    <Card className="bg-card border-border shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-card-foreground">
          {t('Review Your Information for', { ns: 'translation', defaultValue: 'Review Your Information for' })} {documentDisplayName}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {t('Please confirm the details below are correct before proceeding.', { ns: 'translation', defaultValue: 'Please confirm the details below are correct before proceeding.' })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {fieldsToReview.map(field => {
          const value = formData[field.id];
          const displayValue = value instanceof Date ? value.toLocaleDateString(locale) : (typeof value === 'boolean' ? (value ? t('Yes') : t('No')) : (value || t('Not Provided', {ns: 'translation'})));
          return (
            <div key={field.id} className="flex justify-between items-start py-2 border-b border-border last:border-b-0">
              <div className="flex-1">
                <dt className="text-sm font-medium text-muted-foreground">{t(field.label, field.label)}:</dt>
                <dd className="mt-0.5 text-sm text-card-foreground break-words">{String(displayValue)}</dd>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onEdit(field.id)} className="ml-2 text-primary hover:text-primary/80 h-7 w-7 p-1">
                <Edit2 className="h-4 w-4" />
                <span className="sr-only">{t('Edit', {ns: 'translation'})} {t(field.label, field.label)}</span>
              </Button>
            </div>
          );
        })}
        {fieldsToReview.length === 0 && (
            <p className="text-muted-foreground italic text-center py-4">
                {t('No details were required for this document.', {ns: 'translation'})}
            </p>
        )}
      </CardContent>
    </Card>
  );
}

