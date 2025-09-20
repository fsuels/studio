export const metadata = {
  id: 'pour-over-will',
  jurisdiction: 'US',
  category: 'Estate Planning',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 15,
  states: 'all',
  templatePaths: {
    en: 'en/us/pour-over-will.md',
    es: 'es/us/pour-over-will.md',
  },
  upsellClauses: [],
  translations: {
    en: {
      name: 'Pour-Over Will',
      description:
        'A will that transfers assets to your existing trust, ensuring trust administration of all assets.',
      aliases: [
        'trust will',
        'pour over will',
        'trust transfer will',
        'estate planning will',
      ],
    },
    es: {
      name: 'Testamento de Transferencia',
      description:
        'Un testamento que transfiere activos a su fideicomiso existente, asegurando la administración fiduciaria de todos los activos.',
      aliases: [
        'testamento fideicomiso',
        'testamento de transferencia',
        'testamento de administración',
        'planificación patrimonial will',
      ],
    },
  },
};
