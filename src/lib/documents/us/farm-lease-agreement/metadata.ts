// src/lib/documents/us/farm-lease-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { FarmLeaseAgreementSchema } from './schema';
import { farmLeaseAgreementQuestions } from './questions';

export const farmLeaseAgreementMeta: LegalDocument = {
  id: 'farm-lease-agreement',
  jurisdiction: 'US',
  category: 'Real Estate & Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: true,
  offerNotarization: true,
  offerRecordingHelp: true,
  basePrice: 39.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/farm-lease-agreement.md',
    es: '/templates/es/farm-lease-agreement.md',
  },
  schema: FarmLeaseAgreementSchema,
  questions: farmLeaseAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Farm Lease Agreement',
      description:
        'Agreement for leasing agricultural land and farming operations.',
      aliases: [
        'agricultural lease',
        'farmland rental agreement',
        'crop share lease',
      ],
    },
    es: {
      name: 'Acuerdo de Arrendamiento de Granja',
      description:
        'Renta tierra para cultivar o criar ganado. Cubre términos de arrendamiento, responsabilidades y cómo se dividen las ganancias de las cosechas.',
      aliases: ['arrendamiento agrícola', 'acuerdo de alquiler de tierras'],
    },
  },
};
