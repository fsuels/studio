// src/lib/documents/us/government-contract-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { GovernmentContractAgreementSchema } from './schema';
import { governmentContractAgreementQuestions } from './questions';

export const governmentContractAgreementMeta: LegalDocument = {
  id: 'government-contract-agreement',
  jurisdiction: 'US',
  category: 'Government & Legal Services',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 44.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/government-contract-agreement.md',
    es: '/templates/es/government-contract-agreement.md',
  },
  schema: GovernmentContractAgreementSchema,
  questions: governmentContractAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Government Contract Agreement',
      description: 'Agreement for providing goods or services to government agencies.',
      aliases: ['federal contract', 'public sector agreement', 'gsa contract'],
    },
    es: {
      name: 'Acuerdo de Contrato Gubernamental',
      description: 'Acuerdo para proporcionar bienes o servicios a agencias gubernamentales.',
      aliases: ['contrato federal', 'acuerdo de sector público'],
    },
  },
};