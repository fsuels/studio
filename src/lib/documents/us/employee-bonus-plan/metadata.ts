// src/lib/documents/us/employee-bonus-plan/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { schema } from './schema';
import { questions } from './questions';

export const employeeBonusPlanMeta: LegalDocument = {
  id: 'employee-bonus-plan',
  jurisdiction: 'US',
  category: 'Employment',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 18,
  states: 'all',
  templatePaths: {
    en: '/templates/en/employee-bonus-plan.md',
    es: '/templates/es/employee-bonus-plan.md',
  },
  schema,
  questions: questions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Employee Bonus Plan',
      description:
        'Structured bonus plan document outlining performance-based compensation and incentive programs.',
      aliases: [
        'incentive plan',
        'performance bonus structure',
        'employee rewards program',
      ],
    },
    es: {
      name: 'Plan de Bonificación de Empleados',
      description:
        'Documento de plan de bonificación estructurado que describe la compensación basada en el rendimiento y los programas de incentivos.',
      aliases: [
        'plan de incentivos',
        'estructura de bonificación por rendimiento',
        'programa de recompensas para empleados',
      ],
    },
  },
};
