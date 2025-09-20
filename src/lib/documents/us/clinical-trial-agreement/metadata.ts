// src/lib/documents/us/clinical-trial-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { ClinicalTrialAgreementSchema } from './schema';
import { clinicalTrialAgreementQuestions } from './questions';

export const clinicalTrialAgreementMeta: LegalDocument = {
  id: 'clinical-trial-agreement',
  jurisdiction: 'US',
  category: 'Healthcare & Medical',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 39.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/clinical-trial-agreement.md',
    es: '/templates/es/clinical-trial-agreement.md',
  },
  schema: ClinicalTrialAgreementSchema,
  questions: clinicalTrialAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Clinical Trial Agreement',
      description:
        'Agreement for conducting clinical trials and medical research studies.',
      aliases: [
        'research study agreement',
        'clinical research contract',
        'trial participation agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Ensayo Clínico',
      description:
        'Participa en investigación médica con protección legal completa. Asegura compensación justa y acceso a tratamientos innovadores.',
      aliases: [
        'contrato de investigación clínica',
        'acuerdo de estudio médico',
        'acuerdo de participación en el juicio',
      ],
    },
  },
};
