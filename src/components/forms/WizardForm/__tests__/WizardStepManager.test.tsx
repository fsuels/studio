import { renderHook } from '@testing-library/react';
import { z } from 'zod';
import { calculateProgress, useWizardSteps } from '../WizardStepManager';
import type { LegalDocument } from '@/lib/document-library';

// Mock document for testing
const mockDocument: LegalDocument = {
  id: 'test-doc',
  category: 'Test',
  languageSupport: ['en'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 10,
  states: 'all',
  schema: z.object({
    name: z.string().min(1),
    email: z.string().email(),
  }),
  questions: [
    {
      id: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
    },
    {
      id: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      tooltip: 'Enter your email address',
    },
  ],
  upsellClauses: [],
  translations: {
    en: {
      name: 'Test Document',
      description: 'A test document',
      aliases: ['test'],
    },
  },
};

describe('WizardStepManager', () => {
  describe('calculateProgress', () => {
    it('calculates progress correctly for normal steps', () => {
      expect(calculateProgress(0, 4, false)).toBe(25);
      expect(calculateProgress(1, 4, false)).toBe(50);
      expect(calculateProgress(2, 4, false)).toBe(75);
      expect(calculateProgress(3, 4, false)).toBe(100);
    });

    it('returns 100% when reviewing', () => {
      expect(calculateProgress(2, 4, true)).toBe(100);
    });

    it('returns 100% when no steps', () => {
      expect(calculateProgress(0, 0, false)).toBe(100);
    });

    it('rounds progress to nearest integer', () => {
      expect(calculateProgress(0, 3, false)).toBe(33); // 33.333... rounded
      expect(calculateProgress(1, 3, false)).toBe(67); // 66.666... rounded
    });
  });

  describe('useWizardSteps', () => {
    it('generates steps from document questions', () => {
      const { result } = renderHook(() => useWizardSteps(mockDocument));

      expect(result.current.totalSteps).toBe(2);
      expect(result.current.steps).toHaveLength(2);

      const [nameStep, emailStep] = result.current.steps;

      expect(nameStep.id).toBe('name');
      expect(nameStep.label).toBe('Full Name');
      expect(nameStep.type).toBe('text');
      expect(nameStep.required).toBe(true);

      expect(emailStep.id).toBe('email');
      expect(emailStep.label).toBe('Email Address');
      expect(emailStep.type).toBe('email');
      expect(emailStep.tooltip).toBe('Enter your email address');
    });

    it('handles document with no questions', () => {
      const docWithoutQuestions = { ...mockDocument, questions: [] };
      const { result } = renderHook(() => useWizardSteps(docWithoutQuestions));

      expect(result.current.totalSteps).toBe(0);
      expect(result.current.steps).toHaveLength(0);
    });

    it('extracts schema shape correctly', () => {
      const { result } = renderHook(() => useWizardSteps(mockDocument));

      expect(result.current.actualSchemaShape).toBeDefined();
      // Schema shape may be a function or object depending on Zod version
      if (typeof result.current.actualSchemaShape === 'object') {
        expect(result.current.actualSchemaShape).toHaveProperty('name');
        expect(result.current.actualSchemaShape).toHaveProperty('email');
      }
    });
  });
});
