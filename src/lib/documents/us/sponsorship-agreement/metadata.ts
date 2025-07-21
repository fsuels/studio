// src/lib/documents/us/sponsorship-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { SponsorshipAgreementSchema } from './schema';
import { sponsorshipAgreementQuestions } from './questions';

export const sponsorshipAgreementMeta: LegalDocument = {
  id: 'sponsorship-agreement',
  jurisdiction: 'US',
  category: 'Marketing & Advertising',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 16.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/sponsorship-agreement.md',
    es: '/templates/es/sponsorship-agreement.md',
  },
  schema: SponsorshipAgreementSchema,
  questions: sponsorshipAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Sponsorship Agreement',
      description: 'Agreement for event, sports, or business sponsorships.',
      aliases: ['sponsor contract', 'sponsorship deal'],
    },
    es: {
      name: 'Acuerdo de Patrocinio',
      description: 'Acuerdo para patrocinios de eventos, deportes o negocios.',
      aliases: ['contrato de patrocinio'],
    },
  },
};
