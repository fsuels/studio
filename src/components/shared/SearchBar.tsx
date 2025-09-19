// src/components/SearchBar.tsx
"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { resolveDocSlug } from '@/lib/slug-alias';
import { Input } from '@/components/ui/input';
import { Search, FileText, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRouter, useParams } from 'next/navigation';
import { searchWorkflowDocuments, type DocumentSummary } from '@/lib/workflow/document-workflow';

const SearchBar = React.memo(function SearchBar() {
  const { t: tHeader } = useTranslation('header');
  const router = useRouter();
  const params = (useParams<{ locale?: string }>() ?? {}) as {
    locale?: string;
  };
  const locale = (params.locale as 'en' | 'es') || 'en';
  const marketplaceDestination = `/${locale}/marketplace`;

  useEffect(() => {
    router.prefetch(marketplaceDestination);
  }, [marketplaceDestination, router]);

  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<DocumentSummary[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const hydratedSuggestions = useMemo(() => {
    if (!isHydrated) return [] as DocumentSummary[];

    const term = searchTerm.trim();
    if (term.length <= 1) return [];

    const results = searchWorkflowDocuments(term, {
      jurisdiction: 'us',
      language: locale === 'es' ? 'es' : 'en',
    });

    return results.slice(0, 5);
  }, [isHydrated, locale, searchTerm]);

  useEffect(() => {
    setSuggestions(hydratedSuggestions);
    setShowSuggestions(isHydrated && hydratedSuggestions.length > 0);
  }, [hydratedSuggestions, isHydrated]);

  // Close on outside click
  useEffect(() => {
    if (!isHydrated) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isHydrated]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isHydrated) return;
    if (searchTerm.trim()) {
      router.push(
        `${marketplaceDestination}?search=${encodeURIComponent(searchTerm)}`
      );
      setSearchTerm('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = async (docId: string) => {
    if (!isHydrated) return;
    setSearchTerm('');
    setShowSuggestions(false);
    router.push(`/${locale}/docs/${resolveDocSlug(docId)}`);
  };

  const placeholderText = isHydrated
    ? tHeader('SearchBar.placeholder', {
        defaultValue: 'e.g. Lease, Will, NDA...',
      })
    : 'Loading…';
  const suggestionsHint = isHydrated
    ? tHeader('SearchBar.suggestionsHint', {
        defaultValue:
          'Popular: Lease \u00b7 Will \u00b7 Bill of Sale \u00b7 Power of Attorney',
      })
    : '';

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="relative w-full max-w-md mx-auto"
    >
      <div className="relative flex items-center shadow-lg rounded-full border border-gray-300 bg-background">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={searchInputRef}
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() =>
            isHydrated &&
            searchTerm.trim().length > 1 &&
            suggestions.length > 0 &&
            setShowSuggestions(true)
          }
          placeholder={placeholderText}
          className="flex-grow pl-10 pr-32 py-3 h-12 text-base rounded-full border-none placeholder-gray-400 focus:border-[#006EFF] focus:ring-2 focus:ring-offset-2 focus:ring-[#00C3A3]"
          aria-label={placeholderText}
          disabled={!isHydrated}
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 whitespace-nowrap text-sm font-medium text-white px-3 py-2 rounded-full bg-gradient-to-r from-electric-500 to-electric-700 hover:to-electric-600"
        >
          {tHeader('SearchBar.cta', { defaultValue: 'Find Template' })}
        </button>

        {isHydrated && showSuggestions && suggestions.length > 0 && (
          <ul
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((suggestion) => {
              const translation =
                suggestion.translations?.[locale as 'en' | 'es'] ??
                suggestion.translations?.en;
              const name = translation?.name || suggestion.title;
              return (
                <li key={suggestion.id}>
                  <button
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion.id)}
                    /* Removed eager prefetch to reduce network overhead */
                    className="w-full text-left px-3 py-2.5 hover:bg-muted text-sm flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{name}</span>
                    <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground shrink-0" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {suggestionsHint && (
        <p className="mt-2 text-center text-sm text-slate-700 dark:text-slate-200">
          {suggestionsHint}
        </p>
      )}
    </form>
  );
});

export default SearchBar;
