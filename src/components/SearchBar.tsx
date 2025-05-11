// src/components/SearchBar.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, FileText, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRouter, useParams } from 'next/navigation';
import { documentLibrary, type LegalDocument } from '@/lib/document-library'; 

const SearchBar = React.memo(function SearchBar() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as 'en' | 'es' || 'en';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<LegalDocument[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return; // Don't run search logic until hydrated

    if (searchTerm.trim().length > 1) {
      const lowerQuery = searchTerm.toLowerCase();
      const results = documentLibrary.filter(doc => {
        const name = locale === 'es' && doc.name_es ? doc.name_es : doc.name;
        const description = locale === 'es' && doc.description_es ? doc.description_es : doc.description;
        const aliases = locale === 'es' && doc.aliases_es ? doc.aliases_es : (doc.aliases || []);
        return (
          name.toLowerCase().includes(lowerQuery) ||
          (description && description.toLowerCase().includes(lowerQuery)) ||
          aliases.some(alias => alias.toLowerCase().includes(lowerQuery))
        );
      }).slice(0, 5); // Limit to 5 suggestions
      setSuggestions(results);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, locale, isHydrated]); // Added isHydrated

  useEffect(() => {
    if (!isHydrated) return; // Don't attach listeners until hydrated
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
  }, [isHydrated]); // Added isHydrated


  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isHydrated) return; // Ensure component is hydrated
    if (searchTerm.trim()) {
      router.push(`/${locale}/?search=${encodeURIComponent(searchTerm)}#workflow-start`);
      setSearchTerm('');
      setShowSuggestions(false);
    }
  };
  
  const handleSuggestionClick = (docId: string) => {
    if (!isHydrated) return; // Ensure component is hydrated
    setSearchTerm('');
    setShowSuggestions(false);
    router.push(`/${locale}/docs/${docId}`);
  };

  const placeholderText = isHydrated ? t('SearchBar.placeholder', { defaultValue: 'Search 200+ contracts…' }) : "Loading...";

  return (
    <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
        <Input
          ref={searchInputRef}
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => isHydrated && searchTerm.trim().length > 1 && suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholderText}
          className="w-full pl-10 pr-4 py-3 h-12 text-base rounded-full shadow-lg border-border focus:ring-primary focus:border-primary bg-background"
          aria-label={placeholderText}
          disabled={!isHydrated} // Disable input until hydrated
        />
         {isHydrated && showSuggestions && suggestions.length > 0 && ( // Only show suggestions if hydrated
          <ul 
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((suggestion) => (
              <li key={suggestion.id}>
                <button
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion.id)}
                  className="w-full text-left px-3 py-2.5 hover:bg-muted text-sm flex items-center gap-2"
                >
                  <FileText className="h-4 w-4 shrink-0 text-muted-foreground"/>
                  <span className="truncate">
                    {locale === 'es' && suggestion.name_es ? suggestion.name_es : suggestion.name}
                  </span>
                  <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground/70 shrink-0"/>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </form>
  );
});
export default SearchBar;