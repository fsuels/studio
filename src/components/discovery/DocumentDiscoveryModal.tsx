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
import type { DiscoveryResult } from '@/types/discovery';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { findMatchingDocuments } from '@/lib/document-library';
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
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const {
    showDiscoveryModal,
    setShowDiscoveryModal,
    discoveryInput,
    setDiscoveryInput
  } = useDiscoveryModal();

  const {
    tokens,
    results: firestoreResults,
    loading: isSearching,
    error,
    searchFirestore,
    hybridSearch,
    resetMetrics
  } = useDiscoverySearch();
  
  const [searchInput, setSearchInput] = useState('');
  const [suggestion] = useState('');
  const [localResults, setLocalResults] = useState<DiscoveryResult[]>([]);
  const [isUsingLocalFallback, setIsUsingLocalFallback] = useState(false);
  
  const performSearch = async (query: string) => {
    if (query.trim()) {
      // First try Firestore search
      await searchFirestore(query);
      
      // If Firestore returns no results, fall back to local document library
      setTimeout(() => {
        if (firestoreResults.length === 0) {
          console.log('[Discovery Modal] Firestore search returned no results, falling back to local search');
          
          // Search local document library
          const localDocs = findMatchingDocuments(query.trim(), locale);
          
          // Convert to DiscoveryResult format
          const convertedResults: DiscoveryResult[] = localDocs.slice(0, 10).map((doc, index) => ({
            id: doc.id,
            title: doc.translations?.[locale]?.name || doc.name || doc.id,
            confidence: Math.max(0.9 - (index * 0.1), 0.1), // Decreasing confidence scores
            reason: 'keyword' as const,
            template: {
              id: doc.id,
              name: doc.translations?.[locale]?.name || doc.name || doc.id,
              description: doc.translations?.[locale]?.description || doc.description || '',
              keywords: doc.translations?.[locale]?.aliases || [],
              category: doc.category,
              slug: doc.id,
              createdBy: 'system',
              creatorProfile: {
                userId: 'system',
                displayName: '123LegalDoc',
                verified: true,
                badges: [],
                totalTemplates: 0,
                totalDownloads: 0,
                totalRevenue: 0,
                averageRating: 5.0,
              },
              maintainers: [],
              tags: [doc.category.toLowerCase()],
              jurisdiction: doc.jurisdiction || 'US',
              states: doc.states || 'all',
              languageSupport: doc.languageSupport || ['en'],
              visibility: 'public' as const,
              pricing: {
                type: 'one-time' as const,
                basePrice: doc.basePrice || 2500,
                currency: 'USD',
                creatorShare: 0,
                platformFee: 100,
              },
              licenseType: 'premium' as const,
              currentVersion: '1.0.0',
              latestVersionId: 'v1',
              versions: ['v1'],
              stats: {
                totalDownloads: 0,
                totalInstalls: 0,
                totalRevenue: 0,
                uniqueUsers: 0,
                downloadsThisMonth: 0,
                downloadsThisWeek: 0,
                revenueThisMonth: 0,
                totalRatings: 0,
                averageRating: 5.0,
                completionRate: 95,
                forkCount: 0,
                favoriteCount: 0,
                reportCount: 0,
                versionCount: 1,
                lastVersionDate: new Date() as any,
                updateFrequency: 365,
              },
              ratings: {
                averageRating: 5.0,
                totalRatings: 0,
                ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
                recentTrend: 'stable' as const,
                trendChange: 0,
              },
              lastUpdated: new Date() as any,
              featured: false,
              verified: true,
              moderationStatus: 'approved' as const,
            }
          }));
          
          setLocalResults(convertedResults);
          setIsUsingLocalFallback(true);
        } else {
          setLocalResults([]);
          setIsUsingLocalFallback(false);
        }
      }, 100); // Small delay to ensure Firestore search has completed
    }
  };
  
  // Combined results - use local fallback if Firestore is empty
  const results = isUsingLocalFallback ? localResults : firestoreResults;
  
  const clearResults = () => {
    resetMetrics();
    setSearchInput('');
    setLocalResults([]);
    setIsUsingLocalFallback(false);
  };

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
    <Dialog open={showDiscoveryModal} onOpenChange={setShowDiscoveryModal}>
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
          <div className="flex-shrink-0 px-6 py-4 pb-3 sticky top-0 bg-gray-50/50 dark:bg-gray-800/50 z-10 border-b border-gray-200 dark:border-gray-700">
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
            ref={scrollContainerRef}
            className={`flex-1 overflow-y-auto px-6 relative ${
              isOverflowing ? 'scroll-fade-out' : ''
            }`}
            aria-live="polite"
            aria-label="Search results"
          >
            {isSearching || !results ? (
              <div className="space-y-4 pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => <ResultCardSkeleton key={i} />)}
                </div>
              </div>
            ) : results.length > 0 ? (
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