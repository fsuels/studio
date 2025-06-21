// src/components/onboarding/OnboardingWizard.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Joyride, { CallBackProps, STATUS, EVENTS, Step } from 'react-joyride';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { createProgressTracker, OnboardingStep } from '@/lib/onboarding/progress-tracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  Users, 
  Building2, 
  User,
  CheckCircle,
  ArrowRight,
  X
} from 'lucide-react';

interface OnboardingWizardProps {
  autoStart?: boolean;
  onComplete?: () => void;
  onSkip?: () => void;
}

interface PersonaOption {
  id: 'business' | 'individual' | 'hr';
  label: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  autoStart = false,
  onComplete,
  onSkip
}) => {
  const { t } = useTranslation('common');
  const { user } = useAuth();
  
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [showPersonaSelection, setShowPersonaSelection] = useState(true);
  const [selectedPersona, setSelectedPersona] = useState<string>('');
  const [steps, setSteps] = useState<Step[]>([]);
  const [progress, setProgress] = useState(0);
  const [tracker, setTracker] = useState<ReturnType<typeof createProgressTracker> | null>(null);

  const personaOptions: PersonaOption[] = [
    {
      id: 'business',
      label: 'Business Owner',
      description: 'Contracts, NDAs, and business agreements',
      icon: <Building2 className="h-6 w-6" />,
      features: ['Business contracts', 'Employee agreements', 'Vendor contracts', 'E-signature workflows']
    },
    {
      id: 'individual',
      label: 'Individual',
      description: 'Personal legal documents and forms',
      icon: <User className="h-6 w-6" />,
      features: ['Wills & estate planning', 'Rental agreements', 'Personal contracts', 'Online notary']
    },
    {
      id: 'hr',
      label: 'HR Professional',
      description: 'Employee documentation and HR forms',
      icon: <Users className="h-6 w-6" />,
      features: ['Employment contracts', 'Employee handbook', 'HR policies', 'Bulk document creation']
    }
  ];

  useEffect(() => {
    if (user?.uid) {
      setTracker(createProgressTracker(user.uid));
    }
  }, [user?.uid]);

  useEffect(() => {
    if (autoStart && user?.uid && tracker) {
      initializeOnboarding();
    }
  }, [autoStart, user?.uid, tracker]);

  const initializeOnboarding = async () => {
    if (!tracker) return;
    
    const existingProgress = await tracker.getProgress();
    if (existingProgress?.isCompleted) {
      return; // Don't show onboarding if already completed
    }

    setShowPersonaSelection(true);
  };

  const handlePersonaSelect = async (persona: string) => {
    if (!tracker) return;

    setSelectedPersona(persona);
    await tracker.initializeProgress(persona);
    
    const onboardingSteps = tracker.getStepsForPersona(persona);
    const joyrideSteps: Step[] = onboardingSteps.map((step: OnboardingStep) => ({
      target: step.target,
      content: (
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
          <p className="text-muted-foreground mb-3">{step.content}</p>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">AI-Powered Assistant</span>
          </div>
        </div>
      ),
      placement: step.placement,
      disableBeacon: step.disableBeacon,
      hideCloseButton: step.hideCloseButton,
      spotlightClicks: step.spotlightClicks,
      styles: {
        options: {
          primaryColor: 'hsl(var(--primary))',
          backgroundColor: 'hsl(var(--background))',
          textColor: 'hsl(var(--foreground))',
          arrowColor: 'hsl(var(--background))',
          overlayColor: 'rgba(0, 0, 0, 0.4)',
        },
        tooltip: {
          borderRadius: '8px',
          fontSize: '14px',
        },
        tooltipContent: {
          padding: '0',
        },
        buttonNext: {
          backgroundColor: 'hsl(var(--primary))',
          color: 'hsl(var(--primary-foreground))',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '500',
        },
        buttonBack: {
          color: 'hsl(var(--muted-foreground))',
          fontSize: '14px',
        },
        buttonSkip: {
          color: 'hsl(var(--muted-foreground))',
          fontSize: '14px',
        },
      }
    }));

    setSteps(joyrideSteps);
    setShowPersonaSelection(false);
    setRun(true);
  };

  const handleJoyrideCallback = useCallback(async (data: CallBackProps) => {
    const { status, type, index, action } = data;

    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      if (tracker && selectedPersona) {
        const onboardingSteps = tracker.getStepsForPersona(selectedPersona);
        const currentStep = onboardingSteps[index];
        if (currentStep) {
          await tracker.updateStep(currentStep.id);
        }
      }
      
      setStepIndex(index + (action === 'next' ? 1 : -1));
      setProgress(((index + 1) / steps.length) * 100);
    }

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      
      if (status === STATUS.FINISHED && tracker) {
        await tracker.markMilestone('dashboardTour');
        onComplete?.();
      } else {
        onSkip?.();
      }
    }
  }, [tracker, selectedPersona, steps.length, onComplete, onSkip]);

  const PersonaSelectionModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl mb-2">Welcome to 123LegalDoc!</CardTitle>
          <p className="text-muted-foreground">
            Let's personalize your experience. What best describes you?
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            {personaOptions.map((option) => (
              <Card
                key={option.id}
                className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 hover:border-primary/50"
                onClick={() => handlePersonaSelect(option.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    {option.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{option.label}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{option.description}</p>
                  
                  <div className="space-y-2">
                    {option.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full mt-4 gap-2">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center pt-4 border-t">
            <Button 
              variant="ghost" 
              onClick={() => {
                setShowPersonaSelection(false);
                onSkip?.();
              }}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Skip for now
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              You can always change this later in your profile settings
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (!user?.uid) {
    return null;
  }

  return (
    <>
      {showPersonaSelection && <PersonaSelectionModal />}
      
      {run && steps.length > 0 && (
        <Joyride
          steps={steps}
          run={run}
          stepIndex={stepIndex}
          continuous
          showProgress
          showSkipButton
          callback={handleJoyrideCallback}
          styles={{
            options: {
              primaryColor: 'hsl(var(--primary))',
              zIndex: 10000,
            }
          }}
          locale={{
            back: t('Back'),
            close: t('Close'),
            last: t('Finish'),
            next: t('Next'),
            skip: t('Skip Tour')
          }}
        />
      )}
      
      {run && (
        <div className="fixed top-4 right-4 z-[9999]">
          <Card className="w-64">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="gap-1">
                  <Sparkles className="h-3 w-3" />
                  Onboarding
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {stepIndex + 1} of {steps.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default OnboardingWizard;