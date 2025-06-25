'use client';

import React from 'react';
import { Search, Mic, MicOff, Lightbulb, Zap } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onVoiceToggle: () => void;
  isListening: boolean;
  isVoiceSupported: boolean;
  placeholder?: string;
  showHelpText?: boolean;
}

export function SearchInput({
  value,
  onChange,
  onVoiceToggle,
  isListening,
  isVoiceSupported,
  placeholder = "Describe your legal situation...",
  showHelpText = true
}: SearchInputProps) {
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' && e.target === e.currentTarget) {
      e.preventDefault();
      onVoiceToggle();
    }
  };
  return (
    <div className="space-y-3">
      {showHelpText && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-200/60 dark:border-blue-800/40 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <p className="text-sm leading-snug text-blue-800 dark:text-blue-200">
              Describe your legal goal for instant, tailored templates.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Zap className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          Start typing to see results instantly
        </h3>
        
        <div className="flex gap-2">
          <button
            onClick={onVoiceToggle}
            onKeyDown={handleKeyDown}
            disabled={!isVoiceSupported}
            aria-label={isListening ? 'Stop voice input (Shift+⌘+S)' : 'Start voice input (Shift+⌘+S)'}
            aria-describedby="voice-shortcut-hint"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 ${
              isListening
                ? 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 focus-visible:ring-red-500/50 focus-visible:border-red-400 animate-pulse'
                : isVoiceSupported
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-400'
                : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed focus-visible:ring-gray-400/50'
            }`}
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
          
          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center px-2">
            or
          </span>
          
          <div className="flex-1 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none placeholder:text-[#6B7280]"
                rows={2}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}