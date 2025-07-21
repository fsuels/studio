// src/lib/documents/us/photo-release-form/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { PhotoReleaseFormSchema } from './schema';
import { photoReleaseFormQuestions } from './questions';

export const photoReleaseFormMeta: LegalDocument = {
  id: 'photo-release-form',
  jurisdiction: 'US',
  category: 'Legal',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 12,
  states: 'all',
  templatePaths: {
    en: '/templates/en/photo-release-form.md',
    es: '/templates/es/photo-release-form.md',
  },
  schema: PhotoReleaseFormSchema,
  questions: photoReleaseFormQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Photo Release Form',
      description:
        'Use photos safely in your marketing without legal risks. Get proper permission for commercial use and advertising.',
      aliases: [
        'photography release',
        'image release',
        'photo consent',
        'picture release',
      ],
    },
    es: {
      name: 'Formulario de Liberación Fotográfica',
      description:
        'Formulario simple de permiso para usar la foto de alguien comercialmente. Requerido para marketing, sitios web y publicaciones.',
      aliases: [
        'liberación fotografía',
        'liberación imagen',
        'consentimiento foto',
        'liberación fotografica',
      ],
    },
  },
};
