import React from 'react';
import type { LegalDocument } from '@/types/documents';

// Helper type for a simplified translation function used internally
export type SimpleT = (
  _key: string,
  _fallback?: string | Record<string, unknown>,
) => string;

export interface CategoryInfo {
  key: string;
  labelKey: string;
  icon: React.ElementType;
}

export interface Step1DocumentSelectorProps {
  selectedCategory: string | null;
  onCategorySelect: (_categoryKey: string | null) => void;
  onDocumentSelect: (_doc: LegalDocument) => void;
  isReadOnly?: boolean;
  globalSearchTerm: string;
  globalSelectedState: string;
}

export type ViewType =
  | 'top-docs'
  | 'all-categories'
  | 'documents-in-category'
  | 'search-results';

export interface BaseComponentProps {
  disabled: boolean;
  t: SimpleT;
  i18nLanguage: string;
}

export interface DocumentCardProps extends BaseComponentProps {
  doc: LegalDocument;
  onSelect: () => void;
  placeholderNoDescription: string;
  placeholderRequiresNotarization: string;
  placeholderCanBeRecorded: string;
}

export interface CategoryCardProps extends BaseComponentProps {
  category: CategoryInfo;
  onClick: () => void;
}

export interface TopDocChipProps extends BaseComponentProps {
  doc: Pick<LegalDocument, 'id' | 'translations'> & {
    icon?: React.ElementType;
  };
  onSelect: () => void;
}

export interface ViewComponentProps {
  isReadOnly: boolean;
  isHydrated: boolean;
  t: SimpleT;
  i18nLanguage: string;
  documentsToDisplay: LegalDocument[];
  globalSelectedState: string;
  placeholderNoDescription: string;
  placeholderRequiresNotarization: string;
  placeholderCanBeRecorded: string;
  placeholderNoResults: string;
  onDocumentSelect: (doc: LegalDocument) => void;
}
