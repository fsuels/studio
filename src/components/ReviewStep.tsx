// src/components/ReviewStep.tsx
'use client';

import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import type { LegalDocument, Question } from '@/lib/document-library';
import { usStates } from '@/lib/document-library';
import { prettify } from '@/lib/schema-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit2, Check, X, AlertTriangle, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';
import AddressField from '@/components/AddressField';
import SmartInput from '@/components/wizard/SmartInput';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from '@/components/ui/label';

interface ReviewStepProps {
  doc: LegalDocument;
  locale: 'en' | 'es';
}

export default function ReviewStep({ doc, locale }: ReviewStepProps) {
  const { t } = useTranslation("common");
  const { control, getValues, setValue, trigger, formState: { errors }, watch, register } = useFormContext();
  const { toast } = useToast();

  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [originalFieldValue, setOriginalFieldValue] = useState<any>(null);

  useEffect(() => {
    // This log helps see if the component re-renders when editingFieldId changes
    console.log('[ReviewStep] editingFieldId changed to:', editingFieldId);
  }, [editingFieldId]);

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
        if (fieldId === 'notarizationPreference') return false; // Example of a field to exclude
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
            else if (fieldId.toLowerCase().includes('address') && schemaFieldDef.typeName === 'ZodString') fieldType = 'address';
            else if (fieldId.toLowerCase().includes('phone') && schemaFieldDef.typeName === 'ZodString') fieldType = 'tel';
            else if (schemaFieldDef.typeName === 'ZodString' && ((schemaFieldDef as any)?.uiType === 'textarea' || questionConfig?.type === 'textarea')) fieldType = 'textarea';
        }
        
        const rawEnumValues = schemaFieldDef?.innerType?._def?.values ?? schemaFieldDef?.values ?? (schemaFieldDef?.typeName === 'ZodEffects' ? schemaFieldDef.schema?._def?.values : undefined);
        const enumOptions = Array.isArray(rawEnumValues) ? rawEnumValues.map((val: string) => ({ value: val, label: t(`documents:fields.${fieldId}.options.${val}`, {defaultValue: prettify(val)}) })) : undefined;
        
        const options = questionConfig?.options ??
                        enumOptions ??
                        (fieldId === 'state' ? usStates.map(s => ({value: s.value, label: s.label})) : undefined) ??
                        (fieldId === 'odo_status' ? [{value: 'ACTUAL', label: t('documents:fields.odo_status.options.ACTUAL', {defaultValue: 'Actual mileage'})}, {value: 'EXCEEDS', label: t('documents:fields.odo_status.options.EXCEEDS', {defaultValue: 'Exceeds mechanical limits'})}, {value: 'NOT_ACTUAL', label: t('documents:fields.odo_status.options.NOT_ACTUAL', {defaultValue: 'Not actual mileage'})}] : undefined);
        
        const placeholder = questionConfig?.placeholder || (schemaFieldDef as any)?.placeholder;
        const tooltip = questionConfig?.tooltip || (schemaFieldDef as any)?.tooltip;
        const required = questionConfig?.required ?? (schemaFieldDef?.typeName !== 'ZodOptional' && schemaFieldDef?.innerType?._def?.typeName !== 'ZodOptional');

        return { id: fieldId, label, type: fieldType, options, required, placeholder, tooltip };
      });
  }, [doc, actualSchemaShape, getValues, t, watchedValues]); // watchedValues dependency

  const handleEdit = (fieldId: string) => {
    console.log(`[ReviewStep] handleEdit called for fieldId: ${fieldId}`);
    const currentValue = getValues(fieldId);
    console.log(`[ReviewStep] Current value for ${fieldId}:`, currentValue);
    setOriginalFieldValue(currentValue);
    setEditingFieldId(fieldId);
    console.log(`[ReviewStep] editingFieldId state set to: ${fieldId}`);
  };

  const handleSave = useCallback(async (fieldId: string) => {
    const isValid = await trigger(fieldId as any);
    if (isValid) {
      setEditingFieldId(null);
      setOriginalFieldValue(null);
      toast({ title: t('Changes Saved'), description: `${t(fieldsToReview.find(f=>f.id === fieldId)?.label || fieldId, { ns: 'documents', defaultValue: fieldsToReview.find(f=>f.id === fieldId)?.label || fieldId })} ${t('updated.')}` });
    } else {
      toast({ title: t('Validation Error'), description: t('Please correct the field.'), variant: 'destructive' });
    }
  }, [trigger, toast, t, fieldsToReview]);

  const handleCancel = useCallback(() => {
    if (editingFieldId && originalFieldValue !== undefined) { // Check for undefined, not null
      setValue(editingFieldId as any, originalFieldValue, { shouldValidate: true, shouldDirty: true });
    }
    setEditingFieldId(null);
    setOriginalFieldValue(null);
  }, [editingFieldId, originalFieldValue, setValue]);

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
  
  const getInputType = (fieldType: Question['type']): React.HTMLInputTypeAttribute => {
    if (fieldType === 'number') return 'number';
    if (fieldType === 'date') return 'date';
    if (fieldType === 'tel') return 'tel'; // SmartInput handles tel better
    return 'text';
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
        {fieldsToReview.map((field) => {
          const isCurrentlyEditing = editingFieldId === field.id;
          console.log(`[ReviewStep] Rendering field: ${field.id}, isCurrentlyEditing: ${isCurrentlyEditing}`);
          return (
            <div key={field.id} className="py-3 border-b border-border last:border-b-0">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-0.5">
                    <p className="text-sm font-medium text-muted-foreground">
                      {t(field.label, {ns: 'documents', defaultValue: field.label})}
                      {field.required && <span className="text-destructive ml-1">*</span>}
                    </p>
                    {field.tooltip && !isCurrentlyEditing && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button type="button" variant="ghost" size="icon" className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground" onClick={(e) => e.stopPropagation()}>
                            <Info className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" align="start" className="max-w-xs text-xs bg-popover text-popover-foreground border shadow-md rounded p-1.5 z-50">
                          <p>{t(field.tooltip, {ns: 'documents', defaultValue: field.tooltip})}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>

                  {isCurrentlyEditing ? (
                    <div className="mt-1.5 space-y-2">
                      {(field.type === 'tel' || field.id.toLowerCase().includes('phone')) ? (
                        <SmartInput
                          id={`review-${field.id}`}
                          type="tel"
                          placeholder={t(field.placeholder || '', {ns: 'documents', defaultValue: field.placeholder || ''})}
                          className={cn("max-w-md text-sm", errors[field.id] && "border-destructive")}
                          aria-invalid={!!errors[field.id]}
                          rhfProps={register(field.id as any, { required: field.required })}
                        />
                      ) : field.type === 'address' ? (
                        <Controller
                          name={field.id as any}
                          control={control}
                          rules={{ required: field.required }}
                          render={({ field: controllerField }) => (
                            <AddressField
                              name={controllerField.name}
                              label="" // Label is already rendered above
                              value={controllerField.value || ''}
                              onChange={(val, parts) => {
                                controllerField.onChange(val);
                                if (parts && actualSchemaShape) {
                                  const prefix = field.id.replace(/_address$/i, '') || field.id.replace(/Address$/i, '');
                                  if ((actualSchemaShape as any)?.[`${prefix}_city`]) setValue(`${prefix}_city`, parts.city, { shouldValidate: true, shouldDirty: true });
                                  if ((actualSchemaShape as any)?.[`${prefix}_state`]) setValue(`${prefix}_state`, parts.state, { shouldValidate: true, shouldDirty: true });
                                  if ((actualSchemaShape as any)?.[`${prefix}_postal_code`]) setValue(`${prefix}_postal_code`, parts.postalCode, { shouldValidate: true, shouldDirty: true });
                                }
                              }}
                              placeholder={t(field.placeholder || 'Enter address...', {ns: 'documents', defaultValue: field.placeholder || 'Enter address...'})}
                              className="max-w-md"
                              error={errors[field.id]?.message as string | undefined}
                              tooltipText={field.tooltip ? t(field.tooltip, {ns: 'documents', defaultValue: field.tooltip}) : undefined}
                            />
                          )}
                        />
                      ) : (
                        <Controller
                          name={field.id as any}
                          control={control}
                          rules={{ required: field.required }}
                          render={({ field: controllerField }) => {
                            if (field.type === 'textarea') {
                              return <Textarea
                                id={`review-${field.id}`}
                                placeholder={t(field.placeholder || '', {ns: 'documents', defaultValue: field.placeholder || ''})}
                                className={cn("max-w-md text-sm", errors[field.id] && "border-destructive")}
                                value={controllerField.value ?? ''}
                                onChange={(e) => controllerField.onChange(e.target.value)}
                                onBlur={controllerField.onBlur}
                                name={controllerField.name}
                                ref={controllerField.ref}
                                aria-invalid={!!errors[field.id]}
                                rows={3}
                              />;
                            }
                            if (field.type === 'select' && field.options) {
                              return (
                                <Select
                                  value={String(controllerField.value ?? '')}
                                  onValueChange={controllerField.onChange}
                                  name={controllerField.name}
                                >
                                  <SelectTrigger
                                    id={`review-${field.id}`}
                                    className={cn("max-w-md text-sm", errors[field.id] && "border-destructive focus:ring-destructive")}
                                    aria-invalid={!!errors[field.id]}
                                    aria-label={t(field.placeholder || 'Select...', {ns: 'documents', defaultValue: field.placeholder || 'Select...'})}
                                  >
                                    <SelectValue placeholder={t(field.placeholder || 'Select...', {ns: 'documents', defaultValue: field.placeholder || 'Select...'})} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {field.options.map((opt) => (
                                      <SelectItem key={opt.value} value={String(opt.value)} className="text-sm">{t(opt.label, {ns: 'documents', defaultValue: opt.label})}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              );
                            }
                            if (field.type === 'boolean') {
                              return (
                                <div className="flex items-center space-x-2">
                                  <Switch id={`review-${field.id}`} checked={Boolean(controllerField.value)} onCheckedChange={controllerField.onChange} ref={controllerField.ref} />
                                  <Label htmlFor={`review-${field.id}`} className="text-sm font-normal">{Boolean(controllerField.value) ? t('Yes') : t('No')}</Label>
                                </div>
                              );
                            }
                            // Default to standard Input
                            return (
                              <Input
                                id={`review-${field.id}`}
                                type={getInputType(field.type)}
                                placeholder={t(field.placeholder || '', {ns: 'documents', defaultValue: field.placeholder || ''})}
                                className={cn("max-w-md text-sm", errors[field.id] && "border-destructive")}
                                value={controllerField.value ?? ''}
                                onChange={(e) => {
                                  let valToSet: string | number = e.target.value;
                                  if (field.type === 'number' && valToSet !== '' && !isNaN(Number(valToSet))) {
                                    valToSet = Number(valToSet);
                                  } else if (field.type === 'number' && valToSet === '') {
                                    valToSet = '' // Allow clearing number field, validation will handle it
                                  }
                                  controllerField.onChange(valToSet);
                                }}
                                onBlur={controllerField.onBlur}
                                name={controllerField.name}
                                ref={controllerField.ref}
                                aria-invalid={!!errors[field.id]}
                              />
                            );
                          }}
                        />
                      )}
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
                {!isCurrentlyEditing && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      console.log(`[ReviewStep] Edit button clicked for fieldId: ${field.id}`);
                      e.stopPropagation(); // Prevent any parent click handlers if any
                      handleEdit(field.id);
                    }}
                    className="mt-1 self-start shrink-0"
                    aria-label={`${t('Edit')} ${t(field.label, { ns: 'documents', defaultValue: field.label })}`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              {errors[field.id] && isCurrentlyEditing && (
                <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> {String(errors[field.id]?.message)}
                </p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

