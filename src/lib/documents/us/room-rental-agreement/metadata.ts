// src/lib/documents/us/room-rental-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { RoomRentalAgreementSchema } from './schema';
import { roomRentalAgreementQuestions } from './questions';

export const roomRentalAgreementMeta: LegalDocument = {
  id: 'room-rental-agreement',
  jurisdiction: 'US',
  category: 'Real Estate',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 8.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/room-rental-agreement.md',
    es: '/templates/es/room-rental-agreement.md',
  },
  schema: RoomRentalAgreementSchema,
  questions: roomRentalAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Room Rental Agreement',
      description:
        'Create a legally binding room rental agreement for shared living spaces with our easy-to-use template.',
      aliases: [
        'room lease',
        'bedroom rental',
        'shared housing agreement',
        'room sharing contract'
      ],
    },
    es: {
      name: 'Acuerdo de Alquiler de Habitación',
      description:
        'Crea un acuerdo de alquiler de habitación legalmente válido para espacios de vida compartidos.',
      aliases: [
        'arrendamiento de habitación',
        'alquiler de dormitorio',
        'acuerdo de vivienda compartida'
      ],
    },
  },
};