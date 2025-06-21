// src/lib/documents/us/cohabitation-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { CohabitationAgreementSchema } from './schema';
import { cohabitationAgreementQuestions } from './questions';

export const cohabitationAgreementMeta: LegalDocument = {
  id: 'cohabitation-agreement',
  jurisdiction: 'US',
  category: 'Family & Personal',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 29.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/cohabitation-agreement.md',
    es: '/templates/es/cohabitation-agreement.md',
  },
  schema: CohabitationAgreementSchema,
  questions: cohabitationAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Cohabitation Agreement',
      description:
        'Create a legally binding cohabitation agreement for unmarried couples living together to define rights and responsibilities.',
      aliases: [
        'domestic partnership agreement',
        'living together agreement',
        'unmarried couple agreement',
        'common law agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Cohabitación',
      description:
        'Crea un acuerdo de cohabitación legalmente válido para parejas no casadas que viven juntas.',
      aliases: [
        'acuerdo de pareja de hecho',
        'acuerdo de convivencia',
        'acuerdo de unión libre',
      ],
    },
  },
};
