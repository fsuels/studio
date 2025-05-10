// src/components/SearchBar.tsx
'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRouter, useParams } from 'next/navigation';

export default function SearchBar() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as 'en' | 'es' || 'en';
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]); // Placeholder for actual suggestions

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to a search results page or filter documents on the current page
      // For now, we'll just log and potentially update a global search state via a provider if needed
      console.log(`Searching for: ${searchTerm} in locale: ${locale}`);
      // Example navigation: router.push(`/${locale}/search?q=${encodeURIComponent(searchTerm)}`);
      // Or, if filtering on homepage:
      router.push(`/${locale}/?search=${encodeURIComponent(searchTerm)}#workflow-start`);
      setSearchTerm(''); // Clear search after submit
      setSuggestions([]);
    }
  };

  // Placeholder for fetching autocomplete suggestions
  const fetchSuggestions = (query: string) => {
    if (query.length > 2) {
      // In a real app, fetch from Firestore or an API
      // For now, static example:
      const staticSuggestions = ["Lease Agreement", "NDA", "Bill of Sale", "Power of Attorney", "Eviction Notice"]
        .filter(s => s.toLowerCase().includes(query.toLowerCase()));
      setSuggestions(staticSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    fetchSuggestions(e.target.value);
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
    // Potentially auto-submit or allow user to refine then submit
    router.push(`/${locale}/?search=${encodeURIComponent(suggestion)}#workflow-start`);
  };


  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={t('Search 200+ contracts…', { defaultValue: 'Search 200+ contracts…' })}
          className="w-full pl-10 pr-4 py-3 h-12 text-base rounded-full shadow-lg border-border focus:ring-primary focus:border-primary bg-background"
          aria-label={t('Search documents', {defaultValue: 'Search documents'})}
        />
         {suggestions.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-2 hover:bg-muted text-sm"
                >
                  {suggestion}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Submit button is implicit with form onSubmit or can be added explicitly */}
      {/* <Button type="submit" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 px-4 rounded-full">
        {t('Search', {defaultValue: 'Search'})}
      </Button> */}
    </form>
  );
}
