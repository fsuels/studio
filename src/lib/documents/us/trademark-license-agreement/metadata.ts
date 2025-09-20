// src/lib/documents/us/trademark-license-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { TrademarkLicenseAgreementSchema } from './schema';
import { trademarkLicenseAgreementQuestions } from './questions';

export const trademarkLicenseAgreementMeta: LegalDocument = {
  id: 'trademark-license-agreement',
  jurisdiction: 'US',
  category: 'Intellectual Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: true,
  offerNotarization: false,
  offerRecordingHelp: true,
  basePrice: 24.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/trademark-license-agreement.md',
    es: '/templates/es/trademark-license-agreement.md',
  },
  schema: TrademarkLicenseAgreementSchema,
  questions: trademarkLicenseAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Trademark License Agreement',
      description:
        'Agreement granting rights to use trademark and brand names with quality control provisions.',
      aliases: [
        'brand licensing agreement',
        'trademark usage agreement',
        'licensing contract',
      ],
    },
    es: {
      name: 'Acuerdo de Licencia de Marca Registrada',
      description:
        'Acuerdo que otorga derechos para usar marcas registradas y nombres comerciales con control de calidad.',
      aliases: [
        'acuerdo de licencia de marca',
        'contrato de licencia',
        'contrato de licencia legal',
      ],
    },
  },
};
