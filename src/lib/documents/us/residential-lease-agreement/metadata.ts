import type { LegalDocument } from '@/types/documents';
import { residentialLeaseAgreementSchema } from './schema';
import { residentialLeaseAgreementQuestions } from './questions';

export const residentialLeaseAgreementMeta: LegalDocument = {
  id: 'residential-lease-agreement',
  jurisdiction: 'US',
  category: 'Real Estate',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: true,
  offerNotarization: false,
  offerRecordingHelp: true,
  basePrice: 9.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/residential-lease-agreement.md',
    es: '/templates/es/residential-lease-agreement.md',
  },
  schema: residentialLeaseAgreementSchema,
  questions: residentialLeaseAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Residential Rental Agreement',
      description: 'Create a legally binding residential lease agreement with our easy-to-use template. State-specific requirements included.',
      aliases: [
        'residential lease contract',
        'apartment lease',
        'rental lease',
        'home rental agreement'
      ],
    },
    es: {
      name: 'Contrato de Alquiler Residencial',
      description: 'Crea un acuerdo de arrendamiento residencial legalmente válido con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.',
      aliases: [
        'contrato de arrendamiento residencial',
        'arrendamiento de apartamento',
        'contrato de alquiler'
      ],
    },
  },
};
