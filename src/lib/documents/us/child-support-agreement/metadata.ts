// src/lib/documents/us/child-support-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { ChildSupportAgreementSchema } from './schema';
import { childSupportAgreementQuestions } from './questions';

export const childSupportAgreementMeta: LegalDocument = {
  id: 'child-support-agreement',
  jurisdiction: 'US',
  category: 'Family',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: true,
  offerNotarization: true,
  offerRecordingHelp: true,
  basePrice: 19.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/child-support-agreement.md',
    es: '/templates/es/child-support-agreement.md',
  },
  schema: ChildSupportAgreementSchema,
  questions: childSupportAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Child Support Agreement',
      description:
        'Comprehensive agreement establishing child support payment terms and responsibilities.',
      aliases: [
        'child support contract',
        'support payment agreement',
        'custody support agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Manutención Infantil',
      description:
        'Define cuánto dinero se pagará mensualmente para gastos del hijo. Cubre educación, salud, vivienda y gastos extras.',
      aliases: ['contrato de manutención', 'acuerdo de apoyo financiero'],
    },
  },
};
