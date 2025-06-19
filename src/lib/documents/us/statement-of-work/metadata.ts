// src/lib/documents/us/statement-of-work/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { StatementOfWorkSchema } from './schema';
import { statementOfWorkQuestions } from './questions';

export const statementOfWorkMeta: LegalDocument = {
  id: 'statement-of-work',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 11.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/statement-of-work.md',
    es: '/templates/es/statement-of-work.md',
  },
  schema: StatementOfWorkSchema,
  questions: statementOfWorkQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Statement of Work (SOW)',
      description: 'Create a detailed SOW defining project scope, deliverables, and timeline.',
      aliases: ['SOW', 'statement of work', 'project scope', 'work order'],
    },
    es: {
      name: 'Declaración de Trabajo (SOW)',
      description: 'Crea un SOW detallado que defina el alcance del proyecto, entregables y cronograma.',
      aliases: ['SOW', 'declaración de trabajo', 'alcance del proyecto', 'orden de trabajo'],
    },
  },
};