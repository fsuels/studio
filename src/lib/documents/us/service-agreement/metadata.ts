// src/lib/documents/us/service-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { serviceAgreementSchema } from './schema';
import { serviceAgreementQuestions } from './questions';

export const serviceAgreementMeta: LegalDocument = {
  id: 'service-agreement',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 15,
  states: 'all',
  templatePaths: {
    en: '/templates/en/service-agreement.md',
    es: '/templates/es/service-agreement.md',
  },
  schema: serviceAgreementSchema,
  questions: serviceAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Service Agreement',
      description: 'Ensure service quality and prevent misunderstandings with providers. Establish clear expectations for deliverables, timelines, and payments.',
      aliases: ['hire services', 'service provider', 'payment terms'],
    },
    es: {
      name: 'Acuerdo de Servicios',
      description:
        'Asegura la calidad del servicio y evita malentendidos con proveedores. Establece expectativas claras sobre entregables, cronogramas y pagos.',
      aliases: [
        'contratar servicios',
        'proveedor de servicios',
        'términos de pago',
      ],
    },
  },
};
