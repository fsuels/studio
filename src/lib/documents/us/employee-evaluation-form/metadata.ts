// src/lib/documents/us/employee-evaluation-form/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { EmployeeEvaluationFormSchema } from './schema';
import { employeeEvaluationFormQuestions } from './questions';

export const employeeEvaluationFormMeta: LegalDocument = {
  id: 'employee-evaluation-form',
  jurisdiction: 'US',
  category: 'Employment',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 8.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/employee-evaluation-form.md',
    es: '/templates/es/employee-evaluation-form.md',
  },
  schema: EmployeeEvaluationFormSchema,
  questions: employeeEvaluationFormQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Employee Evaluation Form',
      description:
        'Comprehensive employee performance evaluation and review form.',
      aliases: ['performance review', 'employee assessment', 'annual review'],
    },
    es: {
      name: 'Formulario de Evaluación de Empleado',
      description:
        'Formulario integral de evaluación y revisión del desempeño del empleado.',
      aliases: ['revisión de desempeño', 'evaluación anual'],
    },
  },
};
