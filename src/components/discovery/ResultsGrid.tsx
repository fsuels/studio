'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, Zap } from 'lucide-react';
import { getDocTranslation } from '@/lib/i18nUtils';
import type { SemanticResult } from '@/lib/semantic-analysis-engine';

interface ResultsGridProps {
  results: SemanticResult[];
  locale: 'en' | 'es';
  onDocumentClick: (docId: string) => void;
}

export function ResultsGrid({ results, locale, onDocumentClick }: ResultsGridProps) {
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
          const translatedDoc = getDocTranslation(result.doc, locale);
          const { confidence } = result;
          
          return (
            <Link
              key={result.doc.id}
              href={`/${locale}/docs/${result.doc.id}`}
              onClick={() => onDocumentClick(result.doc.id)}
              className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-300 hover:shadow-lg p-6"
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
                    {translatedDoc.name}
                  </h4>
                  
                  {/* Excellence indicator only */}
                  {confidence.level === 'excellent' && (
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 mb-3">
                      <span>✨</span>
                      <span>Perfect match!</span>
                    </div>
                  )}
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                    {translatedDoc.description}
                  </p>
                  
                  {/* Confidence message */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                    {confidence.message}
                  </p>
                  
                  {/* Primary CTA with accent color */}
                  <div className="flex items-center gap-1 mt-3 text-sm font-medium text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-300">
                    <span>Create document</span>
                    <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </div>
                </div>

                {/* Match percentage badge - right aligned */}
                <div className="flex-shrink-0">
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400">
                    <span>{confidence.score}%</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}