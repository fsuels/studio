// src/lib/documents/us/music-licensing-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { MusicLicensingAgreementSchema } from './schema';
import { musicLicensingAgreementQuestions } from './questions';

export const musicLicensingAgreementMeta: LegalDocument = {
  id: 'music-licensing-agreement',
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
    en: '/templates/en/music-licensing-agreement.md',
    es: '/templates/es/music-licensing-agreement.md',
  },
  schema: MusicLicensingAgreementSchema,
  questions: musicLicensingAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Music Licensing Agreement',
      description:
        'Agreement for licensing music compositions and recordings for various uses.',
      aliases: ['music license', 'sync license', 'performance license'],
    },
    es: {
      name: 'Acuerdo de Licencia Musical',
      description:
        'Acuerdo para licenciar composiciones musicales y grabaciones para varios usos.',
      aliases: ['licencia musical', 'licencia de sincronización'],
    },
  },
};
