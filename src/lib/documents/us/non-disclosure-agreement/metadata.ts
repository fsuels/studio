// src/lib/documents/us/non-disclosure-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { nonDisclosureAgreementSchema } from './schema';
import { nonDisclosureAgreementQuestions } from './questions';

export const nonDisclosureAgreementMeta: LegalDocument = {
  id: 'non-disclosure-agreement',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 15,
  states: 'all',
  templatePaths: {
    en: '/templates/en/nda.md',
    es: '/templates/es/nda.md',
  },
  schema: nonDisclosureAgreementSchema,
  questions: nonDisclosureAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Non-Disclosure Agreement (NDA)',
      description:
        'Create a legally binding Non-Disclosure Agreement (NDA) with our easy-to-use template. State-specific requirements included.',
      aliases: [
        'non-disclosure contract (nda)',
        'business document',
        'commercial agreement',
        'confidentiality agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Confidencialidad (NDA)',
      description:
        'Crea un Acuerdo de Confidencialidad (NDA) legalmente válido con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.',
      aliases: [
        'acuerdo de no divulgación',
        'contrato de confidencialidad',
        'documento comercial',
      ],
    },
  },
};
