// src/lib/documents/us/arbitration-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { ArbitrationAgreementSchema } from './schema';
import { arbitrationAgreementQuestions } from './questions';

export const arbitrationAgreementMeta: LegalDocument = {
  id: 'arbitration-agreement',
  jurisdiction: 'US',
  category: 'Dispute Resolution',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 9.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/arbitration-agreement.md',
    es: '/templates/es/arbitration-agreement.md',
  },
  schema: ArbitrationAgreementSchema,
  questions: arbitrationAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Arbitration Agreement',
      description:
        'Agreement requiring disputes to be resolved through arbitration instead of court litigation.',
      aliases: [
        'binding arbitration agreement',
        'dispute resolution agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Arbitraje',
      description:
        'Resuelve disputas a través de arbitraje en lugar de corte. Forma más rápida y menos costosa de resolver desacuerdos comerciales.',
      aliases: [
        'acuerdo de arbitraje vinculante',
        'acuerdo de resolución de disputas',
      ],
    },
  },
};
