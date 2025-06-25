// src/lib/documents/us/child-custody-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { ChildCustodyAgreementSchema } from './schema';
import { childCustodyAgreementQuestions } from './questions';

export const childCustodyAgreementMeta: LegalDocument = {
  id: 'child-custody-agreement',
  jurisdiction: 'US',
  category: 'Family',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: true,
  offerNotarization: true,
  offerRecordingHelp: true,
  basePrice: 7,
  states: 'all',
  templatePaths: {
    en: '/templates/en/us/child-custody-agreement.md',
    es: '/templates/es/us/child-custody-agreement.md',
  },
  schema: ChildCustodyAgreementSchema,
  questions: childCustodyAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Child Custody Agreement',
      description:
        "Protect your children's wellbeing during family transitions. Establish stable custody arrangements that prioritize their needs.",
      aliases: ['child custody', 'custody battle', 'parenting plan'],
    },
    es: {
      name: 'Acuerdo de Custodia de Menores',
      description:
        'Protege el bienestar de tus hijos y evita conflictos futuros con tu ex pareja. Establece rutinas estables y derechos claros para ambos padres.',
      aliases: ['custodia de hijos', 'batalla por custodia', 'plan de crianza'],
    },
  },
};
