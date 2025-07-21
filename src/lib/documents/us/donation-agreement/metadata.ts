// src/lib/documents/us/donation-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { DonationAgreementSchema } from './schema';
import { donationAgreementQuestions } from './questions';

export const donationAgreementMeta: LegalDocument = {
  id: 'donation-agreement',
  jurisdiction: 'US',
  category: 'Personal & Lifestyle',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 12.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/donation-agreement.md',
    es: '/templates/es/donation-agreement.md',
  },
  schema: DonationAgreementSchema,
  questions: donationAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Donation Agreement',
      description: 'Agreement for charitable donations and gifts.',
      aliases: ['gift agreement', 'charitable donation', 'pledge agreement'],
    },
    es: {
      name: 'Acuerdo de Donación',
      description: 'Acuerdo para donaciones caritativas y regalos.',
      aliases: ['acuerdo de regalo', 'donación caritativa'],
    },
  },
};
