'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDiscoveryModal } from '@/contexts/DiscoveryModalContext';
import { useToast } from '@/hooks/use-toast';
import { documentLibrary } from '@/lib/document-library';
import { getDocTranslation } from '@/lib/i18nUtils';
import { Search, FileText, Mic, MicOff, MessageSquare, ArrowRight, AlertTriangle, X } from 'lucide-react';
import type { LegalDocument } from '@/lib/document-library';

export default function DocumentDiscoveryModal() {
  const { t } = useTranslation('common');
  const { toast } = useToast();
  const params = useParams();
  const locale = (params!.locale as 'en' | 'es') || 'en';

  const {
    showDiscoveryModal,
    setShowDiscoveryModal,
    discoveryInput,
    setDiscoveryInput,
    isListening,
    setIsListening
  } = useDiscoveryModal();

  const [isHydrated, setIsHydrated] = useState(false);
  const [discoveryResults, setDiscoveryResults] = useState<LegalDocument[]>([]);
  const [inputMethod, setInputMethod] = useState<'text' | 'voice'>('text');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

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

  // Update results when discoveryInput changes
  useEffect(() => {
    setDiscoveryResults(discoverDocuments);
  }, [discoverDocuments]);

  // Voice input functionality with enhanced error handling
  const startVoiceInput = useCallback(() => {
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
                    location.hostname.endsWith('.local') ||
                    location.protocol === 'file:';

    if (!isSecure) {
      toast({
        title: "HTTPS Required",
        description: "Voice input requires a secure connection. Please use HTTPS or localhost for development.",
        variant: "destructive",
      });
      return;
    }

    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast({
        title: "Voice input not supported",
        description: "Your browser doesn't support voice input. Please try Chrome, Safari, or Edge.",
        variant: "destructive",
      });
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = locale === 'es' ? 'es-ES' : 'en-US';

      setIsListening(true);

      recognition.onstart = () => {
        toast({
          title: "Listening...",
          description: "Speak clearly about your legal document needs.",
        });
      };

      recognition.onresult = (event: any) => {
        try {
          const transcript = event.results[0][0].transcript;
          setDiscoveryInput(transcript);
          
          // Manually trigger the semantic analysis with the new transcript
          const semanticAnalyzer = (userInput: string) => {
            const input = userInput.toLowerCase();
            const results: { doc: LegalDocument; score: number; reasons: string[] }[] = [];
            
            documentLibrary.forEach(doc => {
              const translatedDoc = getDocTranslation(doc, locale);
              let score = 0;
              const reasons: string[] = [];
              
              const docName = translatedDoc.name.toLowerCase();
              const docDesc = translatedDoc.description?.toLowerCase() || '';
              const keywords = doc.keywords?.map(k => k.toLowerCase()) || [];
              
              // Apply the same semantic analysis logic
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
                }
              }
              
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

              // Add other semantic analysis patterns here...
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
            
            return results
              .sort((a, b) => b.score - a.score)
              .slice(0, 8)
              .map(result => result.doc);
          };
          
          const voiceResults = semanticAnalyzer(transcript);
          setDiscoveryResults(voiceResults);

          toast({
            title: "Voice captured!",
            description: `You said: "${transcript}"`,
          });
        } catch (error) {
          console.error('Speech recognition result error:', error);
          toast({
            title: "Processing Error",
            description: "Could not process your speech. Please try again.",
            variant: "destructive",
          });
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        let errorMessage = "Voice input failed. Please try again or use text input.";
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = "No speech detected. Please try speaking again.";
            break;
          case 'audio-capture':
            errorMessage = "Microphone not accessible. Please check your microphone permissions.";
            break;
          case 'not-allowed':
            errorMessage = "Microphone permission denied. Please allow microphone access and try again.";
            break;
          case 'network':
            errorMessage = "Network error occurred. Please check your connection and try again.";
            break;
        }
        
        toast({
          title: "Voice Input Error",
          description: errorMessage,
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (error) {
      console.error('Speech recognition setup error:', error);
      setIsListening(false);
      toast({
        title: "Voice input failed",
        description: "Could not initialize voice input. Please try text input instead.",
        variant: "destructive",
      });
    }
  }, [isHydrated, locale, setDiscoveryInput, setDiscoveryResults, setIsListening, toast]);

  return (
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
  );
}