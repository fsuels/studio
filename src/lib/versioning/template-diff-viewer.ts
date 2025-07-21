// src/lib/versioning/template-diff-viewer.ts
'use client';

import type { LegalDocument } from '@/types/documents';
import type { TemplateVersion, ChangelogEntry } from '@/types/marketplace';

/**
 * Template diff utilities for Monaco editor integration
 * Generates diffs between template versions using jsondiffpatch
 */

export interface DiffResult {
  added: DiffChange[];
  removed: DiffChange[];
  modified: DiffChange[];
  unchanged: DiffChange[];
  summary: DiffSummary;
}

export interface DiffChange {
  path: string;
  oldValue?: any;
  newValue?: any;
  type: 'added' | 'removed' | 'modified' | 'unchanged';
  description: string;
  severity: 'breaking' | 'feature' | 'fix' | 'style';
}

export interface DiffSummary {
  totalChanges: number;
  addedCount: number;
  removedCount: number;
  modifiedCount: number;
  breakingChanges: number;
  newFeatures: number;
  bugFixes: number;
}

export interface MonacoDiffData {
  original: string;
  modified: string;
  language: 'json' | 'markdown' | 'yaml';
  diffNavigator?: boolean;
}

/**
 * Generate a comprehensive diff between two template versions
 */
export function generateTemplateDiff(
  originalVersion: TemplateVersion,
  modifiedVersion: TemplateVersion,
): DiffResult {
  const changes: DiffChange[] = [];

  // Compare basic metadata
  const metadataChanges = compareMetadata(
    originalVersion.document,
    modifiedVersion.document,
  );
  changes.push(...metadataChanges);

  // Compare questions/schema
  const questionChanges = compareQuestions(
    originalVersion.document.questions || [],
    modifiedVersion.document.questions || [],
  );
  changes.push(...questionChanges);

  // Compare template content
  const templateChanges = compareTemplateContent(
    originalVersion.document,
    modifiedVersion.document,
  );
  changes.push(...templateChanges);

  // Compare pricing and business logic
  const pricingChanges = comparePricing(
    originalVersion.document,
    modifiedVersion.document,
  );
  changes.push(...pricingChanges);

  // Categorize changes
  const added = changes.filter((c) => c.type === 'added');
  const removed = changes.filter((c) => c.type === 'removed');
  const modified = changes.filter((c) => c.type === 'modified');
  const unchanged = changes.filter((c) => c.type === 'unchanged');

  const summary: DiffSummary = {
    totalChanges: added.length + removed.length + modified.length,
    addedCount: added.length,
    removedCount: removed.length,
    modifiedCount: modified.length,
    breakingChanges: changes.filter((c) => c.severity === 'breaking').length,
    newFeatures: changes.filter((c) => c.severity === 'feature').length,
    bugFixes: changes.filter((c) => c.severity === 'fix').length,
  };

  return {
    added,
    removed,
    modified,
    unchanged,
    summary,
  };
}

/**
 * Generate Monaco editor diff data
 */
export function generateMonacoDiff(
  originalVersion: TemplateVersion,
  modifiedVersion: TemplateVersion,
  format: 'json' | 'template' | 'questions' = 'json',
): MonacoDiffData {
  let original: string;
  let modified: string;
  let language: 'json' | 'markdown' | 'yaml' = 'json';

  switch (format) {
    case 'json':
      original = JSON.stringify(originalVersion.document, null, 2);
      modified = JSON.stringify(modifiedVersion.document, null, 2);
      language = 'json';
      break;

    case 'template':
      original = getTemplateContent(originalVersion.document) || '';
      modified = getTemplateContent(modifiedVersion.document) || '';
      language = 'markdown';
      break;

    case 'questions':
      original = formatQuestionsForDiff(
        originalVersion.document.questions || [],
      );
      modified = formatQuestionsForDiff(
        modifiedVersion.document.questions || [],
      );
      language = 'yaml';
      break;

    default:
      original = JSON.stringify(originalVersion.document, null, 2);
      modified = JSON.stringify(modifiedVersion.document, null, 2);
  }

  return {
    original,
    modified,
    language,
    diffNavigator: true,
  };
}

/**
 * Compare metadata between two documents
 */
function compareMetadata(
  original: LegalDocument,
  modified: LegalDocument,
): DiffChange[] {
  const changes: DiffChange[] = [];

  const metadataFields = [
    { key: 'name', description: 'Template name', severity: 'style' as const },
    {
      key: 'description',
      description: 'Template description',
      severity: 'style' as const,
    },
    {
      key: 'category',
      description: 'Template category',
      severity: 'feature' as const,
    },
    {
      key: 'jurisdiction',
      description: 'Legal jurisdiction',
      severity: 'breaking' as const,
    },
    {
      key: 'basePrice',
      description: 'Base price',
      severity: 'feature' as const,
    },
    {
      key: 'requiresNotarization',
      description: 'Notarization requirement',
      severity: 'breaking' as const,
    },
    {
      key: 'canBeRecorded',
      description: 'Recording capability',
      severity: 'feature' as const,
    },
  ];

  for (const field of metadataFields) {
    const originalValue = (original as any)[field.key];
    const modifiedValue = (modified as any)[field.key];

    if (originalValue !== modifiedValue) {
      if (originalValue === undefined) {
        changes.push({
          path: field.key,
          newValue: modifiedValue,
          type: 'added',
          description: `Added ${field.description}`,
          severity: field.severity,
        });
      } else if (modifiedValue === undefined) {
        changes.push({
          path: field.key,
          oldValue: originalValue,
          type: 'removed',
          description: `Removed ${field.description}`,
          severity: 'breaking',
        });
      } else {
        changes.push({
          path: field.key,
          oldValue: originalValue,
          newValue: modifiedValue,
          type: 'modified',
          description: `Changed ${field.description}`,
          severity: field.severity,
        });
      }
    }
  }

  return changes;
}

/**
 * Compare questions between two documents
 */
function compareQuestions(
  originalQuestions: any[],
  modifiedQuestions: any[],
): DiffChange[] {
  const changes: DiffChange[] = [];

  const originalMap = new Map(originalQuestions.map((q) => [q.id, q]));
  const modifiedMap = new Map(modifiedQuestions.map((q) => [q.id, q]));

  // Check for added questions
  for (const [id, question] of modifiedMap) {
    if (!originalMap.has(id)) {
      changes.push({
        path: `questions.${id}`,
        newValue: question,
        type: 'added',
        description: `Added question: ${question.label}`,
        severity: question.required ? 'breaking' : 'feature',
      });
    }
  }

  // Check for removed questions
  for (const [id, question] of originalMap) {
    if (!modifiedMap.has(id)) {
      changes.push({
        path: `questions.${id}`,
        oldValue: question,
        type: 'removed',
        description: `Removed question: ${question.label}`,
        severity: 'breaking',
      });
    }
  }

  // Check for modified questions
  for (const [id, modifiedQuestion] of modifiedMap) {
    const originalQuestion = originalMap.get(id);
    if (
      originalQuestion &&
      JSON.stringify(originalQuestion) !== JSON.stringify(modifiedQuestion)
    ) {
      const questionChanges = compareQuestionFields(
        originalQuestion,
        modifiedQuestion,
      );
      changes.push(
        ...questionChanges.map((change) => ({
          ...change,
          path: `questions.${id}.${change.path}`,
        })),
      );
    }
  }

  return changes;
}

/**
 * Compare individual question fields
 */
function compareQuestionFields(original: any, modified: any): DiffChange[] {
  const changes: DiffChange[] = [];

  const fieldSeverities: Record<
    string,
    'breaking' | 'feature' | 'fix' | 'style'
  > = {
    type: 'breaking',
    required: 'breaking',
    options: 'feature',
    label: 'style',
    placeholder: 'style',
    helperText: 'style',
    tooltip: 'style',
  };

  for (const [field, severity] of Object.entries(fieldSeverities)) {
    if (original[field] !== modified[field]) {
      changes.push({
        path: field,
        oldValue: original[field],
        newValue: modified[field],
        type: 'modified',
        description: `Changed ${field}`,
        severity,
      });
    }
  }

  return changes;
}

/**
 * Compare template content
 */
function compareTemplateContent(
  original: LegalDocument,
  modified: LegalDocument,
): DiffChange[] {
  const changes: DiffChange[] = [];

  // Compare template paths
  const originalPaths = original.templatePaths || {};
  const modifiedPaths = modified.templatePaths || {};

  for (const lang of new Set([
    ...Object.keys(originalPaths),
    ...Object.keys(modifiedPaths),
  ])) {
    if (originalPaths[lang] !== modifiedPaths[lang]) {
      changes.push({
        path: `templatePaths.${lang}`,
        oldValue: originalPaths[lang],
        newValue: modifiedPaths[lang],
        type: modifiedPaths[lang]
          ? originalPaths[lang]
            ? 'modified'
            : 'added'
          : 'removed',
        description: `Template path for ${lang}`,
        severity: 'feature',
      });
    }
  }

  // Compare language support
  const originalLangs = new Set(original.languageSupport || []);
  const modifiedLangs = new Set(modified.languageSupport || []);

  for (const lang of modifiedLangs) {
    if (!originalLangs.has(lang)) {
      changes.push({
        path: `languageSupport.${lang}`,
        newValue: lang,
        type: 'added',
        description: `Added language support: ${lang}`,
        severity: 'feature',
      });
    }
  }

  for (const lang of originalLangs) {
    if (!modifiedLangs.has(lang)) {
      changes.push({
        path: `languageSupport.${lang}`,
        oldValue: lang,
        type: 'removed',
        description: `Removed language support: ${lang}`,
        severity: 'breaking',
      });
    }
  }

  return changes;
}

/**
 * Compare pricing information
 */
function comparePricing(
  original: LegalDocument,
  modified: LegalDocument,
): DiffChange[] {
  const changes: DiffChange[] = [];

  if (original.basePrice !== modified.basePrice) {
    changes.push({
      path: 'basePrice',
      oldValue: original.basePrice,
      newValue: modified.basePrice,
      type: 'modified',
      description: 'Base price changed',
      severity: 'feature',
    });
  }

  // Compare upsell clauses
  const originalClauses = original.upsellClauses || [];
  const modifiedClauses = modified.upsellClauses || [];

  if (originalClauses.length !== modifiedClauses.length) {
    changes.push({
      path: 'upsellClauses',
      oldValue: originalClauses.length,
      newValue: modifiedClauses.length,
      type: 'modified',
      description: 'Number of upsell clauses changed',
      severity: 'feature',
    });
  }

  return changes;
}

/**
 * Get template content for diff viewing
 */
function getTemplateContent(document: LegalDocument): string | null {
  if (document.templatePaths?.en) {
    // In a real implementation, you would fetch the actual template content
    return `Template path: ${document.templatePaths.en}`;
  }
  if (document.templatePath) {
    return `Template path: ${document.templatePath}`;
  }
  return null;
}

/**
 * Format questions for YAML-like diff viewing
 */
function formatQuestionsForDiff(questions: any[]): string {
  return questions
    .map((q) => {
      const lines = [
        `- id: ${q.id}`,
        `  label: "${q.label}"`,
        `  type: ${q.type}`,
        `  required: ${q.required || false}`,
      ];

      if (q.placeholder) lines.push(`  placeholder: "${q.placeholder}"`);
      if (q.helperText) lines.push(`  helperText: "${q.helperText}"`);
      if (q.options) {
        lines.push('  options:');
        q.options.forEach((opt: any) => {
          lines.push(`    - value: "${opt.value}"`);
          lines.push(`      label: "${opt.label}"`);
        });
      }

      return lines.join('\n');
    })
    .join('\n\n');
}

/**
 * Generate changelog from diff
 */
export function generateChangelogFromDiff(
  diff: DiffResult,
  versionType: 'major' | 'minor' | 'patch',
): ChangelogEntry[] {
  const changelog: ChangelogEntry[] = [];

  // Group changes by type
  const breakingChanges = [
    ...diff.added,
    ...diff.removed,
    ...diff.modified,
  ].filter((c) => c.severity === 'breaking');

  const features = [...diff.added, ...diff.modified].filter(
    (c) => c.severity === 'feature',
  );

  const fixes = diff.modified.filter((c) => c.severity === 'fix');

  if (breakingChanges.length > 0) {
    changelog.push({
      type: 'changed',
      description: `Breaking changes: ${breakingChanges.map((c) => c.description).join(', ')}`,
      impact: 'major',
      affectedFields: breakingChanges.map((c) => c.path),
    });
  }

  if (features.length > 0) {
    changelog.push({
      type: 'added',
      description: `New features: ${features.map((c) => c.description).join(', ')}`,
      impact: 'minor',
      affectedFields: features.map((c) => c.path),
    });
  }

  if (fixes.length > 0) {
    changelog.push({
      type: 'fixed',
      description: `Bug fixes: ${fixes.map((c) => c.description).join(', ')}`,
      impact: 'patch',
      affectedFields: fixes.map((c) => c.path),
    });
  }

  return changelog;
}
