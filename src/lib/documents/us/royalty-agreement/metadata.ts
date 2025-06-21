// src/lib/documents/us/royalty-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { RoyaltyAgreementSchema } from './schema';
import { royaltyAgreementQuestions } from './questions';

export const royaltyAgreementMeta: LegalDocument = {
  id: 'royalty-agreement',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 28,
  states: 'all',
  templatePaths: {
    en: '/templates/en/royalty-agreement.md',
    es: '/templates/es/royalty-agreement.md',
  },
  schema: RoyaltyAgreementSchema,
  questions: royaltyAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Royalty Agreement',
      description:
        'Agreement for royalty payments and distribution of intellectual property licensing revenue.',
      aliases: [
        'royalty contract',
        'licensing royalty',
        'ip royalty',
        'revenue sharing',
      ],
    },
    es: {
      name: 'Acuerdo de Regalías',
      description:
        'Acuerdo para pagos de regalías y distribución de ingresos por licenciamiento de propiedad intelectual.',
      aliases: [
        'contrato regalías',
        'regalías licenciamiento',
        'regalías pi',
        'participación ingresos',
      ],
    },
  },
};
