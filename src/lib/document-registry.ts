// Document registry backed by the generated manifest metadata

import { DOCUMENT_MANIFEST } from './documents/manifest.generated';

export interface DocumentInfo {
  id: string;
  title: string;
  description: string;
  category: string;
  jurisdiction: string;
  configType: 'typescript' | 'json';
  route: string;
  isNew?: boolean;
  requiresNotary?: boolean;
  officialForm?: boolean;
  states?: string[];
  aliases?: string[];
  tags?: string[];
  estimatedTime?: string;
  complexity?: 'simple' | 'intermediate' | 'complex';
}

const deriveConfigType = (importPath: string): 'typescript' | 'json' => {
  return importPath.includes('/json/') ? 'json' : 'typescript';
};

const ensureRoute = (id: string): string => {
  return `/docs/${id}`;
};

const manifestToDocumentInfo = () =>
  DOCUMENT_MANIFEST.map((entry) => {
    const meta = entry.meta;

    return {
      id: entry.id,
      title: meta.title || meta.translations.en.name || entry.id,
      description: meta.description || meta.translations.en.description || '',
      category: meta.category,
      jurisdiction: meta.jurisdiction,
      configType: deriveConfigType(entry.importPath),
      route: ensureRoute(entry.id),
      requiresNotary: meta.requiresNotary,
      officialForm: meta.officialForm,
      states: meta.states,
      aliases: meta.aliases,
      tags: meta.tags,
      estimatedTime: meta.estimatedTime,
      complexity: meta.complexity,
      isNew: false,
    } satisfies DocumentInfo;
  });

export const DOCUMENT_REGISTRY: DocumentInfo[] = manifestToDocumentInfo();

// Helper functions
export function getDocumentById(id: string): DocumentInfo | undefined {
  return DOCUMENT_REGISTRY.find((doc) => doc.id === id);
}

export function getDocumentsByCategory(category: string): DocumentInfo[] {
  const normalized = category.toLowerCase();
  return DOCUMENT_REGISTRY.filter((doc) => doc.category.toLowerCase() === normalized);
}

export function getJsonBasedDocuments(): DocumentInfo[] {
  return DOCUMENT_REGISTRY.filter((doc) => doc.configType === 'json');
}

export function getTypeScriptBasedDocuments(): DocumentInfo[] {
  return DOCUMENT_REGISTRY.filter((doc) => doc.configType === 'typescript');
}

export function getDocumentsByState(state: string): DocumentInfo[] {
  const normalized = state.toLowerCase();
  return DOCUMENT_REGISTRY.filter((doc) => {
    if (doc.states && doc.states.length) {
      if (doc.states.includes('all')) return true;
      if (doc.states.some((value) => value.toLowerCase() === normalized)) {
        return true;
      }
    }

    return doc.jurisdiction?.toLowerCase().includes(normalized);
  });
}

export function getAllCategories(): string[] {
  return Array.from(new Set(DOCUMENT_REGISTRY.map((doc) => doc.category))).sort();
}

export default DOCUMENT_REGISTRY;
