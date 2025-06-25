// src/lib/documents/us/affidavit-of-heirship/metadata.ts
import type { LegalDocument } from '@/types/documents';

export const affidavitOfHeirshipMeta: Omit<
  LegalDocument,
  'schema' | 'questions'
> = {
  id: 'affidavit-of-heirship',
  jurisdiction: 'US',
  category: 'Legal',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: true,
  offerNotarization: true,
  offerRecordingHelp: true,
  basePrice: 20,
  states: 'all',
  templatePaths: {
    en: '/templates/en/affidavit-of-heirship.md',
    es: '/templates/es/affidavit-of-heirship.md',
  },
  upsellClauses: [],
  translations: {
    en: {
      name: 'Affidavit of Heirship',
      description:
        'Legal document establishing the heirs of a deceased person for property transfer and inheritance purposes.',
      aliases: [
        'heirship affidavit',
        'affidavit of inheritance',
        'heir determination affidavit',
        'family tree affidavit',
        'descent affidavit',
        'heirship declaration',
      ],
    },
    es: {
      name: 'Declaración Jurada de Herederos',
      description:
        'Establece quién hereda propiedad cuando alguien muere sin testamento. Prueba relaciones familiares para transferencia de bienes.',
      aliases: [
        'declaración jurada de herencia',
        'declaración jurada de sucesión',
        'declaración de herederos',
        'declaración jurada familiar',
        'declaración de descendencia',
        'declaración de herencia',
      ],
    },
  },
};
