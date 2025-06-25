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
import { Search, FileText, Mic, MicOff, MessageSquare, ArrowRight, AlertTriangle, X, Brain, Sparkles, Zap, Wand2, Check, Lightbulb } from 'lucide-react';
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
  
  // PHASE 3C: Sequential Context Memory for Related Searches
  const [searchHistory, setSearchHistory] = useState<Array<{
    query: string;
    timestamp: number;
    results: LegalDocument[];
    selectedDocument?: string;
    context: {
      detectedStates: string[];
      primaryCategory: string;
      intent: string;
      userType: 'business' | 'personal' | 'unknown';
    };
  }>>([]);
  const [sessionContext, setSessionContext] = useState<{
    primaryLegalArea: string;
    userProfile: {
      experienceLevel: 'beginner' | 'experienced' | 'unknown';
      businessType: 'individual' | 'business' | 'unknown';
      commonStates: string[];
      preferredDocTypes: string[];
    };
    searchPattern: {
      isSequentialSearch: boolean;
      relatedSearches: number;
      topCategories: string[];
    };
  }>({
    primaryLegalArea: '',
    userProfile: {
      experienceLevel: 'unknown',
      businessType: 'unknown',
      commonStates: [],
      preferredDocTypes: []
    },
    searchPattern: {
      isSequentialSearch: false,
      relatedSearches: 0,
      topCategories: []
    }
  });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // CATEGORY VETO RULES - Prevent obviously wrong results
  const CATEGORY_VETOS = {
    // Divorce queries should NEVER return business/property docs
    divorce: ['business-formation', 'corporation', 'llc', 'partnership', 'vehicle-sales', 'property-lease', 'farm', 'mining', 'hunting', 'contractor'],
    
    // Vehicle queries should NEVER return family/business docs  
    vehicle: ['family-law', 'divorce', 'marriage', 'business-formation', 'employment', 'court-documents'],
    
    // Business queries should NEVER return family/vehicle docs
    business: ['family-law', 'divorce', 'marriage', 'vehicle-sales', 'personal-care'],
    
    // Employment queries should NEVER return vehicle/property docs
    employment: ['vehicle-sales', 'property-lease', 'family-law', 'farm', 'mining'],
    
    // Real estate queries should NEVER return vehicle/business formation docs
    realestate: ['vehicle-sales', 'business-formation', 'employment', 'family-law']
  };

  const detectQueryIntent = (query: string): string => {
    const q = query.toLowerCase();
    
    if (q.includes('divorce') || q.includes('divorc') || q.includes('separat') || q.includes('marriage end')) return 'divorce';
    if (q.includes('car') || q.includes('vehicle') || q.includes('auto') || q.includes('truck') || q.includes('motorcycle')) return 'vehicle';
    if (q.includes('business') || q.includes('llc') || q.includes('corporation') || q.includes('company') || q.includes('startup')) return 'business';
    if (q.includes('employ') || q.includes('hire') || q.includes('contractor') || q.includes('job')) return 'employment';
    if (q.includes('house') || q.includes('property') || q.includes('real estate') || q.includes('home')) return 'realestate';
    
    return 'general';
  };

  const applyVetoRules = (query: string, results: any[]): any[] => {
    const intent = detectQueryIntent(query);
    const vetoKeywords = CATEGORY_VETOS[intent as keyof typeof CATEGORY_VETOS] || [];
    
    if (vetoKeywords.length === 0) return results;
    
    return results.filter(result => {
      const docName = result.doc.translations?.en?.name?.toLowerCase() || '';
      const docDesc = result.doc.translations?.en?.description?.toLowerCase() || '';
      const docCategory = result.doc.category?.toLowerCase() || '';
      
      // Check if document contains any veto keywords
      const hasVetoKeyword = vetoKeywords.some(veto => 
        docName.includes(veto) || 
        docDesc.includes(veto) || 
        docCategory.includes(veto)
      );
      
      if (hasVetoKeyword) {
        console.log(`🚫 VETO: "${docName}" blocked for ${intent} query (contains: ${vetoKeywords.find(v => docName.includes(v) || docDesc.includes(v) || docCategory.includes(v))})`);
        return false;
      }
      
      return true;
    });
  };

  // AI-powered document discovery with advanced semantic understanding
  const discoverDocuments = useMemo(() => {
    if (!discoveryInput.trim()) return [];
    
    const query = discoveryInput.toLowerCase();
    
    // PHASE 3B: State/Location Analysis - Global scope for entire discovery process
    const globalLocationAnalysis = (() => {
      // US States and abbreviations mapping
      const stateMap = {
        // Full state names to abbreviations
        'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR', 'california': 'CA', 'colorado': 'CO',
        'connecticut': 'CT', 'delaware': 'DE', 'florida': 'FL', 'georgia': 'GA', 'hawaii': 'HI', 'idaho': 'ID',
        'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA', 'kansas': 'KS', 'kentucky': 'KY', 'louisiana': 'LA',
        'maine': 'ME', 'maryland': 'MD', 'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS',
        'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ',
        'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH',
        'oklahoma': 'OK', 'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
        'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT', 'vermont': 'VT', 'virginia': 'VA',
        'washington': 'WA', 'west virginia': 'WV', 'wisconsin': 'WI', 'wyoming': 'WY',
        
        // Common abbreviations
        'al': 'AL', 'ak': 'AK', 'az': 'AZ', 'ar': 'AR', 'ca': 'CA', 'co': 'CO', 'ct': 'CT', 'de': 'DE',
        'fl': 'FL', 'ga': 'GA', 'hi': 'HI', 'id': 'ID', 'il': 'IL', 'in': 'IN', 'ia': 'IA', 'ks': 'KS',
        'ky': 'KY', 'la': 'LA', 'me': 'ME', 'md': 'MD', 'ma': 'MA', 'mi': 'MI', 'mn': 'MN', 'ms': 'MS',
        'mo': 'MO', 'mt': 'MT', 'ne': 'NE', 'nv': 'NV', 'nh': 'NH', 'nj': 'NJ', 'nm': 'NM', 'ny': 'NY',
        'nc': 'NC', 'nd': 'ND', 'oh': 'OH', 'ok': 'OK', 'or': 'OR', 'pa': 'PA', 'ri': 'RI', 'sc': 'SC',
        'sd': 'SD', 'tn': 'TN', 'tx': 'TX', 'ut': 'UT', 'vt': 'VT', 'va': 'VA', 'wa': 'WA', 'wv': 'WV',
        'wi': 'WI', 'wy': 'WY'
      };
      
      // Major cities to states mapping for common references
      const cityStateMap = {
        'new york city': 'NY', 'nyc': 'NY', 'manhattan': 'NY', 'brooklyn': 'NY', 'queens': 'NY',
        'los angeles': 'CA', 'la': 'CA', 'san francisco': 'CA', 'san diego': 'CA', 'oakland': 'CA',
        'chicago': 'IL', 'houston': 'TX', 'dallas': 'TX', 'austin': 'TX', 'san antonio': 'TX',
        'philadelphia': 'PA', 'phoenix': 'AZ', 'atlanta': 'GA', 'miami': 'FL', 'orlando': 'FL',
        'seattle': 'WA', 'denver': 'CO', 'boston': 'MA', 'detroit': 'MI', 'las vegas': 'NV',
        'portland': 'OR', 'charlotte': 'NC', 'nashville': 'TN', 'memphis': 'TN'
      };
      
      let detectedStates: string[] = [];
      
      // Detect states from input
      for (const [stateName, stateCode] of Object.entries(stateMap)) {
        if (query.includes(stateName.toLowerCase())) {
          detectedStates.push(stateCode);
        }
      }
      
      // Detect cities and map to states
      for (const [cityName, stateCode] of Object.entries(cityStateMap)) {
        if (query.includes(cityName.toLowerCase())) {
          if (!detectedStates.includes(stateCode)) {
            detectedStates.push(stateCode);
          }
        }
      }
      
      return { detectedStates };
    })();
    
    // Helper functions for context detection - must be defined before use
    const detectPrimaryCategory = (query: string) => {
      const categoryIndicators = {
        'realEstate': ['house', 'home', 'property', 'real estate', 'deed', 'mortgage'],
        'vehicle': ['car', 'vehicle', 'auto', 'truck', 'motorcycle', 'boat'],
        'business': ['business', 'company', 'llc', 'corporation', 'partnership'],
        'employment': ['employee', 'contractor', 'job', 'hiring', 'employment'],
        'rental': ['lease', 'rental', 'tenant', 'landlord', 'eviction'],
        'legal': ['divorce', 'custody', 'will', 'estate', 'power of attorney', 'affidavit']
      };
      
      const lowerQuery = query.toLowerCase();
      for (const [category, indicators] of Object.entries(categoryIndicators)) {
        if (indicators.some(indicator => lowerQuery.includes(indicator))) {
          return category;
        }
      }
      return 'general';
    };
    
    const detectUserIntent = (query: string) => {
      const intentIndicators = {
        'buying': ['buy', 'purchase', 'acquire', 'getting'],
        'selling': ['sell', 'dispose', 'transfer'],
        'creating': ['start', 'create', 'form', 'establish'],
        'protecting': ['protect', 'secure', 'safeguard'],
        'resolving': ['resolve', 'fix', 'handle', 'deal with'],
        'planning': ['plan', 'prepare', 'organize']
      };
      
      const lowerQuery = query.toLowerCase();
      for (const [intent, indicators] of Object.entries(intentIndicators)) {
        if (indicators.some(indicator => lowerQuery.includes(indicator))) {
          return intent;
        }
      }
      return 'general';
    };
    
    const detectUserType = (query: string): 'business' | 'personal' | 'unknown' => {
      const businessIndicators = ['my business', 'company', 'commercial', 'enterprise', 'corporation'];
      const personalIndicators = ['my family', 'personal', 'myself', 'my home', 'individual'];
      
      const lowerQuery = query.toLowerCase();
      
      if (businessIndicators.some(indicator => lowerQuery.includes(indicator))) {
        return 'business';
      }
      if (personalIndicators.some(indicator => lowerQuery.includes(indicator))) {
        return 'personal';
      }
      return 'unknown';
    };
    
    // PHASE 1A: Multi-word Context Phrase Analysis
    const analyzePhrasesAndContext = (input: string) => {
      const phrases = {
        // Real Estate Phrases
        realEstate: [
          'buying a house', 'buying a home', 'purchasing a house', 'purchasing a home',
          'selling a house', 'selling a home', 'selling my house', 'selling my home',
          'house purchase', 'home purchase', 'real estate purchase', 'property purchase',
          'buying property', 'selling property', 'real estate transaction',
          'home buying', 'house hunting', 'property sale'
        ],
        
        // Vehicle Phrases  
        vehicle: [
          'buying a car', 'selling a car', 'purchasing a vehicle', 'selling my car',
          'car purchase', 'vehicle purchase', 'auto purchase', 'car sale', 'vehicle sale',
          'buying a truck', 'selling a truck', 'motorcycle purchase', 'buying auto'
        ],
        
        // Business Phrases
        business: [
          'starting a business', 'starting a company', 'new business', 'business startup',
          'selling a business', 'selling my business', 'business sale', 'company sale',
          'business partnership', 'business partner', 'starting llc', 'forming llc'
        ],
        
        // Employment Phrases
        employment: [
          'hiring employee', 'hiring employees', 'need employment contract',
          'firing employee', 'terminating employee', 'employee agreement',
          'hiring contractor', 'independent contractor', 'freelancer agreement'
        ],
        
        // Rental/Lease Phrases
        rental: [
          'renting apartment', 'renting house', 'leasing property', 'rental agreement',
          'tenant lease', 'landlord tenant', 'evicting tenant', 'need to evict'
        ],
        
        // Legal Action Phrases - Including common misspellings and variations
        legalAction: [
          'getting divorced', 'getting divorce', 'getting divorve', 'filing divorce', 'divorce proceedings', 'child custody',
          'getting separat', 'separation', 'marriage ending', 'split up', 'breaking up marriage',
          'suing someone', 'being sued', 'legal dispute', 'court case'
        ]
      };
      
      // Check for exact phrase matches first (highest confidence)
      for (const [category, phraseList] of Object.entries(phrases)) {
        for (const phrase of phraseList) {
          if (input.includes(phrase)) {
            return { category, phrase, confidence: 'high' };
          }
        }
      }
      
      // Check for partial phrase matches (medium confidence)
      const words = input.split(' ');
      for (const [category, phraseList] of Object.entries(phrases)) {
        for (const phrase of phraseList) {
          const phraseWords = phrase.split(' ');
          const matchedWords = phraseWords.filter(word => words.includes(word));
          if (matchedWords.length >= Math.ceil(phraseWords.length * 0.6)) {
            return { category, phrase, confidence: 'medium' };
          }
        }
      }
      
      return { category: 'general', phrase: '', confidence: 'low' };
    };
    
    // AI Semantic Analysis - enhanced with phrase context
    const semanticAnalyzer = (userInput: string) => {
      const input = userInput.toLowerCase();
      const results: { doc: LegalDocument; score: number; reasons: string[] }[] = [];
      
      // PHASE 1A: Get phrase context first
      const phraseContext = analyzePhrasesAndContext(input);
      
      
      // Analyze each document for semantic relevance
      documentLibrary.forEach(doc => {
        const translatedDoc = getDocTranslation(doc, locale);
        let score = 0;
        const reasons: string[] = [];
        
        const docName = translatedDoc.name.toLowerCase();
        const docDesc = translatedDoc.description?.toLowerCase() || '';
        const keywords = doc.keywords?.map(k => k.toLowerCase()) || [];
        
        // PHASE 1A: Apply phrase-based scoring first
        if (phraseContext.confidence === 'high') {
          switch (phraseContext.category) {
            case 'realEstate':
              if (docName.includes('real estate purchase') || (docName.includes('purchase') && docName.includes('real estate'))) {
                score += 300; // Highest score for perfect phrase match
                reasons.push(`Perfect match for: "${phraseContext.phrase}"`);
              } else if (docName.includes('livestock') || docName.includes('vehicle') || docName.includes('car')) {
                score -= 200; // Heavy penalty for wrong category
                reasons.push('Excluded - wrong category for real estate');
              }
              break;
              
            case 'vehicle':
              if (docName.includes('vehicle') && docName.includes('bill of sale')) {
                score += 300;
                reasons.push(`Perfect match for: "${phraseContext.phrase}"`);
              } else if (docName.includes('real estate') || docName.includes('livestock')) {
                score -= 200;
                reasons.push('Excluded - wrong category for vehicle');
              }
              break;
              
            case 'business':
              if (docName.includes('llc') || docName.includes('partnership') || docName.includes('business')) {
                score += 300;
                reasons.push(`Perfect match for: "${phraseContext.phrase}"`);
              } else if (docName.includes('vehicle') || docName.includes('real estate') || docName.includes('employment')) {
                score -= 150;
                reasons.push('Excluded - wrong category for business formation');
              }
              break;
              
            case 'employment':
              if (docName.includes('employment') || docName.includes('contractor')) {
                score += 300;
                reasons.push(`Perfect match for: "${phraseContext.phrase}"`);
              } else if (docName.includes('business formation') || docName.includes('real estate')) {
                score -= 150;
                reasons.push('Excluded - wrong category for employment');
              }
              break;
              
            case 'rental':
              if (docName.includes('lease') || docName.includes('rental') || docName.includes('eviction')) {
                score += 300;
                reasons.push(`Perfect match for: "${phraseContext.phrase}"`);
              } else if (docName.includes('purchase') || docName.includes('sale')) {
                score -= 150;
                reasons.push('Excluded - rental not purchase');
              }
              break;
          }
        }
        
        // PHASE 1B: Negative Keywords Detection
        const negativePatterns = [
          // Don't want patterns
          "don't want", "don't need", "not looking for", "not interested in", "no need for",
          "without", "except", "excluding", "not", "avoid", "skip", "already have",
          "don't require", "not required", "not necessary", "doesn't need"
        ];
        
        // Check for negative keywords and apply penalties
        for (const negPattern of negativePatterns) {
          const negIndex = input.indexOf(negPattern);
          if (negIndex !== -1) {
            // Extract what comes after the negative pattern
            const afterNegative = input.substring(negIndex + negPattern.length).trim();
            
            // Check if document type is mentioned after negative pattern
            if (afterNegative.includes('nda') && docName.includes('disclosure')) {
              score -= 300;
              reasons.push('Excluded - user explicitly said no NDA');
            }
            if (afterNegative.includes('employment') && docName.includes('employment')) {
              score -= 300;
              reasons.push('Excluded - user said no employment contracts');
            }
            if (afterNegative.includes('lease') && docName.includes('lease')) {
              score -= 300;
              reasons.push('Excluded - user said no lease agreements');
            }
            if (afterNegative.includes('contractor') && docName.includes('contractor')) {
              score -= 300;
              reasons.push('Excluded - user said no contractor agreements');
            }
            if (afterNegative.includes('business') && docName.includes('business')) {
              score -= 300;
              reasons.push('Excluded - user said no business documents');
            }
            // Generic negative scoring for common document types
            const commonTypes = ['contract', 'agreement', 'form', 'template', 'document'];
            for (const type of commonTypes) {
              if (afterNegative.includes(type) && docName.includes(type)) {
                score -= 200;
                reasons.push(`Excluded - user said no ${type}s`);
              }
            }
          }
        }
        
        // PHASE 1C: Comprehensive Synonym and Legal Term Intelligence
        const synonymMap = {
          // Real Estate Synonyms
          'house': ['home', 'residence', 'dwelling', 'property', 'real estate'],
          'buying': ['purchasing', 'acquiring', 'getting', 'obtaining'],
          'selling': ['selling', 'disposing', 'transferring', 'liquidating'],
          
          // Employment Synonyms  
          'fired': ['terminated', 'let go', 'dismissed', 'laid off', 'discharged'],
          'hired': ['employed', 'recruited', 'onboarded', 'brought on'],
          'quit': ['resigned', 'left', 'departed', 'stepped down'],
          
          // Business Synonyms
          'starting': ['forming', 'creating', 'establishing', 'founding', 'launching'],
          'business': ['company', 'corporation', 'enterprise', 'firm', 'venture'],
          'partner': ['co-founder', 'associate', 'joint venture', 'collaborator'],
          
          // Legal Action Synonyms
          'divorced': ['separated', 'dissolution', 'marriage ended', 'split up'],
          'sued': ['litigation', 'legal action', 'court case', 'legal dispute'],
          'evicted': ['removed', 'ejected', 'expelled', 'thrown out'],
          
          // Vehicle Synonyms
          'car': ['vehicle', 'automobile', 'auto', 'motor vehicle'],
          'truck': ['pickup', 'commercial vehicle', 'freight vehicle'],
          
          // Rental Synonyms  
          'renting': ['leasing', 'tenancy', 'rental'],
          'landlord': ['property owner', 'lessor', 'property manager'],
          'tenant': ['renter', 'lessee', 'occupant'],
          
          // Legal Document Synonyms
          'contract': ['agreement', 'pact', 'deal', 'arrangement'],
          'will': ['testament', 'last will', 'estate plan'],
          'nda': ['non-disclosure', 'confidentiality agreement', 'secrecy agreement']
        };
        
        // Apply synonym expansion to input
        let expandedInput = input;
        for (const [baseWord, synonyms] of Object.entries(synonymMap)) {
          for (const synonym of synonyms) {
            if (input.includes(synonym)) {
              // Add the base word to help matching
              expandedInput += ` ${baseWord}`;
              // Add boost for synonym recognition
              if (docName.includes(baseWord) || docDesc.includes(baseWord)) {
                score += 50;
                reasons.push(`Synonym match: ${synonym} → ${baseWord}`);
              }
            }
          }
        }
        
        // Legal Term Intelligence - understand professional vs common language
        const legalTerms = {
          'getting divorced': { professional: 'divorce settlement', boost: 200 },
          'getting divorce': { professional: 'divorce settlement', boost: 200 },
          'getting divorve': { professional: 'divorce settlement', boost: 200 },
          'divorce': { professional: 'divorce settlement', boost: 200 },
          'divorcing': { professional: 'divorce settlement', boost: 200 },
          'separation': { professional: 'separation agreement', boost: 180 },
          'getting separated': { professional: 'separation agreement', boost: 180 },
          'child custody': { professional: 'custody agreement', boost: 190 },
          'getting married': { professional: 'prenuptial agreement', boost: 80 },
          'fired from job': { professional: 'employment termination', boost: 90 },
          'starting business': { professional: 'business formation', boost: 100 },
          'renting place': { professional: 'residential lease', boost: 90 },
          'need to evict': { professional: 'eviction notice', boost: 100 },
          'borrowing money': { professional: 'promissory note', boost: 90 },
          'lending money': { professional: 'loan agreement', boost: 90 },
          'selling car': { professional: 'vehicle bill of sale', boost: 100 },
          'buying car': { professional: 'vehicle bill of sale', boost: 100 }
        };
        
        // Apply legal term intelligence
        for (const [commonPhrase, legalInfo] of Object.entries(legalTerms)) {
          if (input.includes(commonPhrase)) {
            if (docName.includes(legalInfo.professional.toLowerCase())) {
              score += legalInfo.boost;
              reasons.push(`Legal term match: "${commonPhrase}" → ${legalInfo.professional}`);
            }
          }
        }
        
        // PHASE 1D: Enhanced Category Exclusions with Document Type Intelligence
        const documentCategories = {
          realEstate: {
            keywords: ['real estate', 'property', 'deed', 'mortgage', 'escrow', 'home', 'house'],
            excludes: ['vehicle', 'livestock', 'employment', 'business formation', 'partnership'],
            requiredFor: ['buying house', 'selling house', 'property purchase', 'real estate']
          },
          vehicle: {
            keywords: ['vehicle', 'car', 'auto', 'truck', 'motorcycle', 'boat'],
            excludes: ['real estate', 'livestock', 'employment', 'business'],
            requiredFor: ['buying car', 'selling car', 'vehicle purchase', 'auto sale']
          },
          business: {
            keywords: ['llc', 'corporation', 'partnership', 'business formation', 'company'],
            excludes: ['vehicle', 'real estate', 'employment', 'rental'],
            requiredFor: ['starting business', 'business formation', 'new company']
          },
          employment: {
            keywords: ['employment', 'contractor', 'employee', 'hiring', 'job'],
            excludes: ['business formation', 'real estate', 'vehicle', 'rental'],
            requiredFor: ['hiring', 'employment', 'contractor agreement', 'job contract']
          },
          rental: {
            keywords: ['lease', 'rental', 'tenant', 'landlord', 'eviction'],
            excludes: ['purchase', 'sale', 'business formation', 'employment'],
            requiredFor: ['renting', 'leasing', 'tenant', 'eviction']
          },
          legal: {
            keywords: ['divorce', 'custody', 'will', 'estate', 'power of attorney'],
            excludes: ['business', 'vehicle', 'real estate', 'employment'],
            requiredFor: ['divorce', 'custody', 'estate planning', 'legal action']
          }
        };
        
        // Intelligent Category Analysis
        const analyzeDocumentCategory = (docName: string) => {
          for (const [category, info] of Object.entries(documentCategories)) {
            if (info.keywords.some(keyword => docName.includes(keyword))) {
              return category;
            }
          }
          return 'general';
        };
        
        // Apply Enhanced Category Intelligence
        const docCategory = analyzeDocumentCategory(docName);
        
        // Check if user intent matches document category
        let categoryMatch = false;
        let categoryMismatch = false;
        
        for (const [category, info] of Object.entries(documentCategories)) {
          // Check if user input matches this category's requirements
          const matchesCategory = info.requiredFor.some(requirement => 
            expandedInput.includes(requirement) || input.includes(requirement)
          );
          
          if (matchesCategory) {
            if (docCategory === category) {
              score += 150;
              reasons.push(`Strong category match: ${category}`);
              categoryMatch = true;
            } else {
              // Check if document category is in exclusion list
              if (info.excludes.includes(docCategory)) {
                score -= 250;
                reasons.push(`Category mismatch: looking for ${category}, found ${docCategory}`);
                categoryMismatch = true;
              }
            }
          }
        }
        
        // Document Type Intelligence - understand document purposes
        const documentPurposes = {
          'purchase': { 
            compatible: ['bill of sale', 'purchase agreement', 'contract'],
            incompatible: ['lease', 'rental', 'employment', 'termination']
          },
          'lease': {
            compatible: ['lease agreement', 'rental', 'tenant'],
            incompatible: ['purchase', 'sale', 'bill of sale']
          },
          'employment': {
            compatible: ['employment contract', 'contractor agreement', 'hiring'],
            incompatible: ['real estate', 'vehicle', 'rental']
          },
          'termination': {
            compatible: ['termination', 'eviction', 'dismissal', 'cancellation'],
            incompatible: ['formation', 'creation', 'purchase', 'agreement']
          }
        };
        
        // Apply Document Purpose Intelligence
        for (const [purpose, info] of Object.entries(documentPurposes)) {
          if (input.includes(purpose)) {
            const isCompatible = info.compatible.some(compat => docName.includes(compat));
            const isIncompatible = info.incompatible.some(incompat => docName.includes(incompat));
            
            if (isCompatible) {
              score += 100;
              reasons.push(`Document purpose match: ${purpose}`);
            } else if (isIncompatible) {
              score -= 200;
              reasons.push(`Document purpose conflict: ${purpose} vs ${docName}`);
            }
          }
        }
        
        // PHASE 2A: Intent Detection (Experience Level & Use Case)
        const intentAnalysis = {
          experienceLevel: 'unknown',
          useCase: 'unknown',
          urgency: 'normal',
          complexity: 'standard'
        };
        
        // Experience Level Detection
        const beginnerIndicators = [
          'first time', 'never done', 'new to', 'beginner', 'dont know', 'confused',
          'help me', 'what do i need', 'getting started', 'just starting'
        ];
        const experiencedIndicators = [
          'another', 'again', 'second', 'multiple', 'several', 'experienced',
          'previously', 'before', 'used to', 'familiar with'
        ];
        
        if (beginnerIndicators.some(indicator => input.includes(indicator))) {
          intentAnalysis.experienceLevel = 'beginner';
          // Boost simpler, more comprehensive documents
          if (docName.includes('guide') || docName.includes('complete') || docDesc.includes('beginner')) {
            score += 75;
            reasons.push('Beginner-friendly document');
          }
        } else if (experiencedIndicators.some(indicator => input.includes(indicator))) {
          intentAnalysis.experienceLevel = 'experienced';
          // Boost more advanced or specific documents
          if (docName.includes('advanced') || docName.includes('specific') || docName.includes('amendment')) {
            score += 50;
            reasons.push('Advanced document for experienced users');
          }
        }
        
        // Use Case Detection (Business vs Personal)
        const businessIndicators = [
          'my business', 'company', 'llc', 'corporation', 'commercial', 'business use',
          'for work', 'enterprise', 'startup', 'firm'
        ];
        const personalIndicators = [
          'personal', 'my family', 'myself', 'my home', 'personal use', 'individual',
          'me and my', 'for myself'
        ];
        
        if (businessIndicators.some(indicator => input.includes(indicator))) {
          intentAnalysis.useCase = 'business';
          // Boost business-focused documents
          if (docName.includes('commercial') || docName.includes('business') || docName.includes('corporate')) {
            score += 100;
            reasons.push('Business-focused document');
          }
          // Penalize personal/individual documents
          if (docName.includes('personal') || docName.includes('individual') || docName.includes('family')) {
            score -= 75;
            reasons.push('Personal document not suitable for business');
          }
        } else if (personalIndicators.some(indicator => input.includes(indicator))) {
          intentAnalysis.useCase = 'personal';
          // Boost personal/individual documents
          if (docName.includes('personal') || docName.includes('individual') || docName.includes('residential')) {
            score += 75;
            reasons.push('Personal-use document');
          }
          // Penalize commercial documents
          if (docName.includes('commercial') || docName.includes('corporate') || docName.includes('enterprise')) {
            score -= 50;
            reasons.push('Commercial document may be too complex for personal use');
          }
        }
        
        // Urgency Detection
        const urgentIndicators = [
          'urgent', 'asap', 'quickly', 'emergency', 'immediate', 'right now',
          'today', 'this week', 'deadline', 'time sensitive'
        ];
        const plannedIndicators = [
          'planning', 'future', 'eventually', 'next year', 'down the road',
          'preparing for', 'getting ready'
        ];
        
        if (urgentIndicators.some(indicator => input.includes(indicator))) {
          intentAnalysis.urgency = 'urgent';
          // Boost simpler, ready-to-use documents
          if (docName.includes('simple') || docName.includes('basic') || docName.includes('quick')) {
            score += 60;
            reasons.push('Quick-use document for urgent need');
          }
        } else if (plannedIndicators.some(indicator => input.includes(indicator))) {
          intentAnalysis.urgency = 'planned';
          // Boost comprehensive, detailed documents
          if (docName.includes('comprehensive') || docName.includes('detailed') || docName.includes('complete')) {
            score += 40;
            reasons.push('Comprehensive document for planned use');
          }
        }
        
        // Complexity Preference Detection
        const simpleIndicators = [
          'simple', 'basic', 'easy', 'straightforward', 'minimal', 'short'
        ];
        const comprehensiveIndicators = [
          'detailed', 'comprehensive', 'complete', 'full', 'thorough', 'extensive'
        ];
        
        if (simpleIndicators.some(indicator => input.includes(indicator))) {
          intentAnalysis.complexity = 'simple';
          if (docName.includes('simple') || docName.includes('basic') || docName.includes('short')) {
            score += 80;
            reasons.push('Simple document as requested');
          }
          if (docName.includes('comprehensive') || docName.includes('detailed') || docName.includes('complex')) {
            score -= 40;
            reasons.push('Document may be too complex');
          }
        } else if (comprehensiveIndicators.some(indicator => input.includes(indicator))) {
          intentAnalysis.complexity = 'comprehensive';
          if (docName.includes('comprehensive') || docName.includes('detailed') || docName.includes('complete')) {
            score += 80;
            reasons.push('Comprehensive document as requested');
          }
          if (docName.includes('simple') || docName.includes('basic')) {
            score -= 30;
            reasons.push('Document may be too basic');
          }
        }
        
        // PHASE 2B: Document Relationship Intelligence & Sequential Recommendations
        const documentRelationships = {
          // Real Estate Document Sequences
          'real-estate-buying': {
            primary: ['real estate purchase agreement'],
            secondary: ['property deed', 'mortgage agreement', 'title insurance'],
            followUp: ['property inspection', 'homeowners insurance'],
            timeline: 'sequential'
          },
          
          // Business Formation Sequences
          'business-formation': {
            primary: ['llc operating agreement', 'articles of incorporation'],
            secondary: ['employment contract', 'non-disclosure agreement'],
            followUp: ['partnership agreement', 'business contract'],
            timeline: 'sequential'
          },
          
          // Employment Document Clusters
          'employment-hiring': {
            primary: ['employment contract', 'independent contractor agreement'],
            secondary: ['non-disclosure agreement', 'non-compete agreement'],
            followUp: ['employee handbook', 'confidentiality agreement'],
            timeline: 'parallel'
          },
          
          // Rental Property Sequences
          'rental-property': {
            primary: ['lease agreement', 'rental agreement'],
            secondary: ['tenant application', 'security deposit'],
            followUp: ['eviction notice', 'lease termination'],
            timeline: 'conditional'
          },
          
          // Divorce/Family Sequences
          'family-legal': {
            primary: ['divorce agreement', 'separation agreement'],
            secondary: ['child custody agreement', 'child support agreement'],
            followUp: ['property division', 'spousal support'],
            timeline: 'parallel'
          }
        };
        
        // Detect Document Relationships
        const findRelatedDocuments = (userIntent: string, currentDoc: string) => {
          for (const [category, relationships] of Object.entries(documentRelationships)) {
            // Check if current document is in this category
            const isPrimary = relationships.primary.some(doc => currentDoc.includes(doc.replace(/-/g, ' ')));
            const isSecondary = relationships.secondary.some(doc => currentDoc.includes(doc.replace(/-/g, ' ')));
            
            if (isPrimary || isSecondary) {
              return relationships;
            }
          }
          return null;
        };
        
        // Apply Relationship Intelligence
        const docRelationships = findRelatedDocuments(input, docName);
        if (docRelationships) {
          // Boost primary documents highest
          const isPrimaryDoc = docRelationships.primary.some(doc => 
            docName.includes(doc.replace(/-/g, ' '))
          );
          if (isPrimaryDoc) {
            score += 120;
            reasons.push('Primary document in typical workflow');
          }
          
          // Boost secondary documents moderately
          const isSecondaryDoc = docRelationships.secondary.some(doc => 
            docName.includes(doc.replace(/-/g, ' '))
          );
          if (isSecondaryDoc) {
            score += 80;
            reasons.push('Important supporting document');
          }
          
          // Boost follow-up documents lightly
          const isFollowUpDoc = docRelationships.followUp.some(doc => 
            docName.includes(doc.replace(/-/g, ' '))
          );
          if (isFollowUpDoc) {
            score += 40;
            reasons.push('Follow-up document in process');
          }
        }
        
        // Document Combination Intelligence
        const commonCombinations = {
          'house-purchase': {
            must_have: ['real estate purchase agreement'],
            should_have: ['property deed', 'mortgage'],
            nice_to_have: ['homeowners insurance', 'property inspection']
          },
          'business-startup': {
            must_have: ['llc operating agreement', 'articles of incorporation'],
            should_have: ['employment contract', 'nda'],
            nice_to_have: ['business plan', 'partnership agreement']
          },
          'employee-hiring': {
            must_have: ['employment contract'],
            should_have: ['nda', 'employee handbook'],
            nice_to_have: ['non-compete', 'confidentiality agreement']
          },
          'rental-setup': {
            must_have: ['lease agreement'],
            should_have: ['tenant application', 'rental agreement'],
            nice_to_have: ['property management', 'maintenance agreement']
          }
        };
        
        // Apply Combination Intelligence
        for (const [combo, docs] of Object.entries(commonCombinations)) {
          // Check if user intent matches this combination
          const intentMatches = 
            (combo === 'house-purchase' && (input.includes('buying house') || input.includes('purchasing home'))) ||
            (combo === 'business-startup' && (input.includes('starting business') || input.includes('new company'))) ||
            (combo === 'employee-hiring' && (input.includes('hiring') || input.includes('employee'))) ||
            (combo === 'rental-setup' && (input.includes('renting') || input.includes('lease')));
            
          if (intentMatches) {
            // Boost must-have documents
            if (docs.must_have.some(mustHave => docName.includes(mustHave.replace(/-/g, ' ')))) {
              score += 150;
              reasons.push('Essential document for this process');
            }
            // Boost should-have documents
            if (docs.should_have.some(shouldHave => docName.includes(shouldHave.replace(/-/g, ' ')))) {
              score += 100;
              reasons.push('Recommended document for this process');
            }
            // Boost nice-to-have documents
            if (docs.nice_to_have.some(niceToHave => docName.includes(niceToHave.replace(/-/g, ' ')))) {
              score += 50;
              reasons.push('Additional helpful document');
            }
          }
        }
        
        // PHASE 3A: Confidence Scoring System
        const calculateConfidenceScore = (totalScore: number, reasonsArray: string[]) => {
          let confidence = 0;
          let confidenceLevel = 'low';
          let confidenceColor = 'gray';
          let confidenceIcon = '❓';
          
          // Base confidence from score (normalized)
          if (totalScore >= 300) {
            confidence = Math.min(95, 70 + (totalScore - 300) / 20);
            confidenceLevel = 'excellent';
            confidenceColor = 'emerald';
            confidenceIcon = '🎯';
          } else if (totalScore >= 200) {
            confidence = 50 + (totalScore - 200) / 5;
            confidenceLevel = 'good';
            confidenceColor = 'blue';
            confidenceIcon = '✅';
          } else if (totalScore >= 100) {
            confidence = 25 + (totalScore - 100) / 4;
            confidenceLevel = 'fair';
            confidenceColor = 'yellow';
            confidenceIcon = '⚠️';
          } else if (totalScore >= 50) {
            confidence = 10 + (totalScore - 50) / 2.5;
            confidenceLevel = 'weak';
            confidenceColor = 'orange';
            confidenceIcon = '🤔';
          } else {
            confidence = Math.max(5, totalScore / 10);
            confidenceLevel = 'poor';
            confidenceColor = 'red';
            confidenceIcon = '❌';
          }
          
          // Boost confidence for multiple positive reasons
          const positiveReasons = reasonsArray.filter(reason => 
            !reason.includes('Excluded') && 
            !reason.includes('penalty') && 
            !reason.includes('conflict') &&
            !reason.includes('mismatch')
          );
          
          if (positiveReasons.length >= 3) {
            confidence += 10;
            confidenceLevel = confidence >= 85 ? 'excellent' : confidence >= 70 ? 'good' : confidenceLevel;
          }
          
          // Reduce confidence for negative reasons
          const negativeReasons = reasonsArray.filter(reason => 
            reason.includes('Excluded') || 
            reason.includes('penalty') || 
            reason.includes('conflict') ||
            reason.includes('mismatch')
          );
          
          if (negativeReasons.length > 0) {
            confidence = Math.max(5, confidence - (negativeReasons.length * 15));
            if (confidence < 30) {
              confidenceLevel = 'poor';
              confidenceColor = 'red';
              confidenceIcon = '❌';
            }
          }
          
          // Perfect phrase matches get high confidence
          const hasPerfectMatch = reasonsArray.some(reason => 
            reason.includes('Perfect match') || 
            reason.includes('perfect phrase match')
          );
          
          if (hasPerfectMatch) {
            confidence = Math.min(95, confidence + 15);
            if (confidence >= 85) {
              confidenceLevel = 'excellent';
              confidenceColor = 'emerald';
              confidenceIcon = '🎯';
            }
          }
          
          return {
            score: Math.round(confidence),
            level: confidenceLevel,
            color: confidenceColor,
            icon: confidenceIcon,
            message: getConfidenceMessage(Math.round(confidence))
          };
        };
        
        const getConfidenceMessage = (confidence: number) => {
          if (confidence >= 85) return 'Excellent match for your needs';
          if (confidence >= 70) return 'Good match for your situation';
          if (confidence >= 50) return 'Reasonable match - review carefully';
          if (confidence >= 30) return 'Possible match - check if suitable';
          return 'Low match - may not be what you need';
        };
        
        // Enhanced Context Understanding
        
        // 1. BUYING/SELLING ANALYSIS - Enhanced with exclusions
        if (input.includes('buy') || input.includes('purchase') || input.includes('sell') || input.includes('sale')) {
          // REAL ESTATE - Houses, homes, property
          if (input.includes('house') || input.includes('home') || input.includes('property') || input.includes('real estate')) {
            // EXCLUDE livestock, animals, vehicles when talking about houses
            if (docName.includes('livestock') || docName.includes('animal') || docName.includes('vehicle') || docName.includes('car') || docName.includes('boat')) {
              score -= 100; // Heavy penalty for wrong category
              reasons.push('Excluded - wrong category for real estate');
            } else if (docName.includes('real estate purchase') || (docName.includes('purchase agreement') && docName.includes('real estate'))) {
              score += 200;
              reasons.push('Real estate purchase agreement - perfect match');
            } else if (docName.includes('real estate') || (docName.includes('property') && !docName.includes('intellectual'))) {
              score += 120;
              reasons.push('Real estate related document');
            } else if (docName.includes('deed') || docName.includes('mortgage') || docName.includes('escrow')) {
              score += 100;
              reasons.push('Real estate closing document');
            }
          } 
          // VEHICLES - Cars, trucks, motorcycles
          else if (input.includes('car') || input.includes('vehicle') || input.includes('auto') || input.includes('truck') || input.includes('motorcycle')) {
            // EXCLUDE real estate, livestock when talking about vehicles
            if (docName.includes('real estate') || docName.includes('property') || docName.includes('livestock') || docName.includes('animal')) {
              score -= 100;
              reasons.push('Excluded - wrong category for vehicle');
            } else if (docName.includes('vehicle') && docName.includes('bill of sale')) {
              score += 200;
              reasons.push('Vehicle bill of sale - perfect match');
            } else if (docName.includes('auto') || docName.includes('car') || docName.includes('truck')) {
              score += 150;
              reasons.push('Vehicle transaction document');
            }
          } 
          // BOATS/WATERCRAFT
          else if (input.includes('boat') || input.includes('ship') || input.includes('yacht') || input.includes('watercraft')) {
            if (docName.includes('livestock') || docName.includes('real estate') || docName.includes('vehicle')) {
              score -= 100;
              reasons.push('Excluded - wrong category for boat');
            } else if (docName.includes('boat') || docName.includes('watercraft')) {
              score += 200;
              reasons.push('Boat transaction - perfect match');
            }
          } 
          // LIVESTOCK/ANIMALS
          else if (input.includes('livestock') || input.includes('cattle') || input.includes('horse') || input.includes('animal') || input.includes('farm animal')) {
            if (docName.includes('real estate') || docName.includes('vehicle') || docName.includes('boat')) {
              score -= 100;
              reasons.push('Excluded - wrong category for livestock');
            } else if (docName.includes('livestock') || docName.includes('cattle') || docName.includes('horse')) {
              score += 200;
              reasons.push('Livestock transaction - perfect match');
            }
          } 
          // BUSINESS SALES
          else if (input.includes('business') || input.includes('company')) {
            if (docName.includes('livestock') || docName.includes('vehicle') || docName.includes('real estate')) {
              score -= 100;
              reasons.push('Excluded - wrong category for business');
            } else if (docName.includes('business sale') || docName.includes('buy-sell')) {
              score += 200;
              reasons.push('Business transaction - perfect match');
            }
          } 
          // GENERAL PURCHASES - Only if no specific category mentioned
          else {
            // General item sale - but exclude specialized categories
            if (docName.includes('livestock') || docName.includes('vehicle') || docName.includes('real estate')) {
              score -= 50; // Light penalty for specialized docs when general query
              reasons.push('Too specific for general purchase');
            } else if (docName.includes('bill of sale') && docName.includes('general')) {
              score += 120;
              reasons.push('General purchase document');
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
        
        // 7. FAMILY/RELATIONSHIP ANALYSIS - MASSIVELY IMPROVED
        
        // DIVORCE - highest priority for divorce-related queries
        if (input.includes('divorce') || input.includes('divorc') || input.includes('separat')) {
          if (docName.includes('divorce') || docName.includes('separation')) {
            score += 500; // MASSIVE boost for exact divorce matches
            reasons.push('🎯 PERFECT DIVORCE MATCH');
          } else if (docName.includes('custody') || docName.includes('child')) {
            score += 300; // High boost for related custody
            reasons.push('Divorce-related child custody');
          } else if (docName.includes('prenuptial') || docName.includes('marriage')) {
            score += 200; // Moderate boost for marriage-related
            reasons.push('Marriage/divorce related');
          } else {
            // HEAVILY penalize completely unrelated documents
            if (docName.includes('corporation') || docName.includes('business') || 
                docName.includes('lease') || docName.includes('vehicle') || 
                docName.includes('real estate') || docName.includes('farm') || 
                docName.includes('mining') || docName.includes('hunting')) {
              score -= 300;
              reasons.push('❌ Completely unrelated to divorce');
            }
          }
        }
        
        // CUSTODY - high priority for child custody
        else if (input.includes('child') || input.includes('custody')) {
          if (docName.includes('custody') || docName.includes('child')) {
            score += 400;
            reasons.push('🎯 PERFECT CUSTODY MATCH');
          } else if (docName.includes('divorce') || docName.includes('separation')) {
            score += 300;
            reasons.push('Custody-related divorce');
          } else {
            // Penalize unrelated docs
            if (docName.includes('corporation') || docName.includes('business') || 
                docName.includes('lease') || docName.includes('vehicle')) {
              score -= 200;
              reasons.push('❌ Not related to child custody');
            }
          }
        }
        
        // MARRIAGE/PRENUP
        else if (input.includes('marriage') || input.includes('prenup') || input.includes('before marriage')) {
          if (docName.includes('prenuptial') || docName.includes('marriage')) {
            score += 400;
            reasons.push('🎯 PERFECT MARRIAGE MATCH');
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
        
        // Apply state/location analysis and boosting to document score
        if (globalLocationAnalysis.detectedStates.length > 0) {
          globalLocationAnalysis.detectedStates.forEach(stateCode => {
            // State-specific forms get major boost
            if (docName.includes(stateCode.toLowerCase()) || docDesc.includes(stateCode.toLowerCase())) {
              score += 200;
              reasons.push(`🏛️ State-specific form for ${stateCode}`);
            }
            
            // Documents with state variations get moderate boost
            if (docName.includes('state-specific') || docDesc.includes('varies by state')) {
              score += 100;
              reasons.push(`📍 Document with state variations - relevant for ${stateCode}`);
            }
          });
        }
        
        // PHASE 3C: Sequential Context Memory - Use Previous Search Context
        const applySessionContext = (locationData = globalLocationAnalysis) => {
          if (searchHistory.length === 0) return;
          
          const recentSearches = searchHistory.slice(-3); // Last 3 searches
          const currentTime = Date.now();
          
          // Recent search is within last 5 minutes
          const recentSearch = recentSearches.find(search => 
            (currentTime - search.timestamp) < 300000
          );
          
          if (recentSearch) {
            // CONTEXT CONTINUITY: Same user, related searches
            
            // 1. STATE CONTEXT CONTINUITY
            if (recentSearch.context.detectedStates.length > 0 && locationData.detectedStates.length === 0) {
              // User previously mentioned a state, boost state-specific docs
              recentSearch.context.detectedStates.forEach(stateCode => {
                if (docName.includes(stateCode.toLowerCase()) || docDesc.includes(stateCode.toLowerCase())) {
                  score += 75;
                  reasons.push(`🏛️ Continuing with ${stateCode} context from previous search`);
                }
              });
            }
            
            // 2. CATEGORY CONTEXT CONTINUITY  
            if (recentSearch.context.primaryCategory && recentSearch.context.primaryCategory !== 'general') {
              const categoryKeywords = {
                'realEstate': ['real estate', 'property', 'house', 'home', 'deed'],
                'vehicle': ['vehicle', 'car', 'auto', 'truck', 'motorcycle'],
                'business': ['business', 'llc', 'corporation', 'partnership', 'company'],
                'employment': ['employment', 'contractor', 'employee', 'hiring', 'job'],
                'rental': ['lease', 'rental', 'tenant', 'landlord', 'eviction'],
                'legal': ['divorce', 'custody', 'will', 'estate', 'power of attorney']
              };
              
              const categoryWords = categoryKeywords[recentSearch.context.primaryCategory as keyof typeof categoryKeywords] || [];
              if (categoryWords.some(word => docName.includes(word) || docDesc.includes(word))) {
                score += 60;
                reasons.push(`🔗 Related to previous ${recentSearch.context.primaryCategory} search`);
              }
            }
            
            // 3. USER TYPE CONTINUITY
            if (recentSearch.context.userType !== 'unknown') {
              if (recentSearch.context.userType === 'business') {
                if (docName.includes('commercial') || docName.includes('business') || docName.includes('corporate')) {
                  score += 40;
                  reasons.push('🏢 Business context from search history');
                }
                if (docName.includes('personal') || docName.includes('individual') || docName.includes('family')) {
                  score -= 30;
                  reasons.push('👤 Personal document may not fit business context');
                }
              } else if (recentSearch.context.userType === 'personal') {
                if (docName.includes('personal') || docName.includes('individual') || docName.includes('residential')) {
                  score += 40;
                  reasons.push('👤 Personal context from search history');
                }
                if (docName.includes('commercial') || docName.includes('corporate')) {
                  score -= 20;
                  reasons.push('🏢 Commercial document may be too complex for personal use');
                }
              }
            }
          }
          
          // SEARCH PATTERN ANALYSIS
          const searchPatterns = analyzeSearchPatterns(recentSearches);
          
          // Sequential document flow detection
          if (searchPatterns.isSequentialFlow) {
            const documentFlow = getDocumentFlow(searchPatterns.flowType);
            if (documentFlow.nextLikely.some(nextDoc => docName.includes(nextDoc))) {
              score += 100;
              reasons.push(`📋 Next logical document in ${searchPatterns.flowType} process`);
            }
            if (documentFlow.alreadySearched.some(prevDoc => docName.includes(prevDoc))) {
              score -= 50;
              reasons.push('↩️ Already searched for similar document');
            }
          }
          
          // Learning from previous selections
          if (recentSearches.some(search => search.selectedDocument === doc.id)) {
            score += 30;
            reasons.push('✅ Previously viewed this document');
          }
        };
        
        // Helper function to analyze search patterns
        const analyzeSearchPatterns = (searches: typeof searchHistory) => {
          const patterns = {
            isSequentialFlow: false,
            flowType: '',
            categories: [] as string[]
          };
          
          if (searches.length < 2) return patterns;
          
          const categories = searches.map(s => s.context.primaryCategory).filter(Boolean);
          const uniqueCategories = [...new Set(categories)];
          
          // Sequential flow patterns
          const flowPatterns = {
            'house-buying': ['realEstate', 'realEstate', 'legal'], // property search -> purchase agreement -> deed
            'business-formation': ['business', 'legal', 'employment'], // business formation -> operating agreement -> employment
            'employee-hiring': ['employment', 'legal', 'employment'], // job posting -> contract -> policies
            'rental-management': ['rental', 'legal', 'rental'] // lease -> eviction notice -> tenant policies
          };
          
          for (const [flowName, expectedFlow] of Object.entries(flowPatterns)) {
            if (categories.length >= 2) {
              const recentCategories = categories.slice(-2);
              if (expectedFlow.slice(0, 2).every((cat, i) => cat === recentCategories[i])) {
                patterns.isSequentialFlow = true;
                patterns.flowType = flowName;
                break;
              }
            }
          }
          
          patterns.categories = uniqueCategories;
          return patterns;
        };
        
        // Helper function to get document flow recommendations
        const getDocumentFlow = (flowType: string) => {
          const flows = {
            'house-buying': {
              nextLikely: ['deed', 'title', 'closing', 'mortgage'],
              alreadySearched: ['purchase agreement', 'real estate contract']
            },
            'business-formation': {
              nextLikely: ['operating agreement', 'bylaws', 'employment contract'],
              alreadySearched: ['articles of incorporation', 'business registration']
            },
            'employee-hiring': {
              nextLikely: ['employee handbook', 'non-disclosure', 'job description'],
              alreadySearched: ['employment contract', 'offer letter']
            },
            'rental-management': {
              nextLikely: ['eviction notice', 'lease amendment', 'tenant application'],
              alreadySearched: ['lease agreement', 'rental contract']
            }
          };
          
          return flows[flowType as keyof typeof flows] || { nextLikely: [], alreadySearched: [] };
        };
        
        // Apply session context analysis
        applySessionContext();
        
        // 10. SEMANTIC WORD MATCHING (fallback) - Fixed to require exact word matches
        const inputWords = input.split(' ').filter(word => word.length > 2);
        const docWords = [...docName.split(' '), ...docDesc.split(' '), ...keywords].filter(word => word.length > 2);
        
        inputWords.forEach(inputWord => {
          docWords.forEach(docWord => {
            // FIXED: Require exact word match, not substring match
            if (docWord.toLowerCase() === inputWord.toLowerCase()) {
              score += 20;
              reasons.push(`Exact word match: ${inputWord}`);
            }
          });
        });
        
        // MASSIVE PENALTY SYSTEM: Eliminate obviously wrong documents BEFORE final scoring
        
        // If user mentions divorce, heavily penalize business/property docs
        if ((input.includes('divorce') || input.includes('divorc') || input.includes('separat')) && 
            (docName.includes('corporation') || docName.includes('business') || docName.includes('articles') || 
             docName.includes('lease') || docName.includes('farm') || docName.includes('hunting') || 
             docName.includes('mining') || docName.includes('vehicle'))) {
          score -= 1000; // Massive penalty for completely unrelated docs
          reasons.push('❌ COMPLETELY UNRELATED TO DIVORCE');
        }
        
        // If user mentions car/vehicle, heavily penalize non-vehicle docs
        if ((input.includes('car') || input.includes('vehicle') || input.includes('auto')) && 
            (docName.includes('divorce') || docName.includes('marriage') || docName.includes('business') || 
             docName.includes('lease') || docName.includes('farm') || docName.includes('mining'))) {
          score -= 800;
          reasons.push('❌ COMPLETELY UNRELATED TO VEHICLES');
        }
        
        // CRITICAL FIX: Only include documents with positive scores AND relevance
        if (score > 0) {
          // PHASE 3A: Calculate confidence for this document
          const confidence = calculateConfidenceScore(score, reasons);
          results.push({ doc, score, reasons, confidence });
        }
      });
      
      // PHASE 2C: Smart Clarification Questions for Ambiguous Input
      const analyzeAmbiguity = (userInput: string, searchResults: any[]) => {
        const ambiguityAnalysis = {
          isAmbiguous: false,
          ambiguityType: '',
          clarificationQuestions: [] as string[],
          suggestedQueries: [] as string[],
          confidenceSpread: 0,
          topCategories: [] as string[]
        };
        
        // Calculate confidence spread to detect unclear results
        if (searchResults.length > 0) {
          const scores = searchResults.map(r => r.confidence?.score || 0);
          const maxScore = Math.max(...scores);
          const minScore = Math.min(...scores.slice(0, 3)); // Compare top 3 results
          ambiguityAnalysis.confidenceSpread = maxScore - minScore;
        }
        
        // Detect various types of ambiguity
        
        // 1. GENERIC LEGAL TERMS (too broad)
        const genericTerms = [
          'contract', 'agreement', 'document', 'form', 'template', 'legal document',
          'paperwork', 'forms', 'legal forms', 'legal papers'
        ];
        
        const isGenericQuery = genericTerms.some(term => 
          userInput.toLowerCase().trim() === term || 
          userInput.toLowerCase() === `${term}s` ||
          userInput.toLowerCase() === `legal ${term}`
        );
        
        if (isGenericQuery) {
          ambiguityAnalysis.isAmbiguous = true;
          ambiguityAnalysis.ambiguityType = 'too_generic';
          ambiguityAnalysis.clarificationQuestions = [
            "What type of agreement do you need? (business, employment, rental, etc.)",
            "Who are the parties involved? (individuals, companies, employees, etc.)",
            "What's the purpose? (buying, selling, hiring, renting, protecting, etc.)"
          ];
          ambiguityAnalysis.suggestedQueries = [
            "I need to hire an employee",
            "I'm buying a house",
            "I want to start a business",
            "I need to rent my property"
          ];
        }
        
        // 2. MULTIPLE CATEGORY INTENT (could apply to several areas)
        const multiCategoryWords = [
          { word: 'sell', categories: ['real estate', 'vehicle', 'business', 'general items'] },
          { word: 'buy', categories: ['real estate', 'vehicle', 'business', 'general items'] },
          { word: 'lease', categories: ['residential', 'commercial', 'vehicle', 'equipment'] },
          { word: 'partner', categories: ['business partnership', 'personal relationship', 'joint venture'] },
          { word: 'hire', categories: ['employee', 'contractor', 'consultant', 'service provider'] }
        ];
        
        const categoryMatches = multiCategoryWords.filter(item => 
          userInput.toLowerCase().includes(item.word)
        );
        
        if (categoryMatches.length > 0 && userInput.split(' ').length <= 3) {
          const matchedWord = categoryMatches[0];
          ambiguityAnalysis.isAmbiguous = true;
          ambiguityAnalysis.ambiguityType = 'multiple_categories';
          ambiguityAnalysis.topCategories = matchedWord.categories;
          
          if (matchedWord.word === 'sell' || matchedWord.word === 'buy') {
            ambiguityAnalysis.clarificationQuestions = [
              "What are you looking to buy/sell?",
              "Is this for a house, car, business, or something else?"
            ];
            ambiguityAnalysis.suggestedQueries = [
              "buying a house",
              "selling my car", 
              "buying a business",
              "selling general items"
            ];
          } else if (matchedWord.word === 'lease') {
            ambiguityAnalysis.clarificationQuestions = [
              "What type of lease do you need?",
              "Is this for residential, commercial, or vehicle leasing?"
            ];
            ambiguityAnalysis.suggestedQueries = [
              "residential lease agreement",
              "commercial lease",
              "vehicle lease"
            ];
          } else if (matchedWord.word === 'hire') {
            ambiguityAnalysis.clarificationQuestions = [
              "Who are you looking to hire?",
              "Is this for an employee, contractor, or service provider?"
            ];
            ambiguityAnalysis.suggestedQueries = [
              "hiring an employee",
              "hiring a contractor",
              "hiring a consultant"
            ];
          }
        }
        
        // 3. VAGUE SITUATION DESCRIPTIONS
        const vagueIndicators = [
          'legal problem', 'legal issue', 'legal matter', 'legal situation',
          'need help', 'what should i do', 'legal advice', 'legal question',
          'in trouble', 'legal trouble', 'problem with', 'issue with'
        ];
        
        const isVagueQuery = vagueIndicators.some(indicator => 
          userInput.toLowerCase().includes(indicator)
        );
        
        if (isVagueQuery) {
          ambiguityAnalysis.isAmbiguous = true;
          ambiguityAnalysis.ambiguityType = 'vague_situation';
          ambiguityAnalysis.clarificationQuestions = [
            "Can you describe your specific situation?",
            "What area of law does this involve? (business, family, real estate, employment, etc.)",
            "What outcome are you trying to achieve?"
          ];
          ambiguityAnalysis.suggestedQueries = [
            "I need to protect my business information",
            "I'm having issues with my tenant",
            "I need to document a loan to a friend",
            "I want to plan my estate"
          ];
        }
        
        // 4. UNCLEAR CONFIDENCE RESULTS
        if (ambiguityAnalysis.confidenceSpread < 15 && searchResults.length >= 3) {
          const topResults = searchResults.slice(0, 3);
          const hasMultipleCategories = new Set(topResults.map(r => r.category)).size > 1;
          
          if (hasMultipleCategories) {
            ambiguityAnalysis.isAmbiguous = true;
            ambiguityAnalysis.ambiguityType = 'unclear_results';
            ambiguityAnalysis.clarificationQuestions = [
              "I found several relevant documents. Can you be more specific?",
              "Are you looking for something related to business, personal, or legal matters?"
            ];
          }
        }
        
        // 5. CONTEXT-DEPENDENT TERMS
        const contextDependentTerms = [
          { term: 'power of attorney', needs: 'purpose (medical, financial, general)' },
          { term: 'will', needs: 'type (simple will, living will, last will)' },
          { term: 'lease', needs: 'type (residential, commercial, vehicle)' },
          { term: 'partnership', needs: 'type (business, personal, legal partnership)' },
          { term: 'custody', needs: 'type (child custody, property custody)' }
        ];
        
        const contextTerm = contextDependentTerms.find(term => 
          userInput.toLowerCase().includes(term.term)
        );
        
        if (contextTerm && userInput.split(' ').length <= 2) {
          ambiguityAnalysis.isAmbiguous = true;
          ambiguityAnalysis.ambiguityType = 'needs_context';
          ambiguityAnalysis.clarificationQuestions = [
            `I found "${contextTerm.term}" documents. What specific ${contextTerm.needs} do you need?`
          ];
        }
        
        // 6. PROCESS-ORIENTED QUERIES (need timeline context)
        const processQueries = [
          'getting divorced', 'starting business', 'buying house', 'hiring employee',
          'getting married', 'planning estate', 'renting property'
        ];
        
        const processMatch = processQueries.find(process => 
          userInput.toLowerCase().includes(process)
        );
        
        if (processMatch && !userInput.includes('agreement') && !userInput.includes('contract')) {
          ambiguityAnalysis.isAmbiguous = true;
          ambiguityAnalysis.ambiguityType = 'process_oriented';
          ambiguityAnalysis.clarificationQuestions = [
            "What stage of the process are you in?",
            "Do you need documents to start the process, during, or to finalize?"
          ];
          
          if (processMatch === 'getting divorced') {
            ambiguityAnalysis.suggestedQueries = [
              "divorce settlement agreement",
              "child custody agreement", 
              "property division agreement"
            ];
          } else if (processMatch === 'starting business') {
            ambiguityAnalysis.suggestedQueries = [
              "LLC operating agreement",
              "partnership agreement",
              "business plan template"
            ];
          }
        }
        
        return ambiguityAnalysis;
      };
      
      // Apply ambiguity analysis
      const ambiguityCheck = analyzeAmbiguity(query, results);
      
      // Add clarification metadata to results if ambiguous
      if (ambiguityCheck.isAmbiguous) {
        results.forEach(result => {
          result.clarification = ambiguityCheck;
        });
      }
      
      // Sort by AI confidence score (prioritize high confidence even with lower raw scores)
      return results
        .sort((a, b) => {
          // First sort by confidence level priority
          const confidencePriority = {
            'excellent': 5,
            'good': 4, 
            'fair': 3,
            'weak': 2,
            'poor': 1
          };
          
          const aConfidencePriority = confidencePriority[a.confidence.level as keyof typeof confidencePriority] || 0;
          const bConfidencePriority = confidencePriority[b.confidence.level as keyof typeof confidencePriority] || 0;
          
          if (aConfidencePriority !== bConfidencePriority) {
            return bConfidencePriority - aConfidencePriority;
          }
          
          // Then sort by confidence score
          if (a.confidence.score !== b.confidence.score) {
            return b.confidence.score - a.confidence.score;
          }
          
          // Finally sort by raw score
          return b.score - a.score;
        })
        .slice(0, 8)
        .map(result => ({ ...result.doc, confidence: result.confidence }));
    };
    
    const results = semanticAnalyzer(query);
    
    // PHASE 3C: Update search history and session context
    if (results.length > 0 && query.trim()) {
      // Extract context from current search
      const currentSearchContext = {
        detectedStates: globalLocationAnalysis?.detectedStates || [],
        primaryCategory: detectPrimaryCategory(query),
        intent: detectUserIntent(query),
        userType: detectUserType(query)
      };
      
      // Add to search history (async to avoid blocking)
      setTimeout(() => {
        setSearchHistory(prev => {
          const newEntry = {
            query: query.trim(),
            timestamp: Date.now(),
            results: results,
            context: currentSearchContext
          };
          
          // Keep only last 10 searches to manage memory
          const updatedHistory = [...prev, newEntry].slice(-10);
          return updatedHistory;
        });
        
        // Update session context
        setSessionContext(prev => {
          const updatedContext = { ...prev };
          
          // Update user profile based on search patterns
          if (currentSearchContext.userType !== 'unknown') {
            updatedContext.userProfile.businessType = currentSearchContext.userType;
          }
          
          // Track common states
          if (currentSearchContext.detectedStates.length > 0) {
            const newStates = currentSearchContext.detectedStates.filter(
              state => !updatedContext.userProfile.commonStates.includes(state)
            );
            updatedContext.userProfile.commonStates = [
              ...updatedContext.userProfile.commonStates,
              ...newStates
            ].slice(-3); // Keep only last 3 states
          }
          
          // Update search patterns
          updatedContext.searchPattern.relatedSearches += 1;
          
          // Track top categories
          if (currentSearchContext.primaryCategory) {
            const categoryIndex = updatedContext.searchPattern.topCategories.indexOf(currentSearchContext.primaryCategory);
            if (categoryIndex === -1) {
              updatedContext.searchPattern.topCategories.push(currentSearchContext.primaryCategory);
            }
            // Keep only top 5 categories
            updatedContext.searchPattern.topCategories = updatedContext.searchPattern.topCategories.slice(-5);
          }
          
          return updatedContext;
        });
      }, 100);
    }
    
    return results;
  }, [discoveryInput, locale]);


  // Update results when discoveryInput changes
  useEffect(() => {
    setDiscoveryResults(discoverDocuments);
  }, [discoverDocuments]);
  
  // PHASE 3C: Track document selections for learning
  const handleDocumentClick = useCallback((documentId: string) => {
    setSearchHistory(prev => {
      const updated = [...prev];
      if (updated.length > 0) {
        updated[updated.length - 1].selectedDocument = documentId;
      }
      return updated;
    });
    setShowDiscoveryModal(false);
  }, [setShowDiscoveryModal]);

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
              
              // Apply the same enhanced semantic analysis logic
              if (input.includes('buy') || input.includes('purchase') || input.includes('sell') || input.includes('sale')) {
                // REAL ESTATE - Houses, homes, property
                if (input.includes('house') || input.includes('home') || input.includes('property') || input.includes('real estate')) {
                  // EXCLUDE livestock, animals, vehicles when talking about houses
                  if (docName.includes('livestock') || docName.includes('animal') || docName.includes('vehicle') || docName.includes('car') || docName.includes('boat')) {
                    score -= 100; // Heavy penalty for wrong category
                    reasons.push('Excluded - wrong category for real estate');
                  } else if (docName.includes('real estate purchase') || (docName.includes('purchase agreement') && docName.includes('real estate'))) {
                    score += 200;
                    reasons.push('Real estate purchase agreement - perfect match');
                  } else if (docName.includes('real estate') || (docName.includes('property') && !docName.includes('intellectual'))) {
                    score += 120;
                    reasons.push('Real estate related document');
                  } else if (docName.includes('deed') || docName.includes('mortgage') || docName.includes('escrow')) {
                    score += 100;
                    reasons.push('Real estate closing document');
                  }
                } 
                // VEHICLES - Cars, trucks, motorcycles
                else if (input.includes('car') || input.includes('vehicle') || input.includes('auto') || input.includes('truck') || input.includes('motorcycle')) {
                  // EXCLUDE real estate, livestock when talking about vehicles
                  if (docName.includes('real estate') || docName.includes('property') || docName.includes('livestock') || docName.includes('animal')) {
                    score -= 100;
                    reasons.push('Excluded - wrong category for vehicle');
                  } else if (docName.includes('vehicle') && docName.includes('bill of sale')) {
                    score += 200;
                    reasons.push('Vehicle bill of sale - perfect match');
                  } else if (docName.includes('auto') || docName.includes('car') || docName.includes('truck')) {
                    score += 150;
                    reasons.push('Vehicle transaction document');
                  }
                } 
                // LIVESTOCK/ANIMALS
                else if (input.includes('livestock') || input.includes('cattle') || input.includes('horse') || input.includes('animal') || input.includes('farm animal')) {
                  if (docName.includes('real estate') || docName.includes('vehicle') || docName.includes('boat')) {
                    score -= 100;
                    reasons.push('Excluded - wrong category for livestock');
                  } else if (docName.includes('livestock') || docName.includes('cattle') || docName.includes('horse')) {
                    score += 200;
                    reasons.push('Livestock transaction - perfect match');
                  }
                } 
                // GENERAL PURCHASES - Only if no specific category mentioned
                else {
                  // General item sale - but exclude specialized categories
                  if (docName.includes('livestock') || docName.includes('vehicle') || docName.includes('real estate')) {
                    score -= 50; // Light penalty for specialized docs when general query
                    reasons.push('Too specific for general purchase');
                  } else if (docName.includes('bill of sale') && docName.includes('general')) {
                    score += 120;
                    reasons.push('General purchase document');
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
      <DialogContent className="max-w-6xl h-[95vh] flex flex-col p-0 border-0 shadow-2xl bg-white dark:bg-gray-900">
        {/* Enhanced Header with Gradient Background */}
        <div className="relative overflow-hidden rounded-t-lg">
          {/* Animated background patterns */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-white/20"></div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute -bottom-2 -left-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          
          <DialogHeader className="relative p-8 pb-6">
            <DialogTitle className="text-3xl font-bold text-white flex items-center gap-4">
              <div className="relative">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                  <Brain className="h-8 w-8 text-white drop-shadow-lg" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <span className="block">AI Document Discovery</span>
                <span className="text-lg font-normal text-emerald-100 block">Find exactly what you need with artificial intelligence</span>
              </div>
            </DialogTitle>
          </DialogHeader>
        </div>
        
        {/* Enhanced Content Container */}
        <div className="flex-1 flex flex-col bg-gray-50/50 dark:bg-gray-800/50 overflow-hidden">
          {/* Compact Header Content */}
          <div className="flex-shrink-0 p-6 pb-3 space-y-4">
            {/* Compact How it works - Only show when no results */}
            {discoveryResults.length === 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-200/60 dark:border-blue-800/40 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Describe your legal situation in plain English. We'll help you find matching document templates. We offer tools, not legal advice; customize carefully or consult an attorney.
                  </p>
                </div>
              </div>
            )}

            {/* Enhanced Input Method Toggle */}
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-500" />
                How would you like to describe your situation?
              </h3>
            <div className="flex items-center gap-3">
              <div className="flex bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-1 shadow-inner">
                <button
                  onClick={() => setInputMethod('text')}
                  className={`relative overflow-hidden px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    inputMethod === 'text' 
                      ? 'bg-white dark:bg-gray-900 text-emerald-600 dark:text-emerald-400 shadow-md' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Type</span>
                  </div>
                </button>
                <button
                  onClick={() => setInputMethod('voice')}
                  disabled={!isHydrated || (isHydrated && !('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window))}
                  className={`relative overflow-hidden px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    inputMethod === 'voice' 
                      ? 'bg-white dark:bg-gray-900 text-emerald-600 dark:text-emerald-400 shadow-md' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                  } ${isHydrated && !('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={isHydrated && !('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window) ? 'Voice input not supported in this browser' : 'Use voice input'}
                >
                  <div className="flex items-center gap-1.5">
                    <Mic className="h-3.5 w-3.5" />
                    <span>Speak</span>
                  </div>
                </button>
              </div>
              {isHydrated && !('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window) && (
                <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Voice input requires Chrome, Safari, or Edge</span>
                </div>
              )}
              </div>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto px-6">
            {/* Compact Input Section */}
            <div className="space-y-3 mb-4">
            {inputMethod === 'text' ? (
              <div className="space-y-2">
                <div className="relative">
                  <textarea
                    value={discoveryInput}
                    onChange={(e) => {
                      setDiscoveryInput(e.target.value);
                    }}
                    placeholder="Example: I'm buying a car and need a bill of sale... or I'm starting a business with a partner... or I need to evict a tenant..."
                    className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 min-h-[80px] resize-none text-sm bg-white dark:bg-gray-800 shadow-sm transition-all duration-300 placeholder:text-gray-400"
                    rows={2}
                  />
                  <div className="absolute bottom-2 right-3 flex items-center gap-2">
                    <div className="bg-emerald-100 dark:bg-emerald-900/50 px-2 py-1 rounded-full">
                      <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">AI Ready</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-700 dark:to-gray-800 rounded-lg border-2 border-dashed border-emerald-200 dark:border-emerald-700">
                  <button
                    onClick={startVoiceInput}
                    disabled={isListening}
                    className={`relative overflow-hidden group inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-base transition-all duration-300 ${
                      isListening 
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white cursor-not-allowed shadow-xl' 
                        : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white hover:shadow-xl hover:scale-105 active:scale-95 shadow-lg'
                    }`}
                    title={isListening ? "Recording your voice..." : "Click to start voice input"}
                  >
                    <div className="relative flex items-center gap-2">
                      {isListening ? (
                        <>
                          <div className="relative">
                            <Mic className="h-5 w-5" />
                            <div className="absolute -inset-1 bg-white/30 rounded-full animate-ping"></div>
                          </div>
                          <span>Listening...</span>
                        </>
                      ) : (
                        <>
                          <div className="relative">
                            <Mic className="h-5 w-5 drop-shadow-lg" />
                            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                          </div>
                          <span>Start Speaking</span>
                        </>
                      )}
                    </div>
                  </button>
                  
                  {discoveryInput && (
                    <div className="w-full max-w-sm">
                      <div className="bg-white dark:bg-gray-900 rounded-lg p-3 shadow-sm border border-emerald-200 dark:border-emerald-700">
                        <div className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">You said:</p>
                            <p className="text-sm text-gray-900 dark:text-gray-100 font-medium italic">"{discoveryInput}"</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

            {/* Enhanced Results Section */}
            {discoveryResults.length > 0 && (
              <div className="space-y-4 pb-8">
                {/* Results Header */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                        <Zap className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-emerald-900 dark:text-emerald-100">AI Recommendations</h3>
                        <p className="text-sm text-emerald-700 dark:text-emerald-300">
                          Documents that may help with your situation
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-white dark:bg-gray-900 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-700">
                        <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                          {discoveryResults.length} {discoveryResults.length === 1 ? 'match' : 'matches'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* PHASE 2C: Smart Clarification Questions */}
                {discoveryResults.length > 0 && discoveryResults[0]?.clarification?.isAmbiguous && (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 rounded-xl p-5 border border-amber-200 dark:border-amber-800 shadow-sm">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                          <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-amber-900 dark:text-amber-100">Need More Clarity?</h3>
                          <p className="text-sm text-amber-700 dark:text-amber-300">
                            I found some matches, but can help you narrow it down further
                          </p>
                        </div>
                      </div>
                      
                      {/* Clarification Questions */}
                      {discoveryResults[0].clarification.clarificationQuestions.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-amber-900 dark:text-amber-100 text-sm">
                            💡 To find the perfect document, please clarify:
                          </h4>
                          <ul className="space-y-2">
                            {discoveryResults[0].clarification.clarificationQuestions.map((question, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-amber-600 dark:text-amber-400 text-xs mt-1">•</span>
                                <span className="text-sm text-amber-800 dark:text-amber-200">{question}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Suggested Queries */}
                      {discoveryResults[0].clarification.suggestedQueries.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-amber-900 dark:text-amber-100 text-sm">
                            🎯 Try these specific examples:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {discoveryResults[0].clarification.suggestedQueries.map((query, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  setDiscoveryInput(query);
                                }}
                                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium bg-white dark:bg-gray-800 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors"
                              >
                                <Search className="h-3 w-3" />
                                "{query}"
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Category Breakdown for Multiple Categories */}
                      {discoveryResults[0].clarification.ambiguityType === 'multiple_categories' && discoveryResults[0].clarification.topCategories.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-amber-900 dark:text-amber-100 text-sm">
                            📋 Which category matches your needs?
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            {discoveryResults[0].clarification.topCategories.map((category, index) => (
                              <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-amber-200 dark:border-amber-700">
                                <span className="text-sm font-medium text-amber-800 dark:text-amber-200 capitalize">
                                  {category}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Ambiguity Type Info */}
                      <div className="pt-2 border-t border-amber-200 dark:border-amber-700">
                        <p className="text-xs text-amber-600 dark:text-amber-400 italic">
                          {discoveryResults[0].clarification.ambiguityType === 'too_generic' && 'Your search was quite broad - adding specific details will help find the perfect document.'}
                          {discoveryResults[0].clarification.ambiguityType === 'multiple_categories' && 'Your search could apply to several areas - specifying the type will narrow down the results.'}
                          {discoveryResults[0].clarification.ambiguityType === 'vague_situation' && 'Describing your specific situation in more detail will help me recommend the right legal document.'}
                          {discoveryResults[0].clarification.ambiguityType === 'unclear_results' && 'Multiple documents seem relevant - adding context will help prioritize the best match.'}
                          {discoveryResults[0].clarification.ambiguityType === 'needs_context' && 'This type of document has several variations - specifying your needs will ensure the right fit.'}
                          {discoveryResults[0].clarification.ambiguityType === 'process_oriented' && 'Legal processes involve multiple documents - clarifying the stage will identify what you need most.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Results Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {discoveryResults.map((doc: any, index) => {
                    const translatedDoc = getDocTranslation(doc, locale);
                    const confidence = doc.confidence || { score: 50, level: 'fair', color: 'gray', icon: '❓', message: 'Standard match' };
                    
                    return (
                      <Link
                        key={doc.id}
                        href={`/${locale}/docs/${doc.id}`}
                        onClick={() => handleDocumentClick(doc.id)}
                        className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 hover:shadow-xl hover:scale-105 p-6"
                        style={{
                          animationDelay: `${index * 100}ms`
                        }}
                      >
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Content */}
                        <div className="relative flex items-start gap-4">
                          {/* Icon */}
                          <div className="flex-shrink-0">
                            <div className="p-3 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 rounded-xl border border-emerald-200 dark:border-emerald-700 group-hover:scale-110 transition-transform duration-300">
                              <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                          </div>
                          
                          {/* Document Info */}
                          <div className="flex-1 min-w-0">
                            {/* Title */}
                            <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 leading-tight mb-2 transition-colors duration-300">
                              {translatedDoc.name}
                            </h4>
                            
                            {/* PHASE 3A: Confidence Indicator */}
                            <div className="flex items-center gap-2 mb-3">
                              <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                                confidence.level === 'excellent' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200' :
                                confidence.level === 'good' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200' :
                                confidence.level === 'fair' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200' :
                                confidence.level === 'weak' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200' :
                                'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
                              }`}>
                                <span className="text-xs">{confidence.icon}</span>
                                <span>{confidence.score}% match</span>
                              </div>
                              {confidence.level === 'excellent' && (
                                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                                  🎯 Perfect
                                </div>
                              )}
                            </div>
                            
                            {/* Confidence Message */}
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 italic">
                              {confidence.message}
                            </p>
                            
                            {/* Description */}
                            {translatedDoc.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                                {translatedDoc.description}
                              </p>
                            )}
                            
                            {/* CTA */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-300">
                                <span className="text-sm">Start Document</span>
                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                              </div>
                              
                              {/* Ranking indicator */}
                              <div className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                  #{index + 1}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Enhanced No Results Section */}
            {discoveryInput && discoveryResults.length === 0 && (
              <div className="py-16">
                <div className="text-center max-w-lg mx-auto space-y-6">
                  {/* Icon with animation */}
                  <div className="relative mx-auto w-24 h-24">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-full animate-pulse"></div>
                    <div className="relative flex items-center justify-center w-full h-full">
                      <Search className="h-12 w-12 text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>
                  
                  {/* Message */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      No exact matches found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      Don't worry! Try describing your situation differently, or browse our complete document library to find what you need.
                    </p>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => {
                        setDiscoveryInput('');
                        setDiscoveryResults([]);
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors border border-emerald-200 dark:border-emerald-700"
                    >
                      <Wand2 className="h-4 w-4" />
                      Try Again
                    </button>
                    <button
                      onClick={() => setShowDiscoveryModal(false)}
                      className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600"
                    >
                      <FileText className="h-4 w-4" />
                      Browse All Documents
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}