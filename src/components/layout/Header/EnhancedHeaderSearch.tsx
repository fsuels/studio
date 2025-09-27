// src/components/layout/Header/EnhancedHeaderSearch.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { resolveDocSlug } from '@/lib/slug-alias';
import { useTranslation } from 'react-i18next';
import {
  Search as SearchIcon,
  FileText,
  ExternalLink,
  Star,
  Zap,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { getDocumentTitle } from '@/lib/format-utils';

type SearchResult = {
  slug: string;
  title: string;
  description: string;
  complexity: string;
  popular: boolean;
  category: string;
  relevanceScore: number;
  matchType: 'exact' | 'synonym' | 'fuzzy' | 'category';
};

type SiteLink = {
  href: string;
  title: string;
  keywords: string[];
};

interface EnhancedHeaderSearchProps {
  autoFocus?: boolean;
  clientLocale: 'en' | 'es';
  mounted: boolean;
  className?: string;
  userRole?: string;
  onNavigate?: () => void;
}

export default function EnhancedHeaderSearch({
  clientLocale,
  mounted,
  className = '',
  userRole,
  autoFocus = false,
  onNavigate,
}: EnhancedHeaderSearchProps) {
  const router = useRouter();
  const { t: tHeader } = useTranslation('header');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const suggestionsFetchedRef = useRef(false);

  const placeholderSearch = mounted
    ? tHeader('search.placeholder', { defaultValue: 'Search documents...' })
    : 'Search documents...';

  const siteLinks: SiteLink[] = React.useMemo(
    () => [
      {
        href: `/${clientLocale}/pricing`,
        title: tHeader('nav.pricing', { defaultValue: 'Pricing' }),
        keywords: ['pricing', 'price', 'plan', 'plans'],
      },
      {
        href: `/${clientLocale}/features`,
        title: tHeader('nav.features', { defaultValue: 'Features' }),
        keywords: ['feature', 'features', 'capabilities'],
      },
      {
        href: `/${clientLocale}/faq`,
        title: tHeader('nav.faq', { defaultValue: 'FAQ' }),
        keywords: ['faq', 'questions', 'help', 'support'],
      },
      {
        href: `/${clientLocale}/blog`,
        title: tHeader('nav.blog', { defaultValue: 'Blog' }),
        keywords: ['blog', 'article', 'news'],
      },
    ],
    [clientLocale, tHeader],
  );

  const performSearch = useCallback(
    async (query: string) => {
      const trimmed = query.trim();
      if (trimmed.length === 0) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      if (trimmed.length < 2) {
        return;
      }

      setIsLoading(true);

      try {
        const { taxonomy } = await import('@/config/taxonomy');
        const useEnhanced = !!taxonomy?.feature_flags?.wizard_v4?.enabled;

        if (useEnhanced) {
          const { enhancedSearch } = await import('@/lib/enhanced-search');
          const results = await enhancedSearch(trimmed, clientLocale, {
            maxResults: 8,
            roleFilter: userRole,
          });
          setSearchResults(results);
          setShowResults(results.length > 0);
        } else {
          const { legacySearch } = await import('@/lib/enhanced-search');
          const legacyResults = await legacySearch(trimmed, clientLocale);
          const mappedResults: SearchResult[] = legacyResults.slice(0, 8).map((doc) => ({
            slug: doc.id,
            title: getDocumentTitle(doc, clientLocale),
            description:
              doc.translations?.[clientLocale]?.description ||
              doc.description ||
              '',
            complexity: 'medium',
            popular: false,
            category: doc.category,
            relevanceScore: 50,
            matchType: 'fuzzy',
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
      onNavigate?.();
      router.push(`/${clientLocale}/docs/${resolveDocSlug(firstResult.slug)}/start`);
    }
  };

  const handleFocus = async () => {
    try {
      if (!suggestionsFetchedRef.current) {
        const { taxonomy } = await import('@/config/taxonomy');
        const useEnhanced = !!taxonomy?.feature_flags?.wizard_v4?.enabled;
        if (useEnhanced) {
          const { getSearchSuggestions } = await import('@/lib/enhanced-search');
          const items = await getSearchSuggestions(clientLocale);
          setSuggestions(items);
        }
        suggestionsFetchedRef.current = true;
      }
    } catch (_error) {
      // ignore
    }

    if (searchQuery.trim().length === 0 && suggestions.length > 0) {
      setSearchResults(suggestions);
      setShowResults(true);
    } else if (searchQuery.trim().length > 1 && (searchResults.length > 0 || siteMatches.length > 0)) {
      setShowResults(true);
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

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const showSuggestions = searchQuery.trim().length === 0 && suggestions.length > 0;

  const siteMatches = React.useMemo(() => {
    if (normalizedQuery.length < 2) {
      return [] as SiteLink[];
    }

    return siteLinks.filter(
      (link) =>
        link.keywords.some((keyword) => normalizedQuery.includes(keyword)) ||
        link.title.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery, siteLinks]);

  useEffect(() => {
    if (siteMatches.length > 0 && normalizedQuery.length >= 2) {
      setShowResults(true);
    }
  }, [normalizedQuery, siteMatches]);

  const resultsToShow = showSuggestions ? suggestions : searchResults;
  const shouldRenderResultsPanel = showResults && (resultsToShow.length > 0 || siteMatches.length > 0);

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
        autoFocus={autoFocus}
        className="h-10 pl-10 text-base md:text-sm rounded-md w-full bg-muted border-input focus:border-primary focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
        disabled={!mounted}
        aria-label={placeholderSearch}
      />

      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {shouldRenderResultsPanel && (
        <div
          ref={searchResultsRef}
          className="absolute top-full mt-1 w-full max-h-80 overflow-y-auto bg-popover border border-border rounded-md shadow-lg z-[70]"
        >
          {resultsToShow.length > 0 && (
            <>
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
                      href={`/${clientLocale}/docs/${resolveDocSlug(result.slug)}/start`}
                      className="flex items-start gap-3 px-3 py-2.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors w-full text-left group"
                      prefetch
                      onClick={() => {
                        onNavigate?.();
                        setShowResults(false);
                      }}
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
                        <ExternalLink className="h-3 w-3 text-muted-foreground/70 group-hover:text-muted-foreground" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          {!showSuggestions && siteMatches.length > 0 && (
            <>
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-t bg-muted/40">
                {tHeader('search.sitePages', { defaultValue: 'Website pages' })}
              </div>
              <ul className="py-1">
                {siteMatches.map((page) => (
                  <li key={page.href}>
                    <Link
                      href={page.href}
                      className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors w-full text-left group"
                      prefetch
                      onClick={() => {
                        onNavigate?.();
                        setShowResults(false);
                      }}
                    >
                      <span className="text-sm font-medium text-foreground group-hover:text-primary">
                        {page.title}
                      </span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground/70 group-hover:text-muted-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </form>
  );
}
