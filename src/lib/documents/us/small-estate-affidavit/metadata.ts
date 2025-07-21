// src/lib/documents/us/small-estate-affidavit/metadata.ts
import type { LegalDocument } from '@/types/documents';

export const smallEstateAffidavitMeta: Omit<
  LegalDocument,
  'schema' | 'questions'
> = {
  id: 'small-estate-affidavit',
  jurisdiction: 'US',
  category: 'Legal',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 18,
  states: 'all',
  templatePaths: {
    en: '/templates/en/small-estate-affidavit.md',
    es: '/templates/es/small-estate-affidavit.md',
  },
  upsellClauses: [],
  translations: {
    en: {
      name: 'Small Estate Affidavit',
      description:
        'Affidavit to transfer assets of a small estate without formal probate proceedings.',
      aliases: [
        'small estate succession',
        'affidavit of small estate',
        'small estate declaration',
        'simplified probate affidavit',
        'small estate transfer',
        'inheritance affidavit',
      ],
    },
    es: {
      name: 'Declaración Jurada de Patrimonio Pequeño',
      description:
        'Declaración jurada para transferir activos de un patrimonio pequeño sin procedimientos formales de sucesión.',
      aliases: [
        'sucesión de patrimonio pequeño',
        'declaración jurada de herencia pequeña',
        'declaración de patrimonio menor',
        'declaración jurada de sucesión simplificada',
        'transferencia de patrimonio pequeño',
        'declaración jurada de herencia',
      ],
    },
  },
};
