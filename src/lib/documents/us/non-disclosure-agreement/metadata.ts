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
    en: '/templates/en/non-disclosure-agreement.md',
    es: '/templates/es/non-disclosure-agreement.md',
  },
  schema: nonDisclosureAgreementSchema,
  questions: nonDisclosureAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Confidentiality Agreement (NDA)',
      description:
        'Protect your business secrets and confidential information when hiring employees or partners. Prevent competitors from stealing your valuable ideas.',
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
        'Protege secretos comerciales e información confidencial al contratar empleados o socios. Previene compartir secretos con competidores.',
      aliases: [
        'acuerdo de no divulgación',
        'contrato de confidencialidad',
        'documento comercial',
      ],
    },
  },
};
