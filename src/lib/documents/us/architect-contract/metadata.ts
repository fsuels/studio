// src/lib/documents/us/architect-contract/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { ArchitectContractSchema } from './schema';
import { architectContractQuestions } from './questions';

export const architectContractMeta: LegalDocument = {
  id: 'architect-contract',
  jurisdiction: 'US',
  category: 'Construction',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 34.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/architect-contract.md',
    es: '/templates/es/architect-contract.md',
  },
  schema: ArchitectContractSchema,
  questions: architectContractQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Architect Services Contract',
      description:
        'Professional services agreement for architectural design, planning, and construction administration.',
      aliases: [
        'architectural services agreement',
        'design professional contract',
        'architect agreement',
      ],
    },
    es: {
      name: 'Contrato de Servicios de Arquitecto',
      description:
        'Asegura un diseño profesional que cumpla tus expectativas y presupuesto. Protege tu inversión con términos claros sobre cambios y responsabilidades.',
      aliases: [
        'acuerdo de servicios arquitectónicos',
        'contrato de profesional de diseño',
        'acuerdo de arquitecto',
      ],
    },
  },
};
