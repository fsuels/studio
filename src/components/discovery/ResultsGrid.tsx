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
              className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 hover:shadow-xl hover:scale-105 p-6"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Content */}
              <div className="relative flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="p-3 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 rounded-xl border border-emerald-200 dark:border-emerald-700 group-hover:scale-110 transition-transform duration-300">
                    <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                
                {/* Document Info */}
                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 leading-tight mb-2 transition-colors duration-300">
                    {translatedDoc.name}
                  </h4>
                  
                  {/* Confidence Indicator */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                      confidence.level === 'excellent' ? 'bg-emerald-200 text-emerald-900 dark:bg-emerald-800 dark:text-emerald-100' :
                      confidence.level === 'good' ? 'bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-blue-100' :
                      confidence.level === 'fair' ? 'bg-yellow-200 text-yellow-900 dark:bg-yellow-800 dark:text-yellow-100' :
                      confidence.level === 'weak' ? 'bg-orange-200 text-orange-900 dark:bg-orange-800 dark:text-orange-100' :
                      'bg-red-200 text-red-900 dark:bg-red-800 dark:text-red-100'
                    }`}>
                      <span className="text-xs">{confidence.icon}</span>
                      <span>{confidence.score}% match</span>
                    </div>
                    {confidence.level === 'excellent' && (
                      <div className="flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-300">
                        <span>✨</span>
                        <span>Perfect match!</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                    {translatedDoc.description}
                  </p>
                  
                  {/* Confidence message */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                    {confidence.message}
                  </p>
                  
                  {/* Click indicator */}
                  <div className="flex items-center gap-1 mt-3 text-xs text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-300">
                    <span>Create document</span>
                    <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
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