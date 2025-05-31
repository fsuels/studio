// src/components/StickyFilterBar.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import { Search, MapPin, Mic } from 'lucide-react';

type SpeechRecognitionConstructor = new () => SpeechRecognition;
interface SpeechWindow extends Window {
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
  SpeechRecognition?: SpeechRecognitionConstructor;
}

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
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    if (typeof window !== 'undefined') {
      const speechWindow = window as SpeechWindow;
      const SpeechCtor =
        speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
      if (SpeechCtor) {
        recognitionRef.current = new SpeechCtor();
        recognitionRef.current.continuous = false;
        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = Array.from(event.results)
            .map((r) => r[0].transcript)
            .join(' ');
          onSearchTermChange(transcript);
        };
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
        setIsSpeechSupported(true);
      }
    }
  }, [onSearchTermChange]);

  const placeholderSearch = isHydrated
    ? t('Search all documents...')
    : 'Loading...';
  const placeholderState = isHydrated ? t('All States') : 'Loading...';

  const handleVoiceClick = () => {
    if (!isSpeechSupported || isListening || !recognitionRef.current) return;
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      console.error('Speech recognition error', err);
    }
  };

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
          {isSpeechSupported && (
            <button
              type="button"
              onClick={handleVoiceClick}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-label={isListening ? 'Listening' : 'Start voice input'}
              disabled={isListening}
            >
              <Mic className="h-4 w-4" />
            </button>
          )}
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
