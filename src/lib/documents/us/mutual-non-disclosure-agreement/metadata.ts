// src/lib/documents/us/mutual-non-disclosure-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { MutualNDASchema } from './schema';
import { mutualNdaQuestions } from './questions';

export const mutualNdaMeta: LegalDocument = {
  id: 'mutual-non-disclosure-agreement',
  jurisdiction: 'US',
  category: 'Legal',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 8,
  states: 'all',
  templatePaths: {
    en: '/templates/en/mutual-non-disclosure-agreement.md',
    es: '/templates/es/mutual-non-disclosure-agreement.md',
  },
  schema: MutualNDASchema,
  questions: mutualNdaQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Mutual Non-Disclosure Agreement (Mutual NDA)',
      description:
        'Two-way confidentiality agreement protecting information shared by both parties.',
      aliases: [
        'mutual confidentiality',
        'bilateral nda',
        'two-way nda',
        'mutual secrecy',
      ],
    },
    es: {
      name: 'Acuerdo Mutuo de Confidencialidad (NDA Mutuo)',
      description:
        'Acuerdo de confidencialidad bilateral que protege la información compartida por ambas partes.',
      aliases: [
        'confidencialidad mutua',
        'nda bilateral',
        'nda de dos vías',
        'secreto mutuo',
      ],
    },
  },
};
