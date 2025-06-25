'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Brain, Check, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDiscoveryModal } from '@/contexts/DiscoveryModalContext';
import { useDiscoverySearch } from '@/hooks/useDiscoverySearch';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { SearchInput } from './SearchInput';
import { ResultsGrid } from './ResultsGrid';
import { NoResults } from './NoResults';

export default function DocumentDiscoveryModal() {
  const { t } = useTranslation('common');
  const params = useParams();
  const locale = (params!.locale as 'en' | 'es') || 'en';
  const [isHydrated, setIsHydrated] = useState(false);

  const {
    showDiscoveryModal,
    setShowDiscoveryModal,
    discoveryInput,
    setDiscoveryInput
  } = useDiscoveryModal();

  const {
    searchInput,
    setSearchInput,
    results,
    isSearching,
    performSearch,
    clearResults
  } = useDiscoverySearch({ locale, maxResults: 8 });

  const {
    isListening,
    isSupported: isVoiceSupported,
    startListening,
    transcript
  } = useSpeechRecognition({
    locale,
    onResult: (text) => {
      setSearchInput(text);
      setDiscoveryInput(text);
      performSearch(text);
    }
  });

  // Hydration check
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Sync with context
  useEffect(() => {
    if (discoveryInput && discoveryInput !== searchInput) {
      setSearchInput(discoveryInput);
      performSearch(discoveryInput);
    }
  }, [discoveryInput, searchInput, setSearchInput, performSearch]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showDiscoveryModal) {
        handleClose();
      }
      // Shift+Cmd+S (Mac) or Shift+Ctrl+S (PC) for voice toggle
      if (e.shiftKey && (e.metaKey || e.ctrlKey) && e.key === 'S') {
        e.preventDefault();
        if (showDiscoveryModal && isVoiceSupported) {
          startListening();
        }
      }
    };

    if (showDiscoveryModal) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [showDiscoveryModal, isVoiceSupported, startListening]);

  // Background content accessibility
  useEffect(() => {
    if (showDiscoveryModal) {
      // Find main content containers and add aria-hidden
      const mainContent = document.querySelector('main');
      const headerContent = document.querySelector('header');
      const footerContent = document.querySelector('footer');
      const bodyContent = document.querySelector('body > div:not([data-radix-portal])');

      [mainContent, headerContent, footerContent, bodyContent].forEach(element => {
        if (element && !element.contains(document.activeElement)) {
          element.setAttribute('aria-hidden', 'true');
        }
      });

      return () => {
        // Remove aria-hidden when modal closes
        [mainContent, headerContent, footerContent, bodyContent].forEach(element => {
          if (element) {
            element.removeAttribute('aria-hidden');
          }
        });
      };
    }
  }, [showDiscoveryModal]);


  const handleDocumentClick = (docId: string) => {
    setShowDiscoveryModal(false);
    clearResults();
    setDiscoveryInput('');
  };

  const handleClose = () => {
    setShowDiscoveryModal(false);
    clearResults();
    setDiscoveryInput('');
  };

  if (!isHydrated) {
    return null;
  }

  return (
    <Dialog open={showDiscoveryModal} onOpenChange={() => {}}>
      <DialogContent 
        className="max-w-6xl h-[95vh] flex flex-col p-0 border-0 shadow-2xl bg-white dark:bg-gray-900 [&>button:last-child]:hidden"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Smart Document Finder</DialogTitle>
        </DialogHeader>
        
        {/* Enhanced Header */}
        <div className="relative overflow-hidden rounded-t-lg header-gradient">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-white/20"></div>
          {/* Contrast overlay for WCAG compliance - 40% for H1 contrast ≈ 5.8:1 */}
          <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute -bottom-2 -left-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="relative px-5 py-4 pb-5">
            <h2 className="text-3xl font-bold text-white flex items-center gap-4">
              <div className="relative">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                  <Brain className="h-8 w-8 text-white drop-shadow-lg" style={{ color: '#E7FFF9', strokeWidth: '2px' }} />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <span className="block">Smart Document Finder</span>
              </div>
            </h2>
            
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 focus:bg-white/40 rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
              aria-label="Close modal"
            >
              <X className="h-5 w-5 text-white" style={{ color: '#E7FFF9', strokeWidth: '2px' }} />
            </button>
          </div>
        </div>
        
        {/* Content Container */}
        <div className="flex-1 flex flex-col bg-gray-50/50 dark:bg-gray-800/50 overflow-hidden">
          <div className="flex-shrink-0 px-6 py-4 pb-3">
            <SearchInput
              value={searchInput}
              onChange={setSearchInput}
              onVoiceToggle={startListening}
              isListening={isListening}
              isVoiceSupported={isVoiceSupported}
              showHelpText={results.length === 0}
            />

            {/* Enhanced Voice feedback */}
            {isListening && (
              <div className="mt-4 flex justify-center">
                <div className="w-full max-w-md">
                  <div className="bg-red-50 dark:bg-red-950/50 rounded-lg p-4 shadow-sm border border-red-200 dark:border-red-700">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="h-8 w-8 bg-red-500 rounded-full flex items-center justify-center">
                          <div className="h-3 w-3 bg-white rounded-full animate-pulse"></div>
                        </div>
                        <div className="absolute -inset-1 bg-red-500 rounded-full animate-ping opacity-25"></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-700 dark:text-red-300">
                          🎤 Listening... Speak now
                        </p>
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                          Say something like "I need a vehicle bill of sale"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Voice transcript with correction option */}
            {transcript && !isListening && (
              <div className="mt-4 flex justify-center">
                <div className="w-full max-w-md">
                  <div className="bg-emerald-50 dark:bg-emerald-950/50 rounded-lg p-4 shadow-sm border border-emerald-200 dark:border-emerald-700">
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300 mb-1">
                          Voice captured:
                        </p>
                        <p className="text-sm text-gray-900 dark:text-gray-100 font-medium mb-2 italic">
                          "{transcript}"
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSearchInput(transcript);
                              performSearch(transcript);
                            }}
                            className="text-xs px-2 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                          >
                            ✓ Use this
                          </button>
                          <button
                            onClick={startListening}
                            className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                          >
                            🎤 Try again
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Live region for screen reader announcements */}
          <div 
            role="status" 
            aria-live="polite" 
            aria-atomic="true" 
            className="sr-only"
          >
            {isSearching 
              ? "Searching for legal documents..." 
              : results.length > 0 
              ? `Found ${results.length} matching legal ${results.length === 1 ? 'document' : 'documents'}. Use arrow keys to navigate through results.`
              : searchInput 
              ? "No matching documents found. Try different keywords or browse categories."
              : ""
            }
          </div>

          {/* Scrollable Results */}
          <div 
            className="flex-1 overflow-y-auto px-6"
            aria-live="polite"
            aria-label="Search results"
          >
            {isSearching ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                  <p className="text-gray-600 dark:text-gray-300">Analyzing your request...</p>
                </div>
              </div>
            ) : results.length > 0 ? (
              <ResultsGrid
                results={results}
                locale={locale}
                onDocumentClick={handleDocumentClick}
              />
            ) : searchInput ? (
              <NoResults
                searchQuery={searchInput}
              />
            ) : null}
          </div>

          {/* Subtle disclaimer at bottom */}
          <div className="flex-shrink-0 px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              <span className="font-medium">Disclaimer:</span> Not legal advice; consult an attorney for personalized guidance.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}