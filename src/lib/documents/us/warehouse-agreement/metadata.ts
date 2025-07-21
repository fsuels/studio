// src/lib/documents/us/warehouse-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { WarehouseAgreementSchema } from './schema';
import { warehouseAgreementQuestions } from './questions';

export const warehouseAgreementMeta: LegalDocument = {
  id: 'warehouse-agreement',
  jurisdiction: 'US',
  category: 'Transportation & Automotive',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 29.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/warehouse-agreement.md',
    es: '/templates/es/warehouse-agreement.md',
  },
  schema: WarehouseAgreementSchema,
  questions: warehouseAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Warehouse Agreement',
      description: 'Agreement for warehouse storage and logistics services.',
      aliases: [
        'storage agreement',
        'fulfillment agreement',
        'logistics contract',
      ],
    },
    es: {
      name: 'Acuerdo de Almacén',
      description: 'Acuerdo para servicios de almacenamiento y logística.',
      aliases: ['contrato de almacenamiento', 'acuerdo logístico'],
    },
  },
};
