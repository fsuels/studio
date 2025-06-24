// src/app/[locale]/HomePageClient.tsx
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import lazyOnView from '@/components/shared/media/LazyOnView';
import type { LegalDocument } from '@/lib/document-library';
import { documentLibrary } from '@/lib/document-library';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { CATEGORY_LIST } from '@/components/workflow/Step1DocumentSelector';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import PersonalizationBlock from '@/components/PersonalizationBlock';
import { AutoImage } from '@/components/shared';
// import SearchBar from '@/components/SearchBar'; // Original import
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton
import { getDocTranslation } from '@/lib/i18nUtils';
import { Search, FileText, Mic, MicOff, MessageSquare, ArrowRight, AlertTriangle, X } from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Minimal loading spinner without text
const MinimalLoadingSpinner = () => (
  <div className="flex justify-center items-center h-32">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Skeletons for lazy-loaded sections
const HowItWorksSkeleton = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-8"></div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-muted rounded-lg p-6 h-40"></div>
      ))}
    </div>
  </div>
);

const TestimonialsSkeleton = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-8"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="bg-muted rounded-lg p-6 h-48"></div>
      ))}
    </div>
  </div>
);

const TopDocsSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="h-8 bg-muted rounded w-1/4 mx-auto mb-6"></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-muted rounded-lg h-16"></div>
      ))}
    </div>
  </div>
);

const SearchBarSkeleton = () => (
  <div className="relative max-w-md">
    <div className="h-12 bg-muted rounded-full w-full"></div>{' '}
    {/* Input field skeleton */}
    <div className="mt-2 h-4 bg-muted rounded w-3/4"></div>{' '}
    {/* Trustline/Hint skeleton */}
  </div>
);

const SearchBar = lazyOnView(() => import('@/components/shared/SearchBar'), {
  placeholder: <SearchBarSkeleton />,
});

const HowItWorks = lazyOnView(
  () => import('@/components/layout').then((m) => ({ default: m.HowItWorks })),
  {
    placeholder: <HowItWorksSkeleton />,
  },
);

const TrustAndTestimonialsSection = lazyOnView(
  () =>
    import('@/components/layout').then((m) => ({
      default: m.TrustAndTestimonialsSection,
    })),
  {
    placeholder: <TestimonialsSkeleton />,
  },
);

const TopDocsChips = lazyOnView(
  () => import('@/components/shared/TopDocsChips'),
  {
    placeholder: <TopDocsSkeleton />,
  },
);

const AnnouncementBar = lazyOnView(
  () =>
    import('@/components/shared').then((m) => ({ default: m.AnnouncementBar })),
  {
    placeholder: null,
  },
);

export default function HomePageClient() {
  const { t } = useTranslation('common');
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const locale = (params!.locale as 'en' | 'es') || 'en';

  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [selectedCategoryForFilter, setSelectedCategoryForFilter] = useState<
    string | null
  >(null);
  const [selectedDocument, setSelectedDocument] =
    useState<LegalDocument | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [ctaVariant, setCtaVariant] = useState<'A' | 'B' | 'C'>('A');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);
  const [discoveryInput, setDiscoveryInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [discoveryResults, setDiscoveryResults] = useState<LegalDocument[]>([]);
  const [inputMethod, setInputMethod] = useState<'text' | 'voice'>('text');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // A/B Test CTA variants - only after hydration to avoid SSR mismatch
    if (!isHydrated) return;
    
    const stored = localStorage.getItem('ctaVariant');
    if (stored === 'A' || stored === 'B' || stored === 'C') {
      setCtaVariant(stored as 'A' | 'B' | 'C');
    } else {
      const variants: ('A' | 'B' | 'C')[] = ['A', 'B', 'C'];
      const chosen = variants[Math.floor(Math.random() * variants.length)];
      localStorage.setItem('ctaVariant', chosen);
      setCtaVariant(chosen);
    }
  }, [isHydrated]);

  // Search functionality
  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return documentLibrary
      .filter(doc => {
        const translatedDoc = getDocTranslation(doc, locale);
        return (
          translatedDoc.name.toLowerCase().includes(query) ||
          translatedDoc.description?.toLowerCase().includes(query) ||
          doc.keywords?.some(keyword => keyword.toLowerCase().includes(query))
        );
      })
      .slice(0, 6); // Limit to 6 results
  }, [searchQuery, locale]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchResults(true);
    }
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.search-container')) {
        setShowSearchResults(false);
      }
    };

    if (showSearchResults) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSearchResults]);

  // AI-powered document discovery with semantic understanding
  const discoverDocuments = useMemo(() => {
    if (!discoveryInput.trim()) return [];
    
    const query = discoveryInput.toLowerCase();
    
    // AI Semantic Analysis - understand intent and context
    const semanticAnalyzer = (userInput: string) => {
      const input = userInput.toLowerCase();
      const results: { doc: LegalDocument; score: number; reasons: string[] }[] = [];
      
      // Analyze each document for semantic relevance
      documentLibrary.forEach(doc => {
        const translatedDoc = getDocTranslation(doc, locale);
        let score = 0;
        const reasons: string[] = [];
        
        const docName = translatedDoc.name.toLowerCase();
        const docDesc = translatedDoc.description?.toLowerCase() || '';
        const keywords = doc.keywords?.map(k => k.toLowerCase()) || [];
        
        // AI Context Understanding
        
        // 1. BUYING/SELLING ANALYSIS
        if (input.includes('buy') || input.includes('purchase') || input.includes('sell') || input.includes('sale')) {
          if (input.includes('house') || input.includes('home') || input.includes('property') || input.includes('real estate')) {
            if (docName.includes('real estate') || docName.includes('property') || docName.includes('deed')) {
              score += 100;
              reasons.push('Real estate transaction');
            }
          } else if (input.includes('car') || input.includes('vehicle') || input.includes('auto') || input.includes('truck') || input.includes('motorcycle')) {
            if (docName.includes('vehicle') || docName.includes('bill of sale')) {
              score += 100;
              reasons.push('Vehicle transaction');
            }
          } else if (input.includes('boat') || input.includes('ship') || input.includes('yacht')) {
            if (docName.includes('boat') || docName.includes('bill of sale')) {
              score += 100;
              reasons.push('Boat transaction');
            }
          } else if (input.includes('business') || input.includes('company')) {
            if (docName.includes('business sale') || docName.includes('buy-sell')) {
              score += 100;
              reasons.push('Business transaction');
            }
          } else {
            // General item sale
            if (docName.includes('bill of sale') && !docName.includes('vehicle')) {
              score += 80;
              reasons.push('General item sale');
            }
          }
        }
        
        // 2. EMPLOYMENT ANALYSIS
        if (input.includes('hire') || input.includes('employ') || input.includes('job') || input.includes('work')) {
          if (input.includes('contractor') || input.includes('freelance') || input.includes('consultant')) {
            if (docName.includes('contractor') || docName.includes('consulting')) {
              score += 100;
              reasons.push('Independent contractor hiring');
            }
          } else {
            if (docName.includes('employment') && !docName.includes('contractor')) {
              score += 100;
              reasons.push('Employee hiring');
            }
          }
        }
        
        // 3. RENTAL/LEASE ANALYSIS
        if (input.includes('rent') || input.includes('lease') || input.includes('tenant') || input.includes('landlord')) {
          if (input.includes('commercial') || input.includes('office') || input.includes('store')) {
            if (docName.includes('commercial lease')) {
              score += 100;
              reasons.push('Commercial rental');
            }
          } else {
            if (docName.includes('lease') || docName.includes('rental')) {
              score += 90;
              reasons.push('Residential rental');
            }
          }
        }
        
        // 4. BUSINESS FORMATION ANALYSIS
        if (input.includes('start') && (input.includes('business') || input.includes('company'))) {
          if (input.includes('partner') || input.includes('together') || input.includes('with')) {
            if (docName.includes('partnership')) {
              score += 100;
              reasons.push('Business partnership');
            } else if (docName.includes('llc')) {
              score += 90;
              reasons.push('LLC formation');
            }
          } else {
            if (docName.includes('llc') || docName.includes('corporation') || docName.includes('articles')) {
              score += 90;
              reasons.push('Business formation');
            }
          }
        }
        
        // 5. ESTATE/WILL ANALYSIS
        if (input.includes('will') || input.includes('die') || input.includes('death') || input.includes('estate') || input.includes('inherit')) {
          if (docName.includes('will') || docName.includes('testament')) {
            score += 100;
            reasons.push('Estate planning');
          }
        }
        
        // 6. LOAN/MONEY ANALYSIS
        if (input.includes('loan') || input.includes('borrow') || input.includes('lend') || input.includes('money') || input.includes('owe')) {
          if (docName.includes('promissory') || docName.includes('loan')) {
            score += 100;
            reasons.push('Loan agreement');
          }
        }
        
        // 7. FAMILY/RELATIONSHIP ANALYSIS
        if (input.includes('divorce') || input.includes('custody') || input.includes('child') || input.includes('marriage')) {
          if (input.includes('prenup') || input.includes('before marriage')) {
            if (docName.includes('prenuptial')) {
              score += 100;
              reasons.push('Marriage preparation');
            }
          } else if (input.includes('child') || input.includes('custody')) {
            if (docName.includes('custody') || docName.includes('child')) {
              score += 100;
              reasons.push('Child-related legal matter');
            }
          } else if (input.includes('divorce')) {
            if (docName.includes('divorce') || docName.includes('separation')) {
              score += 100;
              reasons.push('Divorce proceedings');
            }
          }
        }
        
        // 8. CONFIDENTIALITY ANALYSIS
        if (input.includes('secret') || input.includes('confidential') || input.includes('nda') || input.includes('private') || input.includes('information')) {
          if (docName.includes('disclosure') || docName.includes('confidentiality')) {
            score += 100;
            reasons.push('Information protection');
          }
        }
        
        // 9. POWER OF ATTORNEY ANALYSIS
        if (input.includes('medical decision') || input.includes('power of attorney') || input.includes('cannot decide')) {
          if (docName.includes('power of attorney')) {
            score += 100;
            reasons.push('Legal decision authority');
          }
        }
        
        // 10. SEMANTIC WORD MATCHING (fallback)
        const inputWords = input.split(' ').filter(word => word.length > 2);
        const docWords = [...docName.split(' '), ...docDesc.split(' '), ...keywords].filter(word => word.length > 2);
        
        inputWords.forEach(inputWord => {
          docWords.forEach(docWord => {
            if (docWord.includes(inputWord) || inputWord.includes(docWord)) {
              score += 20;
              reasons.push(`Word match: ${inputWord}`);
            }
          });
        });
        
        if (score > 0) {
          results.push({ doc, score, reasons });
        }
      });
      
      // Sort by AI confidence score
      return results
        .sort((a, b) => b.score - a.score)
        .slice(0, 8)
        .map(result => result.doc);
    };
    
    return semanticAnalyzer(query);
  }, [discoveryInput, locale]);

  // Voice input functionality with enhanced error handling
  const startVoiceInput = () => {
    // Only proceed if hydrated
    if (!isHydrated) {
      toast({
        title: "Loading",
        description: "Please wait for the page to finish loading.",
        variant: "destructive",
      });
      return;
    }

    // Check for HTTPS requirement (allow localhost, 127.0.0.1, and file:// for development)
    const isSecure = location.protocol === 'https:' || 
                    location.hostname === 'localhost' || 
                    location.hostname === '127.0.0.1' ||
                    location.hostname.startsWith('192.168.') ||
                    location.hostname.endsWith('.local') ||
                    location.protocol === 'file:';
    
    if (!isSecure) {
      toast({
        title: "HTTPS Required",
        description: "Voice input requires a secure connection. Please use HTTPS.",
        variant: "destructive",
      });
      return;
    }

    // Check for browser support
    const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    if (!isSupported) {
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser doesn't support voice input. Please try typing instead.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Use feature detection to avoid CSP issues
      let SpeechRecognition;
      if ('webkitSpeechRecognition' in window) {
        SpeechRecognition = (window as any).webkitSpeechRecognition;
      } else if ('SpeechRecognition' in window) {
        SpeechRecognition = (window as any).SpeechRecognition;
      } else {
        throw new Error('Speech recognition not supported');
      }
      
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = locale === 'es' ? 'es-ES' : 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        try {
          const transcript = event.results[0][0].transcript;
          setDiscoveryInput(transcript);
          
          // Manually trigger the semantic analysis with the new transcript
          const semanticAnalyzer = (userInput: string) => {
            const input = userInput.toLowerCase();
            const results: { doc: LegalDocument; score: number; reasons: string[] }[] = [];
            
            // Analyze each document for semantic relevance
            documentLibrary.forEach(doc => {
              const translatedDoc = getDocTranslation(doc, locale);
              let score = 0;
              const reasons: string[] = [];
              
              const docName = translatedDoc.name.toLowerCase();
              const docDesc = translatedDoc.description?.toLowerCase() || '';
              const keywords = doc.keywords?.map(k => k.toLowerCase()) || [];
              
              // AI Context Understanding for voice input
              
              // 1. BUYING/SELLING ANALYSIS
              if (input.includes('buy') || input.includes('purchase') || input.includes('sell') || input.includes('sale')) {
                if (input.includes('house') || input.includes('home') || input.includes('property') || input.includes('real estate')) {
                  if (docName.includes('real estate') || docName.includes('property') || docName.includes('deed') || docName.includes('purchase agreement')) {
                    score += 100;
                    reasons.push('Real estate transaction');
                  }
                } else if (input.includes('car') || input.includes('vehicle') || input.includes('auto') || input.includes('truck') || input.includes('motorcycle')) {
                  if (docName.includes('vehicle') || docName.includes('bill of sale')) {
                    score += 100;
                    reasons.push('Vehicle transaction');
                  }
                } else if (input.includes('boat') || input.includes('ship') || input.includes('yacht')) {
                  if (docName.includes('boat') || docName.includes('bill of sale')) {
                    score += 100;
                    reasons.push('Boat transaction');
                  }
                } else if (input.includes('business') || input.includes('company')) {
                  if (docName.includes('business sale') || docName.includes('buy-sell')) {
                    score += 100;
                    reasons.push('Business transaction');
                  }
                } else {
                  // General item sale
                  if (docName.includes('bill of sale') && !docName.includes('vehicle')) {
                    score += 80;
                    reasons.push('General item sale');
                  }
                }
              }
              
              // 2. EMPLOYMENT ANALYSIS
              if (input.includes('hire') || input.includes('employ') || input.includes('job') || input.includes('work')) {
                if (input.includes('contractor') || input.includes('freelance') || input.includes('consultant')) {
                  if (docName.includes('contractor') || docName.includes('consulting')) {
                    score += 100;
                    reasons.push('Independent contractor hiring');
                  }
                } else {
                  if (docName.includes('employment') && !docName.includes('contractor')) {
                    score += 100;
                    reasons.push('Employee hiring');
                  }
                }
              }
              
              // 3. RENTAL/LEASE ANALYSIS
              if (input.includes('rent') || input.includes('lease') || input.includes('tenant') || input.includes('landlord')) {
                if (input.includes('commercial') || input.includes('office') || input.includes('store')) {
                  if (docName.includes('commercial lease')) {
                    score += 100;
                    reasons.push('Commercial rental');
                  }
                } else {
                  if (docName.includes('lease') || docName.includes('rental')) {
                    score += 90;
                    reasons.push('Residential rental');
                  }
                }
              }
              
              // 4. BUSINESS FORMATION ANALYSIS
              if (input.includes('start') && (input.includes('business') || input.includes('company'))) {
                if (input.includes('partner') || input.includes('together') || input.includes('with')) {
                  if (docName.includes('partnership')) {
                    score += 100;
                    reasons.push('Business partnership');
                  } else if (docName.includes('llc')) {
                    score += 90;
                    reasons.push('LLC formation');
                  }
                } else {
                  if (docName.includes('llc') || docName.includes('corporation') || docName.includes('articles')) {
                    score += 90;
                    reasons.push('Business formation');
                  }
                }
              }
              
              // 5. ESTATE/WILL ANALYSIS
              if (input.includes('will') || input.includes('die') || input.includes('death') || input.includes('estate') || input.includes('inherit')) {
                if (docName.includes('will') || docName.includes('testament')) {
                  score += 100;
                  reasons.push('Estate planning');
                }
              }
              
              // 6. LOAN/MONEY ANALYSIS
              if (input.includes('loan') || input.includes('borrow') || input.includes('lend') || input.includes('money') || input.includes('owe')) {
                if (docName.includes('promissory') || docName.includes('loan')) {
                  score += 100;
                  reasons.push('Loan agreement');
                }
              }
              
              // 7. FAMILY/RELATIONSHIP ANALYSIS
              if (input.includes('divorce') || input.includes('custody') || input.includes('child') || input.includes('marriage')) {
                if (input.includes('prenup') || input.includes('before marriage')) {
                  if (docName.includes('prenuptial')) {
                    score += 100;
                    reasons.push('Marriage preparation');
                  }
                } else if (input.includes('child') || input.includes('custody')) {
                  if (docName.includes('custody') || docName.includes('child')) {
                    score += 100;
                    reasons.push('Child-related legal matter');
                  }
                } else if (input.includes('divorce')) {
                  if (docName.includes('divorce') || docName.includes('separation')) {
                    score += 100;
                    reasons.push('Divorce proceedings');
                  }
                }
              }
              
              // 8. CONFIDENTIALITY ANALYSIS
              if (input.includes('secret') || input.includes('confidential') || input.includes('nda') || input.includes('private') || input.includes('information')) {
                if (docName.includes('disclosure') || docName.includes('confidentiality')) {
                  score += 100;
                  reasons.push('Information protection');
                }
              }
              
              // 9. POWER OF ATTORNEY ANALYSIS
              if (input.includes('medical decision') || input.includes('power of attorney') || input.includes('cannot decide')) {
                if (docName.includes('power of attorney')) {
                  score += 100;
                  reasons.push('Legal decision authority');
                }
              }
              
              // 10. SEMANTIC WORD MATCHING (fallback)
              const inputWords = input.split(' ').filter(word => word.length > 2);
              const docWords = [...docName.split(' '), ...docDesc.split(' '), ...keywords].filter(word => word.length > 2);
              
              inputWords.forEach(inputWord => {
                docWords.forEach(docWord => {
                  if (docWord.includes(inputWord) || inputWord.includes(docWord)) {
                    score += 20;
                    reasons.push(`Word match: ${inputWord}`);
                  }
                });
              });
              
              if (score > 0) {
                results.push({ doc, score, reasons });
              }
            });
            
            // Sort by AI confidence score
            return results
              .sort((a, b) => b.score - a.score)
              .slice(0, 8)
              .map(result => result.doc);
          };
          
          const voiceResults = semanticAnalyzer(transcript);
          setDiscoveryResults(voiceResults);
          
          toast({
            title: "Voice Input Received",
            description: `Heard: "${transcript}" - Found ${voiceResults.length} matches`,
          });
        } catch (error) {
          console.error('Error processing speech result:', error);
          toast({
            title: "Processing Error",
            description: "Could not process your voice input. Please try again.",
            variant: "destructive",
          });
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        console.error('Speech recognition error:', event.error);
        
        let errorMessage = "Voice input failed. Please try again or use text input.";
        
        switch (event.error) {
          case 'not-allowed':
          case 'service-not-allowed':
            errorMessage = "Microphone permission denied. Please allow microphone access and try again.";
            break;
          case 'no-speech':
            errorMessage = "Sorry, I didn't catch that. Please try speaking again, or type your situation.";
            break;
          case 'network':
            errorMessage = "Network error. Please check your connection and try again.";
            break;
          case 'audio-capture':
            errorMessage = "Microphone not available. Please check your microphone and try again.";
            break;
          case 'aborted':
            errorMessage = "Voice input was cancelled. Feel free to try again.";
            break;
        }
        
        toast({
          title: "Voice Input Issue",
          description: errorMessage,
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (error) {
      setIsListening(false);
      console.error('Failed to start speech recognition:', error);
      toast({
        title: "Voice Input Error",
        description: "Could not start voice input. Please try typing instead.",
        variant: "destructive",
      });
    }
  };

  const handleDiscoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDiscoveryResults(discoverDocuments);
  };

  const workflowSectionId = 'workflow-start'; // This ID is now unused as the section is removed

  const scrollToWorkflow = useCallback(() => {
    // Since the section is removed, this function might not be needed
    // or could be repurposed if there's another target section.
    // For now, it will do nothing if the element is not found.
    const section = document.getElementById(workflowSectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [workflowSectionId]);

  useEffect(() => {
    if (!isHydrated) return;

    const docIdFromQuery = searchParams!.get('docId');
    const categoryFromQuery = searchParams!.get('category');
    const searchFromQuery = searchParams!.get('search');

    if (searchFromQuery && !globalSearchTerm) {
      setGlobalSearchTerm(searchFromQuery);
      // scrollToWorkflow(); // May not be needed as section is removed
    }

    if (categoryFromQuery && !selectedCategoryForFilter) {
      const isValidCategory = CATEGORY_LIST.some(
        (cat) => cat.key === categoryFromQuery,
      );
      if (isValidCategory) {
        setSelectedCategoryForFilter(categoryFromQuery);
        // scrollToWorkflow(); // May not be needed
      }
    }

    if (docIdFromQuery && !selectedCategoryForFilter && !selectedDocument) {
      const foundDoc = documentLibrary.find((d) => d.id === docIdFromQuery);
      if (foundDoc) {
        setSelectedCategoryForFilter(foundDoc.category);
        // scrollToWorkflow(); // May not be needed
      }
    }
  }, [
    searchParams,
    globalSearchTerm,
    selectedCategoryForFilter,
    selectedDocument,
    isHydrated,
    scrollToWorkflow,
  ]);

  return (
    <>
      <AnnouncementBar />

      {/* HERO SECTION */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left column */}
          <div>
            <div className="space-y-3">
              <h1 className="text-4xl lg:text-5xl font-bold text-[#1F2937] leading-tight">
                {t('home.hero2.title', {
                  defaultValue: 'Legal Documents Made Easy:',
                })}
              </h1>
              <div className="relative inline-block">
                <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                  {t('home.hero2.subtitle2', {
                    defaultValue: 'Generate Any Form in Minutes.',
                  })}
                </h2>
                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 rounded-xl blur-lg -z-10"></div>
              </div>
              {isHydrated && (
                <div className="flex items-center gap-2 mt-4">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-emerald-700">Save Thousands</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-blue-700">No Legal Experience</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-purple-700">Instant Results</span>
                  </div>
                </div>
              )}
            </div>
            <p className="mt-6 text-lg text-gray-700 tracking-wide leading-relaxed">
              {t('home.hero2.subtitle', {
                defaultValue:
                  'Avoid costly lawyers and complex processes. Our AI platform guides you through creating legally sound documents with ease.',
              })}
            </p>
            
            {/* Prominent CTA Section */}
            <div className="mt-8 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setShowDiscoveryModal(true)}
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden" 
                  suppressHydrationWarning
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center gap-2" suppressHydrationWarning>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {!isHydrated 
                      ? t('home.hero2.cta.primary', { defaultValue: 'Generate Your First Form Free' })
                      : ctaVariant === 'A' 
                      ? t('home.hero2.cta.primary', { defaultValue: 'Generate Your First Form Free' })
                      : ctaVariant === 'B'
                      ? t('home.hero2.cta.primaryB', { defaultValue: 'Start Creating Documents' })
                      : t('home.hero2.cta.primaryC', { defaultValue: 'Create Legal Forms Now' })
                    }
                  </span>
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-500/20 to-blue-600/20 blur-xl"></div>
                </button>
                
                {isHydrated ? (
                  <div className="relative flex-1 max-w-md search-container">
                    <form onSubmit={handleSearchSubmit} className="relative">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          placeholder={t('home.hero2.searchPlaceholder', { defaultValue: 'Search legal forms (e.g., lease, NDA, will)...' })}
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowSearchResults(e.target.value.length > 0);
                          }}
                          className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 shadow-sm focus:shadow-md"
                        />
                      </div>
                    </form>
                    
                    {/* Search Results Dropdown */}
                    {showSearchResults && searchQuery.trim() && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-80 overflow-y-auto">
                        {filteredDocuments.length > 0 ? (
                          <div className="p-2">
                            <div className="text-xs text-gray-500 px-3 py-2 border-b">
                              {filteredDocuments.length} result{filteredDocuments.length !== 1 ? 's' : ''} found
                            </div>
                            {filteredDocuments.map((doc) => {
                              const translatedDoc = getDocTranslation(doc, locale);
                              return (
                                <Link
                                  key={doc.id}
                                  href={`/${locale}/docs/${doc.id}`}
                                  className="block p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                  onClick={() => {
                                    setShowSearchResults(false);
                                    setSearchQuery('');
                                  }}
                                >
                                  <div className="flex items-start gap-3">
                                    <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-medium text-gray-900 truncate">
                                        {translatedDoc.name}
                                      </h4>
                                      {translatedDoc.description && (
                                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                          {translatedDoc.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="p-4 text-center text-gray-500">
                            <FileText className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                            <p>No documents found for "{searchQuery}"</p>
                            <p className="text-xs mt-1">Try searching for "lease", "contract", or "will"</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 max-w-md">
                    <div className="w-full h-14 bg-gray-100 rounded-xl animate-pulse"></div>
                  </div>
                )}
              </div>
              
              {/* Trust indicators under CTA */}
              <div className="flex items-center justify-start gap-6 text-sm text-gray-600 pt-2">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>30-day guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>SSL secure</span>
                </div>
              </div>
            </div>
            {/* Trust Line */}
            <div className="mt-6">
              <p className="text-sm text-gray-600 flex items-center gap-1 flex-wrap">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Smart Legal Templates</span>
                <span className="mx-2">•</span>
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Fast & Secure</span>
                <span className="mx-2">•</span>
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Tailored by You</span>
              </p>
            </div>
          </div>
          {/* Right column */}
          <div className="mt-10 lg:mt-0 flex justify-center lg:justify-end mx-auto lg:ml-auto lg:mr-8">
            <AutoImage
              src={
                locale === 'es'
                  ? '/images/hero-main-es.png'
                  : '/images/hero-main.png'
              }
              alt="Hero image illustrating legal document generation"
              className="w-full max-w-lg rounded-xl shadow-lg"
              data-ai-hint="team collaboration"
              priority
            />
          </div>
        </div>
      </section>

      {/* "Generate and Personalize Legal Forms" section (formerly "How It Works") */}
      <HowItWorks />

      {/* Popular Documents by Category */}
      <TopDocsChips />

      {/* "Trust and Testimonials" section */}
      <TrustAndTestimonialsSection />

      <Separator className="my-12" />

      {/* The "What do you want to accomplish?" section and its contents have been removed. */}
      {/* The PersonalizationBlock that was inside it is also removed. If it's needed elsewhere, it can be re-added. */}

      {/* Document Discovery Modal */}
      <Dialog open={showDiscoveryModal} onOpenChange={setShowDiscoveryModal}>
        <DialogContent className="max-w-5xl h-[95vh] flex flex-col p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-blue-600" />
              Find the Right Document for Your Needs
            </DialogTitle>
          </DialogHeader>
          
          {/* Helpful Notice - Compact */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                <span className="font-medium">Quick Note:</span> Effortlessly create essential legal documents with our powerful templates. We provide tools, not legal advice – consult an attorney for personalized guidance.
              </p>
            </div>
          </div>

          {/* Input Method Toggle */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-medium text-gray-700">How would you like to describe your situation?</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setInputMethod('text')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  inputMethod === 'text' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <MessageSquare className="h-4 w-4 inline mr-1" />
                Type
              </button>
              <button
                onClick={() => setInputMethod('voice')}
                disabled={!isHydrated || (isHydrated && !('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window))}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  inputMethod === 'voice' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                } ${isHydrated && !('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window) ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={isHydrated && !('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window) ? 'Voice input not supported in this browser' : 'Use voice input'}
              >
                <Mic className="h-4 w-4 inline mr-1" />
                Speak
              </button>
            </div>
            {isHydrated && !('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window) && (
              <span className="text-xs text-gray-500 italic">Voice input requires Chrome, Safari, or Edge</span>
            )}
          </div>

          {/* Input Section - Compact */}
          <div className="flex-shrink-0 mb-4">
            {inputMethod === 'text' ? (
              <div>
                <textarea
                  value={discoveryInput}
                  onChange={(e) => {
                    setDiscoveryInput(e.target.value);
                    setDiscoveryResults(discoverDocuments);
                  }}
                  placeholder="Describe your situation (e.g., buying a car, renting apartment, starting business)..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[60px] resize-none"
                  rows={2}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="text-sm text-gray-600">Click to speak:</span>
                <button
                  onClick={startVoiceInput}
                  disabled={isListening}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isListening 
                      ? 'bg-red-100 text-red-700 cursor-not-allowed animate-pulse' 
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-95'
                  }`}
                  title={isListening ? "Recording your voice..." : "Click to start voice input"}
                >
                  {isListening ? (
                    <>
                      <div className="relative">
                        <Mic className="h-4 w-4" />
                        <div className="absolute -inset-1 bg-red-500 rounded-full animate-ping opacity-25"></div>
                      </div>
                      Listening...
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4" />
                      Start Speaking
                    </>
                  )}
                </button>
                {discoveryInput && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">You said:</span>
                    <span className="text-sm text-gray-700 italic bg-gray-100 px-2 py-1 rounded">"{discoveryInput}"</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Results Section - Grid Layout */}
          {discoveryResults.length > 0 && (
            <div className="flex-1 min-h-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">AI Recommended Documents:</h3>
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    Let our AI do the searching for you
                  </span>
                </div>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {discoveryResults.length} result{discoveryResults.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="h-full overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-4">
                  {discoveryResults.map((doc) => {
                    const translatedDoc = getDocTranslation(doc, locale);
                    return (
                      <Link
                        key={doc.id}
                        href={`/${locale}/docs/${doc.id}`}
                        onClick={() => setShowDiscoveryModal(false)}
                        className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group h-fit hover:shadow-sm"
                      >
                        <div className="flex items-start gap-3">
                          <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 group-hover:text-blue-700 text-sm leading-tight mb-1">
                              {translatedDoc.name}
                            </h4>
                            {translatedDoc.description && (
                              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                                {translatedDoc.description}
                              </p>
                            )}
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-blue-600 font-medium group-hover:text-blue-700">
                                Start Document
                              </span>
                              <ArrowRight className="h-3 w-3 text-blue-600 group-hover:text-blue-700 transition-all group-hover:translate-x-0.5" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {discoveryInput && discoveryResults.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center max-w-md">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">Sorry, we couldn't find an exact match for that</p>
                <p className="text-sm text-gray-600 mb-4">Please try rephrasing your situation, or browse our full document library</p>
                <button
                  onClick={() => setShowDiscoveryModal(false)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  Browse All Documents
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
