// src/lib/documents/us/security-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { SecurityAgreementSchema } from './schema';
import { securityAgreementQuestions } from './questions';

export const securityAgreementMeta: LegalDocument = {
  id: 'security-agreement',
  jurisdiction: 'US',
  category: 'Finance',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: true,
  offerNotarization: true,
  offerRecordingHelp: true,
  basePrice: 24.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/security-agreement.md',
    es: '/templates/es/security-agreement.md',
  },
  schema: SecurityAgreementSchema,
  questions: securityAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Security Agreement',
      description:
        'Legal agreement creating a security interest in personal property to secure debt obligations.',
      aliases: [
        'collateral agreement',
        'secured transaction agreement',
        'UCC security agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Garantía',
      description:
        'Acuerdo legal que crea un interés de garantía en propiedad personal para asegurar obligaciones de deuda.',
      aliases: ['acuerdo de colateral', 'acuerdo de transacción garantizada'],
    },
  },
};
