// src/lib/documents/us/travel-insurance-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { TravelInsuranceAgreementSchema } from './schema';
import { travelInsuranceAgreementQuestions } from './questions';

export const travelInsuranceAgreementMeta: LegalDocument = {
  id: 'travel-insurance-agreement',
  jurisdiction: 'US',
  category: 'Travel & Transportation',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 14.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/travel-insurance-agreement.md',
    es: '/templates/es/travel-insurance-agreement.md',
  },
  schema: TravelInsuranceAgreementSchema,
  questions: travelInsuranceAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Travel Insurance Agreement',
      description: 'Agreement for travel insurance coverage and terms.',
      aliases: ['travel insurance policy', 'trip insurance'],
    },
    es: {
      name: 'Acuerdo de Seguro de Viaje',
      description: 'Acuerdo para cobertura y términos de seguro de viaje.',
      aliases: ['póliza de seguro de viaje'],
    },
  },
};
