// src/lib/documents/us/talent-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { TalentAgreementSchema } from './schema';
import { talentAgreementQuestions } from './questions';

export const talentAgreementMeta: LegalDocument = {
  id: 'talent-agreement',
  jurisdiction: 'US',
  category: 'Entertainment & Media',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 12.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/talent-agreement.md',
    es: '/templates/es/talent-agreement.md',
  },
  schema: TalentAgreementSchema,
  questions: talentAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Talent Agreement',
      description:
        'Agreement for talent representation and entertainment industry services.',
      aliases: [
        'artist agreement',
        'performer contract',
        'entertainment agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Talento',
      description:
        'Acuerdo para representación de talento y servicios de la industria del entretenimiento.',
      aliases: ['acuerdo de artista', 'contrato de intérprete'],
    },
  },
};
