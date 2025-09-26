// src/components/SearchBar.tsx
"use client";

import React, {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { resolveDocSlug } from '@/lib/slug-alias';
import { Input } from '@/components/ui/input';
import { Search, FileText, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRouter, useParams } from 'next/navigation';
import type { DocumentSummary } from '@/lib/workflow/document-workflow';
import { loadWorkflowModule } from '@/lib/workflow/load-workflow-module';
import { cn } from '@/lib/utils';
import { track } from '@/lib/analytics';

type SearchBarProps = React.ComponentPropsWithoutRef<'form'> & {
  variant?: 'default' | 'hero';
  'data-testid'?: string;
};

const SearchBar = React.memo(function SearchBar({
  className,
  variant = 'default',
  'data-testid': dataTestId,
  ...rest
}: SearchBarProps) {
  const { t: tHeader } = useTranslation('header');
  const router = useRouter();
  const params = (useParams<{ locale?: string }>() ?? {}) as {
    locale?: string;
  };
  const locale = (params.locale as 'en' | 'es') || 'en';
  const docsBasePath = `/${locale}/docs`;

  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<DocumentSummary[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [workflowModule, setWorkflowModule] =
    useState<typeof import('@/lib/workflow/document-workflow') | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated || workflowModule) {
      return;
    }

    let cancelled = false;
    loadWorkflowModule()
      .then((module) => {
        if (!cancelled) {
          setWorkflowModule(module);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error('Failed to load workflow module for search bar:', error);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isHydrated, workflowModule]);

  const hydratedSuggestions = useMemo(() => {
    if (!isHydrated || !workflowModule) return [] as DocumentSummary[];

    const term = deferredSearchTerm.trim();
    if (term.length <= 1) return [];

    const results = workflowModule.searchWorkflowDocuments(term, {
      jurisdiction: 'us',
      language: locale === 'es' ? 'es' : 'en',
    });

    return results.slice(0, 5);
  }, [deferredSearchTerm, isHydrated, locale, workflowModule]);

  useEffect(() => {
    setSuggestions(hydratedSuggestions);
    const hasQuery = deferredSearchTerm.trim().length > 1;
    setShowSuggestions(isHydrated && hasQuery && hydratedSuggestions.length > 0);
  }, [deferredSearchTerm, hydratedSuggestions, isHydrated]);

  // Close the suggestion panel when users click away
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

    const term = searchTerm.trim();
    if (!term) return;

    const immediateMatch = suggestions[0];
    let targetDocId = immediateMatch?.id;

    if (!targetDocId && workflowModule) {
      const fallbackResults = workflowModule.searchWorkflowDocuments(term, {
        jurisdiction: 'us',
        language: locale === 'es' ? 'es' : 'en',
      });
      targetDocId = fallbackResults[0]?.id;
    }

    track('global_search_submit', {
      locale,
      query: term,
      docId: targetDocId ?? null,
      surface: variant,
    });

    if (targetDocId) {
      router.push(`${docsBasePath}/${resolveDocSlug(targetDocId)}`);
    } else {
      router.push(`${docsBasePath}?search=${encodeURIComponent(term)}`);
    }

    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleSuggestionClick = async (docId: string) => {
    if (!isHydrated) return;
    setSearchTerm('');
    setShowSuggestions(false);
    track('global_search_suggestion_click', {
      locale,
      docId,
      surface: variant,
    });
    router.push(`/${locale}/docs/${resolveDocSlug(docId)}`);
  };

  const placeholderText = isHydrated
    ? tHeader('SearchBar.placeholder', {
        defaultValue: 'e.g. Lease, Will, NDA...',
      })
    : 'Loading...';
  const suggestionsHint = isHydrated
    ? tHeader('SearchBar.suggestionsHint', {
        defaultValue:
          'Popular: Lease \u00b7 Will \u00b7 Bill of Sale \u00b7 Power of Attorney',
      })
    : '';

  const isHero = variant === 'hero';
  const formProps = {
    ...rest,
    'data-testid': dataTestId ?? 'searchbar',
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className={cn(
        'relative w-full',
        isHero ? 'max-w-2xl' : 'mx-auto max-w-md',
        className,
      )}
      {...formProps}
    >
      <div
        className={cn(
          'relative flex items-center rounded-full border border-gray-300 bg-background shadow-lg transition-shadow duration-300 focus-within:shadow-xl',
          isHero &&
            'border-transparent bg-white/85 px-2 py-2 ring-1 ring-emerald-200/70 backdrop-blur supports-[backdrop-filter]:backdrop-blur-xl',
        )}
      >
        <Search
          className={cn(
            'pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground',
            isHero && 'h-5 w-5 text-emerald-500',
          )}
        />
        <Input
          ref={searchInputRef}
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            if (
              isHydrated &&
              searchTerm.trim().length > 1 &&
              suggestions.length > 0
            ) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholderText}
          className={cn(
            'flex-grow rounded-full border-none pl-10 pr-32 placeholder-gray-400 focus:border-[#006EFF] focus:ring-2 focus:ring-[#00C3A3] focus:ring-offset-2',
            isHero ? 'h-14 py-4 text-lg' : 'h-12 py-3 text-base',
          )}
          aria-label={placeholderText}
          disabled={!isHydrated}
        />
        <button
          type="submit"
          className={cn(
            'absolute right-1.5 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-electric-500 to-electric-700 text-sm font-medium text-white transition hover:to-electric-600',
            isHero ? 'px-5 py-3 text-base shadow-md md:px-6' : 'px-3 py-2',
          )}
        >
          {tHeader('SearchBar.cta', { defaultValue: 'Find Template' })}
        </button>

        {isHydrated && showSuggestions && suggestions.length > 0 && (
          <ul
            ref={suggestionsRef}
            className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-border bg-popover shadow-lg"
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
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition hover:bg-muted"
                  >
                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{name}</span>
                    <ExternalLink className="ml-auto h-3 w-3 shrink-0 text-muted-foreground" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {suggestionsHint && (
        <p
          className={cn(
            'mt-2 text-center text-sm text-slate-700 dark:text-slate-200',
            isHero && 'text-left text-xs text-slate-600 md:text-sm',
          )}
        >
          {suggestionsHint}
        </p>
      )}
    </form>
  );
});

export default SearchBar;
