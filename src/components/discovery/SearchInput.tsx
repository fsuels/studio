'use client';

import React, { useState, useEffect } from 'react';
import { Search, Mic, MicOff, Lightbulb, Zap } from 'lucide-react';
import '@/styles/animations.css';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onVoiceToggle: () => void;
  isListening: boolean;
  isVoiceSupported: boolean;
  voiceError?: string | null;
  placeholder?: string;
  showHelpText?: boolean;
}

export function SearchInput({
  value,
  onChange,
  onVoiceToggle,
  isListening,
  isVoiceSupported,
  voiceError,
  placeholder = "Describe your legal situation...",
  showHelpText = true
}: SearchInputProps) {
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' && e.target === e.currentTarget) {
      e.preventDefault();
      onVoiceToggle();
    }
  };
  return (
    <div className="space-y-3">
      {showHelpText && (
        <div className="hidden sm:block bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-200/60 dark:border-blue-800/40 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <p className="text-sm leading-snug text-blue-800 dark:text-blue-200">
              Describe your legal goal for instant, tailored templates.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Zap className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          Start typing to see results instantly
        </h3>
        
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={onVoiceToggle}
            onKeyDown={handleKeyDown}
            disabled={!isVoiceSupported}
            aria-label={isListening ? 'Stop voice input (Shift+⌘+S)' : 'Start voice input (Shift+⌘+S)'}
            aria-describedby="voice-shortcut-hint"
            aria-pressed={isListening}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 ${
              isListening
                ? 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 focus-visible:ring-red-500/50 focus-visible:border-red-400 animate-pulse'
                : isVoiceSupported
                ? `bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-400 ${!hasAnimated ? 'animate-subtle-pulse' : ''}`
                : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed focus-visible:ring-gray-400/50'
            } w-full justify-center sm:w-auto sm:justify-start`}
          >
            {isListening ? (
              <>
                <div className="relative">
                  <MicOff className="h-4 w-4" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                </div>
                <span className="text-sm font-medium">Stop Listening</span>
              </>
            ) : (
              <>
                <Mic className="h-4 w-4" />
                <span className="text-sm font-medium">Speak</span>
              </>
            )}
          </button>
          <span id="voice-shortcut-hint" className="sr-only">
            Use Shift plus Command and S (or Control and S) to toggle voice input.
          </span>
          <span className="hidden sm:flex text-sm text-gray-500 dark:text-gray-400 items-center px-2">
            or
          </span>

          <div className="flex-1 w-full relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="e.g., Buying a used car"
                aria-label="Describe your legal situation"
                className={`w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-gray-500 ${!hasAnimated ? 'animate-subtle-glow' : ''}`}
                autoFocus
              />
            </div>
          </div>
        </div>
      </div>

      {!isVoiceSupported && (
        <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-200 rounded-lg px-3 py-2 text-sm" role="status" aria-live="polite">
          Voice search needs a supported browser such as Chrome, Edge, or Safari.
        </div>
      )}

      {voiceError && isVoiceSupported && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg px-3 py-2 text-sm" role="status" aria-live="assertive">
          {voiceError}
        </div>
      )}
    </div>
  );
}
