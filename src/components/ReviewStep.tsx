// src/components/ReviewStep.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import type { LegalDocument, Question } from '@/lib/document-library';
import { usStates } from '@/lib/document-library';
import { prettify } from '@/lib/schema-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit2, Check, X, AlertTriangle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import AddressField from '@/components/AddressField'; 
import { Label } from "@/components/ui/label";

interface ReviewStepProps {
  doc: LegalDocument;
  locale: 'en' | 'es';
}

export default function ReviewStep({ doc, locale }: ReviewStepProps) {
  const { t } = useTranslation();
  const { getValues, setValue, trigger, watch, formState: { errors } } = useFormContext();
  const { toast } = useToast();

  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editedValue, setEditedValue] = useState<any>(null); 
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const actualSchemaShape = useMemo(() => {
    const schemaDef = doc?.schema?._def;
    if (!schemaDef) return undefined;
    if (schemaDef.typeName === 'ZodObject') return doc.schema.shape;
    if (schemaDef.typeName === 'ZodEffects' && schemaDef.schema?._def?.typeName === 'ZodObject') return schemaDef.schema.shape; 
    return undefined;
  }, [doc]);


  const fieldsToReview = useMemo(() => {
    if (!isHydrated || !doc || !actualSchemaShape) return [];
    const currentFormData = getValues();
    const allFieldKeys = Array.from(new Set([...Object.keys(actualSchemaShape), ...Object.keys(currentFormData)]));

    return allFieldKeys
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
          const baseTypeDef = schemaFieldDef.innerType?._def || schemaFieldDef; 
          if (baseTypeDef.typeName === 'ZodNumber') fieldType = 'number';
          else if (baseTypeDef.typeName === 'ZodDate' || (baseTypeDef.typeName === 'ZodString' && (schemaFieldDef.checks?.some((c: any) => c.kind === 'datetime') || fieldId.endsWith('_date')))) fieldType = 'date';
          else if (baseTypeDef.typeName === 'ZodBoolean') fieldType = 'boolean';
          else if (baseTypeDef.typeName === 'ZodEnum') fieldType = 'select';
          else if (fieldId.includes('_address') || fieldId.includes('Address') || fieldId === 'seller_address' || fieldId === 'buyer_address') fieldType = 'address';
          else if (fieldId.endsWith('_phone') || (label && (label.toLowerCase().includes('phone') || label.toLowerCase().includes('teléfono')))) fieldType = 'tel';
          else if (fieldId === 'warranty_text') fieldType = 'textarea'; 
        }
        
        // Refactored options assignment
        const zodEnumBasedOptions = (schemaFieldDef?.innerType?._def?.values || schemaFieldDef?.values || (schemaFieldDef?.typeName === 'ZodEffects' && schemaFieldDef?.schema?._def?.values) )
                                    ?.map((val: string) => ({ value: val, label: t(`fields.${fieldId}.options.${val}`, {defaultValue: prettify(val)}) }));
        
        const stateBasedOptions = (fieldId === 'state' ? usStates.map(s => ({value: s.value, label: s.label})) : undefined);

        const odoStatusBasedOptions = (fieldId === 'odo_status' ? 
                                      [{value: 'ACTUAL', label: t('fields.odo_status.actual', 'Actual mileage')}, 
                                       {value: 'EXCEEDS', label: t('fields.odo_status.exceeds', 'Exceeds mechanical limits')}, 
                                       {value: 'NOT_ACTUAL', label: t('fields.odo_status.not_actual', 'Not actual mileage')}] 
                                      : undefined);

        const options = questionConfig?.options || zodEnumBasedOptions || stateBasedOptions || odoStatusBasedOptions;
        
        const placeholder = questionConfig?.placeholder || (schemaFieldDef as any)?.placeholder;

        return {
          id: fieldId, 
          label,
          type: fieldType,
          options,
          required: questionConfig?.required || (schemaFieldDef?.typeName !== 'ZodOptional' && schemaFieldDef?.innerType?._def?.typeName !== 'ZodOptional'),
          placeholder: placeholder ? t(placeholder, {defaultValue: placeholder}) : undefined,
        };
      })
      .filter(field => (actualSchemaShape as any)?.[field.id]); 
  }, [doc, actualSchemaShape, t, isHydrated, getValues]);


  const handleEdit = (id: string, type: Question['type']) => {
    const currentValue = getValues(id);
    if (type === 'date' && currentValue instanceof Date) {
      setEditedValue(currentValue.toISOString().split('T')[0]); 
    } else {
      setEditedValue(currentValue === undefined || currentValue === null ? '' : currentValue);
    }
    setEditingFieldId(id);
  };
  
  const handleInputChange = (value: any, type: Question['type']) => {
    if (type === 'number') {
        setEditedValue(value === '' ? '' : parseFloat(value as string)); 
    } else if (type === 'boolean') {
        setEditedValue(Boolean(value));
    } else {
        setEditedValue(value);
    }
  };

  const handleSave = async (id: string, type: Question['type']) => {
    let valueToSave = editedValue;
    if (type === 'number') {
      valueToSave = editedValue === '' || editedValue === null ? undefined : parseFloat(editedValue as string);
      if (isNaN(valueToSave as number)) valueToSave = undefined; 
    } else if (type === 'date' && typeof editedValue === 'string') {
      valueToSave = editedValue ? new Date(editedValue) : undefined;
    }

    setValue(id, valueToSave, { shouldValidate: true, shouldDirty: true });
    const isValid = await trigger(id); 
    if (isValid) {
      setEditingFieldId(null); 
      const fieldLabel = fieldsToReview.find(f=>f.id === id)?.label || id;
      toast({ title: t('Changes Saved'), description: `${t(fieldLabel)} ${t('updated.')}` });
    } else {
      toast({ title: t('Validation Error'), description: t('Please correct the field.'), variant: 'destructive' });
    }
  };

  const handleCancel = () => {
    setEditingFieldId(null);
    setEditedValue(null); 
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
          const liveFieldValue = watch(field.id);

          let displayValue: string;
            if (liveFieldValue instanceof Date) {
                displayValue = liveFieldValue.toLocaleDateString(locale);
            } else if (typeof liveFieldValue === 'boolean') {
                displayValue = liveFieldValue ? t('Yes') : t('No');
            } else if (field.type === 'select' && field.options && liveFieldValue !== undefined) {
                const selectedOption = field.options.find(opt => opt.value === liveFieldValue);
                displayValue = selectedOption ? t(selectedOption.label, {defaultValue: selectedOption.label}) : String(liveFieldValue);
            } else {
                displayValue = (liveFieldValue !== undefined && liveFieldValue !== null && String(liveFieldValue).trim() !== '') ? String(liveFieldValue) : t('Not Provided', { ns: 'translation' });
            }

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
                          value={String(editedValue ?? '')}
                          onChange={(e) => handleInputChange(e.target.value, field.type)}
                          className="min-h-[60px] max-w-sm bg-background border-input"
                          aria-label={t(field.label, {defaultValue: field.label})}
                          placeholder={field.placeholder}
                        />
                      ) : field.type === 'select' && field.options ? (
                        <Select
                          value={String(editedValue ?? '')}
                          onValueChange={(val) => handleInputChange(val, field.type)}
                        >
                          <SelectTrigger aria-label={t(field.label, {defaultValue: field.label})} className="max-w-sm bg-background border-input">
                            <SelectValue placeholder={field.placeholder || t('Select...')} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{t(opt.label, {defaultValue: opt.label})}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : field.type === 'boolean' && field.id === 'as_is' ? (
                        <div className="flex items-center space-x-2 pt-1 max-w-sm">
                            <Switch
                                id={`review-edit-${field.id}`}
                                checked={Boolean(editedValue)}
                                onCheckedChange={(val) => handleInputChange(val, field.type)}
                            />
                            <Label htmlFor={`review-edit-${field.id}`} className="text-sm font-normal">
                               {Boolean(editedValue) ? t('Sold As-Is') : t('Warranty Included')}
                            </Label>
                        </div>
                      ) : field.type === 'boolean' || field.type === 'checkbox' ? (
                        <div className="flex items-center space-x-2 pt-1">
                           <Checkbox
                              checked={Boolean(editedValue)}
                              onCheckedChange={(checked) => handleInputChange(Boolean(checked), field.type)}
                              id={`review-edit-${field.id}`}
                           />
                           <Label htmlFor={`review-edit-${field.id}`} className="text-sm font-normal">
                             {t(field.label, {defaultValue: field.label})} 
                           </Label>
                        </div>
                      ) : field.type === 'radio' && field.options && field.id === 'odo_status' ? (
                          <RadioGroup
                            onValueChange={(val) => handleInputChange(val, field.type)}
                            value={editedValue as string || undefined}
                            className="space-y-1"
                          >
                            {field.options.map((opt) => (
                              <div key={opt.value} className="flex items-center space-x-2">
                                <RadioGroupItem value={opt.value} id={`review_odo_status_${opt.value.toLowerCase()}`} />
                                <Label htmlFor={`review_odo_status_${opt.value.toLowerCase()}`} className="font-normal text-sm">
                                  {t(`fields.odo_status.${opt.value.toLowerCase()}`, {defaultValue: opt.label})}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                      ): field.type === 'address' ? (
                         <AddressField
                            name={field.id} 
                            label="" 
                            placeholder={field.placeholder || t('Enter address...', { ns: 'translation' })}
                            value={String(editedValue ?? '')}
                            onChange={(val) => handleInputChange(val, field.type)} 
                          />
                      ) : ( 
                        <Input
                          type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : field.type === 'tel' ? 'tel' : 'text'}
                          value={field.type === 'date' && editedValue instanceof Date ? editedValue.toISOString().split('T')[0] : String(editedValue ?? '')}
                          onChange={(e) => handleInputChange(e.target.value, field.type)}
                          aria-label={t(field.label, {defaultValue: field.label})}
                          className="max-w-sm bg-background border-input"
                          placeholder={field.placeholder}
                        />
                      )}
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" onClick={() => handleSave(field.id, field.type)}>
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
                    onClick={() => handleEdit(field.id, field.type)}
                    className="ml-2 text-primary hover:text-primary/80 h-7 w-7 p-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity shrink-0"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span className="sr-only">{t('Edit', { ns: 'translation' })} {t(field.label, {defaultValue: field.label})}</span>
                  </Button>
                )}
              </div>
              {errors[field.id] && editingFieldId !== field.id && ( 
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
