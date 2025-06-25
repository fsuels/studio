'use client';

import React from 'react';
import { Search, MessageSquare, Lightbulb, ArrowRight } from 'lucide-react';

interface NoResultsProps {
  searchQuery: string;
  suggestion: { suggestion: string } | null;
  onSuggestionClick: (text: string) => void;
}

const SUGGESTION_EXAMPLES = [
  {
    icon: '🏠',
    label: 'Real Estate',
    query: 'I need to buy a house',
    category: 'Real Estate'
  },
  {
    icon: '🚗',
    label: 'Vehicle Sale',
    query: 'I want to sell my car',
    category: 'Vehicle'
  },
  {
    icon: '👥',
    label: 'Employment',
    query: 'I need to hire an employee',
    category: 'Employment'
  },
  {
    icon: '🏢',
    label: 'Business',
    query: 'I want to start an LLC',
    category: 'Business'
  },
  {
    icon: '📋',
    label: 'Contract',
    query: 'I need a service agreement',
    category: 'Contracts'
  },
  {
    icon: '🤝',
    label: 'Partnership',
    query: 'I want to form a partnership',
    category: 'Business'
  }
];

export function NoResults({ searchQuery, suggestion, onSuggestionClick }: NoResultsProps) {
  return (
    <div className="py-16">
      <div className="text-center max-w-2xl mx-auto space-y-8">
        {/* Icon with animation */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-full animate-pulse"></div>
          <div className="relative flex items-center justify-center w-full h-full">
            <Search className="h-12 w-12 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
        
        {/* Message */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            No matching documents found
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            We couldn't find documents matching "{searchQuery}". Try being more specific or use different terms.
          </p>
          {suggestion && (
            <p className="text-gray-600 dark:text-gray-300">
              Did you mean:{" "}
              <button onClick={() => onSuggestionClick(suggestion.suggestion)} className="text-blue-500 hover:underline">
                {suggestion.suggestion}
              </button>
              ?
            </p>
          )}
        </div>

        {/* Enhanced Suggestions */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="space-y-4">
            <div className="flex items-center gap-3 justify-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">
                Try these examples
              </h3>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Click a category to find exactly what you need:
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {SUGGESTION_EXAMPLES.map((example, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-600"
                >
                  <span className="text-2xl">{example.icon}</span>
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100 text-center">
                    {example.label}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 text-center italic">
                    Try: "{example.query}"
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-blue-600 dark:text-blue-400">
                💡 Or try being more specific: "I need to hire an employee" or "I'm buying a house"
              </p>
            </div>
          </div>
        </div>

        {/* Additional Help */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex-shrink-0">
              <MessageSquare className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-left space-y-2">
              <h4 className="font-bold text-amber-900 dark:text-amber-100">
                Need more help?
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Describe your situation in plain English. For example: "I'm selling my car to my neighbor" 
                or "I need to protect my business idea with confidentiality"
              </p>
              <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 mt-3">
                <span>We'll find the right document template for you</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}