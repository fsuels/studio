// src/lib/documents/us/lease-renewal-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { LeaseRenewalAgreementSchema } from './schema';
import { leaseRenewalAgreementQuestions } from './questions';

export const leaseRenewalAgreementMeta: LegalDocument = {
  id: 'lease-renewal-agreement',
  jurisdiction: 'US',
  category: 'Real Estate',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 7.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/lease-renewal-agreement.md',
    es: '/templates/es/lease-renewal-agreement.md',
  },
  schema: LeaseRenewalAgreementSchema,
  questions: leaseRenewalAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Lease Renewal Agreement',
      description:
        'Extend your existing lease with updated terms and conditions.',
      aliases: ['lease extension', 'rental renewal', 'lease continuation'],
    },
    es: {
      name: 'Acuerdo de Renovación de Arrendamiento',
      description:
        'Extiende tu arrendamiento existente con términos y condiciones actualizados.',
      aliases: ['extensión de arrendamiento', 'renovación de alquiler'],
    },
  },
};
