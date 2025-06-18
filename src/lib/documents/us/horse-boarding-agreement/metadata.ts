// src/lib/documents/us/horse-boarding-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { HorseBoardingAgreementSchema } from './schema';
import { horseBoardingAgreementQuestions } from './questions';

export const horseBoardingAgreementMeta: LegalDocument = {
  id: 'horse-boarding-agreement',
  jurisdiction: 'US',
  category: 'Agriculture & Farming',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 18.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/horse-boarding-agreement.md',
    es: '/templates/es/horse-boarding-agreement.md',
  },
  schema: HorseBoardingAgreementSchema,
  questions: horseBoardingAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Horse Boarding Agreement',
      description: 'Agreement for horse boarding and stable services.',
      aliases: ['stable boarding', 'equine boarding', 'horse care agreement'],
    },
    es: {
      name: 'Acuerdo de Pensión de Caballos',
      description: 'Acuerdo para pensión de caballos y servicios de establo.',
      aliases: ['pensión de caballos', 'cuidado equino'],
    },
  },
};