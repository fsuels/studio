// src/components/ai-ux/SmartDocumentWizard.tsx
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MessageCircle, 
  Lightbulb, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Brain,
  Users,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  type: 'question' | 'choice' | 'input' | 'confirmation';
  required: boolean;
  aiSuggestion?: string;
  legalTip?: string;
  options?: Array<{ value: string; label: string; description?: string }>;
  dependencies?: string[];
}

interface SmartDocumentWizardProps {
  documentType: string;
  userProfile?: {
    role?: string;
    jurisdiction?: string;
    experience?: 'beginner' | 'intermediate' | 'advanced';
  };
  onComplete: (data: Record<string, any>) => void;
  onCancel: () => void;
}

const SmartDocumentWizard: React.FC<SmartDocumentWizardProps> = ({
  documentType,
  userProfile,
  onComplete,
  onCancel
}) => {
  const { t } = useTranslation('wizard');
  const [currentStep, setCurrentStep] = React.useState(0);
  const [responses, setResponses] = React.useState<Record<string, any>>({});
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [aiSuggestions, setAiSuggestions] = React.useState<Record<string, string>>({});
  const [steps, setSteps] = React.useState<WizardStep[]>([]);

  // Initialize wizard steps based on document type and user profile
  React.useEffect(() => {
    const generatedSteps = generateSmartSteps(documentType, userProfile);
    setSteps(generatedSteps);
  }, [documentType, userProfile]);

  // Get AI suggestions for current step
  React.useEffect(() => {
    if (steps[currentStep] && !aiSuggestions[steps[currentStep].id]) {
      generateAISuggestion(steps[currentStep], responses);
    }
  }, [currentStep, steps, responses, aiSuggestions]);

  const generateAISuggestion = async (step: WizardStep, context: Record<string, any>) => {
    try {
      setIsProcessing(true);
      const response = await fetch('/api/ai/wizard-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step,
          context,
          documentType,
          userProfile
        })
      });

      const { suggestion } = await response.json();
      setAiSuggestions(prev => ({
        ...prev,
        [step.id]: suggestion
      }));
    } catch (error) {
      console.warn('Failed to get AI suggestion:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResponse = (stepId: string, value: any) => {
    setResponses(prev => ({ ...prev, [stepId]: value }));
    
    // Trigger smart suggestions for related fields
    triggerSmartSuggestions(stepId, value);
  };

  const triggerSmartSuggestions = async (stepId: string, value: any) => {
    // Find dependent fields and pre-populate them intelligently
    const dependentSteps = steps.filter(step => 
      step.dependencies?.includes(stepId)
    );

    for (const depStep of dependentSteps) {
      const smartValue = await getSmartDefault(depStep, { ...responses, [stepId]: value });
      if (smartValue) {
        setResponses(prev => ({ ...prev, [depStep.id]: smartValue }));
      }
    }
  };

  const getSmartDefault = async (step: WizardStep, context: Record<string, any>) => {
    try {
      const response = await fetch('/api/ai/smart-default', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step,
          context,
          documentType,
          userProfile
        })
      });

      const { defaultValue } = await response.json();
      return defaultValue;
    } catch (error) {
      return null;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsProcessing(true);
    
    // Generate final document with AI enhancement
    try {
      const response = await fetch('/api/ai/enhance-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responses,
          documentType,
          userProfile
        })
      });

      const enhancedData = await response.json();
      onComplete(enhancedData);
    } catch (error) {
      onComplete(responses); // Fallback to basic responses
    } finally {
      setIsProcessing(false);
    }
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  if (!currentStepData) {
    return <div>Loading wizard...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Smart Document Assistant
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
            <Badge variant="outline" className="gap-1">
              <Sparkles className="h-3 w-3" />
              AI-Powered
            </Badge>
          </div>
          <Progress value={progress} className="mt-3" />
        </CardHeader>
      </Card>

      {/* Current Step */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            {currentStepData.title}
          </CardTitle>
          <p className="text-muted-foreground">{currentStepData.description}</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* AI Suggestion */}
          {aiSuggestions[currentStepData.id] && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">AI Suggestion</p>
                  <p className="text-sm text-blue-800 mt-1">
                    {aiSuggestions[currentStepData.id]}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Legal Tip */}
          {currentStepData.legalTip && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-900">Legal Tip</p>
                  <p className="text-sm text-amber-800 mt-1">
                    {currentStepData.legalTip}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step Input */}
          <StepInput
            step={currentStepData}
            value={responses[currentStepData.id]}
            onChange={(value) => handleResponse(currentStepData.id, value)}
            isProcessing={isProcessing}
          />

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              <Button variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                onClick={nextStep}
                disabled={currentStepData.required && !responses[currentStepData.id]}
                className="gap-2"
              >
                {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Context Sidebar */}
      <ContextSidebar
        documentType={documentType}
        responses={responses}
        currentStep={currentStep}
        totalSteps={steps.length}
      />
    </div>
  );
};

// Step input component
const StepInput: React.FC<{
  step: WizardStep;
  value: any;
  onChange: (value: any) => void;
  isProcessing: boolean;
}> = ({ step, value, onChange, isProcessing }) => {
  switch (step.type) {
    case 'choice':
      return (
        <div className="space-y-2">
          {step.options?.map((option) => (
            <Card
              key={option.value}
              className={cn(
                "cursor-pointer transition-colors hover:bg-muted/50",
                value === option.value && "ring-2 ring-primary bg-primary/5"
              )}
              onClick={() => onChange(option.value)}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2",
                    value === option.value 
                      ? "bg-primary border-primary" 
                      : "border-muted-foreground"
                  )} />
                  <div>
                    <p className="font-medium">{option.label}</p>
                    {option.description && (
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );

    case 'input':
      return (
        <Input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your response..."
          disabled={isProcessing}
        />
      );

    case 'question':
      return (
        <Textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Provide details..."
          rows={3}
          disabled={isProcessing}
        />
      );

    default:
      return null;
  }
};

// Context sidebar component
const ContextSidebar: React.FC<{
  documentType: string;
  responses: Record<string, any>;
  currentStep: number;
  totalSteps: number;
}> = ({ documentType, responses, currentStep, totalSteps }) => {
  const completedFields = Object.keys(responses).length;
  
  return (
    <Card className="bg-muted/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Users className="h-4 w-4" />
          Document Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span>Fields Completed</span>
          <Badge variant="secondary">{completedFields}</Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span>Estimated Time</span>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            {Math.max(1, totalSteps - currentStep)} min
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Your responses are automatically saved and can be resumed later.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Smart step generation based on document type
function generateSmartSteps(documentType: string, userProfile?: any): WizardStep[] {
  // This would be dynamically generated based on document metadata
  // For now, showing example structure
  
  const baseSteps: WizardStep[] = [
    {
      id: 'document_purpose',
      title: 'What\'s the purpose of this document?',
      description: 'Help us understand your specific needs',
      type: 'question',
      required: true,
      aiSuggestion: 'Consider your primary goal and any specific circumstances',
      legalTip: 'Being specific about your purpose helps ensure the document meets your needs'
    },
    {
      id: 'parties_involved',
      title: 'Who are the parties involved?',
      description: 'Identify all individuals or entities',
      type: 'choice',
      required: true,
      options: [
        { value: 'individual', label: 'Individual to Individual' },
        { value: 'business', label: 'Business to Individual' },
        { value: 'business_to_business', label: 'Business to Business' }
      ]
    }
  ];

  return baseSteps;
}

export default SmartDocumentWizard;