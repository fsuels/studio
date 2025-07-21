// src/lib/documents/us/property-deed/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { propertyDeedSchema } from './schema';
import { propertyDeedQuestions } from './questions';

export const propertyDeedMeta: LegalDocument = {
  id: 'property-deed',
  jurisdiction: 'US',
  category: 'Real Estate',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: true,
  offerNotarization: true,
  offerRecordingHelp: true,
  basePrice: 25,
  states: 'all',
  templatePaths: {
    en: '/templates/en/us/property-deed.md',
    es: '/templates/es/us/property-deed.md',
  },
  schema: propertyDeedSchema,
  questions: propertyDeedQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Property Deed',
      description:
        'Create a legally binding Property Deed with our easy-to-use template. State-specific requirements included.',
      aliases: ['real estate deed', 'property transfer', 'deed of property'],
    },
    es: {
      name: 'Escritura de Propiedad',
      description:
        'Crea una Escritura de Propiedad legalmente válida con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.',
      aliases: [
        'escritura inmobiliaria',
        'transferencia de propiedad',
        'título de propiedad',
      ],
    },
  },
};
