import Fuse from 'fuse.js';
import { allDocuments } from '@/lib/document-library';
import type { LegalDocument } from '@/lib/document-library';
import { taxonomy } from '@/config/taxonomy';

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

export interface DidYouMeanResult {
  suggestion: string;
}

export interface SemanticAnalysisOptions {
  locale: 'en' | 'es';
  maxResults?: number;
}

export class SemanticAnalysisEngine {
  private expandQuery(query: string): string[] {
    const expanded = new Set<string>();
    const baseQuery = query.toLowerCase();
    expanded.add(baseQuery);

    const synonyms = taxonomy.synonyms ?? {};

    Object.entries(synonyms).forEach(([synonym, rawTargets]) => {
      const normalizedSynonym = synonym.toLowerCase();
      const targets = (Array.isArray(rawTargets) ? rawTargets : [rawTargets])
        .map((target) => String(target).toLowerCase())
        .filter((target) => target.length > 0);

      if (baseQuery.includes(normalizedSynonym)) {
        targets.forEach((target) => expanded.add(target));
      }

      targets.forEach((target) => {
        if (baseQuery.includes(target)) {
          expanded.add(normalizedSynonym);
        }
      });
    });

    return Array.from(expanded);
  }
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
    const expandedQueries = this.expandQuery(userInput);

    const fuse = new Fuse(allDocuments, {
      keys: [
        { name: `translations.${locale}.name`, weight: 0.6 },
        { name: `translations.${locale}.description`, weight: 0.3 },
        { name: `translations.${locale}.aliases`, weight: 0.2 },
        { name: 'seoMetadata.keywords', weight: 0.1 }
      ],
      includeScore: true,
      threshold: 0.4,
      ignoreLocation: true,
    });

    const fuseMap = new Map<string, Fuse.FuseResult<LegalDocument>>();
    for (const q of expandedQueries) {
      for (const res of fuse.search(q)) {
        const existing = fuseMap.get(res.item.id);
        if (!existing || (res.score || 0) < (existing.score || 0)) {
          fuseMap.set(res.item.id, res);
        }
      }
    }

    const fuseResults = Array.from(fuseMap.values());

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

  public suggest(userInput: string): DidYouMeanResult | null {
    const query = userInput.toLowerCase();
    for (const [syn, targets] of Object.entries(taxonomy.synonyms || {})) {
      if (targets.some(t => query.includes(String(t).toLowerCase()))) {
        return { suggestion: syn };
      }
    }
    return null;
  }
}
