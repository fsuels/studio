// src/lib/documents/us/advance-directive/metadata.ts
import type { LegalDocument } from '@/types/documents';

export const advanceDirectiveMeta: Omit<LegalDocument, 'schema' | 'questions'> =
  {
    id: 'advance-directive',
    jurisdiction: 'US',
    category: 'Estate Planning',
    languageSupport: ['en', 'es'],
    requiresNotarization: true,
    canBeRecorded: false,
    offerNotarization: true,
    offerRecordingHelp: false,
    basePrice: 15,
    states: 'all',
    templatePaths: {
      en: '/templates/en/advance-directive.md',
      es: '/templates/es/advance-directive.md',
    },
    upsellClauses: [],
    translations: {
      en: {
        name: 'Advance Directive',
        description:
          'Create a comprehensive advance healthcare directive to specify your medical treatment preferences and appoint a healthcare agent.',
        aliases: [
          'advance healthcare directive',
          'living will with healthcare proxy',
          'medical directive',
          'healthcare power of attorney with living will',
          'advance medical directive',
          'healthcare decisions document',
        ],
      },
      es: {
        name: 'Directiva Médica Anticipada',
        description:
          'Dile a los médicos tus deseos médicos si no puedes hablar por ti mismo. Cubre soporte vital, tubos de alimentación y cuidado al final de la vida.',
        aliases: [
          'directiva de atención médica anticipada',
          'testamento vital con poder médico',
          'directiva médica',
          'poder para atención médica con testamento vital',
          'directiva médica anticipada',
          'documento de decisiones médicas',
        ],
      },
    },
  };
