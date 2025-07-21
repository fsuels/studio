import type { LegalDocument } from '@/types/documents';

export const vendorAgreementMeta: Omit<LegalDocument, 'schema' | 'questions'> =
  {
    id: 'vendor-agreement',
    jurisdiction: 'US',
    category: 'Business',
    languageSupport: ['en', 'es'],
    requiresNotarization: false,
    canBeRecorded: false,
    offerNotarization: false,
    offerRecordingHelp: false,
    basePrice: 25,
    states: 'all',
    templatePaths: {
      en: '/templates/en/vendor-agreement.md',
      es: '/templates/es/vendor-agreement.md',
    },
    upsellClauses: [],
    translations: {
      en: {
        name: 'Vendor Agreement',
        description:
          'Agreement between a company and vendor for the supply of goods or services.',
        aliases: ['Supplier agreement', 'Vendor contract', 'Supply agreement'],
      },
      es: {
        name: 'Acuerdo de Proveedor',
        description:
          'Acuerdo entre una empresa y proveedor para el suministro de bienes o servicios.',
        aliases: [
          'Acuerdo proveedor',
          'Contrato proveedor',
          'Acuerdo suministro',
        ],
      },
    },
  };
