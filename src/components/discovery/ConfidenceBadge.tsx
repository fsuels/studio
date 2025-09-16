// src/components/discovery/ConfidenceBadge.tsx
// Confidence badge component with reason tooltip

import React from 'react';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { DiscoveryResult } from '@/types/discovery';

interface ConfidenceBadgeProps {
  confidence: number;
  reason: DiscoveryResult['reason'];
  className?: string;
}

const reasonMessages: Record<DiscoveryResult['reason'], string> = {
  keyword: 'Direct keyword match - Found exact terms in document metadata',
  synonym: 'Synonym match - Found related terms that match your search intent',
  semantic: 'AI semantic match - Similar meaning detected through machine learning',
  hybrid: 'Combined match - Found through both keyword and semantic analysis',
};

const reasonColors: Record<DiscoveryResult['reason'], string> = {
  keyword: 'bg-emerald-100 border-emerald-200 text-emerald-800',
  synonym: 'bg-blue-100 border-blue-200 text-blue-800',
  semantic: 'bg-purple-100 border-purple-200 text-purple-800',
  hybrid: 'bg-amber-100 border-amber-200 text-amber-800',
};

export function ConfidenceBadge({ confidence, reason, className = '' }: ConfidenceBadgeProps) {
  const percentage = Math.round(confidence * 100);
  const colorClass = reasonColors[reason];

  return (
    <div 
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${colorClass} ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <span>{percentage}%</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-3 w-3 cursor-help opacity-70 hover:opacity-100 transition-opacity" />
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-1">
              <div className="font-medium capitalize">{reason} Match</div>
              <div className="text-xs opacity-90">
                {reasonMessages[reason]}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export default ConfidenceBadge;