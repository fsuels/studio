// src/lib/documents/us/recording-artist-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { RecordingArtistAgreementSchema } from './schema';
import { recordingArtistAgreementQuestions } from './questions';

export const recordingArtistAgreementMeta: LegalDocument = {
  id: 'recording-artist-agreement',
  jurisdiction: 'US',
  category: 'Entertainment & Media',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 29.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/recording-artist-agreement.md',
    es: '/templates/es/recording-artist-agreement.md',
  },
  schema: RecordingArtistAgreementSchema,
  questions: recordingArtistAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Recording Artist Agreement',
      description:
        'Agreement between recording artists and record labels or producers.',
      aliases: ['record deal', 'music contract', 'artist recording contract'],
    },
    es: {
      name: 'Acuerdo de Artista de Grabación',
      description:
        'Acuerdo entre artistas de grabación y sellos discográficos.',
      aliases: ['contrato discográfico', 'acuerdo musical'],
    },
  },
};
