// src/components/ReviewStep.tsx
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import type { LegalDocument, Question } from '@/lib/document-library';
import { prettify } from '@/lib/schema-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit2, Check, X, AlertTriangle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

interface ReviewStepProps {
  doc: LegalDocument;
  locale: 'en' | 'es';
}

export default function ReviewStep({ doc, locale }: ReviewStepProps) {
  const { t } = useTranslation();
  const { getValues, setValue, trigger, watch, formState: { errors } } = useFormContext();
  const formData = getValues(); // Initial snapshot of form data

  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editedValue, setEditedValue] = useState<any>(''); 
  const [isHydrated, setIsHydrated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const actualSchemaShape = useMemo(() => {
    const schemaDef = doc?.schema?._def;
    if (!schemaDef) return undefined;
    if (schemaDef.typeName === 'ZodObject') return doc.schema.shape;
    if (schemaDef.typeName === 'ZodEffects') return schemaDef.schema?.shape;
    return undefined;
  }, [doc]);

  const fieldsToReview = useMemo(() => {
    if (!isHydrated || !doc || !actualSchemaShape) return [];

    return Object.keys(formData)
      .map((fieldId) => { 
        const questionConfig = doc.questions?.find(q => q.id === fieldId);
        const schemaField = (actualSchemaShape as any)?.[fieldId];
        const schemaFieldDef = schemaField?._def;
        const zodDescription = schemaFieldDef?.description ?? schemaFieldDef?.schema?._def?.description;
        
        let label = prettify(fieldId);
        if (questionConfig?.label) {
          label = t(questionConfig.label, { defaultValue: questionConfig.label });
        } else if (zodDescription) {
          label = t(zodDescription, { defaultValue: zodDescription });
        } else { 
           label = t(`fields.${fieldId}.label`, { defaultValue: prettify(fieldId) });
        }
        
        let fieldType: Question['type'] = 'text'; 
        if (questionConfig?.type) {
          fieldType = questionConfig.type;
        } else if (schemaFieldDef) {
          if (schemaFieldDef.typeName === 'ZodNumber') fieldType = 'number';
          else if (schemaFieldDef.typeName === 'ZodDate') fieldType = 'date';
          else if (schemaFieldDef.typeName === 'ZodBoolean') fieldType = 'boolean';
          else if (schemaFieldDef.innerType?._def?.typeName === 'ZodEnum' || schemaFieldDef.typeName === 'ZodEnum') fieldType = 'select';
          else if (fieldId.includes('_address') || fieldId.includes('Address')) fieldType = 'text'; // Simplified for review step
          else if (fieldId.includes('phone') || fieldId.includes('tel')) fieldType = 'tel';
        }
        
        const options = questionConfig?.options || 
                        (schemaFieldDef?.innerType?._def?.values || schemaFieldDef?.values)?.map((val: string) => ({ value: val, label: prettify(val) }));

        return {
          id: fieldId, 
          label,
          type: fieldType,
          options,
          required: questionConfig?.required || (schemaFieldDef?.typeName !== 'ZodOptional' && schemaFieldDef?.innerType?._def?.typeName !== 'ZodOptional'),
          placeholder: questionConfig?.placeholder || (schemaFieldDef as any)?.placeholder,
        };
      })
      .filter(field => formData.hasOwnProperty(field.id));
  }, [doc, formData, actualSchemaShape, t, isHydrated]);


  const handleEdit = (id: string) => {
    const currentValue = getValues(id); // Get fresh value from form state
    setEditedValue(currentValue ?? '');
    setEditingFieldId(id);
  };
  
  const handleInputChange = (value: any) => {
    setEditedValue(value);
  };

  const handleSave = async (id: string) => {
    setValue(id, editedValue, { shouldValidate: true, shouldDirty: true });
    const isValid = await trigger(id);
    if (isValid) {
      setEditingFieldId(null); 
      toast({ title: t('Changes Saved'), description: `${t(fieldsToReview.find(f=>f.id === id)?.label || id)} ${t('updated.')}` });
    } else {
      toast({ title: t('Validation Error'), description: t('Please correct the field.'), variant: 'destructive' });
    }
  };

  const handleCancel = () => {
    setEditingFieldId(null);
    setEditedValue('');
  };
  
  if (!isHydrated) {
    return (
      <Card className="bg-card border-border shadow-lg animate-pulse">
        <CardHeader><div className="h-6 bg-muted rounded w-3/4"></div></CardHeader>
        <CardContent className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-10 bg-muted rounded w-full"></div>)}
        </CardContent>
      </Card>
    );
  }
  
  const documentDisplayName = locale === 'es' && doc.name_es ? doc.name_es : doc.name;

  return (
    <Card className="bg-card border-border shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-card-foreground">
          {t('Review Your Information for', { ns: 'translation' })} {documentDisplayName}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {t('Please confirm the details below are correct. Click the edit icon to make changes.', { ns: 'translation' })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        {fieldsToReview.length === 0 && (
           <p className="text-muted-foreground italic text-center py-4">
            {t('No details to review for this document.', { ns: 'translation' })}
          </p>
        )}
        {fieldsToReview.map((field) => { 
          const currentValueInForm = watch(field.id); // Watch for live updates for display
          const displayValue = currentValueInForm instanceof Date
            ? currentValueInForm.toLocaleDateString(locale)
            : typeof currentValueInForm === 'boolean'
            ? (currentValueInForm ? t('Yes') : t('No'))
            : (currentValueInForm !== undefined && currentValueInForm !== null && currentValueInForm !== '' ? String(currentValueInForm) : t('Not Provided', { ns: 'translation' }));

          return (
            <div key={field.id} className="py-3 border-b border-border last:border-b-0 group">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-0.5">
                    {t(field.label, {defaultValue: field.label})}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                  </p>
                  {editingFieldId === field.id ? (
                    <div className="mt-1 space-y-2">
                      {field.type === 'textarea' ? (
                        <Textarea
                          value={String(editedValue)}
                          onChange={(e) => handleInputChange(e.target.value)}
                          className="min-h-[60px] max-w-sm"
                          aria-label={t(field.label, {defaultValue: field.label})}
                          placeholder={field.placeholder ? t(field.placeholder) : undefined}
                        />
                      ) : field.type === 'select' && field.options ? (
                        <Select
                          value={String(editedValue)}
                          onValueChange={(val) => handleInputChange(val)}
                        >
                          <SelectTrigger aria-label={t(field.label, {defaultValue: field.label})} className="max-w-sm">
                            <SelectValue placeholder={field.placeholder ? t(field.placeholder) : t('Select...')} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{t(opt.label, {defaultValue: opt.label})}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : field.type === 'boolean' || field.type === 'checkbox' ? (
                        <div className="flex items-center space-x-2 pt-1">
                           <Checkbox
                              checked={Boolean(editedValue)}
                              onCheckedChange={(checked) => handleInputChange(Boolean(checked))}
                              id={`review-edit-${field.id}`}
                           />
                           <label htmlFor={`review-edit-${field.id}`} className="text-sm font-normal">
                             {t(field.label, {defaultValue: field.label})}
                           </label>
                        </div>
                      ) : (
                        <Input
                          type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : field.type === 'tel' ? 'tel' : 'text'}
                          value={String(editedValue)}
                          onChange={(e) => handleInputChange(e.target.value)}
                          aria-label={t(field.label, {defaultValue: field.label})}
                          className="max-w-sm"
                          placeholder={field.placeholder ? t(field.placeholder) : undefined}
                        />
                      )}
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" onClick={() => handleSave(field.id)}>
                          <Check className="w-4 h-4 mr-1" />
                          {t('Save', { ns: 'translation' })}
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel}>
                          <X className="w-4 h-4 mr-1" />
                          {t('Cancel', { ns: 'translation' })}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-card-foreground mt-1 break-words whitespace-pre-wrap">
                      {displayValue}
                    </p>
                  )}
                </div>
                {editingFieldId !== field.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(field.id)}
                    className="ml-2 text-primary hover:text-primary/80 h-7 w-7 p-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity shrink-0"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span className="sr-only">{t('Edit', { ns: 'translation' })} {t(field.label, {defaultValue: field.label})}</span>
                  </Button>
                )}
              </div>
              {errors[field.id] && editingFieldId === field.id && ( 
                <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                   <AlertTriangle className="h-3 w-3" />
                   {errors[field.id]?.message?.toString()}
                </p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
