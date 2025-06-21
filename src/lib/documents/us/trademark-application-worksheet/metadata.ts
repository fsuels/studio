// src/lib/documents/us/trademark-application-worksheet/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { TrademarkApplicationWorksheetSchema } from './schema';
import { trademarkApplicationWorksheetQuestions } from './questions';

export const trademarkApplicationWorksheetMeta: LegalDocument = {
  id: 'trademark-application-worksheet',
  jurisdiction: 'US',
  category: 'Intellectual Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 15,
  states: 'all',
  templatePaths: {
    en: '/templates/en/trademark-application-worksheet.md',
    es: '/templates/es/trademark-application-worksheet.md',
  },
  schema: TrademarkApplicationWorksheetSchema,
  questions: trademarkApplicationWorksheetQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Trademark Application Worksheet',
      description:
        'Comprehensive preparation document for USPTO trademark application filing.',
      aliases: [
        'trademark prep',
        'trademark application prep',
        'uspto worksheet',
        'trademark filing prep',
      ],
    },
    es: {
      name: 'Hoja de Trabajo para Solicitud de Marca Registrada',
      description:
        'Documento integral de preparación para la presentación de solicitud de marca registrada USPTO.',
      aliases: [
        'prep de marca',
        'preparación solicitud marca',
        'hoja trabajo uspto',
        'prep presentación marca',
      ],
    },
  },
};
