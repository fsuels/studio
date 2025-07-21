// src/components/translation/LegalTranslator.tsx
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Languages,
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain,
  Scale,
  Globe,
  Copy,
  Download,
  Eye,
  EyeOff,
  Lightbulb,
  Shield,
  Star,
  Users,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { translateLegalText } from '@/lib/legal-translation/LegalTranslationEngine';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  legalSystem: string;
  jurisdictions: string[];
}

interface LegalTranslatorProps {
  documentType: string;
  sourceText: string;
  jurisdiction?: string;
  onTranslationComplete?: (result: any) => void;
  className?: string;
}

const SUPPORTED_LANGUAGES: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    legalSystem: 'Common Law',
    jurisdictions: ['US-ALL', 'CA-ALL', 'UK', 'AU'],
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    legalSystem: 'Civil Law',
    jurisdictions: ['ES', 'MX', 'AR', 'CO'],
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    legalSystem: 'Civil Law',
    jurisdictions: ['FR', 'CA-QC', 'BE', 'CH'],
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    legalSystem: 'Civil Law',
    jurisdictions: ['DE', 'AT', 'CH'],
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇵🇹',
    legalSystem: 'Civil Law',
    jurisdictions: ['PT', 'BR'],
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    legalSystem: 'Civil Law',
    jurisdictions: ['IT', 'CH'],
  },
];

const LegalTranslator: React.FC<LegalTranslatorProps> = ({
  documentType,
  sourceText,
  jurisdiction = 'US-ALL',
  onTranslationComplete,
  className,
}) => {
  const { t } = useTranslation('translation');
  const [sourceLanguage, setSourceLanguage] = React.useState('en');
  const [targetLanguage, setTargetLanguage] = React.useState('es');
  const [isTranslating, setIsTranslating] = React.useState(false);
  const [translationResult, setTranslationResult] = React.useState<any>(null);
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [selectedWarning, setSelectedWarning] = React.useState<number | null>(
    null,
  );
  const [userRole, setUserRole] = React.useState<string>('general');

  // Auto-detect source language
  React.useEffect(() => {
    if (sourceText && sourceText.length > 50) {
      detectSourceLanguage(sourceText);
    }
  }, [sourceText]);

  const detectSourceLanguage = async (text: string) => {
    try {
      const response = await fetch('/api/ai/detect-language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.substring(0, 500) }),
      });

      const { language, confidence } = await response.json();

      if (confidence > 0.8 && language !== sourceLanguage) {
        setSourceLanguage(language);
      }
    } catch (error) {
      console.warn('Language detection failed:', error);
    }
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;

    setIsTranslating(true);

    try {
      const result = await translateLegalText(sourceText, {
        documentType,
        jurisdiction,
        sourceLanguage,
        targetLanguage,
        userRole,
      });

      setTranslationResult(result);
      onTranslationComplete?.(result);
    } catch (error) {
      console.error('Translation failed:', error);
      // Show error message to user
    } finally {
      setIsTranslating(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.9) return 'High Accuracy';
    if (confidence >= 0.7) return 'Medium Accuracy';
    return 'Requires Review';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'low':
        return <Lightbulb className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Show success toast
    } catch (error) {
      console.warn('Failed to copy to clipboard:', error);
    }
  };

  const exportTranslation = () => {
    if (!translationResult) return;

    const exportData = {
      original: sourceText,
      translated: translationResult.translatedText,
      sourceLanguage,
      targetLanguage,
      confidence: translationResult.confidence,
      warnings: translationResult.warnings,
      metadata: translationResult.metadata,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `legal-translation-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sourceLanguageData = SUPPORTED_LANGUAGES.find(
    (l) => l.code === sourceLanguage,
  );
  const targetLanguageData = SUPPORTED_LANGUAGES.find(
    (l) => l.code === targetLanguage,
  );

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-primary" />
            Legal Translation Assistant
            <Badge variant="outline" className="ml-2 gap-1">
              <Shield className="h-3 w-3" />
              Legal Accuracy Preserved
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Language Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">From</label>
              <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                        <span className="text-muted-foreground text-xs">
                          ({lang.legalSystem})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">To</label>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.filter(
                    (l) => l.code !== sourceLanguage,
                  ).map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                        <span className="text-muted-foreground text-xs">
                          ({lang.legalSystem})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Legal System Compatibility Warning */}
          {sourceLanguageData &&
            targetLanguageData &&
            sourceLanguageData.legalSystem !==
              targetLanguageData.legalSystem && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-amber-900">
                    Legal System Difference
                  </p>
                  <p className="text-amber-800">
                    Translating from {sourceLanguageData.legalSystem} to{' '}
                    {targetLanguageData.legalSystem}. Some legal concepts may
                    not have direct equivalents.
                  </p>
                </div>
              </div>
            )}

          {/* Advanced Options */}
          <div className="pt-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="gap-2"
            >
              {showAdvanced ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              Advanced Options
            </Button>

            {showAdvanced && (
              <div className="mt-3 space-y-3 p-3 bg-muted/30 rounded-lg">
                <div className="space-y-2">
                  <label className="text-sm font-medium">User Role</label>
                  <Select value={userRole} onValueChange={setUserRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General User</SelectItem>
                      <SelectItem value="legal_professional">
                        Legal Professional
                      </SelectItem>
                      <SelectItem value="translator">
                        Legal Translator
                      </SelectItem>
                      <SelectItem value="student">Law Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Translate Button */}
          <Button
            onClick={handleTranslate}
            disabled={!sourceText.trim() || isTranslating}
            className="w-full gap-2"
            size="lg"
          >
            {isTranslating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Translating with Legal Validation...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4" />
                Translate with Legal Accuracy
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Translation Result */}
      {translationResult && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Translation Result</CardTitle>
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          'flex items-center gap-1',
                          getConfidenceColor(translationResult.confidence),
                        )}
                      >
                        <Star className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {Math.round(translationResult.confidence * 100)}%
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{getConfidenceLabel(translationResult.confidence)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(translationResult.translatedText)
                  }
                >
                  <Copy className="h-4 w-4" />
                </Button>

                <Button variant="ghost" size="sm" onClick={exportTranslation}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Confidence Progress Bar */}
            <div className="space-y-1">
              <Progress
                value={translationResult.confidence * 100}
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                {getConfidenceLabel(translationResult.confidence)} -
                {translationResult.metadata.reviewRequired
                  ? ' Review recommended'
                  : ' Ready to use'}
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Translated Text */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Translated Text</label>
              <Textarea
                value={translationResult.translatedText}
                readOnly
                rows={Math.min(
                  10,
                  translationResult.translatedText.split('\n').length + 2,
                )}
                className="font-mono text-sm"
              />
            </div>

            {/* Warnings and Issues */}
            {translationResult.warnings.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  Translation Notes ({translationResult.warnings.length})
                </h4>

                <div className="space-y-2">
                  {translationResult.warnings.map(
                    (warning: any, index: number) => (
                      <div
                        key={index}
                        className={cn(
                          'p-3 rounded-lg border',
                          getSeverityColor(warning.severity),
                        )}
                      >
                        <div className="flex items-start gap-2">
                          {getSeverityIcon(warning.severity)}
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">
                              {warning.message}
                            </p>
                            {warning.originalTerm && (
                              <p className="text-xs text-muted-foreground">
                                Term: "{warning.originalTerm}"
                              </p>
                            )}
                            {warning.suggestion && (
                              <p className="text-xs text-blue-700">
                                💡 Suggestion: {warning.suggestion}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Legal Terms Analysis */}
            {translationResult.legalTerms.length > 0 && (
              <Accordion type="single" collapsible>
                <AccordionItem value="legal-terms">
                  <AccordionTrigger className="text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4" />
                      Legal Terms Analysis (
                      {translationResult.legalTerms.length})
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      {translationResult.legalTerms.map(
                        (term: any, index: number) => (
                          <div
                            key={index}
                            className="p-3 border rounded-lg bg-muted/30"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">
                                  {term.term}
                                </span>
                                <span className="text-muted-foreground">→</span>
                                <span className="font-medium text-sm">
                                  {term.translation}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    getConfidenceColor(term.confidence),
                                  )}
                                >
                                  {Math.round(term.confidence * 100)}%
                                </Badge>
                                {term.requiresAdaptation && (
                                  <Badge
                                    variant="outline"
                                    className="text-amber-600"
                                  >
                                    Adaptation Required
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <p className="text-xs text-muted-foreground">
                              {term.definition}
                            </p>

                            {!term.equivalentConcept && (
                              <div className="mt-2 flex items-start gap-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs">
                                <AlertTriangle className="h-3 w-3 text-amber-600 mt-0.5 shrink-0" />
                                <span className="text-amber-800">
                                  No direct legal equivalent in target
                                  jurisdiction
                                </span>
                              </div>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}

            {/* Preserved Terms */}
            {translationResult.preservedTerms.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  Preserved Original Terms
                </h4>
                <div className="flex flex-wrap gap-2">
                  {translationResult.preservedTerms.map(
                    (term: string, index: number) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-blue-50 text-blue-800"
                      >
                        {term}
                      </Badge>
                    ),
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  These terms were preserved in the original language to
                  maintain legal accuracy.
                </p>
              </div>
            )}

            {/* Translation Metadata */}
            <div className="pt-3 border-t text-xs text-muted-foreground space-y-1">
              <div className="flex items-center justify-between">
                <span>Processing Method:</span>
                <Badge variant="outline" className="text-xs">
                  {translationResult.metadata.method.replace('_', ' ')}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Processing Time:</span>
                <span>{translationResult.metadata.processingTime}ms</span>
              </div>
              {translationResult.metadata.reviewRequired && (
                <div className="flex items-center gap-1 text-amber-600">
                  <Users className="h-3 w-3" />
                  <span>Professional review recommended</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LegalTranslator;
