// src/lib/documents/us/progressive-discipline-policy/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { schema } from './schema';
import { questions } from './questions';

export const progressiveDisciplinePolicyMeta: LegalDocument = {
  id: 'progressive-discipline-policy',
  jurisdiction: 'US',
  category: 'HR',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 15,
  states: 'all',
  templatePaths: {
    en: '/templates/en/progressive-discipline-policy.md',
    es: '/templates/es/progressive-discipline-policy.md',
  },
  schema,
  questions: questions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Progressive Discipline Policy',
      description:
        'Comprehensive company policy outlining disciplinary procedures and progressive corrective actions.',
      aliases: [
        'disciplinary policy',
        'employee discipline procedures',
        'corrective action policy',
      ],
    },
    es: {
      name: 'Política de Disciplina Progresiva',
      description:
        'Política integral de la empresa que describe los procedimientos disciplinarios y las acciones correctivas progresivas.',
      aliases: [
        'política disciplinaria',
        'procedimientos de disciplina de empleados',
        'política de acción correctiva',
      ],
    },
  },
};
