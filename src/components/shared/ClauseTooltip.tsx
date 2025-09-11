'use client';

import React, { useState, useEffect } from 'react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { explainClause } from '@/ai/flows/explain-clause';
import { useAccessibility } from '@/contexts/AccessibilityProvider';
import { Lightbulb, Volume2, Eye } from 'lucide-react';

const memoryCache: Record<string, string> = {};

function getCache(id: string): string | null {
  if (memoryCache[id]) return memoryCache[id];
  if (typeof window !== 'undefined') {
    const val = localStorage.getItem('clause:' + id);
    if (val) {
      memoryCache[id] = val;
      return val;
    }
  }
  return null;
}

function setCache(id: string, text: string) {
  memoryCache[id] = text;
  if (typeof window !== 'undefined') {
    localStorage.setItem('clause:' + id, text);
  }
}

interface ClauseTooltipProps {
  id: string;
  text: string;
  children: React.ReactNode;
  className?: string;
  importance?: 'low' | 'medium' | 'high';
}

function ClauseTooltip({
  id,
  text,
  children,
  className,
  importance = 'medium',
}: ClauseTooltipProps) {
  const aiEnabled = !!process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  const { preferences } = useAccessibility();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isAutoExplained, setIsAutoExplained] = useState(false);
  const [simplifiedText, setSimplifiedText] = useState<string>('');

  // Auto-explain when accessibility mode is active
  useEffect(() => {
    if (preferences.autoExplainClauses && !isAutoExplained && !content) {
      handleExplain();
      setIsAutoExplained(true);
    }
  }, [preferences.autoExplainClauses, isAutoExplained, content]);

  // Simplify jargon when enabled
  useEffect(() => {
    if (preferences.simplifyLegalJargon && text) {
      simplifyJargon();
    } else {
      setSimplifiedText('');
    }
  }, [preferences.simplifyLegalJargon, text]);

  const handleExplain = async () => {
    if (!aiEnabled) {
      setContent('AI explanations are disabled in this environment.');
      return;
    }
    const cached = getCache(id);
    if (cached) {
      setContent(cached);
      return;
    }
    setLoading(true);
    try {
      const result = await explainClause(text);
      setContent(result);
      setCache(id, result);
    } catch (error) {
      console.error('Failed to explain clause:', error);
      setContent('Unable to explain this clause at the moment.');
    }
    setLoading(false);
  };

  const simplifyJargon = async () => {
    try {
      const response = await fetch('/api/accessibility/simplify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSimplifiedText(data.simplified);
        }
      }
    } catch (error) {
      console.error('Failed to simplify jargon:', error);
    }
  };

  const handleOpenChange = async (open: boolean) => {
    if (!open) return;
    if (!content) {
      await handleExplain();
    }
  };

  const speakText = (textToSpeak: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const getImportanceColor = () => {
    switch (importance) {
      case 'high':
        return 'text-red-600 dark:text-red-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'low':
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const renderChildren = () => {
    if (preferences.simplifyLegalJargon && simplifiedText) {
      return (
        <span className="legal-jargon-simplified relative">
          {simplifiedText}
          <Badge
            variant="secondary"
            className="ml-1 text-xs"
            title="This text has been simplified"
          >
            Simplified
          </Badge>
        </span>
      );
    }

    if (preferences.highlightImportantSections && importance === 'high') {
      return <span className="important-section-highlight">{children}</span>;
    }

    return children;
  };

  return (
    <Tooltip
      onOpenChange={handleOpenChange}
      delayDuration={preferences.autoExplainClauses ? 0 : 200}
    >
      <span className={`inline-flex items-start gap-1 ${className || ''}`}>
        {renderChildren()}

        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`
              h-5 w-5 p-0 ${getImportanceColor()}
              ${preferences.autoExplainClauses ? 'opacity-100' : 'opacity-60 hover:opacity-100'}
              ${preferences.focusIndicatorEnhanced ? 'focus:ring-2 focus:ring-offset-2' : ''}
            `}
            aria-label={`Explain clause${content ? ' - explanation available' : ''}`}
            aria-expanded={!!content}
            aria-describedby={content ? `tooltip-${id}` : undefined}
          >
            <Lightbulb className="h-3 w-3" />
          </Button>
        </TooltipTrigger>

        <TooltipContent
          id={`tooltip-${id}`}
          className={`
            max-w-xs text-xs leading-snug
            ${preferences.fontSize !== 'medium' ? 'text-sm' : ''}
            ${preferences.dyslexiaFriendlyFont ? 'dyslexia-friendly-font' : ''}
          `}
          role="tooltip"
          aria-live="polite"
        >
          <div className="space-y-2">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full" />
                <span>Explaining...</span>
              </div>
            ) : content ? (
              <>
                <div className="text-left">{content}</div>

                {preferences.voiceGuidance && (
                  <div className="flex items-center gap-2 pt-1 border-t border-border">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0"
                      onClick={() => speakText(content)}
                      aria-label="Read explanation aloud"
                    >
                      <Volume2 className="h-3 w-3" />
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      Click to hear
                    </span>
                  </div>
                )}

                {importance === 'high' && (
                  <Badge variant="destructive" className="text-xs">
                    Important
                  </Badge>
                )}
              </>
            ) : (
              <span>Click to explain this clause</span>
            )}
          </div>
        </TooltipContent>
      </span>
    </Tooltip>
  );
}

export default ClauseTooltip;
