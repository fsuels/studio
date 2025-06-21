// src/lib/documents/us/notarization-request/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { NotarizationRequestSchema } from './schema';
import { notarizationRequestQuestions } from './questions';

export const notarizationRequestMeta: LegalDocument = {
  id: 'notarization-request',
  jurisdiction: 'US',
  category: 'Government & Legal Services',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 5.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/notarization-request.md',
    es: '/templates/es/notarization-request.md',
  },
  schema: NotarizationRequestSchema,
  questions: notarizationRequestQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Notarization Request',
      description:
        'Form to request notarial services for document authentication.',
      aliases: [
        'notary request',
        'document notarization',
        'notarial certificate',
      ],
    },
    es: {
      name: 'Solicitud de Notarización',
      description:
        'Formulario para solicitar servicios notariales para autenticación de documentos.',
      aliases: ['solicitud notarial', 'notarización de documento'],
    },
  },
};
