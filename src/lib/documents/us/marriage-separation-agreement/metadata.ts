// src/lib/documents/us/marriage-separation-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { MarriageSeparationAgreementSchema } from './schema';
import { marriageSeparationAgreementQuestions } from './questions';

export const marriageSeparationAgreementMeta: LegalDocument = {
  id: 'marriage-separation-agreement',
  jurisdiction: 'US',
  category: 'Family & Personal',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 44.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/marriage-separation-agreement.md',
    es: '/templates/es/marriage-separation-agreement.md',
  },
  schema: MarriageSeparationAgreementSchema,
  questions: marriageSeparationAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Marriage Separation Agreement',
      description:
        'Agreement between spouses living apart covering property, support, and custody.',
      aliases: ['legal separation agreement', 'marital separation contract'],
    },
    es: {
      name: 'Acuerdo de Separación Matrimonial',
      description:
        'Acuerdo entre cónyuges que viven separados sobre propiedad, manutención y custodia.',
      aliases: [
        'acuerdo de separación legal',
        'contrato de separación marital',
      ],
    },
  },
};
