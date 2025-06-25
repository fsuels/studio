import Fuse from 'fuse.js';
import { documentLibrary } from '@/lib/document-library';
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
    if (score >= 80) {
      return {
        score: Math.min(98, 85 + Math.floor(score / 20)),
        level: 'excellent',
        color: 'emerald',
        icon: '🎯',
        message: 'Perfect match for your needs'
      };
    } else if (score >= 60) {
      return {
        score: Math.min(90, 75 + Math.floor(score / 15)),
        level: 'excellent',
        color: 'emerald',
        icon: '🎯',
        message: 'Excellent match'
      };
    } else if (score >= 40) {
      return {
        score: Math.min(85, 70 + Math.floor(score / 12)),
        level: 'good',
        color: 'blue',
        icon: '✅',
        message: 'Strong match'
      };
    } else {
      return {
        score: Math.min(65, 30 + Math.floor(score / 4)),
        level: 'weak',
        color: 'orange',
        icon: '⚡',
        message: 'Weak match'
      };
    }
  }

  public analyze(userInput: string, options: SemanticAnalysisOptions): SemanticResult[] {
    const { locale, maxResults = 8 } = options;
    const input = userInput.toLowerCase();

    const fuse = new Fuse(documentLibrary, {
      keys: [
        {
          name: 'name',
          weight: 0.6
        },
        {
          name: 'description',
          weight: 0.3
        },
        {
          name: 'keywords',
          weight: 0.1
        }
      ],
      includeScore: true,
      threshold: 0.4,
      ignoreLocation: true,
    });

    const fuseResults = fuse.search(input);

    const results: SemanticResult[] = fuseResults.map(result => {
      const doc = result.item;
      const score = (1 - (result.score || 0)) * 100;
      const reasons: string[] = [`Fuzzy match score: ${score.toFixed(2)}`];
      const confidence = this.calculateConfidence(score);

      return {
        doc,
        score,
        reasons,
        confidence
      };
    });

    const filteredResults = results
      .filter(result => result.confidence.score >= 70)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);

    return filteredResults;
  }

  public suggest(userInput: string): null {
      return null;
  }
}
