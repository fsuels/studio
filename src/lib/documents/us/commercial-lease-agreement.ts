import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';

export const commercialLeaseAgreement: LegalDocument = {
  id: 'commercial-lease-agreement',
  name: 'Commercial Lease Agreement',
  category: 'Real Estate',
  description: 'Lease agreement specifically for commercial properties.',
  translations: {
    en: {
      name: 'Commercial Lease Agreement',
      description: 'Lease agreement specifically for commercial properties.',
    },
    es: {
      name: 'Contrato de Arrendamiento Comercial',
      description:
        'Contrato de arrendamiento específico para propiedades comerciales.',
    },
  },
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: true,
  offerNotarization: false,
  offerRecordingHelp: true,
  basePrice: 7,
  states: 'all',
  schema: z.object({}), // Placeholder
  questions: [], // Placeholder
};
