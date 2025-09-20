import { findTranslationParityIssues } from '../../scripts/verify-templates-parity';
import type {
  BilingualTemplateSummary,
  MetadataIndex,
} from '../../scripts/verify-templates-parity';
import type { GeneratedMetadata } from '../lib/documents/manifest.generated';

const buildSummary = (
  language: 'en' | 'es',
  variables: string[],
  sections: string[] = ['1. Section'],
): BilingualTemplateSummary => ({
  documentType: 'test-doc',
  language,
  variables,
  sectionHeadings: sections,
  numberedSections: sections
    .map((heading) => heading.match(/^(\d+(?:\.\d+)*)/))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match) => match[1]),
});

describe('findTranslationParityIssues', () => {
  const baseMetadata: GeneratedMetadata = {
    id: 'test-doc',
    title: 'Test Document',
    description: 'A synthetic document for parity guard testing.',
    category: 'Testing',
    jurisdiction: 'us',
    tags: [],
    aliases: [],
    translations: {
      en: {
        name: 'Test Document',
        description: 'English description',
        aliases: ['alias-en'],
      },
      es: {
        name: 'Documento de Prueba',
        description: 'Descripcion en Espanol',
        aliases: ['alias-es'],
      },
    },
  };

  it('flags missing Spanish templates when metadata expects them', () => {
    const metadataIndex: MetadataIndex = { 'test-doc': baseMetadata };
    const issues = findTranslationParityIssues(
      [buildSummary('en', ['first'])],
      metadataIndex,
    );

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentType: 'test-doc',
          message: expect.stringContaining('Spanish template missing'),
        }),
      ]),
    );
  });

  it('flags variable mismatches across languages', () => {
    const metadataIndex: MetadataIndex = { 'test-doc': baseMetadata };
    const issues = findTranslationParityIssues(
      [
        buildSummary('en', ['one', 'two']),
        buildSummary('es', ['one']),
      ],
      metadataIndex,
    );

    expect(issues.some((issue) => issue.message.includes('Variable parity mismatch'))).toBe(
      true,
    );
  });

  it('flags metadata alias count mismatches', () => {
    const metadataWithAliasMismatch: GeneratedMetadata = {
      ...baseMetadata,
      translations: {
        en: {
          ...baseMetadata.translations.en,
          aliases: ['alias-en'],
        },
        es: {
          ...baseMetadata.translations.es,
          aliases: ['alias-es', 'alias-extra'],
        },
      },
    };
    const metadataIndex: MetadataIndex = { 'test-doc': metadataWithAliasMismatch };

    const issues = findTranslationParityIssues(
      [
        buildSummary('en', ['one']),
        buildSummary('es', ['one']),
      ],
      metadataIndex,
    );

    expect(issues.some((issue) => issue.message.includes('Metadata alias count mismatch'))).toBe(
      true,
    );
  });
});
