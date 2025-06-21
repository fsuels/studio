// src/lib/documents/us/affidavit-of-death/metadata.ts
import type { LegalDocument } from '@/types/documents';

export const affidavitOfDeathMeta: Omit<LegalDocument, 'schema' | 'questions'> =
  {
    id: 'affidavit-of-death',
    jurisdiction: 'US',
    category: 'Legal',
    languageSupport: ['en', 'es'],
    requiresNotarization: true,
    canBeRecorded: false,
    offerNotarization: true,
    offerRecordingHelp: false,
    basePrice: 15,
    states: 'all',
    templatePaths: {
      en: '/templates/en/affidavit-of-death.md',
      es: '/templates/es/affidavit-of-death.md',
    },
    upsellClauses: [],
    translations: {
      en: {
        name: 'Affidavit of Death',
        description:
          'Legal document certifying the death of a person when a death certificate is unavailable or as additional proof of death.',
        aliases: [
          'death affidavit',
          'affidavit certifying death',
          'proof of death affidavit',
          'death verification affidavit',
          'affidavit of deceased person',
          'sworn statement of death',
        ],
      },
      es: {
        name: 'Declaración Jurada de Muerte',
        description:
          'Documento legal que certifica la muerte de una persona cuando no está disponible un certificado de defunción o como prueba adicional de muerte.',
        aliases: [
          'declaración jurada de defunción',
          'declaración jurada certificando muerte',
          'declaración jurada de prueba de muerte',
          'declaración jurada de verificación de muerte',
          'declaración jurada de persona fallecida',
          'declaración jurada de muerte',
        ],
      },
    },
  };
