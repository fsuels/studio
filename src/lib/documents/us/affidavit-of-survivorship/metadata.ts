// src/lib/documents/us/affidavit-of-survivorship/metadata.ts
import type { LegalDocument } from '@/types/documents';

export const affidavitOfSurvivorshipMeta: Omit<
  LegalDocument,
  'schema' | 'questions'
> = {
  id: 'affidavit-of-survivorship',
  jurisdiction: 'US',
  category: 'Legal',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: true,
  offerNotarization: true,
  offerRecordingHelp: true,
  basePrice: 18,
  states: 'all',
  templatePaths: {
    en: '/templates/en/affidavit-of-survivorship.md',
    es: '/templates/es/affidavit-of-survivorship.md',
  },
  upsellClauses: [],
  translations: {
    en: {
      name: 'Affidavit of Survivorship',
      description:
        'Legal document for surviving joint owners to establish sole ownership of property after the death of a co-owner.',
      aliases: [
        'survivorship affidavit',
        'joint tenant survivorship affidavit',
        'surviving owner affidavit',
        'right of survivorship affidavit',
        'survivorship deed affidavit',
        'joint ownership death affidavit',
      ],
    },
    es: {
      name: 'Declaración Jurada de Supervivencia',
      description:
        'Transfiere propiedad de tenencia conjunta al propietario sobreviviente después de la muerte. Evita el proceso de sucesión para propiedad en tenencia conjunta.',
      aliases: [
        'declaración jurada de supervivencia',
        'declaración jurada de supervivencia de inquilinos conjuntos',
        'declaración jurada de propietario superviviente',
        'declaración jurada de derecho de supervivencia',
        'declaración jurada de escritura de supervivencia',
        'declaración jurada de muerte de propiedad conjunta',
      ],
    },
  },
};
