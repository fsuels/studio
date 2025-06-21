// src/lib/onboarding/progress-tracker.ts
'use client';

import { getDb } from '@/lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { milestoneEmailService } from './milestone-emails';

export interface OnboardingProgress {
  userId: string;
  currentStep: number;
  totalSteps: number;
  persona?: 'business' | 'individual' | 'hr' | null;
  completedSteps: string[];
  startedAt: Timestamp;
  lastActiveAt: Timestamp;
  completedAt?: Timestamp;
  isCompleted: boolean;
  milestones: {
    profileSetup?: Timestamp;
    firstDocument?: Timestamp;
    firstSignature?: Timestamp;
    dashboardTour?: Timestamp;
  };
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target: string;
  content: string;
  placement: 'top' | 'bottom' | 'left' | 'right' | 'center';
  disableBeacon?: boolean;
  hideCloseButton?: boolean;
  spotlightClicks?: boolean;
}

export class OnboardingProgressTracker {
  private userId: string;
  private userEmail?: string;
  private userName?: string;
  private locale?: string;

  constructor(userId: string, userEmail?: string, userName?: string, locale?: string) {
    this.userId = userId;
    this.userEmail = userEmail;
    this.userName = userName;
    this.locale = locale;
  }

  private get progressDocRef() {
    const db = getDb();
    return doc(db, 'user_progress', this.userId);
  }

  async initializeProgress(persona?: string): Promise<void> {
    const progress: Partial<OnboardingProgress> = {
      userId: this.userId,
      currentStep: 0,
      totalSteps: this.getStepsForPersona(persona).length,
      persona: persona as any,
      completedSteps: [],
      startedAt: serverTimestamp() as Timestamp,
      lastActiveAt: serverTimestamp() as Timestamp,
      isCompleted: false,
      milestones: {}
    };

    await setDoc(this.progressDocRef, progress, { merge: true });
  }

  async getProgress(): Promise<OnboardingProgress | null> {
    try {
      const snap = await getDoc(this.progressDocRef);
      if (snap.exists()) {
        return snap.data() as OnboardingProgress;
      }
      return null;
    } catch (error) {
      console.error('Error fetching onboarding progress:', error);
      return null;
    }
  }

  async updateStep(stepId: string): Promise<void> {
    const progress = await this.getProgress();
    if (!progress) return;

    const updatedSteps = [...new Set([...progress.completedSteps, stepId])];
    const currentStep = Math.min(updatedSteps.length, progress.totalSteps);
    const isCompleted = currentStep >= progress.totalSteps;

    const update: Partial<OnboardingProgress> = {
      currentStep,
      completedSteps: updatedSteps,
      lastActiveAt: serverTimestamp() as Timestamp,
      isCompleted,
      ...(isCompleted && { completedAt: serverTimestamp() as Timestamp })
    };

    await setDoc(this.progressDocRef, update, { merge: true });
  }

  async markMilestone(milestone: keyof OnboardingProgress['milestones']): Promise<void> {
    const update = {
      [`milestones.${milestone}`]: serverTimestamp(),
      lastActiveAt: serverTimestamp()
    };

    await setDoc(this.progressDocRef, update, { merge: true });

    // Trigger milestone email if user email is available
    if (this.userEmail) {
      const progress = await this.getProgress();
      await milestoneEmailService.triggerMilestoneEmail({
        userId: this.userId,
        email: this.userEmail,
        milestone,
        persona: progress?.persona,
        userData: {
          name: this.userName,
          locale: this.locale
        }
      });
    }
  }

  async resetProgress(): Promise<void> {
    await setDoc(this.progressDocRef, {
      currentStep: 0,
      completedSteps: [],
      isCompleted: false,
      lastActiveAt: serverTimestamp(),
      milestones: {}
    }, { merge: true });
  }

  getStepsForPersona(persona?: string): OnboardingStep[] {
    const baseSteps: OnboardingStep[] = [
      {
        id: 'welcome',
        title: 'Welcome to 123LegalDoc!',
        description: 'Let\'s get you started with a quick tour',
        target: 'body',
        content: 'Welcome! We\'ll show you how to create professional legal documents in minutes.',
        placement: 'center'
      },
      {
        id: 'dashboard_overview',
        title: 'Your Dashboard',
        description: 'This is your command center',
        target: '[data-tour="dashboard-nav"]',
        content: 'This is your dashboard where you can manage all your documents, payments, and settings.',
        placement: 'bottom'
      },
      {
        id: 'create_document',
        title: 'Create Your First Document',
        description: 'Start with our document wizard',
        target: '[data-tour="create-document"]',
        content: 'Click here to create your first legal document. We have over 300 templates available.',
        placement: 'bottom',
        spotlightClicks: true
      }
    ];

    switch (persona) {
      case 'business':
        return [
          ...baseSteps,
          {
            id: 'business_templates',
            title: 'Business Templates',
            description: 'Perfect for your business needs',
            target: '[data-tour="business-templates"]',
            content: 'Access business-specific templates like contracts, NDAs, and employment agreements.',
            placement: 'right'
          },
          {
            id: 'esignature',
            title: 'E-Signature Feature',
            description: 'Get documents signed electronically',
            target: '[data-tour="esignature"]',
            content: 'Send documents for electronic signature to streamline your business processes.',
            placement: 'left'
          }
        ];

      case 'hr':
        return [
          ...baseSteps,
          {
            id: 'hr_pack',
            title: 'HR Document Pack',
            description: 'Employee forms and agreements',
            target: '[data-tour="hr-templates"]',
            content: 'Access employment contracts, handbook templates, and employee forms.',
            placement: 'right'
          },
          {
            id: 'bulk_operations',
            title: 'Bulk Operations',
            description: 'Manage multiple documents efficiently',
            target: '[data-tour="bulk-actions"]',
            content: 'Create and manage multiple employee documents at once.',
            placement: 'top'
          }
        ];

      case 'individual':
      default:
        return [
          ...baseSteps,
          {
            id: 'personal_documents',
            title: 'Personal Documents',
            description: 'For your personal legal needs',
            target: '[data-tour="personal-templates"]',
            content: 'Find templates for wills, rental agreements, and personal contracts.',
            placement: 'right'
          },
          {
            id: 'notary_service',
            title: 'Online Notary',
            description: 'Get documents notarized remotely',
            target: '[data-tour="notary"]',
            content: 'Need notarization? Our online notary service is available 24/7.',
            placement: 'left'
          }
        ];
    }
  }
}

export const createProgressTracker = (
  userId: string, 
  userEmail?: string, 
  userName?: string, 
  locale?: string
) => new OnboardingProgressTracker(userId, userEmail, userName, locale);