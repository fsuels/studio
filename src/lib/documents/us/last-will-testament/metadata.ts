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
      description: "Secure your family's future by controlling how your assets are distributed. Prevent family conflicts and legal complications.",
      aliases: ['will', 'inheritance', 'distribute assets'],
    },
    es: {
      name: 'Última Voluntad y Testamento',
      description:
        'Controla quién obtiene tu propiedad y posesiones después de que mueras. Documento esencial para proteger el futuro de tu familia.',
      aliases: ['testamento', 'herencia', 'distribuir bienes'],
    },
  },
};