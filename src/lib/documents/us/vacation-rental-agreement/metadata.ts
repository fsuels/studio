// src/lib/documents/us/vacation-rental-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { VacationRentalAgreementSchema } from './schema';
import { vacationRentalAgreementQuestions } from './questions';

export const vacationRentalAgreementMeta: LegalDocument = {
  id: 'vacation-rental-agreement',
  jurisdiction: 'US',
  category: 'Travel & Transportation',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 16.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/vacation-rental-agreement.md',
    es: '/templates/es/vacation-rental-agreement.md',
  },
  schema: VacationRentalAgreementSchema,
  questions: vacationRentalAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Vacation Rental Agreement',
      description: 'Agreement for short-term vacation property rentals.',
      aliases: ['short-term rental', 'vacation home rental', 'holiday rental'],
    },
    es: {
      name: 'Acuerdo de Alquiler Vacacional',
      description:
        'Acuerdo para alquileres de propiedades vacacionales a corto plazo.',
      aliases: ['alquiler de vacaciones', 'alquiler de casa vacacional'],
    },
  },
};
