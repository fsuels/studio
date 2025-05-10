// src/components/ReviewStep.tsx
'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import type { LegalDocument, Question } from '@/lib/document-library';
import { usStates } from '@/lib/document-library';
import { prettify } from '@/lib/schema-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit2, Check, X, AlertTriangle, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import AddressField from '@/components/AddressField';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  // TooltipProvider is used in WizardForm
} from "@/components/ui/tooltip";

interface ReviewStepProps {
  doc: LegalDocument;
  locale: 'en' | 'es';
}

const ReviewStep = React.memo(function ReviewStep({ doc, locale }: ReviewStepProps) {
  const { t } = useTranslation();
  const { control, getValues, setValue, trigger, formState: { errors } } = useFormContext();
  const { toast } = useToast();

  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [currentEditValue, setCurrentEditValue] = useState<any>('');
  
  // State for individual tooltips if they were to be added here
  // Example: const [tooltipStates, setTooltipStates] = useState<Record<string, boolean>>({});

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
      .filter(fieldId => fieldId !== 'notarizationPreference') // Example filter
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
        
        const rawEnum =
          schemaFieldDef?.innerType?._def?.values ??
          schemaFieldDef?.values ??
          (schemaFieldDef?.typeName === 'ZodEffects'
            ? schemaFieldDef.schema?._def?.values
            : undefined);

        const enumOptions = Array.isArray(rawEnum)
          ? rawEnum.map((val: string) => ({
              value : val,
              label : t(`fields.${fieldId}.options.${val}`, {
                defaultValue: prettify(val),
              }),
            }))
          : undefined;
        
        const options =
          questionConfig?.options ??
          enumOptions ??
          (fieldId === 'state'
            ? usStates.map((s) => ({ value: s.value, label: s.label }))
            : undefined) ??
          (fieldId === 'odo_status'
            ? [
                { value: 'ACTUAL', label: t('fields.odo_status.actual', 'Actual mileage')},
                { value: 'EXCEEDS', label: t('fields.odo_status.exceeds', 'Exceeds mechanical limits')},
                { value: 'NOT_ACTUAL', label: t('fields.odo_status.not_actual', 'Not actual mileage')}
              ]
            : undefined);
        
        const placeholder = questionConfig?.placeholder || (schemaFieldDef as any)?.placeholder;
        const tooltip = questionConfig?.tooltip || (schemaFieldDef as any)?.tooltip;

        return {
          id: fieldId,
          label: t(label, { defaultValue: label }),
          type: fieldType as Question['type'], 
          required: questionConfig?.required ?? (schemaFieldDef?.typeName !== 'ZodOptional' && schemaFieldDef?.innerType?._def?.typeName !== 'ZodOptional'),
          options,
          placeholder,
          tooltip,
        };
      });
  }, [doc.schema, doc.questions, actualSchemaShape, getValues, t]);


  const handleEdit = (field: ReturnType<typeof fieldsToReview>[number]) => {
    setCurrentEditValue(getValues(field.id) ?? '');
    setEditingFieldId(field.id);
  };

  const handleSave = useCallback(async (id: string) => {
    const fieldSchema = fieldsToReview.find(f => f.id === id);
    let valueToSet: any = currentEditValue;

    if (fieldSchema?.type === 'number' && typeof currentEditValue === 'string' && currentEditValue.trim() !== '') {
      const num = parseFloat(currentEditValue);
      valueToSet = isNaN(num) ? undefined : num; // Set to undefined if not a valid number
    } else if (fieldSchema?.type === 'number' && currentEditValue === '') {
        valueToSet = undefined; 
    }
    
    setValue(id, valueToSet, { shouldValidate: true, shouldDirty: true });
    const isValid = await trigger(id); 
    
    if (isValid) {
      setEditingFieldId(null); 
      toast({ title: t('Changes Saved'), description: `${fieldsToReview.find(f=>f.id === id)?.label || id} ${t('updated.')}` });
    } else {
      toast({ title: t('Validation Error'), description: t('Please correct the field.'), variant: 'destructive' });
    }
  }, [currentEditValue, fieldsToReview, setValue, trigger, t, toast]);

  const handleCancel = useCallback(() => {
    setEditingFieldId(null); 
  }, []);

  const renderFieldValue = (fieldId: string, fieldType: Question['type'] | undefined, options: Question['options'] | undefined) => {
    const value = getValues(fieldId);
    if (fieldType === 'boolean') return value ? t('Yes') : t('No');
    if (fieldType === 'select' && options && value !== undefined && value !== null) {
        const opt = options.find(o => String(o.value) === String(value));
        return opt?.label || String(value);
    }
    if (value instanceof Date) return value.toLocaleDateString(locale);
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
              <div className="flex-1 min-w-0"> {/* Added min-w-0 for flexbox to allow shrinking */}
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
                    {field.type === 'textarea' ? (
                       <Controller
                          name={field.id as any}
                          control={control}
                          render={({ field: controllerField }) => (
                            <Textarea 
                              value={currentEditValue ?? ''} 
                              onChange={(e) => setCurrentEditValue(e.target.value)}
                              onBlur={() => { controllerField.onChange(currentEditValue); controllerField.onBlur(); }}
                              className="max-w-md text-sm" 
                              rows={3}
                              placeholder={field.placeholder}
                            />
                          )}
                        />
                    ) : field.type === 'select' && field.options ? (
                       <Controller
                          name={field.id as any}
                          control={control}
                          render={({ field: controllerField }) => (
                            <Select 
                              value={String(currentEditValue ?? '')} 
                              onValueChange={(val) => {
                                setCurrentEditValue(val);
                                controllerField.onChange(val);
                              }}
                            >
                               <SelectTrigger className="w-full max-w-md text-sm">
                                   <SelectValue placeholder={field.placeholder || t('Select...')} />
                               </SelectTrigger>
                               <SelectContent>
                                   {field.options.map((opt) => (
                                       <SelectItem key={opt.value} value={String(opt.value)} className="text-sm">{opt.label}</SelectItem>
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
                            <div className="flex items-center space-x-2">
                                <Switch 
                                  checked={typeof currentEditValue === 'boolean' ? currentEditValue : false} 
                                  onCheckedChange={(val) => {
                                    setCurrentEditValue(val);
                                    controllerField.onChange(val);
                                  }} 
                                  id={`review-${field.id}`}
                                />
                                <Label htmlFor={`review-${field.id}`} className="text-sm font-normal">
                                  {currentEditValue ? t('Yes') : t('No')}
                                </Label>
                            </div>
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
                                    value={currentEditValue ?? ''}
                                    onChange={(val, parts) => {
                                        setCurrentEditValue(val);
                                        controllerField.onChange(val);
                                         if (parts && actualSchemaShape) {
                                            const prefix = field.id.replace(/_address$/i, '') || field.id.replace(/Address$/i, '');
                                            if ((actualSchemaShape as any)?.[`${prefix}_city`]) setValue(`${prefix}_city`, parts.city, {shouldValidate: true, shouldDirty: true});
                                            if ((actualSchemaShape as any)?.[`${prefix}_state`]) setValue(`${prefix}_state`, parts.state, {shouldValidate: true, shouldDirty: true});
                                            if ((actualSchemaShape as any)?.[`${prefix}_postal_code`]) setValue(`${prefix}_postal_code`, parts.postalCode, {shouldValidate: true, shouldDirty: true});
                                         }
                                    }}
                                    placeholder={field.placeholder}
                                    className="max-w-md"
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
                               className="max-w-md text-sm"
                               placeholder={field.placeholder}
                           />
                          )}
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
                     {renderFieldValue(field.id, field.type, field.options)}
                  </p>
                )}
              </div>
              {editingFieldId !== field.id && (
                <Button
                  type="button" // Ensure it doesn't submit form if wrapped
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent any default button action or form submission
                    handleEdit(field);
                  }}
                  className="mt-1 self-start shrink-0"
                  aria-label={`${t('Edit')} ${field.label}`}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            {errors[field.id] && editingFieldId === field.id && ( // Only show error if currently editing this field
              <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                 <AlertTriangle className="h-3 w-3" /> {String(errors[field.id]?.message)}
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
});
export default ReviewStep;
