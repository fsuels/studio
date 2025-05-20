// src/components/ReviewStep.tsx
'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import type { LegalDocument, Question } from '@/lib/document-library';
import { usStates } from '@/lib/document-library'; // Ensure usStates is imported if used
import { prettify } from '@/lib/schema-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit2, Check, X, AlertTriangle, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';
import AddressField from '@/components/AddressField'; 
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";


interface ReviewStepProps {
  doc: LegalDocument;
  locale: 'en' | 'es';
}

export default function ReviewStep({ doc, locale }: ReviewStepProps) {
  const { t } = useTranslation("common");
  const { control, getValues, setValue, trigger, formState: { errors }, watch } = useFormContext();
  const { toast } = useToast();

  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  
  const watchedValues = watch(); 

  const actualSchemaShape = useMemo(() => {
    const schemaDef = doc?.schema?._def;
    if (!schemaDef) return undefined;
    if (schemaDef.typeName === 'ZodObject') return doc.schema.shape;
    if (schemaDef.typeName === 'ZodEffects' && schemaDef.schema?._def?.typeName === 'ZodObject') return schemaDef.schema.shape;
    return undefined;
  }, [doc.schema]);

  const fieldsToReview = useMemo(() => {
    const currentFormData = getValues();
    const allFieldKeys = Array.from(new Set([
      ...(actualSchemaShape ? Object.keys(actualSchemaShape) : []),
      ...Object.keys(currentFormData) 
    ]));

    return allFieldKeys
      .filter(fieldId => {
        if (fieldId === 'notarizationPreference') return false;
        return true;
      })
      .map((fieldId) => {
        const questionConfig = doc.questions?.find(q => q.id === fieldId);
        const schemaField = (actualSchemaShape as any)?.[fieldId];
        const schemaFieldDef = schemaField?._def;

        let label = questionConfig?.label || schemaFieldDef?.description || (schemaFieldDef?.labelKey ? t(schemaFieldDef.labelKey) : null) || prettify(fieldId);
        
        let fieldType: Question['type'] = questionConfig?.type || 'text'; 
        if (schemaFieldDef) {
            if (schemaFieldDef.typeName === 'ZodNumber') fieldType = 'number';
            else if (schemaFieldDef.typeName === 'ZodBoolean') fieldType = 'boolean';
            else if (schemaFieldDef.typeName === 'ZodDate') fieldType = 'date';
            else if (schemaFieldDef.typeName === 'ZodEnum' || schemaFieldDef.innerType?._def?.typeName === 'ZodEnum') fieldType = 'select';
            else if (fieldId.includes('address') && schemaFieldDef.typeName === 'ZodString') fieldType = 'address';
            else if (fieldId.includes('phone') && schemaFieldDef.typeName === 'ZodString') fieldType = 'tel';
            else if (schemaFieldDef.typeName === 'ZodString' && questionConfig?.type === 'textarea') fieldType = 'textarea';
        }
        
        const rawEnumValues = schemaFieldDef?.innerType?._def?.values ?? schemaFieldDef?.values ?? (schemaFieldDef?.typeName === 'ZodEffects' ? schemaFieldDef.schema?._def?.values : undefined);
        const enumOptions = Array.isArray(rawEnumValues) ? rawEnumValues.map((val: string) => ({ value: val, label: t(`fields.${fieldId}.options.${val}`, {defaultValue: prettify(val)}) })) : undefined;
        
        const options = questionConfig?.options ??
                        enumOptions ??
                        (fieldId === 'state' ? usStates.map(s => ({value: s.value, label: s.label})) : undefined) ??
                        (fieldId === 'odo_status' ? [{value: 'ACTUAL', label: t('fields.odo_status.actual', 'Actual mileage')}, {value: 'EXCEEDS', label: t('fields.odo_status.exceeds', 'Exceeds mechanical limits')}, {value: 'NOT_ACTUAL', label: t('fields.odo_status.not_actual', 'Not actual mileage')}] : undefined);
        
        const placeholder = questionConfig?.placeholder || (schemaFieldDef as any)?.placeholder;
        const tooltip = questionConfig?.tooltip || (schemaFieldDef as any)?.tooltip;
        const required = questionConfig?.required ?? (schemaFieldDef?.typeName !== 'ZodOptional' && schemaFieldDef?.innerType?._def?.typeName !== 'ZodOptional');

        return { id: fieldId, label, type: fieldType, options, required, placeholder, tooltip };
      });
  }, [doc, actualSchemaShape, getValues, t, watchedValues]); 

  const handleEdit = (fieldId: string) => {
    setEditingFieldId(fieldId);
  };

  const handleSave = useCallback(async (fieldId: string) => {
    const isValid = await trigger(fieldId as any);
    if (isValid) {
      setEditingFieldId(null); 
      toast({ title: t('Changes Saved'), description: `${t(fieldsToReview.find(f=>f.id === fieldId)?.label || fieldId)} ${t('updated.')}` });
    } else {
      toast({ title: t('Validation Error'), description: t('Please correct the field.'), variant: 'destructive' });
    }
  }, [trigger, toast, t, fieldsToReview]);

  const handleCancel = useCallback(() => {
    setEditingFieldId(null);
  }, []);

  const renderFieldValue = (field: typeof fieldsToReview[number]) => {
    const value = getValues(field.id);
    const isMissing = field.required && (value === undefined || value === null || String(value).trim() === '');
    if (field.type === 'boolean') return value ? t('Yes') : t('No');
    if (field.type === 'select' && field.options && value !== undefined && value !== null) {
      const opt = field.options.find(o => String(o.value) === String(value));
      return opt?.label || String(value);
    }
    if (value instanceof Date) return value.toLocaleDateString(locale);
    if (isMissing) return <span className="italic text-destructive">{t('wizard.fieldRequired')}</span>;
    return (value !== undefined && value !== null && String(value).trim() !== '') ? String(value) : <span className="italic text-muted-foreground/70">{t('Not Provided')}</span>;
  };

  return (
    <Card className="bg-card border-border shadow-lg">
      <CardHeader>
        <CardTitle>{t('Review Your Information')}</CardTitle>
        <CardDescription>
          {t('Please confirm the details below are correct before proceeding.')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {fieldsToReview.map((field) => (
          <div key={field.id} className="py-3 border-b border-border last:border-b-0">
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-0.5">
                  <p className="text-sm font-medium text-muted-foreground">
                    {field.label}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                  </p>
                  {field.tooltip && editingFieldId !== field.id && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button type="button" variant="ghost" size="icon" className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground" onClick={(e) => e.stopPropagation()}>
                          <Info className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="start" className="max-w-xs text-xs bg-popover text-popover-foreground border shadow-md rounded p-1.5 z-50">
                        <p>{field.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>

                {editingFieldId === field.id ? (
                  <div className="mt-1.5 space-y-2">
                    <Controller
                      name={field.id as any}
                      control={control}
                      render={({ field: controllerField }) => {
                        const commonProps = {
                          ...controllerField,
                          value: controllerField.value ?? '', 
                          onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string | boolean) => {
                            let valToSet;
                            if (typeof e === 'object' && 'target' in e && e.target) {
                                valToSet = field.type === 'number' && (e.target as HTMLInputElement).value !== '' ? Number((e.target as HTMLInputElement).value) : (e.target as HTMLInputElement).value;
                            } else { 
                                valToSet = e;
                            }
                            controllerField.onChange(valToSet);
                          },
                          className: cn("max-w-md text-sm", errors[field.id] && "border-destructive"),
                          placeholder: field.placeholder || '',
                        };

                        if (field.type === 'textarea') return <Textarea {...commonProps} rows={3} />;
                        if (field.type === 'select' && field.options) return (
                          <Select
                            value={String(commonProps.value)}
                            onValueChange={commonProps.onChange}
                          >
                            <SelectTrigger className={cn(commonProps.className, "w-full")}>
                              <SelectValue placeholder={field.placeholder || t('Select...')} />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options.map((opt) => (
                                <SelectItem key={opt.value} value={String(opt.value)} className="text-sm">{opt.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        );
                        if (field.type === 'boolean') return (
                          <div className="flex items-center space-x-2">
                            <Switch id={`review-${field.id}`} checked={Boolean(commonProps.value)} onCheckedChange={commonProps.onChange} />
                            <Label htmlFor={`review-${field.id}`} className="text-sm font-normal">{Boolean(commonProps.value) ? t('Yes') : t('No')}</Label>
                          </div>
                        );
                        if (field.type === 'address') return (
                          <AddressField
                            name={controllerField.name}
                            label="" 
                            value={controllerField.value || ''}
                            onChange={(val, parts) => {
                                controllerField.onChange(val);
                                if (parts && actualSchemaShape) {
                                    const prefix = field.id.replace(/_address$/i, '') || field.id.replace(/Address$/i, '');
                                    if ((actualSchemaShape as any)?.[`${prefix}_city`]) setValue(`${prefix}_city`, parts.city, {shouldValidate: true, shouldDirty: true});
                                    if ((actualSchemaShape as any)?.[`${prefix}_state`]) setValue(`${prefix}_state`, parts.state, {shouldValidate: true, shouldDirty: true});
                                    if ((actualSchemaShape as any)?.[`${prefix}_postal_code`]) setValue(`${prefix}_postal_code`, parts.postalCode, {shouldValidate: true, shouldDirty: true});
                                }
                            }}
                            placeholder={field.placeholder || t('Enter address...', {ns: 'translation'})}
                            className="max-w-md"
                            error={errors[field.id]?.message as string | undefined}
                          />
                        );
                        return <Input {...commonProps} type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'} />;
                      }}
                    />
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" onClick={() => handleSave(field.id)} className="text-xs h-8">
                        <Check className="w-3.5 h-3.5 mr-1" />{t('Save')}
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel} className="text-xs h-8">
                        <X className="w-3.5 h-3.5 mr-1" />{t('Cancel')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-card-foreground mt-1 break-words pr-10">
                    {renderFieldValue(field)}
                  </p>
                )}
              </div>
              {editingFieldId !== field.id && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(field.id)}
                  className="mt-1 self-start shrink-0"
                  aria-label={`${t('Edit')} ${field.label}`}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            {errors[field.id] && editingFieldId === field.id && (
              <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> {String(errors[field.id]?.message)}
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
