// src/lib/documents/us/office-space-lease/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { OfficeSpaceLeaseSchema } from './schema';
import { officeSpaceLeaseQuestions } from './questions';

export const officeSpaceLeaseMeta: LegalDocument = {
  id: 'office-space-lease',
  jurisdiction: 'US',
  category: 'Business & Commercial',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 39.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/office-space-lease.md',
    es: '/templates/es/office-space-lease.md',
  },
  schema: OfficeSpaceLeaseSchema,
  questions: officeSpaceLeaseQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Office Space Lease',
      description: 'Commercial lease agreement specifically for office spaces',
      aliases: [],
    },
    es: {
      name: 'Contrato de arrendamiento de oficina',
      description: 'Contrato de arrendamiento comercial específico para espacios de oficina.',
      aliases: [],
    },
  },
};
