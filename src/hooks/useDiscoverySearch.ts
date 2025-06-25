import { useState, useMemo, useCallback, useEffect } from 'react';
import { SemanticAnalysisEngine, type SemanticResult, type DidYouMeanResult } from '@/lib/semantic-analysis-engine';
import type { LegalDocument } from '@/lib/document-library';

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

    console.log('⏳ Starting search...');
    setIsSearching(true);
    
    try {
      // Add small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('🧠 Calling semantic engine...');
      const searchResults = semanticEngine.analyze(query, {
        locale,
        maxResults
      });

      if (searchResults.length === 0) {
        const newSuggestion = semanticEngine.suggest(query);
        setSuggestion(newSuggestion);
      } else {
        setSuggestion(null);
      }
      
      console.log('✅ Search completed, results:', searchResults.length);
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