'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronRight, 
  ChevronLeft, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle,
  Lightbulb,
  Search,
  Sparkles
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FormField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  description?: string;
  validationRules?: any;
  smartSuggestions?: string[];
  seoKeywords?: string[];
  helpText?: string;
  conditionalLogic?: {
    showIf: string;
    equals: any;
  };
}

interface FormStep {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  seoOptimized: boolean;
  estimatedTime: string;
}

interface EnhancedFormWizardProps {
  documentType: string;
  steps: FormStep[];
  onSubmit: (data: any) => void;
  className?: string;
}

export function EnhancedFormWizard({
  documentType,
  steps,
  onSubmit,
  className = ''
}: EnhancedFormWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [smartSuggestions, setSmartSuggestions] = useState<Record<string, string[]>>({});
  const [completedFields, setCompletedFields] = useState<Set<string>>(new Set());

  // AI-powered smart suggestions
  useEffect(() => {
    generateSmartSuggestions();
  }, [currentStep, formData]);

  const generateSmartSuggestions = () => {
    const suggestions: Record<string, string[]> = {};
    
    // Context-aware suggestions based on document type and previous inputs
    if (documentType === 'llc-operating-agreement') {
      suggestions.companyName = [
        `${formData.ownerName || 'Your'} Consulting LLC`,
        `${formData.ownerName || 'Your'} Ventures LLC`,
        `${formData.city || 'City'} Professional Services LLC`
      ];
      
      suggestions.businessPurpose = [
        'Professional consulting services',
        'Technology and software development',
        'Marketing and advertising services',
        'Real estate investment and management'
      ];
    }

    if (documentType === 'employment-contract') {
      suggestions.jobTitle = [
        'Senior Software Engineer',
        'Marketing Manager',
        'Operations Specialist',
        'Business Development Representative'
      ];
      
      if (formData.industry === 'technology') {
        suggestions.benefits = [
          'Health insurance and dental coverage',
          'Flexible work arrangements',
          'Professional development budget',
          'Stock options or equity participation'
        ];
      }
    }

    setSmartSuggestions(suggestions);
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear error when user starts typing
    if (fieldErrors[fieldId]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }

    // Mark field as completed if it has meaningful content
    if (value && value.toString().trim().length > 0) {
      setCompletedFields(prev => new Set([...prev, fieldId]));
    } else {
      setCompletedFields(prev => {
        const newSet = new Set(prev);
        newSet.delete(fieldId);
        return newSet;
      });
    }
  };

  const validateStep = () => {
    const currentStepData = steps[currentStep];
    const errors: Record<string, string> = {};
    
    currentStepData.fields.forEach(field => {
      // Skip validation if field is conditionally hidden
      if (field.conditionalLogic) {
        const showIf = field.conditionalLogic.showIf;
        const expectedValue = field.conditionalLogic.equals;
        if (formData[showIf] !== expectedValue) {
          return;
        }
      }

      if (field.required && !formData[field.id]) {
        errors[field.id] = `${field.label} is required`;
      }

      // Custom validation rules
      if (formData[field.id] && field.validationRules) {
        const value = formData[field.id];
        
        if (field.type === 'email' && !/\S+@\S+\.\S+/.test(value)) {
          errors[field.id] = 'Please enter a valid email address';
        }
        
        if (field.validationRules.minLength && value.length < field.validationRules.minLength) {
          errors[field.id] = `Minimum ${field.validationRules.minLength} characters required`;
        }
      }
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        onSubmit(formData);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getProgressPercentage = () => {
    const totalFields = steps.reduce((acc, step) => acc + step.fields.length, 0);
    const completedCount = completedFields.size;
    return Math.round((completedCount / totalFields) * 100);
  };

  const shouldShowField = (field: FormField) => {
    if (!field.conditionalLogic) return true;
    
    const showIf = field.conditionalLogic.showIf;
    const expectedValue = field.conditionalLogic.equals;
    return formData[showIf] === expectedValue;
  };

  const renderField = (field: FormField) => {
    if (!shouldShowField(field)) return null;

    const hasError = fieldErrors[field.id];
    const isCompleted = completedFields.has(field.id);
    const suggestions = smartSuggestions[field.id] || [];

    return (
      <div key={field.id} className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor={field.id} className="text-sm font-medium">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          
          {isCompleted && (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          )}
          
          {field.helpText && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{field.helpText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {field.description && (
          <p className="text-sm text-gray-600">{field.description}</p>
        )}

        <div className="space-y-2">
          <Input
            id={field.id}
            type={field.type}
            placeholder={field.placeholder}
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className={hasError ? 'border-red-500' : isCompleted ? 'border-green-500' : ''}
          />

          {hasError && (
            <div className="flex items-center gap-1 text-red-500 text-sm">
              <AlertCircle className="h-4 w-4" />
              {hasError}
            </div>
          )}

          {suggestions.length > 0 && !formData[field.id] && (
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Lightbulb className="h-4 w-4" />
                Smart suggestions:
              </div>
              <div className="flex flex-wrap gap-1">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleFieldChange(field.id, suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const currentStepData = steps[currentStep];

  return (
    <div className={className}>
      {/* Progress Header */}
      <div className="mb-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {currentStepData.title}
          </h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              Step {currentStep + 1} of {steps.length}
            </Badge>
            {currentStepData.seoOptimized && (
              <Badge className="bg-green-100 text-green-800">
                <Search className="h-3 w-3 mr-1" />
                SEO Optimized
              </Badge>
            )}
          </div>
        </div>

        <p className="text-gray-600">{currentStepData.description}</p>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{getProgressPercentage()}% complete</span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Estimated time: {currentStepData.estimatedTime}</span>
          <Sparkles className="h-4 w-4 text-purple-500" />
          <span>AI-enhanced for better accuracy</span>
        </div>
      </div>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Complete the following information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStepData.fields.map(renderField)}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-8 rounded-full ${
                index === currentStep 
                  ? 'bg-purple-600' 
                  : index < currentStep 
                    ? 'bg-green-500' 
                    : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <Button onClick={nextStep} className="bg-purple-600 hover:bg-purple-700">
          {currentStep === steps.length - 1 ? 'Complete Document' : 'Next'}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}