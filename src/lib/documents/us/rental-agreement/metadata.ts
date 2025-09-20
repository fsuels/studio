import type { LegalDocument } from '@/types/documents';
import { rentalAgreementSchema } from './schema';
import { rentalAgreementQuestions } from './questions';

export const rentalAgreementMeta: LegalDocument = {
  id: 'rental-agreement',
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
    en: '/templates/en/rental-agreement.md',
    es: '/templates/es/rental-agreement.md',
  },
  schema: rentalAgreementSchema,
  questions: rentalAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Rental Agreement',
      description:
        'Generate steady rental income or secure quality housing with clear terms that protect both parties. Prevent costly tenant disputes and legal issues.',
      aliases: [
        'rental contract',
        'property rental',
        'lease contract',
        'tenancy agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Alquiler',
      description:
        'Crea un acuerdo de alquiler legalmente válido con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.',
      aliases: [
        'contrato de alquiler',
        'contrato de renta',
        'acuerdo de arrendamiento',
        'acuerdo de arrendamiento legal',
      ],
    },
  },
};
