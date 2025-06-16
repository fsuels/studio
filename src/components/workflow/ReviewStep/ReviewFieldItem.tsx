// src/components/workflow/ReviewStep/ReviewFieldItem.tsx
'use client';

import React, { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Edit2, Check, X, AlertTriangle, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import FieldValueRenderer from './FieldValueRenderer';
import FieldEditor from './FieldEditor';
import type { ReviewField, FormValues } from './types';

interface ReviewFieldItemProps {
  field: ReviewField;
  locale: 'en' | 'es';
  isEditing: boolean;
  actualSchemaShape?: Record<string, z.ZodTypeAny>;
  onEdit: (fieldId: string) => void;
  onSave: (fieldId: string) => void;
  onCancel: () => void;
}

export default function ReviewFieldItem({
  field,
  locale,
  isEditing,
  actualSchemaShape,
  onEdit,
  onSave,
  onCancel,
}: ReviewFieldItemProps) {
  const { t } = useTranslation('common');
  const { formState: { errors } } = useFormContext<FormValues>();

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isEditing) {
        onEdit(field.id);
      }
    }
  }, [isEditing, onEdit, field.id]);

  const handleClick = useCallback(() => {
    if (!isEditing) {
      onEdit(field.id);
    }
  }, [isEditing, onEdit, field.id]);

  return (
    <div
      key={field.id}
      role="button"
      tabIndex={0}
      className="py-3 border-b border-border last:border-b-0 cursor-pointer"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-0.5">
            <p className="text-sm font-medium text-muted-foreground">
              {t(field.label, {
                ns: 'documents',
                defaultValue: field.label,
              })}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </p>
            {field.tooltip && !isEditing && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Info className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  align="start"
                  className="max-w-xs text-xs bg-popover text-popover-foreground border shadow-md rounded p-1.5 z-50"
                >
                  <p>
                    {t(field.tooltip, {
                      ns: 'documents',
                      defaultValue: field.tooltip,
                    })}
                  </p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {isEditing ? (
            <div className="mt-1.5 space-y-2">
              <FieldEditor field={field} actualSchemaShape={actualSchemaShape} />
              <div className="flex gap-2 mt-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => onSave(field.id)}
                  className="text-xs h-8"
                >
                  <Check className="w-3.5 h-3.5 mr-1" />
                  {t('Save')}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={onCancel}
                  className="text-xs h-8"
                >
                  <X className="w-3.5 h-3.5 mr-1" />
                  {t('Cancel')}
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-card-foreground mt-1 break-words pr-10">
              <FieldValueRenderer field={field} locale={locale} />
            </p>
          )}
        </div>
        {!isEditing && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(field.id);
            }}
            className="mt-1 self-start shrink-0"
            aria-label={`${t('Edit')} ${t(field.label, { ns: 'documents', defaultValue: field.label })}`}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        )}
      </div>
      {errors[field.id] && isEditing && (
        <p className="block text-xs text-destructive mt-1 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />{' '}
          {String(errors[field.id]?.message)}
        </p>
      )}
    </div>
  );
}