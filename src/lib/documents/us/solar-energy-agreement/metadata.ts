// src/lib/documents/us/solar-energy-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { SolarEnergyAgreementSchema } from './schema';
import { solarEnergyAgreementQuestions } from './questions';

export const solarEnergyAgreementMeta: LegalDocument = {
  id: 'solar-energy-agreement',
  jurisdiction: 'US',
  category: 'Environmental & Energy',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 34.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/solar-energy-agreement.md',
    es: '/templates/es/solar-energy-agreement.md',
  },
  schema: SolarEnergyAgreementSchema,
  questions: solarEnergyAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Solar Energy Agreement',
      description:
        'Agreement for solar panel installation and energy services.',
      aliases: [
        'solar installation contract',
        'solar power agreement',
        'photovoltaic contract',
      ],
    },
    es: {
      name: 'Acuerdo de Energía Solar',
      description:
        'Acuerdo para instalación de paneles solares y servicios energéticos.',
      aliases: [
        'contrato de instalación solar',
        'acuerdo fotovoltaico',
        'contrato fotovoltaico',
      ],
    },
  },
};
