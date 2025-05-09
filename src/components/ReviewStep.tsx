// src/components/ReviewStep.tsx
'use client';

import React, { useMemo, useState } from 'react'; 
import { useFormContext, Controller } from 'react-hook-form'; 
import type { LegalDocument } from '@/lib/document-library';
import { prettify } from '@/lib/schema-utils'; 
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit2, Check, X } from 'lucide-react'; 
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import FieldRenderer from './FieldRenderer'; 
import AddressField from './AddressField'; 

interface ReviewStepProps {
  doc: LegalDocument;
  locale: 'en' | 'es';
  onBackToForm: (fieldId?: string) => void; 
}

export default function ReviewStep({ doc, locale, onBackToForm }: ReviewStepProps) {
  const { getValues, control, trigger, formState: { errors } } = useFormContext(); 
  const { t } = useTranslation();
  const formData = getValues();

  const documentDisplayName = locale === 'es' && doc.name_es ? doc.name_es : doc.name;

  const actualSchemaShape = useMemo(() => {
    if (!doc || !doc.schema) {
        console.warn(`[ReviewStep] Doc or doc.schema is undefined for docId: ${doc?.id}`);
        return undefined;
    }
    const schemaDef = doc.schema._def;
    if (schemaDef?.typeName === 'ZodObject') {
      return doc.schema.shape;
    } else if (schemaDef?.typeName === 'ZodEffects' && schemaDef.schema?._def?.typeName === 'ZodObject') {
      return schemaDef.schema.shape; 
    }
    console.warn(`[ReviewStep] Unhandled schema type for ${doc.id}: ${schemaDef?.typeName}. No shape derived.`);
    return undefined;
  }, [doc]);

  const fieldsToReview = useMemo(() => {
    if (!doc) return [];
    if (doc.questions && doc.questions.length > 0) {
        return doc.questions.map(q => ({ 
            id: q.id, 
            label: q.label ? t(q.label, q.label) : prettify(q.id), 
            tooltip: q.tooltip ? t(q.tooltip, q.tooltip) : undefined,
            isAddress: (q.id.includes('_address') || q.id.includes('Address')),
        }));
    }
    
    if (actualSchemaShape && typeof actualSchemaShape === 'object' && Object.keys(actualSchemaShape).length > 0) {
        return Object.keys(actualSchemaShape).map(key => {
            const fieldDef = (actualSchemaShape as any)[key]?._def;
            const zodDescription = fieldDef?.description ?? fieldDef?.schema?._def?.description;
            const zodTooltip = (fieldDef as any)?.tooltip ?? (fieldDef?.schema?._def as any)?.tooltip;
            const questionConfig = doc.questions?.find(q => q.id === key);

            const label = questionConfig?.label ? t(questionConfig.label, questionConfig.label) : (zodDescription ? t(zodDescription, zodDescription) : t(`fields.${key}.label`, prettify(key)));
            const tooltip = questionConfig?.tooltip ? t(questionConfig.tooltip, questionConfig.tooltip) : (zodTooltip ? t(zodTooltip, zodTooltip) : (zodDescription ? t(zodDescription, zodDescription) : label));

            return {
                id: key,
                label: label,
                tooltip: tooltip,
                isAddress: (key.includes('_address') || key.includes('Address')),
            };
        });
    }
    console.warn(`[ReviewStep] No questions or derivable schema shape for doc: ${doc.id}`);
    return [];
  }, [doc, t, actualSchemaShape]);

  const handleEditClick = (fieldId: string) => {
    onBackToForm(fieldId); 
  };

  return (
    <Card className="bg-card border-border shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-card-foreground">
          {t('Review Your Information for', { ns: 'translation', defaultValue: 'Review Your Information for' })} {documentDisplayName}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {t('Please confirm the details below are correct. Click the edit icon to make changes.', { ns: 'translation' })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        {fieldsToReview.map(field => {
          const value = formData[field.id];
          const displayValue = value instanceof Date
            ? value.toLocaleDateString(locale)
            : typeof value === 'boolean'
            ? (value ? t('Yes') : t('No'))
            : (value || t('Not Provided', { ns: 'translation' }));

          return (
            <div key={field.id} className="py-3 border-b border-border last:border-b-0 group">
              <dt className="text-sm font-medium text-muted-foreground mb-0.5">{t(field.label, field.label)}:</dt>
              <div className="flex justify-between items-start">
                <dd className="mt-0.5 text-sm text-card-foreground break-words flex-1 pr-2">{String(displayValue)}</dd>
                <Button variant="ghost" size="icon" onClick={() => handleEditClick(field.id)} className="ml-2 text-primary hover:text-primary/80 h-7 w-7 p-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity shrink-0">
                  <Edit2 className="h-4 w-4" />
                  <span className="sr-only">{t('Edit', { ns: 'translation' })} {t(field.label, field.label)}</span>
                </Button>
              </div>
            </div>
          );
        })}
        {fieldsToReview.length === 0 && (
          <p className="text-muted-foreground italic text-center py-4">
            {t('No details were required for this document.', { ns: 'translation' })}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
