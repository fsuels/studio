// src/lib/documents/us/patent-application-assignment/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { PatentApplicationAssignmentSchema } from './schema';
import { patentApplicationAssignmentQuestions } from './questions';

export const patentApplicationAssignmentMeta: LegalDocument = {
  id: 'patent-application-assignment',
  jurisdiction: 'US',
  category: 'Intellectual Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: true,
  offerNotarization: true,
  offerRecordingHelp: true,
  basePrice: 22,
  states: 'all',
  templatePaths: {
    en: '/templates/en/patent-application-assignment.md',
    es: '/templates/es/patent-application-assignment.md',
  },
  schema: PatentApplicationAssignmentSchema,
  questions: patentApplicationAssignmentQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Patent Application Assignment Agreement',
      description:
        'Legal document to transfer patent application rights from one party to another.',
      aliases: [
        'patent app assignment',
        'application transfer',
        'patent application transfer',
        'patent rights assignment',
      ],
    },
    es: {
      name: 'Acuerdo de Asignación de Solicitud de Patente',
      description:
        'Documento legal para transferir los derechos de solicitud de patente de una parte a otra.',
      aliases: [
        'asignación solicitud patente',
        'transferencia aplicación',
        'transferencia solicitud patente',
        'asignación derechos patente',
      ],
    },
  },
};
