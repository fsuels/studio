// src/components/StickyFilterBar.tsx
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usStates } from '@/lib/document-library';
import { Search, MapPin } from 'lucide-react';

interface StickyFilterBarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  selectedState: string;
  onSelectedStateChange: (state: string) => void;
}

export default function StickyFilterBar({
  searchTerm,
  onSearchTermChange,
  selectedState,
  onSelectedStateChange,
}: StickyFilterBarProps) {
  const { t } = useTranslation();

  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-sm">
      <div className="container mx-auto px-4 h-16 flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('Search all documents...')}
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="w-full pl-10 h-10 text-sm"
            aria-label={t('Search all documents')}
          />
        </div>
        <div className="relative w-full sm:w-auto sm:min-w-[200px]">
           <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground sm:hidden" />
           <Select
            value={selectedState || ''} // Ensure value is not undefined for Select
            onValueChange={(value) => onSelectedStateChange(value === 'all' ? '' : value)}
           >
            <SelectTrigger className="w-full h-10 text-sm sm:pl-3 data-[placeholder]:text-muted-foreground">
               <MapPin className="h-4 w-4 mr-2 hidden sm:inline-block text-muted-foreground" />
              <SelectValue placeholder={t('All States')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('All States')}</SelectItem>
              {usStates.map((state) => (
                <SelectItem key={state.value} value={state.value}>
                  {t(state.label, state.label)} ({state.value})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}