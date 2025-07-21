// src/lib/documents/us/lease-termination-letter/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { LeaseTerminationLetterSchema } from './schema';
import { leaseTerminationLetterQuestions } from './questions';

export const leaseTerminationLetterMeta: LegalDocument = {
  id: 'lease-termination-letter',
  jurisdiction: 'US',
  category: 'Real Estate',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 5.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/lease-termination-letter.md',
    es: '/templates/es/lease-termination-letter.md',
  },
  schema: LeaseTerminationLetterSchema,
  questions: leaseTerminationLetterQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Lease Termination Letter',
      description:
        'Formally notify your landlord or tenant of lease termination.',
      aliases: ['lease notice', 'termination notice', 'end lease letter'],
    },
    es: {
      name: 'Carta de Terminación de Arrendamiento',
      description:
        'Termina tu contrato de renta legalmente. Avisa con anticipación adecuada para evitar problemas y recuperar depósitos.',
      aliases: ['aviso de terminación', 'carta de fin de contrato'],
    },
  },
};
