// src/components/onboarding/index.ts
export { default as OnboardingWizard } from './OnboardingWizard';
export { default as OnboardingChecklist } from './OnboardingChecklist';
export { useOnboarding } from '@/hooks/useOnboarding';
export { createProgressTracker } from '@/lib/onboarding/progress-tracker';
export { milestoneEmailService } from '@/lib/onboarding/milestone-emails';
