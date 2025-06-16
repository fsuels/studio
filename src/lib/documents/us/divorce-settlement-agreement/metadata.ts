import type { DocumentMetadata } from '@/types/documents';

export const metadata: DocumentMetadata = {
  id: 'divorce-settlement-agreement',
  jurisdiction: 'US',
  category: 'Family',
  translations: {
    en: {
      name: 'Divorce Settlement Agreement',
      description:
        'Formalizes the terms of a divorce, including property division, support, and custody.',
      aliases: [
        'divorce',
        'separation',
        'end marriage',
        'get divorced',
        'marital settlement',
      ],
    },
    es: {
      name: 'Acuerdo de Divorcio',
      description:
        'Formaliza los términos de un divorcio, incluyendo división de bienes, manutención y custodia.',
      aliases: [
        'divorcio',
        'separación',
        'terminar matrimonio',
        'divorciarse',
        'acuerdo matrimonial',
      ],
    },
  },
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: true,
  offerNotarization: true,
  offerRecordingHelp: true,
  basePrice: 7,
  states: 'all',
  templatePaths: {
    en: '/templates/en/divorce-settlement-agreement.md',
    es: '/templates/es/divorce-settlement-agreement.md',
  },
  upsellClauses: [],
};