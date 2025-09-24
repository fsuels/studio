// src/components/layout/Header/HeaderSearch.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { resolveDocSlug } from '@/lib/slug-alias';
import { useTranslation } from 'react-i18next';
import { Search as SearchIcon, FileText, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getDocTranslation } from '@/lib/i18nUtils';
import type { DocumentSummary } from '@/lib/workflow/document-workflow';
import { Skeleton } from '@/components/ui/skeleton';
import { loadWorkflowModule } from '@/lib/workflow/load-workflow-module';
import { cn } from '@/lib/utils';

interface HeaderSearchProps {
  clientLocale: 'en' | 'es';
  mounted: boolean;
  className?: string;
  onNavigate?: () => void;
}

export default function HeaderSearch({
  clientLocale,
  mounted,
  className = '',
  onNavigate,
}: HeaderSearchProps) {
  const { t: tHeader } = useTranslation('header');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DocumentSummary[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [workflowModule, setWorkflowModule] = useState<typeof import('@/lib/workflow/document-workflow') | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const containerClassName = cn('relative w-full', className);

  const placeholderSearch = mounted
    ? tHeader('search.placeholder', { defaultValue: 'Search documents...' })
    : 'Search documents...';

  useEffect(() => {
    if (!mounted || workflowModule) {
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
          console.error('Failed to load workflow module for header search:', error);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [mounted, workflowModule]);

  // Search functionality backed by manifest metadata
  useEffect(() => {
    if (!mounted || !workflowModule) {
      return;
    }

    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery.length > 1) {
      const results = workflowModule.searchWorkflowDocuments(trimmedQuery, {
        jurisdiction: 'us',
        language: clientLocale,
      }).slice(0, 8);

      setSearchResults(results);
      setShowResults(results.length > 0);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery, clientLocale, mounted, workflowModule]);

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
      const href = `/${clientLocale}/docs/${resolveDocSlug(firstResult.id)}`;
      router.push(href);
      onNavigate?.();
    }
  };

  if (!mounted) {
    return (
      <div className={containerClassName}>
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    );
  }

  return (
    <form
      className={containerClassName}
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
        className="h-11 pl-10 text-sm rounded-lg w-full bg-muted border-input focus:border-primary focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
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
                    onClick={() => {
                      setShowResults(false);
                      onNavigate?.();
                    }}
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
