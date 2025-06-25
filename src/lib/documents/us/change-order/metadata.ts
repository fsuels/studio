// src/lib/documents/us/change-order/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { ChangeOrderSchema } from './schema';
import { changeOrderQuestions } from './questions';

export const changeOrderMeta: LegalDocument = {
  id: 'change-order',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 9.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/change-order.md',
    es: '/templates/es/change-order.md',
  },
  schema: ChangeOrderSchema,
  questions: changeOrderQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Change Order',
      description:
        'Create a formal change order to modify project scope, timeline, or budget.',
      aliases: ['change order', 'project change request', 'modification order'],
    },
    es: {
      name: 'Orden de Cambio',
      description:
        'Adaptá proyectos a nuevas necesidades sin perder control del presupuesto. Documenta cambios para evitar disputas y sobrecostos inesperados.',
      aliases: [
        'orden de cambio',
        'solicitud de cambio de proyecto',
        'orden de modificación',
      ],
    },
  },
};
