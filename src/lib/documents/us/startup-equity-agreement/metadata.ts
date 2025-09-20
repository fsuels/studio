// src/lib/documents/us/startup-equity-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { StartupEquityAgreementSchema } from './schema';
import { startupEquityAgreementQuestions } from './questions';

export const startupEquityAgreementMeta: LegalDocument = {
  id: 'startup-equity-agreement',
  jurisdiction: 'US',
  category: 'Business & Commercial',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 29.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/startup-equity-agreement.md',
    es: '/templates/es/startup-equity-agreement.md',
  },
  schema: StartupEquityAgreementSchema,
  questions: startupEquityAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Startup Equity Agreement',
      description:
        'Agreement for equity distribution and vesting in startup companies.',
      aliases: [
        'equity split agreement',
        'founder agreement',
        'equity vesting agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Participación en Startup',
      description:
        'Acuerdo para distribución de participaciones en empresas emergentes.',
      aliases: [
        'acuerdo de fundadores',
        'contrato de participación',
        'acuerdo de adjudicación de capital',
      ],
    },
  },
};
