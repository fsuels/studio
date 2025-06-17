'use client';

import React, { useState } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { explainClause } from '@/ai/flows/explain-clause';

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
}

function ClauseTooltip({ id, text, children }: ClauseTooltipProps) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleOpenChange = async (open: boolean) => {
    if (!open) return;
    const cached = getCache(id);
    if (cached) {
      setContent(cached);
      return;
    }
    setLoading(true);
    const result = await explainClause(text);
    setLoading(false);
    setContent(result);
    setCache(id, result);
  };

  return (
    <Tooltip onOpenChange={handleOpenChange} delayDuration={200}>
      <span className="inline-flex items-start gap-1">
        {children}
        <TooltipTrigger asChild>
          <button type="button" className="text-muted-foreground" aria-label="Explain clause">
            🤖
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-xs leading-snug">
          {loading ? 'Explaining...' : content || 'Explain clause'}
        </TooltipContent>
      </span>
    </Tooltip>
  );
}

export default ClauseTooltip;
