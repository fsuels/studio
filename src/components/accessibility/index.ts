// Accessibility components and utilities
export {
  AccessibilityProvider,
  useAccessibility,
} from '@/contexts/AccessibilityProvider';
export { default as AccessibilitySettingsPanel } from './AccessibilitySettingsPanel';
export { default as AccessibilityToolbar } from './AccessibilityToolbar';
export { default as DocumentSummary } from './DocumentSummary';
export {
  default as KeyboardShortcutsModal,
  useGlobalKeyboardShortcuts,
} from './KeyboardShortcutsModal';
export { default as GlobalKeyboardShortcuts } from './GlobalKeyboardShortcuts';
export { default as AccessibleDocumentWrapper } from './AccessibleDocumentWrapper';

// Types
export type {
  AccessibilityPreferences,
  AccessibilityContextType,
} from '@/contexts/AccessibilityProvider';
export type { DocumentSummary as DocumentSummaryType } from '@/ai/flows/summarize-document';
