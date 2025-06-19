export const metadata = {
  id: 'medical-power-of-attorney',
  jurisdiction: 'US',
  category: 'Estate Planning',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 10,
  states: 'all',
  templatePaths: { 
    en: "en/us/medical-power-of-attorney.md", 
    es: "es/us/medical-power-of-attorney.md" 
  },
  upsellClauses: [],
  translations: {
    en: {
      name: 'Medical Power of Attorney',
      description:
        'Authorize someone to make comprehensive medical decisions on your behalf when you are unable to do so.',
      aliases: ['medical poa', 'healthcare agent', 'medical proxy', 'healthcare surrogate'],
    },
    es: {
      name: 'Poder Notarial Médico',
      description:
        'Autorizar a alguien para tomar decisiones médicas integrales en su nombre cuando usted no pueda hacerlo.',
      aliases: ['poder médico', 'agente de salud', 'representante médico', 'sustituto de atención médica'],
    },
  },
};