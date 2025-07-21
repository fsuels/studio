// src/components/workflow/Step1DocumentSelector.tsx
// Re-export the refactored component from the new modular structure
export { default } from './Step1DocumentSelector';

// Re-export types and constants for backward compatibility
export type {
  Step1DocumentSelectorProps,
  CategoryInfo,
  SimpleT,
  ViewType,
} from './Step1DocumentSelector/types';

export {
  CATEGORY_LIST,
  PLACEHOLDER_TOP_DOCS,
  getDocName,
  getDocDescription,
  getDocAliases,
  languageSupportsSpanish,
} from './Step1DocumentSelector/constants';
