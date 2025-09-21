'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Brain, Check, X } from 'lucide-react';
import { getDocumentTitle } from '@/lib/format-utils';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDiscoveryModal } from '@/contexts/DiscoveryModalContext';
import { useDiscoverySearch } from '@/hooks/useDiscoverySearch';
import { useDebounce } from '@/hooks/use-debounce';
import type { DiscoveryResult } from '@/types/discovery';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import {
  findMatchingDocuments,
  findMatchingDocumentsSync,
  getDocumentsByCountry,
} from '@/lib/document-library';
import type { LegalDocument } from '@/types/documents';
// Local search leverages the manifest-backed document library helpers
import { SearchInput } from './SearchInput';
import { NoResults } from './NoResults';
import { ResultCardSkeleton } from './ResultCardSkeleton';

const ResultsGrid = React.lazy(() => 
  import('./ResultsGrid').then(module => ({ default: module.ResultsGrid }))
);

export default function DocumentDiscoveryModal() {
  const { t } = useTranslation('common');
  const params = useParams();
  const locale = (params!.locale as 'en' | 'es') || 'en';
  const [isHydrated, setIsHydrated] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const {
    showDiscoveryModal,
    setShowDiscoveryModal,
    discoveryInput,
    setDiscoveryInput
  } = useDiscoveryModal();

  const {
    results: discoveryResults,
    loading: isSearching,
    hybridSearch,
    resetMetrics,
  } = useDiscoverySearch();
  
  const [searchInput, setSearchInput] = useState('');
  const [suggestion] = useState('');
  const [localResults, setLocalResults] = useState<DiscoveryResult[]>([]);
  const [isUsingLocalFallback, setIsUsingLocalFallback] = useState(false);
  const [activeQuery, setActiveQuery] = useState('');
  const [remoteQuery, setRemoteQuery] = useState('');
  const latestQueryRef = useRef('');
  const localCacheRef = useRef<Map<string, DiscoveryResult[]>>(new Map());
  
  // Debounce search input to avoid excessive API calls
  const debouncedSearchInput = useDebounce(searchInput, 300);

  const clearResults = useCallback(() => {
    resetMetrics();
    setSearchInput('');
    setLocalResults([]);
    setIsUsingLocalFallback(false);
    setActiveQuery('');
    latestQueryRef.current = '';
    setRemoteQuery('');
  }, [resetMetrics]);
  
  const performSearch = useCallback(
    async (rawQuery: string) => {
      const query = rawQuery.trim();
      if (!query) {
        return;
      }

      latestQueryRef.current = query;
      setActiveQuery(query);
      setRemoteQuery('');

      try {
        await getDocumentsByCountry('us');
      } catch (_error) {
        // Ignore hydration failures; cached manifest data still works.
      }

      const cachedResults = localCacheRef.current.get(query);
      let convertedResults: DiscoveryResult[] | null = cachedResults ?? null;

      if (!cachedResults) {
        let localDocs: LegalDocument[] = [];
        try {
          localDocs = await findMatchingDocuments(query, locale);
        } catch (_error) {
          localDocs = findMatchingDocumentsSync(query, locale);
        }

        if (latestQueryRef.current !== query) {
          return;
        }

        convertedResults = localDocs.slice(0, 10).map((doc, index) => {
          const translation = doc.translations?.[locale] ?? doc.translations?.en;
          const description =
            translation?.description ||
            doc.description ||
            `Legal document for ${doc.category?.toLowerCase() ?? 'general'} matters`;

          const result: DiscoveryResult = {
            id: doc.id,
            title: getDocumentTitle(doc, locale),
            description,
            confidence: Math.max(0.9 - index * 0.1, 0.1),
            reason: 'keyword',
            category: doc.category,
            tags:
              translation?.aliases?.length
                ? [...translation.aliases]
                : doc.translations?.en?.aliases ?? doc.aliases ?? [],
          };

          return result;
        });

        localCacheRef.current.set(query, convertedResults);
      }

      if (convertedResults && latestQueryRef.current === query) {
        setLocalResults(convertedResults);
        setIsUsingLocalFallback(convertedResults.length > 0);
      }

      hybridSearch(query)
        .then(() => {
          if (latestQueryRef.current === query) {
            setRemoteQuery(query);
          }
        })
        .catch(() => {
          // Firestore search is best-effort; fallback already populated.
        });
    },
    [locale, hybridSearch],
  );
  
  // Combined results - prefer Firestore when available
  const results = useMemo(() => {
    if (!activeQuery) {
      return [];
    }

    const hasRemoteForActive =
      remoteQuery === activeQuery && discoveryResults.length > 0;

    if (hasRemoteForActive && !isUsingLocalFallback) {
      return discoveryResults;
    }

    if (isUsingLocalFallback && localResults.length > 0) {
      return localResults;
    }

    return hasRemoteForActive ? discoveryResults : localResults;
  }, [activeQuery, discoveryResults, isUsingLocalFallback, localResults, remoteQuery]);

  const hasResults = results.length > 0;
  const showLoadingState = isSearching && !hasResults;

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

  useEffect(() => {
    if (!activeQuery || remoteQuery !== activeQuery) {
      return;
    }
    if (discoveryResults.length > 0) {
      setIsUsingLocalFallback(false);
    }
  }, [activeQuery, discoveryResults, remoteQuery]);

  // Trigger search when debounced input changes
  useEffect(() => {
    if (debouncedSearchInput.trim()) {
      performSearch(debouncedSearchInput);
    } else if (debouncedSearchInput === '') {
      // Clear results when input is empty
      clearResults();
    }
  }, [debouncedSearchInput, performSearch, clearResults]);

  // Sync with context
  useEffect(() => {
    if (discoveryInput && discoveryInput !== searchInput) {
      setSearchInput(discoveryInput);
      // Don't call performSearch here - let the debounced effect handle it
    }
  }, [discoveryInput, searchInput]);

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

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const checkOverflow = () => {
        setIsOverflowing(container.scrollHeight > container.clientHeight);
      };
      checkOverflow();
      window.addEventListener('resize', checkOverflow);
      return () => window.removeEventListener('resize', checkOverflow);
    }
  }, [results]);


  const handleDismiss = useCallback(() => {
    clearResults();
    setDiscoveryInput('');
  }, [clearResults, setDiscoveryInput]);

  const handleDocumentClick = useCallback(
    (_docId: string) => {
      setShowDiscoveryModal(false);
      handleDismiss();
    },
    [handleDismiss, setShowDiscoveryModal],
  );

  const handleClose = useCallback(() => {
    setShowDiscoveryModal(false);
    handleDismiss();
  }, [handleDismiss, setShowDiscoveryModal]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setShowDiscoveryModal(open);
      if (!open) {
        handleDismiss();
      }
    },
    [handleDismiss, setShowDiscoveryModal],
  );

  if (!isHydrated) {
    return null;
  }

  return (
    <Dialog open={showDiscoveryModal} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="ai-finder-modal w-[min(100vw-1.5rem,80rem)] sm:w-full sm:max-w-5xl lg:max-w-6xl h-[calc(100vh-1.5rem)] sm:h-[90vh] flex flex-col p-0 border-0 shadow-2xl bg-white dark:bg-gray-900 overflow-hidden rounded-none sm:rounded-3xl [&>button:last-child]:hidden"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Smart Document Finder</DialogTitle>
        </DialogHeader>
        
        {/* Enhanced Header */}
        <div className="relative overflow-hidden rounded-none sm:rounded-t-3xl header-gradient">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-white/20 pointer-events-none"></div>
          {/* Contrast overlay for WCAG compliance - 40% for H1 contrast ≈ 5.8:1 */}
          <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-xl animate-pulse pointer-events-none"></div>
          <div className="absolute -bottom-2 -left-4 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative px-4 py-4 pb-5 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3 sm:gap-4">
              <div className="relative">
                <div className="p-2.5 sm:p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                  <Brain className="h-7 w-7 sm:h-8 sm:w-8 text-white drop-shadow-lg" style={{ color: '#E7FFF9', strokeWidth: '2px' }} />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <span className="block">Smart Document Finder</span>
              </div>
            </h2>
            
            <DialogClose asChild>
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 sm:p-2.5 bg-white/20 hover:bg-white/40 focus:bg-white/40 rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
                aria-label="Close modal"
                type="button"
              >
                <X className="h-5 w-5 text-white" style={{ color: '#E7FFF9', strokeWidth: '2px' }} />
              </button>
            </DialogClose>
          </div>
        </div>
        
        {/* Content Container */}
        <div className="flex-1 flex flex-col bg-gray-50/50 dark:bg-gray-800/50 overflow-hidden">
          <div className="flex-shrink-0 px-4 py-4 pb-3 sm:px-6 sticky top-0 bg-gray-50/50 dark:bg-gray-800/50 z-10 border-b border-gray-200 dark:border-gray-700">
            <SearchInput
              value={searchInput}
              onChange={(value) => {
                setSearchInput(value);
                setDiscoveryInput(value);
              }}
              onVoiceToggle={startListening}
              isListening={isListening}
              isVoiceSupported={isVoiceSupported}
              showHelpText={results.length === 0}
            />

            {/* Enhanced Voice feedback */}
            {isListening && (
              <div className="mt-4 flex justify-center px-1">
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
              <div className="mt-4 flex justify-center px-1">
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
            ref={scrollContainerRef}
            className={`flex-1 overflow-y-auto px-4 sm:px-6 relative ${
              isOverflowing ? 'scroll-fade-out' : ''
            }`}
            aria-live="polite"
            aria-label="Search results"
          >
            {showLoadingState ? (
              <div className="space-y-4 pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => <ResultCardSkeleton key={i} />)}
                </div>
              </div>
            ) : hasResults ? (
              <React.Suspense fallback={
                <div className="space-y-4 pb-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => <ResultCardSkeleton key={i} />)}
                  </div>
                </div>
              }>
                <div className="space-y-4 pb-8">
                  {isUsingLocalFallback && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        <Brain className="inline-block w-4 h-4 mr-2" />
                        Showing results from local document library
                      </p>
                    </div>
                  )}
                  <ResultsGrid
                    results={results as DiscoveryResult[]}
                    locale={locale}
                    onDocumentClick={handleDocumentClick}
                    isLoading={isSearching}
                  />
                </div>
              </React.Suspense>
            ) : searchInput ? (
              <NoResults
                searchQuery={searchInput}
                suggestion={suggestion}
                onSuggestionClick={(text) => {
                  setSearchInput(text);
                  performSearch(text);
                }}
              />
            ) : null}
          </div>

          {/* Subtle disclaimer at bottom */}
          <div className="flex-shrink-0 px-4 py-3 sm:px-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)]">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              <span className="font-medium">Disclaimer:</span> Not legal advice; consult an attorney for personalized guidance.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
