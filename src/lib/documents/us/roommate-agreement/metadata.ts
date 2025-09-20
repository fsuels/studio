// src/lib/documents/us/roommate-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { RoommateAgreementSchema } from './schema';
import { roommateAgreementQuestions } from './questions';

export const roommateAgreementMeta: LegalDocument = {
  id: 'roommate-agreement',
  jurisdiction: 'US',
  category: 'Real Estate',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 6.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/roommate-agreement.md',
    es: '/templates/es/roommate-agreement.md',
  },
  schema: RoommateAgreementSchema,
  questions: roommateAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Roommate Agreement',
      description:
        'Establish clear rules and responsibilities for shared living arrangements.',
      aliases: [
        'roommate contract',
        'shared living agreement',
        'housemate agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Compañeros de Cuarto',
      description:
        'Establece reglas claras y responsabilidades para arreglos de vida compartida.',
      aliases: [
        'contrato de compañeros de cuarto',
        'acuerdo de convivencia',
        'acuerdo de compañeros de casa',
      ],
    },
  },
};
