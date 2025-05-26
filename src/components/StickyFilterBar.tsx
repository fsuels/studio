// src/components/StickyFilterBar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usStates } from '@/lib/usStates';
import { Search, MapPin } from 'lucide-react';

interface StickyFilterBarProps {
  searchTerm: string;
  onSearchTermChange: (_term: string) => void;
  selectedState: string;
  onSelectedStateChange: (_state: string) => void;
}

const StickyFilterBar = React.memo(function StickyFilterBar({
  searchTerm,
  onSearchTermChange,
  selectedState,
  onSelectedStateChange,
}: StickyFilterBarProps) {
  const { t } = useTranslation('common');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const placeholderSearch = isHydrated
    ? t('Search all documents...')
    : 'Loading...';
  const placeholderState = isHydrated ? t('All States') : 'Loading...';

  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-sm mb-6">
      <div className="container mx-auto px-4 h-16 flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={placeholderSearch}
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="w-full pl-10 h-10 text-sm"
            aria-label={placeholderSearch}
            disabled={!isHydrated}
          />
        </div>
        <div className="relative w-full sm:w-auto sm:min-w-[200px]">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground sm:hidden" />
          <Select
            value={isHydrated ? selectedState || '' : ''}
            onValueChange={(value) =>
              onSelectedStateChange(value === 'all' ? '' : value)
            }
            disabled={!isHydrated}
          >
            <SelectTrigger
              className="w-full h-10 text-sm sm:pl-3 data-[placeholder]:text-muted-foreground"
              aria-label={placeholderState}
            >
              <MapPin className="h-4 w-4 mr-2 hidden sm:inline-block text-muted-foreground" />
              <SelectValue placeholder={placeholderState} />
            </SelectTrigger>
            <SelectContent>
              {isHydrated ? (
                <>
                  <SelectItem value="all">{t('All States')}</SelectItem>
                  {usStates.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {t(state.label, state.label)} ({state.value})
                    </SelectItem>
                  ))}
                </>
              ) : (
                <SelectItem value="" disabled>
                  Loading states...
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
});
export default StickyFilterBar;
