'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, Zap, Star } from 'lucide-react';
import { getDocTranslation } from '@/lib/i18nUtils';
import type { SemanticResult } from '@/lib/semantic-analysis-engine';
import type { DiscoveryResult } from '@/types/discovery';
import { ConfidenceBadge } from './ConfidenceBadge';
import { ResultCardSkeleton } from './ResultCardSkeleton';

interface ResultsGridProps {
  results: (SemanticResult | DiscoveryResult)[];
  locale: 'en' | 'es';
  onDocumentClick: (docId: string) => void;
  isLoading: boolean;
}

export function ResultsGrid({ results, locale, onDocumentClick, isLoading }: ResultsGridProps) {

  if (isLoading) {
    return (
      <div className="space-y-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <ResultCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 pb-8">
      {/* Results Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
              <Zap className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-emerald-900 dark:text-emerald-100">
                AI Recommendations
              </h3>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                Documents that may help with your situation
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-white dark:bg-gray-900 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-700">
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                {results.length} {results.length === 1 ? 'match' : 'matches'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {results.map((result, index) => {
          // Handle both SemanticResult and DiscoveryResult types
          const isSemanticResult = 'doc' in result;
          const doc = isSemanticResult ? result.doc : null;
          const translatedDoc = doc ? getDocTranslation(doc, locale) : null;
          
          // Extract confidence and reason
          const confidence = isSemanticResult 
            ? result.confidence.score 
            : (result as DiscoveryResult).confidence * 100;
          const reason = isSemanticResult 
            ? 'semantic' as const
            : (result as DiscoveryResult).reason;
          
          const isBestMatch = confidence >= 85;
          
          // For DiscoveryResult, use the result properties directly
          const title = translatedDoc?.name || (result as DiscoveryResult).title || 'Untitled Document';
          
          // Enhanced description fallback with better debugging
          const discoveryDescription = (result as DiscoveryResult).description;
          const description = translatedDoc?.description || discoveryDescription || '';
          
          // Debug logging for empty descriptions (remove in production)
          if (!description || description.trim() === '') {
            console.warn(`[Results Grid] Empty description for document:`, {
              docId: isSemanticResult ? result.doc.id : result.id,
              hasTranslatedDoc: !!translatedDoc,
              translatedDocDesc: translatedDoc?.description,
              discoveryResultDesc: discoveryDescription,
              resultType: isSemanticResult ? 'semantic' : 'discovery'
            });
          }
          
          const docId = isSemanticResult ? result.doc.id : result.id;

          return (
            <Link
              key={docId}
              href={`/${locale}/docs/${docId}`}
              onClick={() => onDocumentClick(docId)}
              className={`group relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-300 hover:shadow-lg p-6 block ${
                isBestMatch ? 'border-emerald-500 animate-subtle-glow' : ''
              }`}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              
              {/* Content */}
              <div className="relative flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 group-hover:scale-110 transition-transform duration-300">
                    <FileText className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  </div>
                </div>
                
                {/* Document Info */}
                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100 leading-tight mb-2">
                    {title}
                  </h4>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                    {description && description.trim() ? (
                      <>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">Use for:</span> {description}
                      </>
                    ) : (
                      <>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">Use for:</span> 
                        <span className="italic"> Professional legal document for {title.toLowerCase()} needs</span>
                      </>
                    )}
                  </p>
                  
                  {/* Primary CTA - Prominent Button */}
                  <div className="mt-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                      <span>Create Document Now</span>
                      <span className="text-emerald-100 group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </div>
                  </div>
                </div>

                {/* Match percentage badge - right aligned */}
                <div className="flex-shrink-0 flex flex-col items-end gap-1">
                  {/* Excellence indicator */}
                  {isBestMatch && (
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>Best match</span>
                    </div>
                  )}
                  
                  {/* Enhanced confidence badge with reason tooltip */}
                  <ConfidenceBadge 
                    confidence={confidence / 100} 
                    reason={reason}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}