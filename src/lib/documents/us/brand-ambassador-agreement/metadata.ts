// src/lib/documents/us/brand-ambassador-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { BrandAmbassadorAgreementSchema } from './schema';
import { brandAmbassadorAgreementQuestions } from './questions';

export const brandAmbassadorAgreementMeta: LegalDocument = {
  id: 'brand-ambassador-agreement',
  jurisdiction: 'US',
  category: 'Marketing & Advertising',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 9.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/brand-ambassador-agreement.md',
    es: '/templates/es/brand-ambassador-agreement.md',
  },
  schema: BrandAmbassadorAgreementSchema,
  questions: brandAmbassadorAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Brand Ambassador Agreement',
      description:
        'Agreement for brand ambassador relationships and long-term brand partnerships.',
      aliases: [
        'brand partnership agreement',
        'ambassador contract',
        'brand representative agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Embajador de Marca',
      description:
        'Asocia con alguien para representar tu marca en eventos o redes sociales. Establece expectativas sobre cómo promocionarán tu negocio.',
      aliases: ['acuerdo de asociación de marca', 'contrato de embajador'],
    },
  },
};
