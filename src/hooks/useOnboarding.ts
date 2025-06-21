// src/hooks/useOnboarding.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createProgressTracker, OnboardingProgress } from '@/lib/onboarding/progress-tracker';

export interface UseOnboardingReturn {
  progress: OnboardingProgress | null;
  isLoading: boolean;
  isOnboardingComplete: boolean;
  shouldShowOnboarding: boolean;
  startOnboarding: () => void;
  completeOnboarding: () => void;
  skipOnboarding: () => void;
  markMilestone: (milestone: keyof OnboardingProgress['milestones']) => Promise<void>;
  resetOnboarding: () => Promise<void>;
}

export const useOnboarding = (): UseOnboardingReturn => {
  const { user, isLoggedIn } = useAuth();
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tracker, setTracker] = useState<ReturnType<typeof createProgressTracker> | null>(null);

  useEffect(() => {
    if (user?.uid) {
      setTracker(createProgressTracker(
        user.uid, 
        user.email || undefined,
        user.displayName || user.name || undefined,
        'en' // You could get this from i18n or user preferences
      ));
    } else {
      setTracker(null);
      setProgress(null);
    }
  }, [user?.uid, user?.email, user?.displayName, user?.name]);

  const loadProgress = useCallback(async () => {
    if (!tracker) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const currentProgress = await tracker.getProgress();
      setProgress(currentProgress);
    } catch (error) {
      console.error('Error loading onboarding progress:', error);
    } finally {
      setIsLoading(false);
    }
  }, [tracker]);

  useEffect(() => {
    if (tracker) {
      loadProgress();
    }
  }, [tracker, loadProgress]);

  const isOnboardingComplete = progress?.isCompleted ?? false;
  
  const shouldShowOnboarding = isLoggedIn && 
    !isLoading && 
    !isOnboardingComplete && 
    (!progress || progress.currentStep === 0);

  const startOnboarding = useCallback(() => {
    // This will be handled by the OnboardingWizard component
    // We just need to trigger a re-render
    loadProgress();
  }, [loadProgress]);

  const completeOnboarding = useCallback(async () => {
    if (!tracker) return;

    try {
      // Mark all steps as completed
      const steps = tracker.getStepsForPersona(progress?.persona);
      for (const step of steps) {
        await tracker.updateStep(step.id);
      }
      await loadProgress();
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  }, [tracker, progress?.persona, loadProgress]);

  const skipOnboarding = useCallback(async () => {
    if (!tracker) return;

    try {
      await tracker.initializeProgress();
      const updateData = {
        isCompleted: true,
        currentStep: tracker.getStepsForPersona().length,
        completedAt: new Date()
      };
      
      // We'll need to add a method to update progress manually
      await loadProgress();
    } catch (error) {
      console.error('Error skipping onboarding:', error);
    }
  }, [tracker, loadProgress]);

  const markMilestone = useCallback(async (milestone: keyof OnboardingProgress['milestones']) => {
    if (!tracker) return;

    try {
      await tracker.markMilestone(milestone);
      await loadProgress();
    } catch (error) {
      console.error('Error marking milestone:', error);
    }
  }, [tracker, loadProgress]);

  const resetOnboarding = useCallback(async () => {
    if (!tracker) return;

    try {
      await tracker.resetProgress();
      await loadProgress();
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  }, [tracker, loadProgress]);

  return {
    progress,
    isLoading,
    isOnboardingComplete,
    shouldShowOnboarding,
    startOnboarding,
    completeOnboarding,
    skipOnboarding,
    markMilestone,
    resetOnboarding
  };
};