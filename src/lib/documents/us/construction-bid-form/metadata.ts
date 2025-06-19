// src/lib/documents/us/construction-bid-form/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { constructionbidformSchema } from './schema';
import { constructionbidformQuestions } from './questions';

export const constructionbidformMeta: LegalDocument = {
  id: 'construction-bid-form',
  jurisdiction: 'US',
  category: 'Construction',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 19.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/construction-bid-form.md',
    es: '/templates/es/construction-bid-form.md',
  },
  schema: constructionbidformSchema,
  questions: constructionbidformQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Construction Bid Form',
      description: 'Standardized construction bid form for contractors to submit project bids.',
      aliases: ['bid form', 'contractor bid form', 'project bid form'],
    },
    es: {
      name: 'Formulario de Oferta de Construcción',
      description: 'Formulario estandarizado de oferta de construcción para que los contratistas presenten ofertas de proyectos.',
      aliases: ['formulario de oferta', 'formulario de oferta de contratista'],
    },
  },
};