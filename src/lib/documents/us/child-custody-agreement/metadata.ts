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
        'Outline legal/physical custody, visitation schedule for children.',
      aliases: ['child custody', 'custody battle', 'parenting plan'],
    },
    es: {
      name: 'Acuerdo de Custodia de Menores',
      description:
        'Define quién tiene custodia de los hijos después del divorcio. Establece horarios de visita, vacaciones y cómo tomar decisiones importantes.',
      aliases: ['custodia de hijos', 'batalla por custodia', 'plan de crianza'],
    },
  },
};
