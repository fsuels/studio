// src/components/DynamicFormRenderer.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import {
  Check,
  Loader2,
  Info,
  AlertTriangle,
  AlertCircle,
  ClipboardList as QuestionnaireIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  saveFormProgress,
  loadFormProgress,
} from '@/lib/firestore/saveFormProgress';
import { track } from '@/lib/analytics';
import type { FormField } from '@/data/formSchemas';
import {
  analyzeFormData,
  type FieldSuggestion,
} from '@/ai/flows/analyze-form-data';

interface Props {
  documentType: string;
  schema: FormField[];
  onSubmit: (_data: Record<string, unknown>) => void;
  isReadOnly?: boolean;
  userId?: string;
  stateCode?: string;
}

export default function DynamicFormRenderer({
  documentType,
  schema,
  onSubmit,
  isReadOnly = false,
  userId,
  stateCode,
}: Props) {
  const { t } = useTranslation('common');

  const [values, setValues] = useState<Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(isReadOnly);
  const [isHydrated, setIsHydrated] = useState(false);
  const [suggestions, setSuggestions] = useState<FieldSuggestion[]>([]);

  /* ------- hydration / load draft ---------- */
  useEffect(() => {
    setIsHydrated(true);
    if (userId && documentType) {
      (async () => {
        try {
          const state = stateCode ?? 'NA';
          console.log('[DynamicFormRenderer] loadFormProgress args →', {
            userId,
            documentType,
            state,
          });
          const saved = await loadFormProgress({
            userId,
            docType: documentType,
            state,
          });
          if (saved && Object.keys(saved).length > 0) {
            setValues(saved);
          }
        } catch (e) {
          console.error('[DynamicFormRenderer] loadFormProgress error:', e);
        }
      })();
    }
  }, [userId, documentType, stateCode]);

  /* -------------- on change ---------------- */
  const handleChange = (id: string, value: unknown) => {
    if (isReadOnly) return;

    setValues((prev) => {
      const updated = { ...prev, [id]: value };

      if (userId && documentType && stateCode) {
        saveFormProgress({
          userId,
          docType: documentType,
          state: stateCode,
          formData: updated,
        }).catch(console.error);
      }

      if (/notarize|upsell|add(?:_)?on|extra/i.test(id)) {
        track('add_payment_info', {
          upsell_id: id,
          enabled: !!value,
          value: 0,
        });
      }

      return updated;
    });
  };

  /* ------------------------------------------------------------
     analyze + submit (unchanged from original)
  ------------------------------------------------------------ */
  const suggestionsByField = useMemo(
    () =>
      suggestions.reduce<Record<string, FieldSuggestion>>((acc, s) => {
        acc[s.fieldId] = s;
        return acc;
      }, {}),
    [suggestions],
  );

  const analyzeThenSubmit = async () => {
    if (isReadOnly || isLoading || hasSubmitted) return;
    const missing = schema.some((f) => f.required && !values[f.id]);
    if (missing) {
      alert(t('dynamicForm.errorMissingRequired'));
      return;
    }
    setIsLoading(true);
    try {
      const ai = await analyzeFormData({
        documentType,
        schema,
        answers: values as Record<string, string | number | boolean>,
      });
      setSuggestions(ai);
      if (
        ai.some((s) => s.importance === 'error' || s.importance === 'warning')
      ) {
        setIsLoading(false);
        return;
      }
      onSubmit(values);
      setHasSubmitted(true);
    } catch {
      onSubmit(values);
      setHasSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isHydrated) {
    return (
      <div className="h-96 animate-pulse bg-muted rounded-lg shadow-lg border border-border" />
    );
  }

  if (schema.length === 0) {
    return (
      <Card
        className={`shadow-lg bg-card border border-border ${isReadOnly ? 'opacity-75' : ''}`}
      >
        <CardHeader>
          <div className="flex items-center space-x-2">
            <QuestionnaireIcon />
            <CardTitle className="text-2xl">
              {t('dynamicForm.stepTitle', { documentType })}
            </CardTitle>
          </div>
          <CardDescription>
            {t('dynamicForm.noQuestionsNeeded')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground italic">
            {t('dynamicForm.proceedMessage')}
          </p>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => {
              if (!hasSubmitted) onSubmit({});
              setHasSubmitted(true);
            }}
            className="w-full"
            disabled={hasSubmitted || isReadOnly}
          >
            {hasSubmitted || isReadOnly ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                {t('dynamicForm.confirmedButton')}
              </>
            ) : (
              t('dynamicForm.confirmProceedButton')
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const getBorderColor = (sug?: FieldSuggestion) =>
    sug?.importance === 'error'
      ? 'border-red-500'
      : sug?.importance === 'warning'
        ? 'border-yellow-400'
        : '';

  const getIconColor = (sug?: FieldSuggestion) =>
    sug?.importance === 'error'
      ? 'text-red-600'
      : sug?.importance === 'warning'
        ? 'text-yellow-600'
        : '';

  return (
    <Card
      className={`shadow-lg bg-card border border-border ${isReadOnly ? 'opacity-75' : ''}`}
    >
      <CardHeader>
        <div className="flex items-center space-x-2">
          <QuestionnaireIcon />
          <CardTitle className="text-2xl">
            {t('dynamicForm.stepTitle', { documentType })}
          </CardTitle>
        </div>
        <CardDescription>
          {isReadOnly
            ? t('dynamicForm.reviewDescription')
            : t('dynamicForm.answerDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {schema.map((field) => {
              const sug = suggestionsByField[field.id];
              const borderColor = getBorderColor(sug);

              return (
                <div key={field.id} className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Label htmlFor={field.id} className="font-medium">
                      {field.label}
                      {field.required && (
                        <span className="ml-0.5 text-destructive">*</span>
                      )}
                    </Label>
                    {field.tooltip && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-sm">
                          {field.tooltip}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  {field.type === 'select' ? (
                    <Select
                      value={(values[field.id] as string) || ''}
                      onValueChange={(val) => handleChange(field.id, val)}
                      disabled={isReadOnly || isLoading}
                      name={field.id}
                    >
                      <SelectTrigger
                        id={field.id}
                        className={`${borderColor} ${
                          isReadOnly
                            ? 'bg-muted/50 border-dashed cursor-not-allowed'
                            : 'bg-background'
                        }`}
                        aria-label={
                          field.placeholder ||
                          t('dynamicForm.selectPlaceholder')
                        }
                      >
                        <SelectValue
                          placeholder={
                            field.placeholder ||
                            t('dynamicForm.selectPlaceholder')
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.type === 'textarea' ? (
                    <Textarea
                      id={field.id}
                      value={(values[field.id] as string) || ''}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      required={field.required}
                      disabled={isReadOnly || isLoading}
                      placeholder={field.placeholder || ''}
                      rows={3}
                      name={field.id}
                      className={`${borderColor} resize-none ${
                        isReadOnly
                          ? 'bg-muted/50 border-dashed cursor-not-allowed'
                          : 'bg-background'
                      }`}
                    />
                  ) : (
                    <Input
                      id={field.id}
                      value={(values[field.id] as string) || ''}
                      placeholder={field.placeholder || ''}
                      required={field.required}
                      type={
                        field.type === 'date'
                          ? 'date'
                          : field.type === 'number'
                            ? 'number'
                            : 'text'
                      }
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      disabled={isReadOnly || isLoading}
                      name={field.id}
                      className={`${borderColor} ${
                        isReadOnly
                          ? 'bg-muted/50 border-dashed cursor-not-allowed'
                          : 'bg-background'
                      }`}
                    />
                  )}
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {sug?.message || field.helperText || ''}
                  </p>
                  {sug?.importance === 'error' && (
                    <p
                      className={`flex items-center gap-1 text-xs ${getIconColor(sug)}`}
                    >
                      <AlertCircle className="h-3 w-3" />
                      {sug.message}
                    </p>
                  )}
                  {sug?.importance === 'warning' && (
                    <p
                      className={`flex items-center gap-1 text-xs ${getIconColor(sug)}`}
                    >
                      <AlertTriangle className="h-3 w-3" />
                      {sug.message}
                    </p>
                  )}
                </div>
              );
            })}
          </form>
        </TooltipProvider>
      </CardContent>
      <CardFooter>
        <Button
          type="button"
          onClick={analyzeThenSubmit}
          disabled={isLoading || isReadOnly || hasSubmitted}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('dynamicForm.savingButton')}
            </>
          ) : hasSubmitted || isReadOnly ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              {t('dynamicForm.confirmedButton')}
            </>
          ) : (
            t('dynamicForm.confirmAnswersButton')
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
