'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

interface ValidationResult {
  confidence: number;
  shouldFallback: boolean;
  issues: string[];
  recommendations: string[];
}

interface TranslationFallbackProps {
  englishText: string;
  spanishText: string;
  documentId: string;
  className?: string;
  forceValidation?: boolean;
  showDebugInfo?: boolean;
}

export default function TranslationFallback({
  englishText,
  spanishText,
  documentId,
  className = '',
  forceValidation = false,
  showDebugInfo = false,
}: TranslationFallbackProps) {
  const { t, i18n } = useTranslation();
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [manualFallback, setManualFallback] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  const isSpanish = i18n.language === 'es';
  const shouldValidate =
    isSpanish && (forceValidation || process.env.NODE_ENV === 'development');

  useEffect(() => {
    if (!shouldValidate || !englishText || !spanishText) return;

    async function validateTranslation() {
      setLoading(true);
      try {
        const response = await fetch('/api/validate-translation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            englishText,
            spanishText,
            documentId,
          }),
        });

        const result: ValidationResult = await response.json();
        setValidation(result);

        // Auto-fallback if confidence is low
        if (result.shouldFallback) {
          setManualFallback(true);
        }
      } catch (error) {
        console.error('Translation validation failed:', error);
        // Safe fallback on validation error
        setValidation({
          confidence: 0,
          shouldFallback: true,
          issues: ['Validation service unavailable'],
          recommendations: ['Using English version for safety'],
        });
        setManualFallback(true);
      } finally {
        setLoading(false);
      }
    }

    validateTranslation();
  }, [englishText, spanishText, documentId, shouldValidate]);

  // If not Spanish or no validation needed, show Spanish text
  if (!isSpanish) {
    return <div className={className}>{englishText}</div>;
  }

  if (!shouldValidate) {
    return <div className={className}>{spanishText}</div>;
  }

  const shouldShowFallback =
    manualFallback || (validation?.shouldFallback && !showOriginal);
  const contentToShow = shouldShowFallback ? englishText : spanishText;

  return (
    <div className={`translation-container ${className}`}>
      {/* Disclaimer Banner - only show if using fallback */}
      {shouldShowFallback && validation && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-yellow-700">
                {t('translation.fallback.notice', {
                  defaultValue:
                    'Este contenido se muestra en inglés para garantizar precisión legal. La traducción al español está siendo mejorada.',
                })}
              </p>

              {/* Toggle button to show original Spanish */}
              <button
                onClick={() => setShowOriginal(!showOriginal)}
                className="mt-2 text-xs text-yellow-600 hover:text-yellow-800 flex items-center gap-1"
              >
                {showOriginal ? (
                  <>
                    <EyeSlashIcon className="h-3 w-3" />
                    {t('translation.fallback.hide_spanish', {
                      defaultValue: 'Ocultar español',
                    })}
                  </>
                ) : (
                  <>
                    <EyeIcon className="h-3 w-3" />
                    {t('translation.fallback.show_spanish', {
                      defaultValue: 'Ver español',
                    })}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div
        className={`content ${shouldShowFallback ? 'english-fallback' : 'spanish-content'}`}
      >
        {loading ? (
          <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: contentToShow }} />
        )}
      </div>

      {/* Debug Information - Development only */}
      {(showDebugInfo || process.env.NODE_ENV === 'development') &&
        validation && (
          <details className="mt-4 p-3 bg-gray-50 border rounded-md text-xs">
            <summary className="cursor-pointer font-medium text-gray-700">
              🔧 Translation Debug Info
            </summary>
            <div className="mt-2 space-y-1 text-gray-600">
              <div>
                <strong>Document:</strong> {documentId}
              </div>
              <div>
                <strong>Confidence:</strong> {validation.confidence}%
              </div>
              <div>
                <strong>Fallback:</strong>{' '}
                {validation.shouldFallback ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Status:</strong>{' '}
                {shouldShowFallback ? 'Using English' : 'Using Spanish'}
              </div>

              {validation.issues.length > 0 && (
                <div>
                  <strong>Issues:</strong>
                  <ul className="ml-4 mt-1">
                    {validation.issues.map((issue, index) => (
                      <li key={index} className="text-red-600">
                        • {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {validation.recommendations.length > 0 && (
                <div>
                  <strong>Recommendations:</strong>
                  <ul className="ml-4 mt-1">
                    {validation.recommendations.map((rec, index) => (
                      <li key={index} className="text-blue-600">
                        • {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </details>
        )}

      {/* Manual fallback controls - Development only */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => setManualFallback(false)}
            className={`px-2 py-1 text-xs rounded ${!manualFallback ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
          >
            Spanish
          </button>
          <button
            onClick={() => setManualFallback(true)}
            className={`px-2 py-1 text-xs rounded ${manualFallback ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}
          >
            English (Safe)
          </button>
        </div>
      )}
    </div>
  );
}
