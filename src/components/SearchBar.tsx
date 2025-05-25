// src/components/SearchBar.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Search, FileText, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRouter, useParams } from 'next/navigation';
import { documentLibrary, type LegalDocument } from '@/lib/document-library/index';
import { getDocumentUrl } from '@/lib/document-library/url';
import { getDocTranslation } from '@/lib/i18nUtils';

const SearchBar = React.memo(function SearchBar() {
  const { t: tHeader, i18n } = useTranslation("common");
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as 'en' | 'es') || 'en';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<LegalDocument[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Filter suggestions
  useEffect(() => {
    if (!isHydrated) return;

    if (searchTerm.trim().length > 1) {
      const lower = searchTerm.toLowerCase();
      const results = documentLibrary
        .filter(doc => {
          const { name = '', description = '', aliases = [] } = getDocTranslation(doc, locale);
          return (
            name.toLowerCase().includes(lower) ||
            description.toLowerCase().includes(lower) ||
            aliases.some(alias => alias.toLowerCase().includes(lower))
          );
        })
        .slice(0, 5);

      setSuggestions(results);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, locale, isHydrated]);

  // Close on outside click
  useEffect(() => {
    if (!isHydrated) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current && !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isHydrated]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isHydrated) return;
    if (searchTerm.trim()) {
      router.push(`/${locale}/?search=${encodeURIComponent(searchTerm)}#workflow-start`);
      setSearchTerm('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (doc: LegalDocument) => {
    if (!isHydrated) return;
    setSearchTerm('');
    setShowSuggestions(false);
    router.push(
      getDocumentUrl(
        locale,
        (doc.jurisdiction || 'US').toLowerCase(),
        doc.id,
      ),
    );
  };

  const placeholderText = isHydrated
    ? tHeader('SearchBar.placeholder', { defaultValue: 'Search 200+ contracts…' })
    : 'Loading…';

  return (
    <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
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
          className="w-full pl-10 pr-4 py-3 h-12 text-base rounded-full shadow-lg border-border focus:ring-primary focus:border-primary bg-background"
          aria-label={placeholderText}
          disabled={!isHydrated}
        />

        {isHydrated && showSuggestions && suggestions.length > 0 && (
          <ul
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
              {suggestions.map((suggestion) => {
                const { name } = getDocTranslation(suggestion, locale);
                return (
                  <li key={suggestion.id}>
                    <button
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      onMouseEnter={() =>
                        router.prefetch(
                          getDocumentUrl(
                            locale,
                            (suggestion.jurisdiction || 'US').toLowerCase(),
                            suggestion.id,
                          ),
                        )}
                      className="w-full text-left px-3 py-2.5 hover:bg-muted text-sm flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="truncate">{name}</span>
                      <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground/70 shrink-0" />
                    </button>
                  </li>
                );
              })}
          </ul>
        )}
      </div>
    </form>
  );
});

export default SearchBar;
