export const metadata = {
  id: 'health-care-directive',
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
    en: 'en/us/health-care-directive.md',
    es: 'es/us/health-care-directive.md',
  },
  upsellClauses: [],
  translations: {
    en: {
      name: 'Healthcare Directive (Advance Directive)',
      description:
        'Document your healthcare wishes and treatment preferences for situations when you cannot communicate them yourself.',
      aliases: [
        'advance directive',
        'healthcare directive',
        'medical directive',
        'treatment directive',
      ],
    },
    es: {
      name: 'Directiva de Atención Médica (Directiva Anticipada)',
      description:
        'Documente sus deseos de atención médica y preferencias de tratamiento para situaciones cuando no pueda comunicarlos usted mismo.',
      aliases: [
        'directiva anticipada',
        'directiva médica',
        'directiva de tratamiento',
        'directiva de tratamiento legal',
      ],
    },
  },
};
