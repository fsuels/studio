// src/lib/documents/us/property-manager-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { PropertyManagerAgreementSchema } from './schema';
import { propertyManagerAgreementQuestions } from './questions';

export const propertyManagerAgreementMeta: LegalDocument = {
  id: 'property-manager-agreement',
  jurisdiction: 'US',
  category: 'Business & Commercial',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 34.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/property-manager-agreement.md',
    es: '/templates/es/property-manager-agreement.md',
  },
  schema: PropertyManagerAgreementSchema,
  questions: propertyManagerAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Property Manager Agreement',
      description:
        'Agreement for property management services and responsibilities',
      aliases: [],
    },
    es: {
      name: 'Property Manager Agreement', // TODO: Add Spanish translation
      description:
        'Agreement for property management services and responsibilities', // TODO: Add Spanish translation
      aliases: [],
    },
  },
};
