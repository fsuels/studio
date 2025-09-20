export const metadata = {
  id: 'education-trust',
  jurisdiction: 'US',
  category: 'Estate Planning',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 20,
  states: 'all',
  templatePaths: {
    en: 'en/us/education-trust.md',
    es: 'es/us/education-trust.md',
  },
  upsellClauses: [],
  translations: {
    en: {
      name: 'Education Trust',
      description:
        'Secure your children\'s educational future while saving on taxes with a dedicated trust fund for school expenses.',
      aliases: [
        'educational trust',
        'tuition trust',
        'scholarship trust',
        '529 trust alternative',
      ],
    },
    es: {
      name: 'Fideicomiso Educativo',
      description:
        'Un fideicomiso especializado diseñado para financiar gastos educativos para beneficiarios con ventajas fiscales.',
      aliases: [
        'fideicomiso educacional',
        'fideicomiso de matrícula',
        'fideicomiso de beca',
        '529 alternativa de confianza',
      ],
    },
  },
};
