// src/components/workflow/Step1DocumentSelector/index.tsx
export { default } from './Step1DocumentSelector';

// Export types for external use
export type {
  Step1DocumentSelectorProps,
  CategoryInfo,
  SimpleT,
  ViewType,
} from './types';

// Export constants for external use
export {
  CATEGORY_LIST,
  PLACEHOLDER_TOP_DOCS,
  getDocName,
  getDocDescription,
  getDocAliases,
  languageSupportsSpanish,
} from './constants';
