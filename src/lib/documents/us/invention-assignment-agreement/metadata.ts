// src/lib/documents/us/invention-assignment-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { InventionAssignmentAgreementSchema } from './schema';
import { inventionAssignmentAgreementQuestions } from './questions';

export const inventionAssignmentAgreementMeta: LegalDocument = {
  id: 'invention-assignment-agreement',
  jurisdiction: 'US',
  category: 'Intellectual Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 20,
  states: 'all',
  templatePaths: {
    en: '/templates/en/invention-assignment-agreement.md',
    es: '/templates/es/invention-assignment-agreement.md',
  },
  schema: InventionAssignmentAgreementSchema,
  questions: inventionAssignmentAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Invention Assignment Agreement',
      description: 'Agreement assigning employee or contractor inventions to the company.',
      aliases: ['employee invention assignment', 'contractor invention agreement', 'invention ownership', 'ip assignment'],
    },
    es: {
      name: 'Acuerdo de Asignación de Invenciones',
      description: 'Acuerdo que asigna las invenciones de empleados o contratistas a la empresa.',
      aliases: ['asignación invenciones empleado', 'acuerdo invenciones contratista', 'propiedad invenciones', 'asignación pi'],
    },
  },
};