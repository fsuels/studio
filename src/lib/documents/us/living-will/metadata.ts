export const metadata = {
  id: 'living-will',
  jurisdiction: 'US',
  category: 'Personal',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 5,
  states: 'all',
  templatePaths: {
    en: 'en/us/living-will.md',
    es: 'es/us/living-will.md',
  },
  upsellClauses: [],
  translations: {
    en: {
      name: 'Living Will / Advance Directive',
      description: 'Control your end-of-life care by documenting specific treatment preferences. Prevent unwanted medical interventions.',
      aliases: [
        'medical wishes',
        'advance directive',
        'life support',
        'end of life',
      ],
    },
    es: {
      name: 'Testamento Vital / Directiva Anticipada',
      description:
        'Dile a los médicos exactamente qué tratamientos médicos quieres o no quieres si estás muriendo o permanentemente inconsciente.',
      aliases: [
        'deseos médicos',
        'directiva anticipada',
        'soporte vital',
        'fin de vida',
      ],
    },
  },
};
