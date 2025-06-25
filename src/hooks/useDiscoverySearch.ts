import { useState, useMemo, useCallback, useEffect } from 'react';
import { SemanticAnalysisEngine, type SemanticResult, type DidYouMeanResult } from '@/lib/semantic-analysis-engine';
import { findMatchingDocuments } from '@/lib/document-library';
import { preprocessQuery } from '@/lib/search/comprehensive-synonym-map';
import type { LegalDocument } from '@/lib/document-library';

// Helper function to calculate confidence - matches SemanticAnalysisEngine logic
function calculateConfidence(score: number): SemanticResult['confidence'] {
  if (score >= 80) {
    return {
      score: Math.min(98, 85 + Math.floor(score / 20)),
      level: 'excellent',
      color: 'emerald',
      icon: '🎯',
      message: 'Excellent match for your needs'
    };
  } else if (score >= 60) {
    return {
      score: Math.min(84, 70 + Math.floor(score / 10)),
      level: 'good',
      color: 'blue',
      icon: '👍',
      message: 'Good match for your situation'
    };
  } else if (score >= 40) {
    return {
      score: Math.min(69, 55 + Math.floor(score / 5)),
      level: 'fair',
      color: 'yellow',
      icon: '⚡',
      message: 'May be relevant to your needs'
    };
  } else if (score >= 20) {
    return {
      score: Math.min(54, 35 + score),
      level: 'weak',
      color: 'orange',
      icon: '💡',
      message: 'Potential match worth considering'
    };
  } else {
    return {
      score: Math.max(15, score + 10),
      level: 'poor',
      color: 'red',
      icon: '❓',
      message: 'Limited relevance detected'
    };
  }
}

export interface UseDiscoverySearchOptions {
  locale: 'en' | 'es';
  maxResults?: number;
}

export interface UseDiscoverySearchReturn {
  searchInput: string;
  setSearchInput: (input: string) => void;
  results: SemanticResult[];
  suggestion: DidYouMeanResult | null;
  isSearching: boolean;
  performSearch: (query: string) => void;
  clearResults: () => void;
}

export function useDiscoverySearch({ locale, maxResults = 8 }: UseDiscoverySearchOptions): UseDiscoverySearchReturn {
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState<SemanticResult[]>([]);
  const [suggestion, setSuggestion] = useState<DidYouMeanResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const semanticEngine = useMemo(() => new SemanticAnalysisEngine(), []);

  // Auto-search with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.trim()) {
        performSearch(searchInput);
      } else {
        setResults([]);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchInput]); // eslint-disable-line react-hooks/exhaustive-deps

  const performSearch = useCallback(async (query: string) => {
    console.log('🔍 performSearch called with:', query);
    
    if (!query.trim()) {
      console.log('❌ Empty query, clearing results');
      setResults([]);
      return;
    }

    console.log('⏳ Starting enhanced search...');
    setIsSearching(true);
    
    try {
      // Add small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('🧠 Using enhanced document library search...');
      // Use the new enhanced search from document library
      const documents = findMatchingDocuments(query, locale);
      
      // Convert to SemanticResult format for compatibility
      const searchResults: SemanticResult[] = documents.slice(0, maxResults).map((doc, index) => {
        const baseScore = Math.max(20, 95 - (index * 15)); // Score decreases with position
        const confidence = calculateConfidence(baseScore);
        
        return {
          doc: doc,
          score: baseScore / 100,
          reasons: [`Found via intelligent keyword matching`],
          confidence
        };
      });

      // Fallback to semantic engine if no results from enhanced search
      if (searchResults.length === 0) {
        console.log('🔄 No results from enhanced search, trying semantic engine...');
        const semanticResults = semanticEngine.analyze(query, {
          locale,
          maxResults
        });
        searchResults.push(...semanticResults);
      }

      if (searchResults.length === 0) {
        const newSuggestion = semanticEngine.suggest(query);
        setSuggestion(newSuggestion);
      } else {
        setSuggestion(null);
      }
      
      console.log('✅ Search completed, results:', searchResults.length);
      console.log('📝 Expanded query tokens:', preprocessQuery(query, locale));
      setResults(searchResults);
    } catch (error) {
      console.error('❌ Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [semanticEngine, locale, maxResults]);

  const clearResults = useCallback(() => {
    setResults([]);
    setSearchInput('');
  }, []);

  return {
    searchInput,
    setSearchInput,
    results,
    suggestion,
    isSearching,
    performSearch,
    clearResults
  };
}