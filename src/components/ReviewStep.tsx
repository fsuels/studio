// src/components/ReviewStep.tsx
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import type { LegalDocument, Question } from '@/lib/document-library';
import { usStates } from '@/lib/document-library';
import { prettify } from '@/lib/schema-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit2, Check, X, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import AddressField from '@/components/AddressField';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';

interface ReviewStepProps {
  doc: LegalDocument;
  locale: 'en' | 'es';
}

export default function ReviewStep({ doc, locale }: ReviewStepProps) {
  const { t } = useTranslation();
  const { control, getValues, setValue, trigger, formState: { errors } } = useFormContext();
  const { toast } = useToast();

  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [currentEditValue, setCurrentEditValue] = useState<any>('');

  const actualSchemaShape = useMemo(() => {
    const schemaDef = doc?.schema?._def;
    if (!schemaDef) return undefined;
    if (schemaDef.typeName === 'ZodObject') return doc.schema.shape;
    if (schemaDef.typeName === 'ZodEffects') return schemaDef.schema?.shape;
    return undefined;
  }, [doc.schema]);

  const fieldsToReview = useMemo(() => {
    const formData = getValues();
    const allFieldKeys = Array.from(new Set([
      ...(actualSchemaShape ? Object.keys(actualSchemaShape) : []),
      ...Object.keys(formData)
    ]));

    return allFieldKeys
      .filter(fieldId => fieldId !== 'notarizationPreference')
      .map((fieldId) => {
        const schemaField = (actualSchemaShape as any)?.[fieldId];
        const schemaFieldDef = schemaField?._def;
        const questionConfig = doc.questions?.find(q => q.id === fieldId);

        const label = questionConfig?.label || schemaFieldDef?.description || prettify(fieldId);
        
        let fieldType = questionConfig?.type || 'text';
        if (schemaFieldDef?.typeName === 'ZodNumber') fieldType = 'number';
        else if (schemaFieldDef?.typeName === 'ZodBoolean') fieldType = 'boolean';
        else if (schemaFieldDef?.typeName === 'ZodDate') fieldType = 'date';
        else if (schemaFieldDef?.typeName === 'ZodEnum' || schemaFieldDef?.innerType?._def?.typeName === 'ZodEnum') fieldType = 'select';
        else if (fieldId.includes('address') && schemaFieldDef?.typeName === 'ZodString') fieldType = 'address';
        else if (fieldId.includes('phone') && schemaFieldDef?.typeName === 'ZodString') fieldType = 'tel';

        const zodEnumValues = schemaFieldDef?.innerType?._def?.values ?? schemaFieldDef?.values ?? (schemaFieldDef?.typeName === 'ZodEffects' && schemaFieldDef.schema?._def?.values);
        let derivedEnumOptions: { value: string; label: string }[] | undefined = undefined;

        if (Array.isArray(zodEnumValues)) {
            derivedEnumOptions = zodEnumValues.map((val: string) => ({
                value: val,
                label: t(`fields.${fieldId}.options.${val}`, { defaultValue: prettify(val) })
            }));
        } else if (typeof zodEnumValues === 'object' && zodEnumValues !== null) {
            // Handle native enums if their values are strings
            derivedEnumOptions = Object.values(zodEnumValues)
                .filter(v => typeof v === 'string')
                .map((val: string) => ({
                    value: val,
                    label: t(`fields.${fieldId}.options.${val}`, { defaultValue: prettify(val) })
                }));
            if (derivedEnumOptions.length === 0) derivedEnumOptions = undefined;
        }
        
        const options = questionConfig?.options && Array.isArray(questionConfig.options) ? questionConfig.options :
                        derivedEnumOptions ||
                        (fieldId === 'state' ? usStates.map(s => ({ value: s.value, label: s.label })) : undefined) ||
                        (fieldId === 'odo_status' ? [
                            { value: 'ACTUAL', label: t('fields.odo_status.actual', 'Actual mileage') },
                            { value: 'EXCEEDS', label: t('fields.odo_status.exceeds', 'Exceeds mechanical limits') },
                            { value: 'NOT_ACTUAL', label: t('fields.odo_status.not_actual', 'Not actual mileage') }
                        ] : undefined);
        
        const placeholder = questionConfig?.placeholder || (schemaFieldDef as any)?.placeholder;

        return {
          id: fieldId,
          label: t(label, { defaultValue: label }),
          type: fieldType as Question['type'], // Cast to ensure type safety
          required: questionConfig?.required ?? (schemaFieldDef?.typeName !== 'ZodOptional' && schemaFieldDef?.innerType?._def?.typeName !== 'ZodOptional'),
          options,
          placeholder,
        };
      });
  }, [doc.schema, doc.questions, actualSchemaShape, getValues, t]);


  const handleEdit = (field: ReturnType<typeof fieldsToReview>[number]) => {
    setCurrentEditValue(getValues(field.id) ?? '');
    setEditingFieldId(field.id);
  };

  const handleSave = async (id: string) => {
    const fieldSchema = fieldsToReview.find(f => f.id === id);
    let valueToSet: any = currentEditValue;

    if (fieldSchema?.type === 'number' && typeof currentEditValue === 'string' && currentEditValue.trim() !== '') {
      const num = parseFloat(currentEditValue);
      if (!isNaN(num)) {
        valueToSet = num;
      }
    } else if (fieldSchema?.type === 'number' && currentEditValue === '') {
        valueToSet = undefined; 
    }
    
    setValue(id, valueToSet, { shouldValidate: true, shouldDirty: true });
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
          <div key={field.id} className="py-2 border-b border-border last:border-b-0">
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-0.5">
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </p>
                {editingFieldId === field.id ? (
                  <div className="mt-1 space-y-2">
                    {field.type === 'textarea' ? (
                       <Controller
                          name={field.id as any}
                          control={control}
                          render={({ field: controllerField }) => (
                            <Textarea 
                              value={currentEditValue} 
                              onChange={(e) => setCurrentEditValue(e.target.value)}
                              onBlur={() => { controllerField.onChange(currentEditValue); controllerField.onBlur(); }}
                              className="max-w-sm" 
                              rows={3}
                            />
                          )}
                        />
                    ) : field.type === 'select' && field.options ? (
                       <Controller
                          name={field.id as any}
                          control={control}
                          render={({ field: controllerField }) => (
                            <Select 
                              value={currentEditValue} 
                              onValueChange={(val) => {
                                setCurrentEditValue(val);
                                controllerField.onChange(val); // Also update RHF value for immediate validation trigger
                              }}
                            >
                               <SelectTrigger className="w-full max-w-sm">
                                   <SelectValue placeholder={field.placeholder || t('Select...')} />
                               </SelectTrigger>
                               <SelectContent>
                                   {field.options.map((opt) => (
                                       <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                   ))}
                               </SelectContent>
                           </Select>
                          )}
                        />
                    ) : field.type === 'boolean' ? (
                        <Controller
                          name={field.id as any}
                          control={control}
                          render={({ field: controllerField }) => (
                            <Switch 
                              checked={typeof currentEditValue === 'boolean' ? currentEditValue : false} 
                              onCheckedChange={(val) => {
                                setCurrentEditValue(val);
                                controllerField.onChange(val);
                              }} 
                            />
                          )}
                        />
                    ) : field.type === 'address' ? (
                         <Controller
                            name={field.id as any}
                            control={control}
                            render={({ field: controllerField }) => (
                                <AddressField 
                                    name={controllerField.name}
                                    label="" 
                                    value={currentEditValue}
                                    onChange={(val, parts) => {
                                        setCurrentEditValue(val);
                                        controllerField.onChange(val);
                                        // If you need to set parts to other fields, use setValue from useFormContext
                                    }}
                                    placeholder={field.placeholder}
                                    className="max-w-sm"
                                />
                            )}
                         />
                    ) : (
                       <Controller
                          name={field.id as any}
                          control={control}
                          render={({ field: controllerField }) => (
                            <Input
                               type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                               value={currentEditValue ?? ''}
                               onChange={(e) => setCurrentEditValue(e.target.value)}
                               onBlur={() => { controllerField.onChange(currentEditValue); controllerField.onBlur();}}
                               className="max-w-sm"
                           />
                          )}
                        />
                    )}
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" onClick={() => handleSave(field.id)}>
                        <Check className="w-4 h-4 mr-1" />{t('Save')}
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        <X className="w-4 h-4 mr-1" />{t('Cancel')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-card-foreground mt-1 break-words">
                    {(() => {
                      const value = getValues(field.id);
                      if (value instanceof Date) return value.toLocaleDateString();
                      if (typeof value === 'boolean') return value ? t('Yes') : t('No');
                      if (field.options && value !== undefined && value !== null) {
                        const opt = field.options.find(o => String(o.value) === String(value)); // Ensure comparison is robust
                        return opt?.label || String(value);
                      }
                      return (value !== undefined && value !== null && String(value).trim() !== '') ? String(value) : t('Not Provided');
                    })()}
                  </p>
                )}
              </div>
              {editingFieldId !== field.id && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(field)}
                  className="mt-1 self-start"
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="sr-only">{t('Edit')} {field.label}</span>
                </Button>
              )}
            </div>
            {errors[field.id] && (
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
