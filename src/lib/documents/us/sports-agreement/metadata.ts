// src/lib/documents/us/sports-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { SportsAgreementSchema } from './schema';
import { sportsAgreementQuestions } from './questions';

export const sportsAgreementMeta: LegalDocument = {
  id: 'sports-agreement',
  jurisdiction: 'US',
  category: 'Sports & Recreation',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 12.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/sports-agreement.md',
    es: '/templates/es/sports-agreement.md',
  },
  schema: SportsAgreementSchema,
  questions: sportsAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Sports Agreement',
      description:
        'Agreement for sports activities, coaching, and athletic services.',
      aliases: [
        'athletic agreement',
        'coaching contract',
        'sports contract',
      ],
    },
    es: {
      name: 'Acuerdo Deportivo',
      description:
        'Acuerdo para actividades deportivas, entrenamiento y servicios atléticos.',
      aliases: [
        'acuerdo atlético',
        'contrato de entrenamiento',
        'contrato deportivo',
      ],
    },
  },
};
