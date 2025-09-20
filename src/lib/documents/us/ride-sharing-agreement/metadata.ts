// src/lib/documents/us/ride-sharing-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { RideSharingAgreementSchema } from './schema';
import { rideSharingAgreementQuestions } from './questions';

export const rideSharingAgreementMeta: LegalDocument = {
  id: 'ride-sharing-agreement',
  jurisdiction: 'US',
  category: 'Transportation & Automotive',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 15.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/ride-sharing-agreement.md',
    es: '/templates/es/ride-sharing-agreement.md',
  },
  schema: RideSharingAgreementSchema,
  questions: rideSharingAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Ride Sharing Agreement',
      description: 'Agreement for ride sharing and carpooling arrangements.',
      aliases: [
        'carpool agreement',
        'rideshare contract',
        'driver passenger agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Viaje Compartido',
      description: 'Acuerdo para arreglos de viaje compartido y carpooling.',
      aliases: [
        'acuerdo de carpool',
        'contrato de viaje compartido',
        'acuerdo de pasajero del conductor',
      ],
    },
  },
};
