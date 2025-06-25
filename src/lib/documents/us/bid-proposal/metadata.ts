// src/lib/documents/us/bid-proposal/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { bidproposalSchema } from './schema';
import { bidproposalQuestions } from './questions';

export const bidproposalMeta: LegalDocument = {
  id: 'bid-proposal',
  jurisdiction: 'US',
  category: 'Construction',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 24.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/bid-proposal.md',
    es: '/templates/es/bid-proposal.md',
  },
  schema: bidproposalSchema,
  questions: bidproposalQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Bid Proposal',
      description:
        'Professional contractor bid proposal for construction projects with detailed pricing and terms.',
      aliases: ['construction bid', 'contractor proposal', 'project bid'],
    },
    es: {
      name: 'Propuesta de Oferta',
      description:
        'Presenta ofertas competitivas para ganar contratos de construcción. Formato profesional que incluye precios detallados y cronogramas de trabajo.',
      aliases: ['oferta de construcción', 'propuesta de contratista'],
    },
  },
};
