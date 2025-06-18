// src/lib/documents/us/mediation-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { MediationAgreementSchema } from './schema';
import { mediationAgreementQuestions } from './questions';

export const mediationAgreementMeta: LegalDocument = {
  id: 'mediation-agreement',
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
    en: '/templates/en/mediation-agreement.md',
    es: '/templates/es/mediation-agreement.md',
  },
  schema: MediationAgreementSchema,
  questions: mediationAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Mediation Agreement',
      description: 'Agreement to resolve disputes through mediation with the help of a neutral mediator.',
      aliases: ['dispute mediation agreement', 'alternative dispute resolution agreement'],
    },
    es: {
      name: 'Acuerdo de Mediación',
      description: 'Acuerdo para resolver disputas a través de mediación con la ayuda de un mediador neutral.',
      aliases: ['acuerdo de mediación de disputas', 'acuerdo de resolución alternativa'],
    },
  },
};