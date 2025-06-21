// src/components/layout/Header/EnhancedHeaderSearch.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  Search as SearchIcon,
  FileText,
  ExternalLink,
  Star,
  Clock,
  Zap,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  enhancedSearch,
  getSearchSuggestions,
  legacySearch,
} from '@/lib/enhanced-search';
import { taxonomy } from '@/config/taxonomy';
import type { LegalDocument } from '@/lib/document-library';

interface SearchResult {
  slug: string;
  title: string;
  description: string;
  complexity: string;
  popular: boolean;
  category: string;
  relevanceScore: number;
  matchType: 'exact' | 'synonym' | 'fuzzy' | 'category';
}

interface EnhancedHeaderSearchProps {
  clientLocale: 'en' | 'es';
  mounted: boolean;
  className?: string;
  userRole?: string; // Optional: for role-based filtering
}

export default function EnhancedHeaderSearch({
  clientLocale,
  mounted,
  className = '',
  userRole,
}: EnhancedHeaderSearchProps) {
  const { t: tHeader } = useTranslation('header');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const placeholderSearch = mounted
    ? tHeader('search.placeholder', { defaultValue: 'Search documents...' })
    : 'Search documents...';

  // Load suggestions on mount
  useEffect(() => {
    if (mounted) {
      getSearchSuggestions(clientLocale).then(setSuggestions);
    }
  }, [mounted, clientLocale]);

  // Enhanced search functionality with debouncing
  const performSearch = useCallback(
    async (query: string) => {
      if (query.trim().length === 0) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      if (query.trim().length < 2) {
        return;
      }

      setIsLoading(true);

      try {
        // Check if enhanced search is enabled
        const useEnhanced = taxonomy.feature_flags?.wizard_v4?.enabled;

        if (useEnhanced) {
          const results = await enhancedSearch(query, clientLocale, {
            maxResults: 8,
            roleFilter: userRole,
          });
          setSearchResults(results);
          setShowResults(results.length > 0);
        } else {
          // Fallback to legacy search
          const legacyResults = legacySearch(query, clientLocale);
          const mappedResults: SearchResult[] = legacyResults
            .slice(0, 8)
            .map((doc) => ({
              slug: doc.id,
              title:
                doc.translations?.[clientLocale]?.name || doc.name || doc.id,
              description:
                doc.translations?.[clientLocale]?.description ||
                doc.description ||
                '',
              complexity: 'medium', // Default complexity
              popular: false,
              category: doc.category,
              relevanceScore: 50,
              matchType: 'fuzzy' as const,
            }));
          setSearchResults(mappedResults);
          setShowResults(mappedResults.length > 0);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
        setShowResults(false);
      } finally {
        setIsLoading(false);
      }
    },
    [clientLocale, userRole],
  );

  // Debounced search effect
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery, performSearch]);

  // Click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node) &&
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      const firstResult = searchResults[0];
      window.location.href = `/${clientLocale}/docs/${firstResult.slug}`;
    }
  };

  const handleFocus = () => {
    if (searchQuery.trim().length === 0 && suggestions.length > 0) {
      setSearchResults(suggestions);
      setShowResults(true);
    } else if (searchQuery.trim().length > 1 && searchResults.length > 0) {
      setShowResults(true);
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMatchTypeIcon = (matchType: string) => {
    switch (matchType) {
      case 'exact':
        return <Zap className="h-3 w-3" />;
      case 'synonym':
        return <Star className="h-3 w-3" />;
      default:
        return <FileText className="h-3 w-3" />;
    }
  };

  if (!mounted) {
    return (
      <div className={cn('relative flex-1 max-w-xs', className)}>
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    );
  }

  const showSuggestions =
    searchQuery.trim().length === 0 && suggestions.length > 0;
  const resultsToShow = showSuggestions ? suggestions : searchResults;

  return (
    <form
      className={cn('relative flex-1 max-w-xs', className)}
      onSubmit={handleSearchSubmit}
    >
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <Input
        ref={searchInputRef}
        id="enhanced-header-search"
        name="search"
        type="search"
        placeholder={placeholderSearch}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={handleFocus}
        className="h-10 pl-10 text-sm rounded-md w-full bg-muted border-input focus:border-primary focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
        disabled={!mounted}
        aria-label={placeholderSearch}
      />

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {/* Search Results */}
      {showResults && resultsToShow.length > 0 && (
        <div
          ref={searchResultsRef}
          className="absolute top-full mt-1 w-full max-h-80 overflow-y-auto bg-popover border border-border rounded-md shadow-lg z-[70]"
        >
          {/* Header for suggestions vs search results */}
          {showSuggestions && (
            <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b bg-muted/50">
              {tHeader('search.suggestions', {
                defaultValue: 'Popular Documents',
              })}
            </div>
          )}

          <ul className="py-1">
            {resultsToShow.map((result) => (
              <li key={result.slug}>
                <Link
                  href={`/${clientLocale}/docs/${result.slug}`}
                  className="flex items-start gap-3 px-3 py-2.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors w-full text-left group"
                  prefetch
                  onClick={() => setShowResults(false)}
                >
                  <div className="shrink-0 mt-0.5 text-muted-foreground">
                    {getMatchTypeIcon(result.matchType)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium truncate">
                        {result.title}
                      </span>
                      {result.popular && (
                        <Star className="h-3 w-3 text-yellow-500 shrink-0" />
                      )}
                    </div>
                    {result.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {result.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Badge
                      variant="secondary"
                      className={cn(
                        'text-xs px-1.5 py-0.5',
                        getComplexityColor(result.complexity),
                      )}
                    >
                      {result.complexity}
                    </Badge>
                    <ExternalLink className="h-3 w-3 text-muted-foreground/70 group-hover:text-muted-foreground" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* Enhanced search hint */}
          {!showSuggestions && searchQuery.trim().length > 0 && (
            <div className="px-3 py-2 text-xs text-muted-foreground border-t bg-muted/30">
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Try: "rental", "NDA", "LLC", "POA"
              </div>
            </div>
          )}
        </div>
      )}
    </form>
  );
}
