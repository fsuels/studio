'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Textarea,
  Label,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui';
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
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { saveFormProgress } from '@/lib/firestore/saveFormProgress';
import { track } from '@/lib/analytics';
import type { FormField } from '@/data/formSchemas';
import { analyzeFormData, type FieldSuggestion } from '@/ai/flows/analyze-form-data';

interface Props {
  documentType: string;
  schema: FormField[];
  onSubmit: (values: Record<string, unknown>) => void;
  isReadOnly?: boolean;
  userId?: string;
  stateCode?: string;
}

/* ----------------- svg icon --------------- */
const QuestionnaireIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-primary"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
    />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

export default function DynamicFormRenderer({
  documentType,
  schema,
  onSubmit,
  isReadOnly = false,
  userId,
  stateCode,
}: Props) {
  const { t } = useTranslation('common');

  /* ---------------- state ------------------ */
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(isReadOnly);
  const [isHydrated, setIsHydrated] = useState(false);

  /* ------- AI suggestions ------------------ */
  const [suggestions, setSuggestions] = useState<FieldSuggestion[]>([]);

  /* ------- hydration / load draft ---------- */
  useEffect(() => {
    setIsHydrated(true);
    if (userId && documentType) {
      (async () => {
        const { loadFormProgress } = await import(
          '@/lib/firestore/saveFormProgress'
        );
        const saved = await loadFormProgress({ userId, docType: documentType });
        if (saved) setValues(saved);
      })().catch(console.error);
    }
  }, [userId, documentType]);

  /* -------------- on change ---------------- */
  const handleChange = (id: string, value: unknown) => {
    if (isReadOnly) return;

    const isUpsellField = /notarize|upsell|add(?:_)?on|extra/i.test(id);
    setValues(prev => {
      const updated = { ...prev, [id]: value };

      if (userId && documentType && stateCode) {
        saveFormProgress({
          userId,
          docType: documentType,
          state: stateCode,
          formData: updated,
        }).catch(console.error);
      }

      if (isUpsellField) {
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
     analyze + submit
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

    const missing = schema.some(f => f.required && !Boolean(values[f.id]));
    if (missing) {
      alert(t('dynamicForm.errorMissingRequired'));
      return;
    }

    setIsLoading(true);
    try {
      const ai = await analyzeFormData({ documentType, schema, answers: values });
      setSuggestions(ai);

      const blocking = ai.some(s => s.importance === 'error' || s.importance === 'warning');
      if (blocking) {
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
    return <div className="h-96 animate-pulse bg-muted rounded-lg shadow-lg border border-border" />;
  }

  if (schema.length === 0) {
    return (
      <Card className={`shadow-lg bg-card border border-border ${isReadOnly ? 'opacity-75' : ''}`}>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <QuestionnaireIcon />
            <CardTitle className="text-2xl">{t('dynamicForm.stepTitle', { documentType })}</CardTitle>
          </div>
          <CardDescription>{t('dynamicForm.noQuestionsNeeded')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground italic">{t('dynamicForm.proceedMessage')}</p>
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
    sug?.importance === 'error' ? 'border-red-500'
      : sug?.importance === 'warning' ? 'border-yellow-400'
      : '';

  const getIconColor = (sug?: FieldSuggestion) =>
    sug?.importance === 'error' ? 'text-red-600'
      : sug?.importance === 'warning' ? 'text-yellow-600'
      : '';

  return (
    <Card className={`shadow-lg bg-card border border-border ${isReadOnly ? 'opacity-75' : ''}`}>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <QuestionnaireIcon />
          <CardTitle className="text-2xl">{t('dynamicForm.stepTitle', { documentType })}</CardTitle>
        </div>
        <CardDescription>
          {isReadOnly ? t('dynamicForm.reviewDescription') : t('dynamicForm.answerDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <form className="space-y-6" onSubmit={e => e.preventDefault()}>
            {schema.map(field => {
              const sug = suggestionsByField[field.id];
              const borderColor = getBorderColor(sug);

              return (
                <div key={field.id} className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Label htmlFor={field.id} className="font-medium">
                      {field.label}
                      {field.required && <span className="ml-0.5 text-destructive">*</span>}
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
                      value={values[field.id] || ''}
                      onValueChange={val => handleChange(field.id, val)}
                      disabled={isReadOnly || isLoading}
                      name={field.id}
                    >
                      <SelectTrigger
                        id={field.id}
                        className={`${borderColor} ${isReadOnly ? 'bg-muted/50 border-dashed cursor-not-allowed' : 'bg-background'}`}
                        aria-label={field.placeholder || t('dynamicForm.selectPlaceholder')}
                      >
                        <SelectValue placeholder={field.placeholder || t('dynamicForm.selectPlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.type === 'textarea' ? (
                    <Textarea
                      id={field.id}
                      value={values[field.id] || ''}
                      onChange={e => handleChange(field.id, e.target.value)}
                      required={field.required}
                      disabled={isReadOnly || isLoading}
                      placeholder={field.placeholder || ''}
                      rows={3}
                      name={field.id}
                      className={`${borderColor} resize-none ${isReadOnly ? 'bg-muted/50 border-dashed cursor-not-allowed' : 'bg-background'}`}
                    />
                  ) : (
                    <Input
                      id={field.id}
                      value={values[field.id] || ''}
                      placeholder={field.placeholder || ''}
                      required={field.required}
                      type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
                      onChange={e => handleChange(field.id, e.target.value)}
                      disabled={isReadOnly || isLoading}
                      name={field.id}
                      className={`${borderColor} ${isReadOnly ? 'bg-muted/50 border-dashed cursor-not-allowed' : 'bg-background'}`}
                    />
                  )}

                  <p className="text-xs text-muted-foreground mt-0.5">
                    {sug?.message || field.helperText || ''}
                  </p>
                  {sug?.importance === 'error' && (
                    <p className={`flex items-center gap-1 text-xs ${getIconColor(sug)}`}>
                      <AlertCircle className="h-3 w-3" />
                      {sug.message}
                    </p>
                  )}
                  {sug?.importance === 'warning' && (
                    <p className={`flex items-center gap-1 text-xs ${getIconColor(sug)}`}>
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
