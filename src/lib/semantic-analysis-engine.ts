import { documentLibrary } from '@/lib/document-library';
import { getDocTranslation } from '@/lib/i18nUtils';
import type { LegalDocument } from '@/lib/document-library';

export interface SemanticResult {
  doc: LegalDocument;
  score: number;
  reasons: string[];
  confidence: {
    score: number;
    level: 'excellent' | 'good' | 'fair' | 'weak' | 'poor';
    color: string;
    icon: string;
    message: string;
  };
}

export interface SemanticAnalysisOptions {
  locale: 'en' | 'es';
  maxResults?: number;
}

export class SemanticAnalysisEngine {
  private calculateConfidence(score: number): SemanticResult['confidence'] {
    if (score >= 200) {
      return {
        score: Math.min(98, 85 + Math.floor(score / 20)),
        level: 'excellent',
        color: 'emerald',
        icon: '🎯',
        message: 'Perfect match for your needs'
      };
    } else if (score >= 150) {
      return {
        score: Math.min(90, 75 + Math.floor(score / 15)),
        level: 'excellent',
        color: 'emerald',
        icon: '🎯',
        message: 'Excellent match'
      };
    } else if (score >= 120) {
      return {
        score: Math.min(85, 70 + Math.floor(score / 12)),
        level: 'good',
        color: 'blue',
        icon: '✅',
        message: 'Strong match'
      };
    } else if (score >= 100) {
      return {
        score: Math.min(80, 65 + Math.floor(score / 10)),
        level: 'good',
        color: 'blue',
        icon: '✅',
        message: 'Good match'
      };
    } else {
      // Anything below 100 raw score gets low confidence
      return {
        score: Math.min(65, 30 + Math.floor(score / 4)),
        level: 'weak',
        color: 'orange',
        icon: '⚡',
        message: 'Weak match'
      };
    }
  }

  private analyzeRealEstate(input: string, docName: string, reasons: string[]): number {
    let score = 0;
    
    if (input.includes('house') || input.includes('home') || input.includes('property') || input.includes('real estate')) {
      // Exclude wrong categories
      if (docName.includes('livestock') || docName.includes('animal') || docName.includes('vehicle') || docName.includes('car') || docName.includes('boat')) {
        score -= 100;
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
    
    return score;
  }

  private analyzeVehicle(input: string, docName: string, reasons: string[]): number {
    let score = 0;
    
    if (input.includes('car') || input.includes('vehicle') || input.includes('auto') || input.includes('truck') || input.includes('motorcycle')) {
      // Exclude wrong categories
      if (docName.includes('real estate') || docName.includes('property') || docName.includes('livestock') || docName.includes('animal')) {
        score -= 100;
        reasons.push('Excluded - wrong category for vehicle');
      } else if (docName.includes('vehicle') && docName.includes('bill of sale')) {
        score += 200;
        reasons.push('Vehicle bill of sale - perfect match');
      } else if (docName.includes('vehicle') || docName.includes('auto')) {
        score += 120;
        reasons.push('Vehicle-related document');
      }
    }
    
    return score;
  }

  private analyzeBusiness(input: string, docName: string, reasons: string[]): number {
    let score = 0;
    
    if (input.includes('business') || input.includes('company') || input.includes('llc') || input.includes('corporation')) {
      if (docName.includes('llc') || docName.includes('operating agreement')) {
        score += 150;
        reasons.push('LLC formation document');
      } else if (docName.includes('business') || docName.includes('corporate')) {
        score += 100;
        reasons.push('Business document');
      }
    }
    
    return score;
  }

  private analyzeEmployment(input: string, docName: string, reasons: string[]): number {
    let score = 0;
    
    if (input.includes('employ') || input.includes('hire') || input.includes('job') || input.includes('work')) {
      if (docName.includes('employment') && docName.includes('contract')) {
        score += 180;
        reasons.push('Employment contract - perfect match');
      } else if (docName.includes('employment') || docName.includes('employee')) {
        score += 120;
        reasons.push('Employment-related document');
      }
    }
    
    return score;
  }

  private performKeywordMatching(input: string, doc: LegalDocument, translatedDoc: any, reasons: string[]): number {
    let score = 0;
    const docName = translatedDoc.name.toLowerCase();
    const docDesc = translatedDoc.description?.toLowerCase() || '';
    const docCategory = doc.category?.toLowerCase() || '';
    
    // Get keywords from multiple sources
    const keywords = [
      ...(doc.keywords?.map(k => k.toLowerCase()) || []),
      ...(doc.tags?.map(k => k.toLowerCase()) || []),
      ...(translatedDoc.aliases?.map(k => k.toLowerCase()) || []),
    ];
    
    // Direct name matching
    const inputWords = input.split(/\s+/);
    inputWords.forEach(inputWord => {
      if (inputWord.length > 2) {
        if (docName.includes(inputWord)) {
          score += 30;
          reasons.push(`Name match: ${inputWord}`);
        }
        if (docDesc.includes(inputWord)) {
          score += 15;
          reasons.push(`Description match: ${inputWord}`);
        }
        if (docCategory.includes(inputWord)) {
          score += 25;
          reasons.push(`Category match: ${inputWord}`);
        }
        keywords.forEach(keyword => {
          if (keyword.includes(inputWord)) {
            score += 20;
            reasons.push(`Keyword match: ${inputWord}`);
          }
        });
      }
    });
    
    return score;
  }

  private analyzeGeneral(input: string, docName: string, translatedDoc: any, reasons: string[]): number {
    let score = 0;
    
    // Divorce-related matching
    if (input.includes('divorce') || input.includes('separation') || input.includes('split up')) {
      if (docName.includes('divorce') || docName.includes('separation')) {
        score += 200;
        reasons.push('Divorce document - perfect match');
      } else if (docName.includes('settlement') || docName.includes('agreement')) {
        score += 50;
        reasons.push('Related legal document');
      }
    }
    
    // Contract-related matching  
    if (input.includes('contract') || input.includes('agreement')) {
      if (docName.includes('contract') || docName.includes('agreement')) {
        score += 100;
        reasons.push('Contract document match');
      }
    }
    
    // Legal document general matching
    if (input.includes('legal') || input.includes('document') || input.includes('form')) {
      score += 10;
      reasons.push('General legal document');
    }
    
    return score;
  }

  public analyze(userInput: string, options: SemanticAnalysisOptions): SemanticResult[] {
    const { locale, maxResults = 8 } = options;
    const input = userInput.toLowerCase();
    const results: SemanticResult[] = [];

    console.log('🔍 Analyzing input:', input);
    console.log('📚 Document library size:', documentLibrary.length);

    documentLibrary.forEach(doc => {
      const translatedDoc = getDocTranslation(doc, locale);
      let score = 0;
      const reasons: string[] = [];
      
      const docName = translatedDoc.name.toLowerCase();

      // Category-specific analysis
      if (input.includes('buy') || input.includes('purchase') || input.includes('sell') || input.includes('sale')) {
        score += this.analyzeRealEstate(input, docName, reasons);
        score += this.analyzeVehicle(input, docName, reasons);
      }

      score += this.analyzeBusiness(input, docName, reasons);
      score += this.analyzeEmployment(input, docName, reasons);
      score += this.analyzeGeneral(input, docName, translatedDoc, reasons);
      score += this.performKeywordMatching(input, doc, translatedDoc, reasons);

      if (score > 0) {
        const confidence = this.calculateConfidence(score);
        console.log(`📄 ${translatedDoc.name}: score ${score}, reasons:`, reasons);
        results.push({
          doc,
          score,
          reasons,
          confidence
        });
      }
    });

    const filteredResults = results
      .filter(result => result.confidence.score >= 70)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);
    
    console.log('✅ Found', results.length, 'total matches,', filteredResults.length, 'above 70% confidence');
    return filteredResults;
  }
}