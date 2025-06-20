export const metadata = {
  id: 'last-will-testament',
  jurisdiction: 'US',
  category: 'Estate Planning',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 7,
  states: 'all',
  templatePaths: {
    en: 'en/us/last-will-testament.md',
    es: 'es/us/last-will-testament.md',
  },
  upsellClauses: [],
  translations: {
    en: {
      name: 'Last Will and Testament',
      description: 'Specify how your assets should be distributed after death.',
      aliases: ['will', 'inheritance', 'distribute assets'],
    },
    es: {
      name: 'Última Voluntad y Testamento',
      description:
        'Especificar cómo deben distribuirse sus bienes después de la muerte.',
      aliases: ['testamento', 'herencia', 'distribuir bienes'],
    },
  },
};
