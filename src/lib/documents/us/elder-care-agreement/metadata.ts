// src/lib/documents/us/elder-care-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { ElderCareAgreementSchema } from './schema';
import { elderCareAgreementQuestions } from './questions';

export const elderCareAgreementMeta: LegalDocument = {
  id: 'elder-care-agreement',
  jurisdiction: 'US',
  category: 'Family & Personal',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 24.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/elder-care-agreement.md',
    es: '/templates/es/elder-care-agreement.md',
  },
  schema: ElderCareAgreementSchema,
  questions: elderCareAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Elder Care Agreement',
      description:
        'Ensure quality care for your loved ones with clear agreements that protect both caregiver and family.',
      aliases: [
        'senior care agreement',
        'caregiving agreement',
        'elderly care contract',
      ],
    },
    es: {
      name: 'Acuerdo de Cuidado de Ancianos',
      description:
        'Acuerdo para proporcionar servicios de cuidado a personas mayores.',
      aliases: [
        'contrato de cuidador',
        'acuerdo de cuidado',
        'contrato de atención de ancianos',
      ],
    },
  },
};
