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
    };

    if (showDiscoveryModal) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [showDiscoveryModal]);

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
        aria-labelledby="discovery-modal-title"
        aria-describedby="discovery-modal-description"
      >
        {/* Enhanced Header */}
        <div className="relative overflow-hidden rounded-t-lg header-gradient">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-white/20"></div>
          {/* Contrast overlay for WCAG compliance - 40% for H1 contrast ≈ 5.8:1 */}
          <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute -bottom-2 -left-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          
          <DialogHeader className="relative px-5 py-4 pb-5">
            <DialogTitle 
              id="discovery-modal-title"
              className="text-3xl font-bold text-white flex items-center gap-4"
            >
              <div className="relative">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                  <Brain className="h-8 w-8 text-white drop-shadow-lg" style={{ color: '#E7FFF9', strokeWidth: '2px' }} />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <span className="block">Smart Document Finder</span>
                <span 
                  id="discovery-modal-description"
                  className="text-lg font-normal block text-white/90"
                >
                  Instantly match the perfect legal template to your needs.
                </span>
              </div>
            </DialogTitle>
            
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 focus:bg-white/40 rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
              aria-label="Close modal"
            >
              <X className="h-5 w-5 text-white" style={{ color: '#E7FFF9', strokeWidth: '2px' }} />
            </button>
            
          </DialogHeader>
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

            {/* Voice feedback */}
            {transcript && (
              <div className="mt-4 flex justify-center">
                <div className="w-full max-w-sm">
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-3 shadow-sm border border-emerald-200 dark:border-emerald-700">
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">You said:</p>
                        <p className="text-sm text-gray-900 dark:text-gray-100 font-medium italic">"{transcript}"</p>
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
              ? `Found ${results.length} matching legal documents`
              : searchInput 
              ? "No matching documents found"
              : ""
            }
          </div>

          {/* Scrollable Results */}
          <div className="flex-1 overflow-y-auto px-6">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}