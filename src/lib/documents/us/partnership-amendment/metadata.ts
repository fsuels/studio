// src/lib/documents/us/partnership-amendment/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { partnershipAmendmentSchema } from './schema';
import { partnershipAmendmentQuestions } from './questions';

export const partnershipAmendmentMeta: LegalDocument = {
  id: 'partnership-amendment',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 20,
  states: 'all',
  templatePaths: {
    en: '/templates/en/partnership-amendment.md',
    es: '/templates/es/partnership-amendment.md',
  },
  schema: partnershipAmendmentSchema,
  questions: partnershipAmendmentQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Partnership Amendment',
      description:
        'Amendment to modify existing partnership agreement terms and conditions.',
      aliases: [
        'partnership modification',
        'agreement amendment',
        'partnership change',
      ],
    },
    es: {
      name: 'Enmienda de Sociedad',
      description:
        'Enmienda para modificar los términos y condiciones del acuerdo de sociedad existente.',
      aliases: [
        'modificación de sociedad',
        'enmienda de acuerdo',
        'cambio de sociedad',
      ],
    },
  },
};
