export const metadata = {
  id: 'lease-agreement',
  jurisdiction: 'US',
  category: 'Real Estate',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: true,
  offerNotarization: false,
  offerRecordingHelp: true,
  basePrice: 5,
  states: 'all',
  templatePaths: {
    en: 'en/us/lease-agreement.md',
    es: 'es/us/lease-agreement.md',
  },
  upsellClauses: [],
  translations: {
    en: {
      name: 'Residential Lease Agreement',
      description: 'Set terms for renting a residential property.',
      aliases: ['rent apartment', 'tenant', 'lease form', 'landlord agreement'],
    },
    es: {
      name: 'Contrato de Arrendamiento Residencial',
      description:
        'Alquila tu propiedad o renta un lugar para vivir. Establece la renta mensual, reglas y responsabilidades para ambos propietario e inquilino.',
      aliases: [
        'alquiler de apartamento',
        'inquilino',
        'formulario de arrendamiento',
        'acuerdo de propietario',
      ],
    },
  },
};
