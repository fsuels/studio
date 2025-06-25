// src/lib/documents/us/catering-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { CateringAgreementSchema } from './schema';
import { cateringAgreementQuestions } from './questions';

export const cateringAgreementMeta: LegalDocument = {
  id: 'catering-agreement',
  jurisdiction: 'US',
  category: 'Food & Hospitality',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 15.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/catering-agreement.md',
    es: '/templates/es/catering-agreement.md',
  },
  schema: CateringAgreementSchema,
  questions: cateringAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Catering Agreement',
      description: 'Agreement for catering services for events and occasions.',
      aliases: ['catering contract', 'food service agreement'],
    },
    es: {
      name: 'Acuerdo de Catering',
      description:
        'Contrata servicio de comida para bodas, fiestas o eventos. Define menús, precios, horarios y qué pasa si se cancelan.',
      aliases: ['contrato de catering', 'acuerdo de servicio de comida'],
    },
  },
};
