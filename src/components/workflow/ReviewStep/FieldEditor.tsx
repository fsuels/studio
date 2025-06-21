// src/components/workflow/ReviewStep/FieldEditor.tsx
'use client';

import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import AddressField from '@/components/forms/AddressField';
import SmartInput from '@/components/forms/wizard/SmartInput';
import { cn } from '@/lib/utils';
import { z, type AnyZodObject } from 'zod';
import type { ReviewField, FormValues } from './types';

interface FieldEditorProps {
  field: ReviewField;
  actualSchemaShape?: Record<string, z.ZodTypeAny>;
}

const getInputType = (
  fieldType: ReviewField['type'],
): React.HTMLInputTypeAttribute => {
  if (fieldType === 'number') return 'number';
  if (fieldType === 'date') return 'date';
  if (fieldType === 'tel') return 'tel';
  return 'text';
};

export default function FieldEditor({
  field,
  actualSchemaShape,
}: FieldEditorProps) {
  const { t } = useTranslation('common');
  const {
    control,
    setValue,
    register,
    formState: { errors },
  } = useFormContext<FormValues>();

  // Handle phone/tel fields with SmartInput
  if (field.type === 'tel' || field.id.toLowerCase().includes('phone')) {
    return (
      <SmartInput
        id={`review-${field.id}`}
        type="tel"
        placeholder={t(field.placeholder || '', {
          ns: 'documents',
          defaultValue: field.placeholder || '',
        })}
        className={cn(
          'max-w-md text-sm',
          errors[field.id] && 'border-destructive',
        )}
        aria-invalid={!!errors[field.id]}
        rhfProps={register(field.id, {
          required: field.required,
        })}
      />
    );
  }

  // Handle address fields
  if (field.type === 'address') {
    return (
      <Controller
        name={field.id}
        control={control}
        rules={{ required: field.required }}
        render={({ field: controllerField }) => (
          <AddressField
            name={controllerField.name}
            label=""
            value={(controllerField.value as string) || ''}
            onChange={(val, parts) => {
              controllerField.onChange(val);
              if (parts && actualSchemaShape) {
                const prefix =
                  field.id.replace(/_address$/i, '') ||
                  field.id.replace(/Address$/i, '');
                if (actualSchemaShape?.[`${prefix}_city`])
                  setValue(`${prefix}_city`, parts.city, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                if (actualSchemaShape?.[`${prefix}_state`])
                  setValue(`${prefix}_state`, parts.state, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                if (actualSchemaShape?.[`${prefix}_postal_code`])
                  setValue(`${prefix}_postal_code`, parts.postalCode, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
              }
            }}
            placeholder={t(field.placeholder || 'Enter address...', {
              ns: 'documents',
              defaultValue: field.placeholder || 'Enter address...',
            })}
            className="max-w-md"
            error={errors[field.id]?.message as string | undefined}
            tooltip={
              field.tooltip
                ? t(field.tooltip, {
                    ns: 'documents',
                    defaultValue: field.tooltip,
                  })
                : undefined
            }
          />
        )}
      />
    );
  }

  // Handle other field types with Controller
  return (
    <Controller
      name={field.id}
      control={control}
      rules={{ required: field.required }}
      render={({ field: controllerField }) => {
        const commonInputProps = {
          id: `review-${field.id}`,
          value: String(controllerField.value ?? ''),
          onChange: (
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
          ) => {
            const valToSet: string | number = e.target.value;
            if (field.type === 'number') {
              if (valToSet === '') {
                controllerField.onChange('');
              } else if (!isNaN(Number(valToSet))) {
                controllerField.onChange(Number(valToSet));
              }
            } else {
              controllerField.onChange(valToSet);
            }
          },
          onBlur: controllerField.onBlur,
          name: controllerField.name,
          ref: controllerField.ref,
          placeholder: t(field.placeholder || '', {
            ns: 'documents',
            defaultValue: field.placeholder || '',
          }),
          className: cn(
            'max-w-md text-sm',
            errors[field.id] && 'border-destructive',
          ),
          'aria-invalid': !!errors[field.id],
        };

        if (field.type === 'textarea') {
          return <Textarea {...commonInputProps} rows={3} />;
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
                className={cn(
                  'max-w-md text-sm',
                  errors[field.id] &&
                    'border-destructive focus:ring-destructive',
                )}
                aria-invalid={!!errors[field.id]}
                aria-label={t(field.placeholder || 'Select...', {
                  ns: 'documents',
                  defaultValue: field.placeholder || 'Select...',
                })}
              >
                <SelectValue
                  placeholder={t(field.placeholder || 'Select...', {
                    ns: 'documents',
                    defaultValue: field.placeholder || 'Select...',
                  })}
                />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={String(opt.value)}
                    className="text-sm"
                  >
                    {t(opt.label, {
                      ns: 'documents',
                      defaultValue: opt.label,
                    })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }

        if (field.type === 'boolean') {
          return (
            <div className="flex items-center space-x-2">
              <Switch
                id={`review-${field.id}`}
                checked={!!controllerField.value}
                onCheckedChange={controllerField.onChange}
                ref={controllerField.ref}
              />
              <Label
                htmlFor={`review-${field.id}`}
                className="text-sm font-normal"
              >
                {controllerField.value ? t('Yes') : t('No')}
              </Label>
            </div>
          );
        }

        return <Input {...commonInputProps} type={getInputType(field.type)} />;
      }}
    />
  );
}
