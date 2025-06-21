'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAccessibility } from '@/contexts/AccessibilityProvider';
import DocumentSummary from './DocumentSummary';
import { Eye, EyeOff, Settings } from 'lucide-react';

interface AccessibleDocumentWrapperProps {
  children: React.ReactNode;
  documentText?: string;
  documentType?: string;
  className?: string;
  showProgressIndicator?: boolean;
}

export function AccessibleDocumentWrapper({
  children,
  documentText,
  documentType,
  className,
  showProgressIndicator = true,
}: AccessibleDocumentWrapperProps) {
  const { preferences, isAccessibilityModeActive } = useAccessibility();
  const [readingProgress, setReadingProgress] = useState(0);
  const [showSummary, setShowSummary] = useState(true);
  const [estimatedReadingTime, setEstimatedReadingTime] = useState<string>('');

  // Calculate reading progress based on scroll position
  useEffect(() => {
    if (!preferences.showProgressIndicators) return;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min((scrollTop / documentHeight) * 100, 100);
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, [preferences.showProgressIndicators]);

  // Calculate estimated reading time
  useEffect(() => {
    if (documentText) {
      const words = documentText.split(/\s+/).length;
      const minutes = Math.ceil(words / 200); // Average reading speed
      setEstimatedReadingTime(
        minutes < 1
          ? '< 1 minute'
          : `${minutes} minute${minutes > 1 ? 's' : ''}`,
      );
    }
  }, [documentText]);

  // Skip links for better navigation
  const SkipLinks = () => (
    <div
      className={`skip-links ${preferences.skipLinksVisible ? 'block' : ''}`}
    >
      <a
        href="#document-summary"
        className="skip-link"
        aria-label="Skip to document summary"
      >
        Skip to Summary
      </a>
      <a
        href="#document-content"
        className="skip-link"
        aria-label="Skip to main document content"
      >
        Skip to Content
      </a>
    </div>
  );

  // Reading progress indicator
  const ReadingProgress = () => {
    if (!preferences.showProgressIndicators || !showProgressIndicator)
      return null;

    return (
      <div className="reading-progress sticky top-0 z-40">
        <Progress
          value={readingProgress}
          className="h-1"
          aria-label={`Reading progress: ${Math.round(readingProgress)}%`}
        />
        <div className="sr-only" aria-live="polite">
          {readingProgress > 0 &&
            `Reading progress: ${Math.round(readingProgress)}%`}
        </div>
      </div>
    );
  };

  // Document metadata bar
  const DocumentMetadata = () => {
    if (!isAccessibilityModeActive) return null;

    return (
      <div className="mb-4 p-3 bg-muted/50 rounded-lg flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          {estimatedReadingTime && (
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Reading time:</span>
              <Badge variant="secondary">{estimatedReadingTime}</Badge>
            </div>
          )}
          {documentType && (
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Document type:</span>
              <Badge variant="outline">{documentType}</Badge>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {preferences.showDocumentSummary && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSummary(!showSummary)}
              className="flex items-center gap-1"
            >
              {showSummary ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              {showSummary ? 'Hide' : 'Show'} Summary
            </Button>
          )}

          {isAccessibilityModeActive && (
            <Badge variant="default" className="flex items-center gap-1">
              <Settings className="h-3 w-3" />
              Accessibility Active
            </Badge>
          )}
        </div>
      </div>
    );
  };

  // Apply accessibility classes to the wrapper
  const getAccessibilityClasses = () => {
    const classes = [];

    if (preferences.dyslexiaFriendlyFont) {
      classes.push('dyslexia-friendly-font');
    }

    if (preferences.highContrast) {
      classes.push('high-contrast');
    }

    if (preferences.reduceMotion) {
      classes.push('reduce-motion');
    }

    if (preferences.focusIndicatorEnhanced) {
      classes.push('enhanced-focus');
    }

    classes.push('accessibility-mode');

    return classes.join(' ');
  };

  return (
    <>
      <SkipLinks />
      <ReadingProgress />

      <div
        className={`
          ${getAccessibilityClasses()} 
          ${className || ''}
        `}
        style={{
          fontSize: `var(--font-size-accessible, 1rem)`,
          lineHeight: `var(--line-height-accessible, 1.5)`,
        }}
      >
        <DocumentMetadata />

        {/* Document Summary */}
        {preferences.showDocumentSummary && showSummary && documentText && (
          <div id="document-summary" className="mb-6">
            <DocumentSummary
              documentText={documentText}
              documentType={documentType}
              onDismiss={() => setShowSummary(false)}
            />
          </div>
        )}

        {/* Main Document Content */}
        <div
          id="document-content"
          className={`
            ${preferences.breakDownComplexForms ? 'space-y-6' : ''}
            ${preferences.highlightImportantSections ? 'highlight-important' : ''}
          `}
          tabIndex={-1}
          aria-label="Main document content"
        >
          {children}
        </div>

        {/* Footer with accessibility info */}
        {isAccessibilityModeActive && (
          <div className="mt-8 p-4 bg-muted/30 rounded-lg border border-dashed">
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">Accessibility Features Active:</p>
              <ul className="space-y-1 text-xs">
                {preferences.plainLanguageMode && (
                  <li>• Plain language mode enabled</li>
                )}
                {preferences.dyslexiaFriendlyFont && (
                  <li>• Dyslexia-friendly font active</li>
                )}
                {preferences.autoExplainClauses && (
                  <li>• Auto-explain clauses enabled</li>
                )}
                {preferences.simplifyLegalJargon && (
                  <li>• Legal jargon simplification active</li>
                )}
                {preferences.highContrast && (
                  <li>• High contrast mode enabled</li>
                )}
                {preferences.keyboardShortcutsEnabled && (
                  <li>
                    • Keyboard shortcuts enabled (press ⌘/Ctrl + / for help)
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AccessibleDocumentWrapper;
