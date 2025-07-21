// src/lib/documents/us/employee-handbook/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { EmployeeHandbookSchema } from './schema';
import { employeeHandbookQuestions } from './questions';

export const employeeHandbookMeta: LegalDocument = {
  id: 'employee-handbook',
  jurisdiction: 'US',
  category: 'Employment',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 19.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/employee-handbook.md',
    es: '/templates/es/employee-handbook.md',
  },
  schema: EmployeeHandbookSchema,
  questions: employeeHandbookQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Employee Handbook',
      description:
        'Comprehensive employee handbook covering policies, procedures, and workplace guidelines.',
      aliases: ['staff handbook', 'employee manual', 'workplace policies'],
    },
    es: {
      name: 'Manual del Empleado',
      description:
        'Manual integral del empleado que cubre políticas, procedimientos y pautas del lugar de trabajo.',
      aliases: ['manual de personal', 'políticas laborales'],
    },
  },
};
