// src/lib/documents/us/membership-cancellation-letter/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { MembershipCancellationLetterSchema } from './schema';
import { membershipCancellationLetterQuestions } from './questions';

export const membershipCancellationLetterMeta: LegalDocument = {
  id: 'membership-cancellation-letter',
  jurisdiction: 'US',
  category: 'Personal & Lifestyle',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 9.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/membership-cancellation-letter.md',
    es: '/templates/es/membership-cancellation-letter.md',
  },
  schema: MembershipCancellationLetterSchema,
  questions: membershipCancellationLetterQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Membership Cancellation Letter',
      description: 'Letter to cancel gym, club, or service memberships.',
      aliases: ['cancellation letter', 'membership termination letter'],
    },
    es: {
      name: 'Carta de Cancelación de Membresía',
      description:
        'Carta para cancelar membresías de gimnasio, club o servicios.',
      aliases: ['carta de cancelación', 'carta de terminación de membresía'],
    },
  },
};
