// src/lib/documents/us/contract-termination-letter/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { contractTerminationLetterSchema } from './schema';
import { contractTerminationLetterQuestions } from './questions';

export const contractTerminationLetterMeta: Omit<
  LegalDocument,
  'schema' | 'questions'
> = {
  id: 'contract-termination-letter',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 15,
  states: 'all',
  templatePaths: {
    en: '/templates/en/contract-termination-letter.md',
    es: '/templates/es/contract-termination-letter.md',
  },
  upsellClauses: [],
  translations: {
    en: {
      name: 'Contract Termination Letter',
      description:
        'Formally terminate a contract with proper notice and documentation.',
      aliases: [
        'termination notice',
        'contract cancellation',
        'agreement termination',
      ],
    },
    es: {
      name: 'Carta de Terminación de Contrato',
      description:
        'Cancela un contrato existente de manera legal y profesional. Evita problemas legales al terminar acuerdos comerciales.',
      aliases: [
        'aviso de terminación',
        'cancelación de contrato',
        'terminación de acuerdo',
      ],
    },
  },
};
