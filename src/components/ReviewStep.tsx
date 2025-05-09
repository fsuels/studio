// src/components/ReviewStep.tsx
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import type { LegalDocument, Question } from '@/lib/document-library';
import { prettify } from '@/lib/schema-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit2, Check, X, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import AddressField from '@/components/AddressField';

interface ReviewStepProps {
  doc: LegalDocument;
  locale: 'en' | 'es';
}

export default function ReviewStep({ doc, locale }: ReviewStepProps) {
  const { t } = useTranslation();
  const { control, watch, setValue, trigger, formState: { errors } } = useFormContext();
  const { toast } = useToast();

  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);

  const actualSchemaShape = useMemo(() => {
    const def = doc?.schema?._def;
    if (!def) return undefined;
    if (def.typeName === 'ZodEffects') return def.schema?.shape;
    if (def.typeName === 'ZodObject') return def.shape;
    return undefined;
  }, [doc]);

  const fieldKeys = useMemo(() => {
    const shape = actualSchemaShape ?? {};
    const values = watch();
    return Array.from(new Set([...Object.keys(shape), ...Object.keys(values)]));
  }, [actualSchemaShape, watch]);

  const fieldsToReview = useMemo(() => {
    return fieldKeys.map((fieldId) => {
      const schemaField = (actualSchemaShape as any)?.[fieldId];
      const def = schemaField?._def;
      const q = doc.questions?.find(q => q.id === fieldId);
      const label = q?.label || def?.description || prettify(fieldId);
      const options = q?.options || def?.values?.map((v: string) => ({ value: v, label: prettify(v) }));
      const fieldType = q?.type || (
        def?.typeName === 'ZodNumber' ? 'number' :
        def?.typeName === 'ZodBoolean' ? 'boolean' :
        def?.typeName === 'ZodDate' ? 'date' :
        def?.typeName === 'ZodEnum' || def?.innerType?._def?.typeName === 'ZodEnum' ? 'select' :
        fieldId.includes('address') ? 'address' : 'text'
      );
      return {
        id: fieldId,
        label: t(label, { defaultValue: label }),
        type: fieldType,
        required: q?.required ?? !(def?.typeName === 'ZodOptional'),
        options,
      };
    });
  }, [fieldKeys, doc.questions, actualSchemaShape, t]);

  const handleSave = async (id: string) => {
    const isValid = await trigger(id);
    if (isValid) {
      toast({ title: t('Saved'), description: t('Changes saved.') });
      setEditingFieldId(null);
    } else {
      toast({ title: t('Validation Error'), description: t('Please correct the field.'), variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Review Your Information')}</CardTitle>
        <CardDescription>{t('Please confirm the details below are correct. Click the edit icon to make changes.')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {fieldsToReview.map((field) => (
          <div key={field.id} className="border-b py-3 last:border-0">
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1">
                <label className="text-sm font-medium text-muted-foreground">
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </label>

                {editingFieldId === field.id ? (
                  <Controller
                    name={field.id}
                    control={control}
                    render={({ field: controller }) => (
                      <div className="mt-1 space-y-2">
                        {field.type === 'textarea' ? (
                          <Textarea {...controller} />
                        ) : field.type === 'select' && field.options ? (
                          <Select value={controller.value} onValueChange={controller.onChange}>
                            <SelectTrigger className="w-full max-w-sm">
                              <SelectValue placeholder={t('Select...')} />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : field.type === 'boolean' ? (
                          <Switch
                            checked={controller.value}
                            onCheckedChange={controller.onChange}
                          />
                        ) : field.type === 'address' ? (
                          <AddressField
                            name={field.id}
                            value={controller.value}
                            onChange={controller.onChange}
                            label=""
                          />
                        ) : (
                          <Input
                            type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                            value={controller.value}
                            onChange={controller.onChange}
                          />
                        )}
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleSave(field.id)}><Check className="w-4 h-4 mr-1" /> {t('Save')}</Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingFieldId(null)}><X className="w-4 h-4 mr-1" /> {t('Cancel')}</Button>
                        </div>
                      </div>
                    )}
                  />
                ) : (
                  <p className="text-sm mt-1 whitespace-pre-wrap">
                    {(() => {
                      const value = watch(field.id);
                      if (value instanceof Date) return value.toLocaleDateString();
                      if (typeof value === 'boolean') return value ? t('Yes') : t('No');
                      if (field.options) {
                        const opt = field.options.find((o) => o.value === value);
                        return opt?.label || String(value);
                      }
                      return value ?? t('Not Provided');
                    })()}
                  </p>
                )}
              </div>
              {editingFieldId !== field.id && (
                <Button size="icon" variant="ghost" onClick={() => setEditingFieldId(field.id)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            {errors[field.id] && (
              <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {String(errors[field.id]?.message)}
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
