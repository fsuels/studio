import type { LegalDocumentMetadata } from '@/types/documents';

export const prenuptialAgreementMetadata: LegalDocumentMetadata = {
  category: 'Family',
  translations: {
    en: {
      name: 'Prenuptial Agreement',
      description:
        'Agreement made before marriage regarding asset division if divorced.',
      aliases: ['prenup', 'marriage contract', 'before marriage agreement'],
    },
    es: {
      name: 'Acuerdo Prenupcial',
      description:
        'Acuerdo hecho antes del matrimonio sobre la división de bienes en caso de divorcio.',
      aliases: ['prenup', 'contrato matrimonial', 'acuerdo prematrimonial'],
    },
  },
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 7,
  states: 'all',
};