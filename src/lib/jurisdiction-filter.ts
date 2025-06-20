// src/lib/jurisdiction-filter.ts
import { getCachedDocMeta } from './metadata-cache';

interface JurisdictionInfo {
  code: string;
  name: string;
  flag: string;
  priority: number;
}

// Comprehensive jurisdiction mapping
const JURISDICTIONS: Record<string, JurisdictionInfo> = {
  'US-ALL': { code: 'US-ALL', name: 'All US States', flag: '🇺🇸', priority: 1 },
  'US-CA': { code: 'US-CA', name: 'California', flag: '🇺🇸', priority: 2 },
  'US-TX': { code: 'US-TX', name: 'Texas', flag: '🇺🇸', priority: 2 },
  'US-NY': { code: 'US-NY', name: 'New York', flag: '🇺🇸', priority: 2 },
  'US-FL': { code: 'US-FL', name: 'Florida', flag: '🇺🇸', priority: 2 },
  'CA-ALL': { code: 'CA-ALL', name: 'All Canada', flag: '🇨🇦', priority: 3 },
  'CA-ON': { code: 'CA-ON', name: 'Ontario', flag: '🇨🇦', priority: 4 },
  'CA-BC': { code: 'CA-BC', name: 'British Columbia', flag: '🇨🇦', priority: 4 },
  'INTL': { code: 'INTL', name: 'International', flag: '🌍', priority: 5 },
};

interface JurisdictionFilterOptions {
  userLocation?: string;
  prioritizeLocal?: boolean;
  showAll?: boolean;
}

interface FilteredDocument {
  slug: string;
  title: string;
  jurisdiction: string[];
  relevanceScore: number;
  locallyRelevant: boolean;
}

export class JurisdictionFilter {
  private userJurisdiction: string | null = null;

  constructor() {
    this.detectUserJurisdiction();
  }

  // Detect user's jurisdiction from various sources
  private async detectUserJurisdiction(): Promise<void> {
    try {
      // 1. Check localStorage for saved preference
      const saved = localStorage.getItem('userJurisdiction');
      if (saved && JURISDICTIONS[saved]) {
        this.userJurisdiction = saved;
        return;
      }

      // 2. Try to detect from IP geolocation (implement your geo service)
      const detected = await this.detectFromGeolocation();
      if (detected) {
        this.userJurisdiction = detected;
        localStorage.setItem('userJurisdiction', detected);
        return;
      }

      // 3. Default to US-ALL for now
      this.userJurisdiction = 'US-ALL';
    } catch (error) {
      console.warn('Failed to detect jurisdiction:', error);
      this.userJurisdiction = 'US-ALL';
    }
  }

  private async detectFromGeolocation(): Promise<string | null> {
    try {
      // Replace with your geolocation service
      const response = await fetch('/api/detect-location');
      const data = await response.json();
      
      if (data.country === 'US') {
        return data.state ? `US-${data.state}` : 'US-ALL';
      } else if (data.country === 'CA') {
        return data.province ? `CA-${data.province}` : 'CA-ALL';
      }
      
      return 'INTL';
    } catch (error) {
      return null;
    }
  }

  // Filter documents by jurisdiction relevance
  async filterDocuments(
    slugs: string[], 
    options: JurisdictionFilterOptions = {}
  ): Promise<FilteredDocument[]> {
    const {
      userLocation = this.userJurisdiction,
      prioritizeLocal = true,
      showAll = false
    } = options;

    const results: FilteredDocument[] = [];
    const metadataMap = await this.getDocumentsMetadata(slugs);

    for (const slug of slugs) {
      const meta = metadataMap[slug];
      if (!meta) continue;

      const jurisdictions = Array.isArray(meta.jurisdiction) ? meta.jurisdiction : [meta.jurisdiction];
      const isLocallyRelevant = this.isLocallyRelevant(jurisdictions, userLocation);
      const relevanceScore = this.calculateRelevanceScore(jurisdictions, userLocation, prioritizeLocal);

      // Filter out non-relevant documents unless showAll is true
      if (!showAll && !isLocallyRelevant && !jurisdictions.includes('US-ALL') && !jurisdictions.includes('INTL')) {
        continue;
      }

      results.push({
        slug,
        title: meta.title,
        jurisdiction: jurisdictions,
        relevanceScore,
        locallyRelevant: isLocallyRelevant
      });
    }

    // Sort by relevance score
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  private async getDocumentsMetadata(slugs: string[]): Promise<Record<string, any>> {
    const { getCachedDocMetaBatch } = await import('./metadata-cache');
    return getCachedDocMetaBatch(slugs);
  }

  private isLocallyRelevant(jurisdictions: string[], userLocation: string | null): boolean {
    if (!userLocation) return true;

    // Direct match
    if (jurisdictions.includes(userLocation)) return true;

    // US state matches US-ALL
    if (userLocation.startsWith('US-') && jurisdictions.includes('US-ALL')) return true;

    // Canada province matches CA-ALL
    if (userLocation.startsWith('CA-') && jurisdictions.includes('CA-ALL')) return true;

    // International documents are relevant everywhere
    if (jurisdictions.includes('INTL')) return true;

    return false;
  }

  private calculateRelevanceScore(
    jurisdictions: string[], 
    userLocation: string | null, 
    prioritizeLocal: boolean
  ): number {
    let score = 50; // Base score

    if (!userLocation || !prioritizeLocal) {
      return score;
    }

    // Exact jurisdiction match
    if (jurisdictions.includes(userLocation)) {
      score += 50;
    }

    // Country-level match
    if (userLocation.startsWith('US-') && jurisdictions.includes('US-ALL')) {
      score += 30;
    } else if (userLocation.startsWith('CA-') && jurisdictions.includes('CA-ALL')) {
      score += 30;
    }

    // International documents
    if (jurisdictions.includes('INTL')) {
      score += 10;
    }

    // Penalize irrelevant jurisdictions
    const hasIrrelevantJurisdictions = jurisdictions.some(j => {
      if (j === 'INTL' || j === userLocation) return false;
      if (userLocation.startsWith('US-') && (j === 'US-ALL' || j.startsWith('US-'))) return false;
      if (userLocation.startsWith('CA-') && (j === 'CA-ALL' || j.startsWith('CA-'))) return false;
      return true;
    });

    if (hasIrrelevantJurisdictions) {
      score -= 20;
    }

    return Math.max(0, score);
  }

  // Get available jurisdictions for filtering UI
  getAvailableJurisdictions(): JurisdictionInfo[] {
    return Object.values(JURISDICTIONS).sort((a, b) => a.priority - b.priority);
  }

  // Set user's jurisdiction preference
  setUserJurisdiction(jurisdiction: string): void {
    if (JURISDICTIONS[jurisdiction]) {
      this.userJurisdiction = jurisdiction;
      try {
        localStorage.setItem('userJurisdiction', jurisdiction);
      } catch (error) {
        // localStorage not available
      }
    }
  }

  // Get current user jurisdiction
  getUserJurisdiction(): string | null {
    return this.userJurisdiction;
  }

  // Get jurisdiction display info
  getJurisdictionInfo(code: string): JurisdictionInfo | null {
    return JURISDICTIONS[code] || null;
  }

  // Check if document is available in user's jurisdiction
  async isDocumentAvailable(slug: string, userJurisdiction?: string): Promise<boolean> {
    try {
      const meta = await getCachedDocMeta(slug);
      if (!meta) return false;

      const jurisdiction = userJurisdiction || this.userJurisdiction;
      if (!jurisdiction) return true;

      const docJurisdictions = Array.isArray(meta.jurisdiction) ? meta.jurisdiction : [meta.jurisdiction];
      return this.isLocallyRelevant(docJurisdictions, jurisdiction);
    } catch (error) {
      console.warn(`Failed to check availability for ${slug}:`, error);
      return true; // Default to available on error
    }
  }

  // Get jurisdiction-specific disclaimer text
  getJurisdictionDisclaimer(jurisdictions: string[]): string {
    const hasUS = jurisdictions.some(j => j.startsWith('US-'));
    const hasCA = jurisdictions.some(j => j.startsWith('CA-'));
    const hasIntl = jurisdictions.includes('INTL');

    if (hasIntl) {
      return 'This document may require adaptation to local laws. Consult local legal counsel.';
    } else if (hasUS && hasCA) {
      return 'Available for US and Canadian jurisdictions. Legal requirements may vary by state/province.';
    } else if (hasUS) {
      return 'Valid for US jurisdictions. State-specific requirements may apply.';
    } else if (hasCA) {
      return 'Valid for Canadian jurisdictions. Provincial requirements may apply.';
    }

    return 'Please verify local legal requirements before use.';
  }
}

// Singleton instance
export const jurisdictionFilter = new JurisdictionFilter();

// Convenience functions
export const filterDocumentsByJurisdiction = (slugs: string[], options?: JurisdictionFilterOptions) =>
  jurisdictionFilter.filterDocuments(slugs, options);

export const isDocumentAvailable = (slug: string, jurisdiction?: string) =>
  jurisdictionFilter.isDocumentAvailable(slug, jurisdiction);

export const getJurisdictionInfo = (code: string) =>
  jurisdictionFilter.getJurisdictionInfo(code);

export default jurisdictionFilter;