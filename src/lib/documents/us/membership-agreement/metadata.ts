// src/lib/documents/us/membership-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { MembershipAgreementSchema } from './schema';
import { membershipAgreementQuestions } from './questions';

export const membershipAgreementMeta: LegalDocument = {
  id: 'membership-agreement',
  jurisdiction: 'US',
  category: 'Personal & Lifestyle',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 13.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/membership-agreement.md',
    es: '/templates/es/membership-agreement.md',
  },
  schema: MembershipAgreementSchema,
  questions: membershipAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Membership Agreement',
      description: 'Agreement for club, organization, or service memberships.',
      aliases: ['club membership', 'subscription agreement'],
    },
    es: {
      name: 'Acuerdo de Membresía',
      description: 'Acuerdo para membresías de club, organización o servicio.',
      aliases: ['membresía de club', 'acuerdo de suscripción'],
    },
  },
};
