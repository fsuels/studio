export const metadata = {
  id: 'living-trust-amendment',
  jurisdiction: 'US',
  category: 'Estate Planning',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 12,
  states: 'all',
  templatePaths: {
    en: 'en/us/living-trust-amendment.md',
    es: 'es/us/living-trust-amendment.md',
  },
  upsellClauses: [],
  translations: {
    en: {
      name: 'Living Trust Amendment',
      description:
        'Modify or update the terms of your existing revocable living trust without creating a new trust.',
      aliases: [
        'trust amendment',
        'modify trust',
        'update trust',
        'trust modification',
      ],
    },
    es: {
      name: 'Enmienda al Fideicomiso en Vida',
      description:
        'Modificar o actualizar los términos de su fideicomiso en vida revocable existente sin crear un nuevo fideicomiso.',
      aliases: [
        'enmienda fideicomiso',
        'modificar fideicomiso',
        'actualizar fideicomiso',
        'modificación de confianza',
      ],
    },
  },
};
