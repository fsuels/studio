import type { LegalDocument } from '@/types/documents';
import { affidavitSchema } from './schema';
import { affidavitQuestions } from './questions';

export const affidavitMeta: LegalDocument = {
  id: 'affidavit',
  jurisdiction: 'US',
  category: 'Personal',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 5.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/affidavit-general.md',
    es: '/templates/es/affidavit-general.md',
  },
  schema: affidavitSchema,
  questions: affidavitQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'General Affidavit',
      description:
        'Provide legally binding testimony for court cases and official proceedings. Strengthen your case with sworn statements.',
      aliases: [
        'sworn statement',
        'sworn declaration',
        'statement under oath',
        'legal affidavit',
      ],
    },
    es: {
      name: 'Declaración Jurada General',
      description:
        'Acelera trámites legales y burocráticos con declaraciones juradas oficiales. Evita comparecencias innecesarias en cortes y oficinas gubernamentales.',
      aliases: [
        'declaración jurada',
        'declaración bajo juramento',
        'afidávit legal',
      ],
    },
  },
};
