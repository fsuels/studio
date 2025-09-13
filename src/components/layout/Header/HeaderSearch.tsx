// src/components/layout/Header/HeaderSearch.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { resolveDocSlug } from '@/lib/slug-alias';
import { useTranslation } from 'react-i18next';
import { Search as SearchIcon, FileText, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getDocTranslation } from '@/lib/i18nUtils';
import type { LegalDocument } from '@/types/documents';
import { Skeleton } from '@/components/ui/skeleton';

interface HeaderSearchProps {
  clientLocale: 'en' | 'es';
  mounted: boolean;
  className?: string;
}

export default function HeaderSearch({
  clientLocale,
  mounted,
  className = '',
}: HeaderSearchProps) {
  const { t: tHeader } = useTranslation('header');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LegalDocument[]>([]);
  const [showResults, setShowResults] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);

  const placeholderSearch = mounted
    ? tHeader('search.placeholder', { defaultValue: 'Search documents...' })
    : 'Search documents...';

  // Search functionality
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (searchQuery.trim().length > 1) {
        try {
          const mod = await import('@/lib/document-library');
          const fn = mod.search as (
            q: string,
            l: 'en' | 'es',
            s?: string,
          ) => LegalDocument[];
          const results = fn(searchQuery, clientLocale);
          if (!cancelled) {
            setSearchResults(results.slice(0, 8));
            setShowResults(results.length > 0);
          }
        } catch (_) {
          if (!cancelled) {
            setSearchResults([]);
            setShowResults(false);
          }
        }
      } else {
        if (!cancelled) {
          setSearchResults([]);
          setShowResults(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [searchQuery, clientLocale]);

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
      window.location.href = `/${clientLocale}/docs/${resolveDocSlug(firstResult.id)}`;
    }
  };

  if (!mounted) {
    return (
      <div className={`relative flex-1 max-w-xs ${className}`}>
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    );
  }

  return (
    <form
      className={`relative flex-1 max-w-xs ${className}`}
      onSubmit={handleSearchSubmit}
    >
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <Input
        ref={searchInputRef}
        id="header-search"
        name="search"
        type="search"
        placeholder={placeholderSearch}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() =>
          searchQuery.trim().length > 1 &&
          searchResults.length > 0 &&
          setShowResults(true)
        }
        className="h-10 pl-10 text-sm rounded-md w-full bg-muted border-input focus:border-primary focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
        disabled={!mounted}
        aria-label={placeholderSearch}
      />
      {showResults && searchResults.length > 0 && (
        <div
          ref={searchResultsRef}
          className="absolute top-full mt-1 w-full max-h-60 overflow-y-auto bg-popover border border-border rounded-md shadow-lg z-[70]"
        >
          <ul>
            {searchResults.map((doc) => {
              const translatedDoc = getDocTranslation(doc, clientLocale);
              const docName = translatedDoc.name;
              return (
                <li key={doc.id}>
                  <Link
                    href={`/${clientLocale}/docs/${resolveDocSlug(doc.id)}`}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors w-full text-left"
                    prefetch
                    onClick={() => setShowResults(false)}
                  >
                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{docName}</span>
                    <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground/70" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </form>
  );
}
