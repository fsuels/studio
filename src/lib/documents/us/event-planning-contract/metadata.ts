// src/lib/documents/us/event-planning-contract/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { EventPlanningContractSchema } from './schema';
import { eventPlanningContractQuestions } from './questions';

export const eventPlanningContractMeta: LegalDocument = {
  id: 'event-planning-contract',
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
    en: '/templates/en/event-planning-contract.md',
    es: '/templates/es/event-planning-contract.md',
  },
  schema: EventPlanningContractSchema,
  questions: eventPlanningContractQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Event Planning Contract',
      description:
        'Contract between event planner and client for event planning services.',
      aliases: [
        'event planner agreement',
        'party planning contract',
        'wedding planning contract',
      ],
    },
    es: {
      name: 'Contrato de Planificación de Eventos',
      description:
        'Contrato entre planificador de eventos y cliente para servicios de planificación.',
      aliases: [
        'acuerdo de planificador de eventos',
        'contrato de planificación de bodas',
        'contrato de planificación de bodas legal',
      ],
    },
  },
};
