import type { GeneratedMetadata } from '../src/lib/documents/manifest.generated';

export interface BilingualTemplateSummary {
  documentType: string;
  language: string;
  variables: string[];
  sectionHeadings: string[];
  numberedSections: string[];
}

export type MetadataIndex = Record<string, GeneratedMetadata>;

export type ParityIssue = {
  documentType: string;
  affectedLanguages: string[];
  message: string;
};

const SUPPORTED_LANGUAGES = new Set(['en', 'es']);

const METADATA_ALIASES: Record<string, string> = {
  'bill-of-sale-vehicle': 'vehicle-bill-of-sale',
};

const CRITICAL_PARITY_VARIABLES: Record<string, string[]> = {
  'advance-directive': [
    'witness_one_name',
    'witness_one_signature_date',
    'witness_two_name',
    'witness_two_signature_date',
    'notary_state',
    'notary_county',
    'notary_date',
    'notary_commission_expiration',
  ],
};

const arraysEqual = (a: string[], b: string[]): boolean =>
  a.length === b.length && a.every((value, index) => value === b[index]);

export function findTranslationParityIssues(
  results: BilingualTemplateSummary[],
  metadataIndex: MetadataIndex,
): ParityIssue[] {
  const issues: ParityIssue[] = [];
  const byDocument = new Map<string, Map<string, BilingualTemplateSummary>>();

  for (const summary of results) {
    if (!SUPPORTED_LANGUAGES.has(summary.language)) continue;
    if (!byDocument.has(summary.documentType)) {
      byDocument.set(summary.documentType, new Map());
    }
    byDocument.get(summary.documentType)!.set(summary.language, summary);
  }

  for (const [documentType, languageMap] of byDocument.entries()) {
    const metadataKey = METADATA_ALIASES[documentType] ?? documentType;
    const metadata = metadataIndex[metadataKey];

    if (!metadata) {
      issues.push({
        documentType,
        affectedLanguages: Array.from(languageMap.keys()),
        message: `Metadata entry missing for document "${documentType}".`,
      });
      continue;
    }

    const translations = metadata.translations ?? ({} as GeneratedMetadata['translations']);
    const hasEnglishMeta = Boolean(translations?.en?.name);
    const hasSpanishMeta = Boolean(translations?.es?.name);

    const englishSummary = languageMap.get('en');
    const spanishSummary = languageMap.get('es');

    if (englishSummary && !hasEnglishMeta) {
      issues.push({
        documentType,
        affectedLanguages: ['en'],
        message: `Metadata missing English translation block for document "${documentType}".`,
      });
    }

    if (spanishSummary && !hasSpanishMeta) {
      issues.push({
        documentType,
        affectedLanguages: ['es'],
        message: `Metadata missing Spanish translation block for document "${documentType}".`,
      });
    }

    if (hasSpanishMeta && englishSummary && !spanishSummary) {
      issues.push({
        documentType,
        affectedLanguages: ['en'],
        message: `Spanish template missing for document "${documentType}" but metadata declares Spanish support.`,
      });
      continue;
    }

    if (hasEnglishMeta && spanishSummary && !englishSummary) {
      issues.push({
        documentType,
        affectedLanguages: ['es'],
        message: `English template missing for document "${documentType}" but metadata declares English support.`,
      });
      continue;
    }

    if (!englishSummary || !spanishSummary) {
      continue;
    }

    const englishVariables = new Set(englishSummary.variables);
    const spanishVariables = new Set(spanishSummary.variables);

    const criticalVariables = CRITICAL_PARITY_VARIABLES[documentType] ?? [];
    if (criticalVariables.length) {
      const missingInEn = criticalVariables.filter(
        (variable) => !englishVariables.has(variable),
      );
      const missingInEs = criticalVariables.filter(
        (variable) => !spanishVariables.has(variable),
      );

      if (missingInEn.length || missingInEs.length) {
        const parts: string[] = [];
        if (missingInEn.length) {
          parts.push(`missing in EN: ${missingInEn.join(', ')}`);
        }
        if (missingInEs.length) {
          parts.push(`missing in ES: ${missingInEs.join(', ')}`);
        }

        issues.push({
          documentType,
          affectedLanguages: ['en', 'es'],
          message: `Critical execution variables out of parity (${parts.join('; ')}).`,
        });
      }
    }

    const missingInSpanish = Array.from(englishVariables).filter(
      (variable) => !spanishVariables.has(variable),
    );
    const missingInEnglish = Array.from(spanishVariables).filter(
      (variable) => !englishVariables.has(variable),
    );

    if (missingInSpanish.length || missingInEnglish.length) {
      const parts: string[] = [];
      if (missingInSpanish.length) {
        parts.push(`missing in ES: ${missingInSpanish.join(', ')}`);
      }
      if (missingInEnglish.length) {
        parts.push(`missing in EN: ${missingInEnglish.join(', ')}`);
      }

      issues.push({
        documentType,
        affectedLanguages: ['en', 'es'],
        message: `Variable parity mismatch (${parts.join('; ')}).`,
      });
    }

    if (englishSummary.sectionHeadings.length !== spanishSummary.sectionHeadings.length) {
      issues.push({
        documentType,
        affectedLanguages: ['en', 'es'],
        message: `Section count mismatch: EN has ${englishSummary.sectionHeadings.length}, ES has ${spanishSummary.sectionHeadings.length}.`,
      });
    }

    if (!arraysEqual(englishSummary.numberedSections, spanishSummary.numberedSections)) {
      issues.push({
        documentType,
        affectedLanguages: ['en', 'es'],
        message: `Section numbering mismatch: EN ${englishSummary.numberedSections.join(', ') || 'none'}, ES ${spanishSummary.numberedSections.join(', ') || 'none'}.`,
      });
    }

    if (translations.en?.aliases && translations.es?.aliases) {
      if (translations.en.aliases.length !== translations.es.aliases.length) {
        issues.push({
          documentType,
          affectedLanguages: ['en', 'es'],
          message: `Metadata alias count mismatch: EN has ${translations.en.aliases.length}, ES has ${translations.es.aliases.length}.`,
        });
      }
    }
  }

  return issues;
}