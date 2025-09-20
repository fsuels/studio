'use client';

// Dynamic form renderer that creates forms from JSON configuration
// This enables document creation without writing React components

import React, { useEffect, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Save } from 'lucide-react';
import { type QuestionConfig, type DocumentConfig } from '@/lib/config-loader';
import DynamicField from './DynamicField';

interface DynamicFormProps {
  config: DocumentConfig;
  initialData?: Record<string, any>;
  onSave?: (data: Record<string, any>) => void;
  onSubmit?: (data: Record<string, any>) => void;
  autoSave?: boolean;
  autoSaveDelay?: number;
  showProgress?: boolean;
  className?: string;
}

interface FormSection {
  title: string;
  questions: QuestionConfig[];
}

export default function DynamicForm({
  config,
  initialData,
  onSave,
  onSubmit,
  autoSave = true,
  autoSaveDelay = 2000,
  showProgress = true,
  className = ''
}: DynamicFormProps) {
  
  // Create Zod schema from question configuration
  const validationSchema = useMemo(() => {
    const schemaFields: Record<string, z.ZodType<any>> = {};
    
    config.questions.forEach(question => {
      let fieldSchema: z.ZodType<any>;
      
      switch (question.type) {
        case 'text':
        case 'textarea':
          fieldSchema = z.string();
          if (question.validation?.pattern) {
            fieldSchema = fieldSchema.regex(
              new RegExp(question.validation.pattern),
              question.validation.message || `Invalid format for ${question.label}`
            );
          }
          break;
          
        case 'number':
          fieldSchema = z.string().transform(val => {
            const num = parseFloat(val);
            return isNaN(num) ? val : num;
          });
          if (question.validation?.min !== undefined) {
            fieldSchema = fieldSchema.refine(
              val => typeof val === 'number' && val >= question.validation!.min!,
              `Must be at least ${question.validation.min}`
            );
          }
          if (question.validation?.max !== undefined) {
            fieldSchema = fieldSchema.refine(
              val => typeof val === 'number' && val <= question.validation!.max!,
              `Must be at most ${question.validation.max}`
            );
          }
          break;
          
        case 'select':
          if (question.options) {
            const validValues = question.options.map(opt => opt.value);
            fieldSchema = z.enum(validValues as [string, ...string[]]);
          } else {
            fieldSchema = z.string();
          }
          break;
          
        case 'boolean':
          fieldSchema = z.boolean();
          break;
          
        case 'date':
          fieldSchema = z.string().regex(
            /^\d{4}-\d{2}-\d{2}$/,
            'Date must be in YYYY-MM-DD format'
          );
          break;
          
        case 'address':
          fieldSchema = z.string();
          break;
          
        default:
          fieldSchema = z.string();
      }
      
      // Apply required validation
      if (!question.required) {
        fieldSchema = fieldSchema.optional();
      }
      
      schemaFields[question.id] = fieldSchema;
    });
    
    return z.object(schemaFields);
  }, [config.questions]);
  
  // Initialize form with validation
  const initialValues = useMemo(() => initialData ?? {}, [initialData]);

  const form = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: initialValues,
    mode: 'onChange'
  });

  useEffect(() => {
    form.reset(initialValues);
  }, [initialValues, form]);
  
  const { watch, handleSubmit, formState: { errors, isValid, isDirty } } = form;
  
  // Group questions into sections
  const sections = useMemo((): FormSection[] => {
    // For now, create a simple grouping - can be enhanced with section metadata
    const sections: FormSection[] = [];
    let currentSection: FormSection = {
      title: 'Document Information',
      questions: []
    };
    
    config.questions.forEach(question => {
      // Simple heuristic: new section for every 8 questions
      if (currentSection.questions.length >= 8) {
        sections.push(currentSection);
        currentSection = {
          title: `Additional Information`,
          questions: []
        };
      }
      currentSection.questions.push(question);
    });
    
    if (currentSection.questions.length > 0) {
      sections.push(currentSection);
    }
    
    return sections;
  }, [config.questions]);
  
  // Calculate progress
  const progress = useMemo(() => {
    const totalQuestions = config.questions.filter(q => q.required).length;
    const answeredQuestions = config.questions.filter(q => {
      const value = watch(q.id);
      return q.required && value !== undefined && value !== '' && value !== null;
    }).length;
    
    return totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
  }, [config.questions, watch]);
  
  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !onSave || !isDirty) return;
    
    const timeoutId = setTimeout(() => {
      const currentData = watch();
      onSave(currentData);
      console.log('DynamicForm: Auto-saved form data');
    }, autoSaveDelay);
    
    return () => clearTimeout(timeoutId);
  }, [watch, autoSave, onSave, autoSaveDelay, isDirty]);
  
  // Handle form submission
  const handleFormSubmit = (data: Record<string, any>) => {
    console.log('DynamicForm: Form submitted with data:', data);
    if (onSubmit) {
      onSubmit(data);
    }
  };
  
  // Manual save handler
  const handleManualSave = () => {
    if (onSave) {
      const currentData = watch();
      onSave(currentData);
      console.log('DynamicForm: Manual save triggered');
    }
  };
  
  return (
    <div className={`dynamic-form ${className}`}>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          
          {/* Header with progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{getDocumentDisplayName(config)}</span>
                <div className="flex items-center gap-2">
                  {autoSave && isDirty && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Save className="h-4 w-4 mr-1" />
                      Auto-saving...
                    </div>
                  )}
                  {!autoSave && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={handleManualSave}
                      disabled={!isDirty}
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save Draft
                    </Button>
                  )}
                </div>
              </CardTitle>
              
              {showProgress && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completion Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </CardHeader>
          </Card>
          
          {/* Compliance Information */}
          {config.compliance && (
            <ComplianceAlert compliance={config.compliance} />
          )}
          
          {/* Form Sections */}
          {sections.map((section, sectionIndex) => (
            <Card key={sectionIndex}>
              <CardHeader>
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.questions.map((question) => (
                  <DynamicField
                    key={question.id}
                    config={question}
                    error={errors[question.id]?.message}
                  />
                ))}
              </CardContent>
            </Card>
          ))}
          
          {/* Form Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {isValid ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Form is complete and valid
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      Please complete all required fields
                    </>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={!isValid}
                    className="min-w-[120px]"
                  >
                    Generate Document
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
        </form>
      </FormProvider>
    </div>
  );
}

// Helper component for compliance alerts
function ComplianceAlert({ compliance }: { compliance: any }) {
  if (!compliance.requiresNotary && !compliance.specialNotes) {
    return null;
  }
  
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-1">
          {compliance.requiresNotary && (
            <p className="font-medium">
              ⚠️ Notarization Required
            </p>
          )}
          {compliance.specialNotes && (
            <p className="text-sm">
              {compliance.specialNotes}
            </p>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}

// Helper function to get document display name
function getDocumentDisplayName(config: DocumentConfig): string {
  // Convert kebab-case to title case
  return config.docType
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Export types for external use
export type { DynamicFormProps, FormSection };