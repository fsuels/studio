// src/lib/documents/us/healthcare-power-of-attorney/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { schema } from './schema';
import { questions } from './questions';

export const healthcarePowerOfAttorneyMeta: LegalDocument = {
  id: 'healthcare-power-of-attorney',
  jurisdiction: 'US',
  category: 'Personal',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 12,
  states: 'all',
  templatePaths: {
    en: '/templates/en/healthcare-power-of-attorney.md',
    es: '/templates/es/healthcare-power-of-attorney.md',
  },
  schema,
  questions: questions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Healthcare Power of Attorney',
      description:
        'Appoint an agent to make healthcare decisions if you cannot.',
      aliases: [
        'medical poa',
        'healthcare proxy',
        'appoint agent for health',
        'medical decisions',
      ],
    },
    es: {
      name: 'Poder Notarial para Atención Médica',
      description:
        'Nombrar un agente para tomar decisiones de atención médica si usted no puede.',
      aliases: [
        'poder médico',
        'proxy de salud',
        'designar agente de salud',
        'decisiones médicas',
      ],
    },
  },
};
