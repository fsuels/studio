// src/lib/documents/us/separation-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { SeparationAgreementSchema } from './schema';
import { separationAgreementQuestions } from './questions';

export const separationAgreementMeta: LegalDocument = {
  id: 'separation-agreement',
  jurisdiction: 'US',
  category: 'Family & Personal',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 39.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/separation-agreement.md',
    es: '/templates/es/separation-agreement.md',
  },
  schema: SeparationAgreementSchema,
  questions: separationAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Separation Agreement',
      description:
        'General agreement for couples separating and dividing assets.',
      aliases: ['legal separation', 'separation contract'],
    },
    es: {
      name: 'Acuerdo de Separación',
      description:
        'Acuerdo general para parejas que se separan y dividen bienes.',
      aliases: ['separación legal', 'contrato de separación'],
    },
  },
};
