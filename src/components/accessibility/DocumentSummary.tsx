'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useAccessibility } from '@/contexts/AccessibilityProvider';
import { DocumentSummary as DocumentSummaryType } from '@/ai/flows/summarize-document';
import {
  FileText,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Brain,
  BookOpen,
  Lightbulb,
  RefreshCw,
  X,
} from 'lucide-react';

interface DocumentSummaryProps {
  documentText: string;
  documentType?: string;
  className?: string;
  onDismiss?: () => void;
}

export function DocumentSummary({
  documentText,
  documentType,
  className,
  onDismiss,
}: DocumentSummaryProps) {
  const { preferences } = useAccessibility();
  const [summary, setSummary] = useState<DocumentSummaryType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showKeyTerms, setShowKeyTerms] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const generateSummary = async () => {
      if (!documentText.trim()) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/accessibility/summarize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            documentText,
            documentType,
            options: {
              readingLevel: preferences.readingLevel,
              maxLength: 'detailed',
              includeKeyTerms: true,
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to generate summary');
        }

        const data = await response.json();

        if (isMounted) {
          if (data.success && data.summary) {
            setSummary(data.summary);
          } else {
            setError('Unable to generate summary');
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : 'Failed to generate summary',
          );
          console.error('Document summary error:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    generateSummary();

    return () => {
      isMounted = false;
    };
  }, [documentText, documentType, preferences.readingLevel]);

  // Don't render if plain language mode is disabled
  if (!preferences.showDocumentSummary && !preferences.plainLanguageMode) {
    return null;
  }

  const handleRefresh = () => {
    setIsLoading(true);
    setError(null);
    setSummary(null);
    // Force re-render by changing the key
    window.location.reload();
  };

  if (isLoading) {
    return (
      <Card className={`plain-language-summary ${className || ''}`}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">AI Document Summary</CardTitle>
            <Badge variant="secondary">Generating...</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-1/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert
        className={`border-orange-200 bg-orange-50 dark:bg-orange-950 ${className || ''}`}
      >
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <Card className={`plain-language-summary ${className || ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Plain Language Summary</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {summary.readingTime}
            </div>
            {onDismiss && (
              <Button variant="ghost" size="icon" onClick={onDismiss}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 p-0 h-auto"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <span className="font-medium">Summary</span>
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-4 mt-3">
            {/* Main Summary */}
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-base leading-relaxed">{summary.summary}</p>
            </div>

            {/* Key Points */}
            {summary.keyPoints.length > 0 && (
              <div>
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4" />
                  Key Points to Remember
                </h4>
                <ul className="space-y-2">
                  {summary.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Important Terms */}
            {summary.importantTerms && summary.importantTerms.length > 0 && (
              <div>
                <Collapsible open={showKeyTerms} onOpenChange={setShowKeyTerms}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 p-0 h-auto"
                    >
                      {showKeyTerms ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <Lightbulb className="h-4 w-4" />
                      <span className="font-medium">
                        Important Terms ({summary.importantTerms.length})
                      </span>
                    </Button>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="mt-2">
                    <div className="space-y-2">
                      {summary.importantTerms.map((term, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg">
                          <div className="font-medium text-sm">{term.term}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {term.definition}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}

            {/* Warnings */}
            {summary.warnings && summary.warnings.length > 0 && (
              <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium mb-1">
                    Important Considerations:
                  </div>
                  <ul className="space-y-1">
                    {summary.warnings.map((warning, index) => (
                      <li key={index} className="text-sm">
                        {warning}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Disclaimer */}
            <div className="text-xs text-muted-foreground p-3 bg-muted rounded-lg">
              <strong>Disclaimer:</strong> This AI-generated summary is for
              informational purposes only and should not be considered legal
              advice. Always review the complete document and consult with a
              qualified attorney for legal matters.
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

export default DocumentSummary;
