// src/lib/documents/us/construction-management-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { constructionmanagementagreementSchema } from './schema';
import { constructionmanagementagreementQuestions } from './questions';

export const constructionmanagementagreementMeta: LegalDocument = {
  id: 'construction-management-agreement',
  jurisdiction: 'US',
  category: 'Construction',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 39.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/construction-management-agreement.md',
    es: '/templates/es/construction-management-agreement.md',
  },
  schema: constructionmanagementagreementSchema,
  questions: constructionmanagementagreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Construction Management Agreement',
      description:
        'Professional construction management services agreement between owner and construction manager.',
      aliases: [
        'CM agreement',
        'construction manager contract',
        'project management agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Gestión de Construcción',
      description:
        'Acuerdo de servicios profesionales de gestión de construcción entre propietario y gestor de construcción.',
      aliases: [
        'acuerdo de gestión de construcción',
        'contrato de gestor de construcción',
      ],
    },
  },
};
