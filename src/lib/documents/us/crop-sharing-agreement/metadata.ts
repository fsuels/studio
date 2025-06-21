// src/lib/documents/us/crop-sharing-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { CropSharingAgreementSchema } from './schema';
import { cropSharingAgreementQuestions } from './questions';

export const cropSharingAgreementMeta: LegalDocument = {
  id: 'crop-sharing-agreement',
  jurisdiction: 'US',
  category: 'Agriculture & Farming',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 17.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/crop-sharing-agreement.md',
    es: '/templates/es/crop-sharing-agreement.md',
  },
  schema: CropSharingAgreementSchema,
  questions: cropSharingAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Crop Sharing Agreement',
      description: 'Agreement for crop sharing and agricultural partnerships.',
      aliases: ['sharecropping agreement', 'farm partnership'],
    },
    es: {
      name: 'Acuerdo de Participación de Cultivos',
      description:
        'Acuerdo para participación de cultivos y asociaciones agrícolas.',
      aliases: ['acuerdo de aparcería', 'sociedad agrícola'],
    },
  },
};
