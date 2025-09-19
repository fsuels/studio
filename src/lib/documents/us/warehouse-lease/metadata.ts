// src/lib/documents/us/warehouse-lease/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { WarehouseLeaseSchema } from './schema';
import { warehouseLeaseQuestions } from './questions';

export const warehouseLeaseMeta: LegalDocument = {
  id: 'warehouse-lease',
  jurisdiction: 'US',
  category: 'Business & Commercial',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 42.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/warehouse-lease.md',
    es: '/templates/es/warehouse-lease.md',
  },
  schema: WarehouseLeaseSchema,
  questions: warehouseLeaseQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Warehouse Lease',
      description:
        'Industrial lease agreement for warehouse and storage facilities',
      aliases: [],
    },
    es: {
      name: 'Contrato de arrendamiento de almacén',
      description:
        'Contrato de arrendamiento industrial para almacenes y centros de almacenamiento.',
      aliases: [],
    },
  },
};
