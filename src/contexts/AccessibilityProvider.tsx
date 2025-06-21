'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

// Accessibility preferences interface
export interface AccessibilityPreferences {
  // Plain Language & Reading Support
  plainLanguageMode: boolean;
  showDocumentSummary: boolean;
  simplifyLegalJargon: boolean;
  readingLevel: 'simple' | 'standard' | 'advanced';
  
  // Visual Accessibility
  dyslexiaFriendlyFont: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  lineHeight: 'comfortable' | 'relaxed' | 'loose';
  highContrast: boolean;
  reduceMotion: boolean;
  
  // Cognitive Accessibility
  showProgressIndicators: boolean;
  breakDownComplexForms: boolean;
  highlightImportantSections: boolean;
  
  // Navigation & Controls
  keyboardShortcutsEnabled: boolean;
  focusIndicatorEnhanced: boolean;
  skipLinksVisible: boolean;
  
  // AI Assistance
  autoExplainClauses: boolean;
  contextualHelp: boolean;
  voiceGuidance: boolean;
}

// Default preferences
const DEFAULT_PREFERENCES: AccessibilityPreferences = {
  // Plain Language & Reading Support
  plainLanguageMode: false,
  showDocumentSummary: false,
  simplifyLegalJargon: false,
  readingLevel: 'standard',
  
  // Visual Accessibility
  dyslexiaFriendlyFont: false,
  fontSize: 'medium',
  lineHeight: 'comfortable',
  highContrast: false,
  reduceMotion: false,
  
  // Cognitive Accessibility
  showProgressIndicators: true,
  breakDownComplexForms: false,
  highlightImportantSections: false,
  
  // Navigation & Controls
  keyboardShortcutsEnabled: true,
  focusIndicatorEnhanced: false,
  skipLinksVisible: false,
  
  // AI Assistance
  autoExplainClauses: false,
  contextualHelp: false,
  voiceGuidance: false,
};

// Context interface
interface AccessibilityContextType {
  preferences: AccessibilityPreferences;
  updatePreferences: (updates: Partial<AccessibilityPreferences>) => void;
  resetPreferences: () => void;
  togglePlainLanguageMode: () => void;
  isAccessibilityModeActive: boolean;
  keyboardShortcuts: Record<string, () => void>;
}

// Create context
const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

// Local storage key
const STORAGE_KEY = 'accessibility-preferences';

// Provider component
interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(DEFAULT_PREFERENCES);
  const [mounted, setMounted] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedPrefs = JSON.parse(stored);
        setPreferences({ ...DEFAULT_PREFERENCES, ...parsedPrefs });
      }
    } catch (error) {
      console.warn('Failed to load accessibility preferences:', error);
    }
    setMounted(true);
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      } catch (error) {
        console.warn('Failed to save accessibility preferences:', error);
      }
    }
  }, [preferences, mounted]);

  // Apply CSS custom properties for accessibility features
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    // Font family
    if (preferences.dyslexiaFriendlyFont) {
      root.style.setProperty('--font-family-accessible', '"OpenDyslexic", "Arial", sans-serif');
      document.body.classList.add('dyslexia-friendly-font');
    } else {
      root.style.removeProperty('--font-family-accessible');
      document.body.classList.remove('dyslexia-friendly-font');
    }
    
    // Font size
    const fontSizeMap = {
      'small': '0.875rem',
      'medium': '1rem',
      'large': '1.125rem',
      'extra-large': '1.25rem'
    };
    root.style.setProperty('--font-size-accessible', fontSizeMap[preferences.fontSize]);
    
    // Line height
    const lineHeightMap = {
      'comfortable': '1.5',
      'relaxed': '1.6',
      'loose': '1.8'
    };
    root.style.setProperty('--line-height-accessible', lineHeightMap[preferences.lineHeight]);
    
    // High contrast
    if (preferences.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    
    // Reduce motion
    if (preferences.reduceMotion) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
    
    // Enhanced focus indicators
    if (preferences.focusIndicatorEnhanced) {
      document.body.classList.add('enhanced-focus');
    } else {
      document.body.classList.remove('enhanced-focus');
    }

  }, [preferences, mounted]);

  // Update preferences function
  const updatePreferences = useCallback((updates: Partial<AccessibilityPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  }, []);

  // Reset preferences function
  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
  }, []);

  // Toggle plain language mode
  const togglePlainLanguageMode = useCallback(() => {
    setPreferences(prev => ({
      ...prev,
      plainLanguageMode: !prev.plainLanguageMode,
      showDocumentSummary: !prev.plainLanguageMode,
      simplifyLegalJargon: !prev.plainLanguageMode,
      autoExplainClauses: !prev.plainLanguageMode,
    }));
  }, []);

  // Check if any accessibility features are active
  const isAccessibilityModeActive = useMemo(() => {
    return (
      preferences.plainLanguageMode ||
      preferences.dyslexiaFriendlyFont ||
      preferences.fontSize !== 'medium' ||
      preferences.highContrast ||
      preferences.reduceMotion ||
      preferences.focusIndicatorEnhanced ||
      preferences.autoExplainClauses
    );
  }, [preferences]);

  // Keyboard shortcuts
  const keyboardShortcuts = useMemo(() => ({
    'togglePlainLanguage': togglePlainLanguageMode,
    'increaseFontSize': () => {
      const sizes = ['small', 'medium', 'large', 'extra-large'] as const;
      const currentIndex = sizes.indexOf(preferences.fontSize);
      if (currentIndex < sizes.length - 1) {
        updatePreferences({ fontSize: sizes[currentIndex + 1] });
      }
    },
    'decreaseFontSize': () => {
      const sizes = ['small', 'medium', 'large', 'extra-large'] as const;
      const currentIndex = sizes.indexOf(preferences.fontSize);
      if (currentIndex > 0) {
        updatePreferences({ fontSize: sizes[currentIndex - 1] });
      }
    },
    'toggleHighContrast': () => {
      updatePreferences({ highContrast: !preferences.highContrast });
    },
    'toggleDyslexiaFont': () => {
      updatePreferences({ dyslexiaFriendlyFont: !preferences.dyslexiaFriendlyFont });
    },
  }), [preferences, updatePreferences, togglePlainLanguageMode]);

  // Keyboard event listener
  useEffect(() => {
    if (!preferences.keyboardShortcutsEnabled || !mounted) return;

    const handleKeyboard = (event: KeyboardEvent) => {
      // Only trigger shortcuts with Alt key to avoid conflicts
      if (!event.altKey) return;

      switch (event.key) {
        case 'p':
          event.preventDefault();
          keyboardShortcuts.togglePlainLanguage();
          break;
        case '=':
        case '+':
          event.preventDefault();
          keyboardShortcuts.increaseFontSize();
          break;
        case '-':
          event.preventDefault();
          keyboardShortcuts.decreaseFontSize();
          break;
        case 'c':
          event.preventDefault();
          keyboardShortcuts.toggleHighContrast();
          break;
        case 'd':
          event.preventDefault();
          keyboardShortcuts.toggleDyslexiaFont();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, [preferences.keyboardShortcutsEnabled, keyboardShortcuts, mounted]);

  const contextValue: AccessibilityContextType = {
    preferences,
    updatePreferences,
    resetPreferences,
    togglePlainLanguageMode,
    isAccessibilityModeActive,
    keyboardShortcuts,
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
}

// Custom hook to use accessibility context
export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

// Export types
export type { AccessibilityContextType };