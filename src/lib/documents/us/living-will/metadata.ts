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
    en: "en/us/living-will.md", 
    es: "es/us/living-will.md" 
  },
  upsellClauses: [],
  translations: {
    en: {
      name: 'Living Will / Advance Directive',
      description: 'Specify your wishes for end-of-life medical care.',
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
        'Especificar sus deseos para la atención médica al final de la vida.',
      aliases: [
        'deseos médicos',
        'directiva anticipada',
        'soporte vital',
        'fin de vida',
      ],
    },
  },
};