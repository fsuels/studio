// src/lib/documents/us/cybersecurity-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { CybersecurityAgreementSchema } from './schema';
import { cybersecurityAgreementQuestions } from './questions';

export const cybersecurityAgreementMeta: LegalDocument = {
  id: 'cybersecurity-agreement',
  jurisdiction: 'US',
  category: 'Technology & IT',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 21.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/cybersecurity-agreement.md',
    es: '/templates/es/cybersecurity-agreement.md',
  },
  schema: CybersecurityAgreementSchema,
  questions: cybersecurityAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Cybersecurity Agreement',
      description: 'Agreement for cybersecurity services and protection.',
      aliases: ['IT security agreement', 'information security contract'],
    },
    es: {
      name: 'Acuerdo de Ciberseguridad',
      description: 'Contrata servicios para proteger tu negocio de hackers y ataques cibernéticos. Define responsabilidades y protocolos de seguridad.',
      aliases: ['acuerdo de seguridad IT', 'contrato de seguridad informática'],
    },
  },
};
