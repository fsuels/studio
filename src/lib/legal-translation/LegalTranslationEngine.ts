// src/lib/legal-translation/LegalTranslationEngine.ts
// import { getCachedDocMeta } from '../metadata-cache';

interface LegalTerm {
  term: string;
  definition: string;
  jurisdiction: string[];
  translations: Record<
    string,
    {
      term: string;
      definition: string;
      confidence: number;
      source: 'legal_dictionary' | 'ai_translation' | 'human_verified';
      alternatives?: string[];
      context?: string;
    }
  >;
}

interface TranslationContext {
  documentType: string;
  jurisdiction: string;
  sourceLanguage: string;
  targetLanguage: string;
  userRole?: string;
  legalSystem?: 'common_law' | 'civil_law' | 'religious_law' | 'mixed';
}

interface TranslationResult {
  translatedText: string;
  confidence: number;
  warnings: TranslationWarning[];
  suggestions: TranslationSuggestion[];
  legalTerms: LegalTermMatch[];
  preservedTerms: string[];
  metadata: {
    processingTime: number;
    method: 'ai_enhanced' | 'dictionary_lookup' | 'hybrid';
    reviewRequired: boolean;
  };
}

interface TranslationWarning {
  type:
    | 'legal_concept_mismatch'
    | 'jurisdiction_conflict'
    | 'cultural_adaptation'
    | 'untranslatable_term'
    | 'system_warning';
  message: string;
  originalTerm: string;
  position: number;
  severity: 'low' | 'medium' | 'high';
  suggestion?: string;
}

interface TranslationSuggestion {
  original: string;
  suggested: string;
  reason: string;
  confidence: number;
  legalBasis?: string;
}

interface LegalTermMatch {
  term: string;
  translation: string;
  confidence: number;
  definition: string;
  equivalentConcept: boolean;
  requiresAdaptation: boolean;
}

class LegalTranslationEngine {
  private legalDictionary: Map<string, LegalTerm> = new Map();
  private jurisdictionMappings: Map<string, string[]> = new Map();
  private cacheTimeoutMs = 30 * 60 * 1000; // 30 minutes

  constructor() {
    this.initializeLegalDictionary();
    this.setupJurisdictionMappings();
  }

  /**
   * Translate legal text with accuracy preservation
   */
  async translateLegalText(
    text: string,
    context: TranslationContext,
  ): Promise<TranslationResult> {
    const startTime = Date.now();

    try {
      // 1. Pre-process text to identify legal terms
      const legalTerms = await this.identifyLegalTerms(text, context);

      // 2. Check for jurisdiction compatibility
      const jurisdictionWarnings = this.checkJurisdictionCompatibility(context);

      // 3. Perform context-aware translation
      const translationResult = await this.performContextualTranslation(
        text,
        context,
        legalTerms,
      );

      // 4. Post-process for legal accuracy
      const refinedResult = await this.refineLegalAccuracy(
        translationResult,
        context,
        legalTerms,
      );

      // 5. Generate warnings and suggestions
      const warnings = [...jurisdictionWarnings, ...refinedResult.warnings];
      const suggestions = await this.generateTranslationSuggestions(
        refinedResult,
        context,
      );

      // 6. Calculate confidence score
      const confidence = this.calculateTranslationConfidence(
        refinedResult,
        legalTerms,
      );

      const translationMethod =
        refinedResult.translationMethod ??
        this.determineTranslationMethod(legalTerms.length, context);

      const reviewRequired =
        refinedResult.reviewRequired ||
        confidence < 0.85 ||
        warnings.some((w) => w.severity === 'high');

      return {
        translatedText: refinedResult.text,
        confidence,
        warnings,
        suggestions,
        legalTerms: refinedResult.legalTermMatches,
        preservedTerms: refinedResult.preservedTerms,
        metadata: {
          processingTime: Date.now() - startTime,
          method: translationMethod,
          reviewRequired,
        },
      };
    } catch (error) {
      console.error('Legal translation failed:', error);
      throw new Error('Translation service temporarily unavailable');
    }
  }

  /**
   * Identify legal terms in the source text
   */
  private async identifyLegalTerms(
    text: string,
    context: TranslationContext,
  ): Promise<LegalTerm[]> {
    const identifiedTerms: LegalTerm[] = [];
    const words = text.toLowerCase().split(/\s+/);

    // Check single words and phrases (up to 4 words)
    for (let i = 0; i < words.length; i++) {
      for (let j = 1; j <= Math.min(4, words.length - i); j++) {
        const phrase = words.slice(i, i + j).join(' ');
        const legalTerm = this.legalDictionary.get(phrase);

        if (legalTerm && this.isTermApplicable(legalTerm, context)) {
          identifiedTerms.push(legalTerm);
        }
      }
    }

    // Use AI to identify additional legal concepts
    const aiIdentifiedTerms = await this.aiIdentifyLegalConcepts(text, context);
    identifiedTerms.push(...aiIdentifiedTerms);

    return this.deduplicateTerms(identifiedTerms);
  }

  /**
   * AI-powered legal concept identification
   */
  private async aiIdentifyLegalConcepts(
    text: string,
    context: TranslationContext,
  ): Promise<LegalTerm[]> {
    try {
      const response = await fetch('/api/ai/identify-legal-terms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          jurisdiction: context.jurisdiction,
          documentType: context.documentType,
          language: context.sourceLanguage,
        }),
      });

      const { legalTerms } = await response.json();
      return legalTerms || [];
    } catch (error) {
      console.warn('AI legal term identification failed:', error);
      return [];
    }
  }

  /**
   * Perform contextual translation with legal awareness
   */
  private async performContextualTranslation(
    text: string,
    context: TranslationContext,
    legalTerms: LegalTerm[],
  ): Promise<{
    text: string;
    warnings: TranslationWarning[];
    legalTermMatches: LegalTermMatch[];
    preservedTerms: string[];
    translationMethod: 'ai_enhanced' | 'dictionary_lookup' | 'hybrid';
    reviewRequired: boolean;
  }> {
    let translatedText = text;
    const warnings: TranslationWarning[] = [];
    const legalTermMatches: LegalTermMatch[] = [];
    const preservedTerms: string[] = [];

    // Create legal term preservation map
    const termMap = new Map<string, string>();

    for (const legalTerm of legalTerms) {
      const translation = legalTerm.translations[context.targetLanguage];

      if (translation) {
        if (translation.confidence >= 0.9) {
          // High confidence - use translation
          termMap.set(legalTerm.term, translation.term);
          legalTermMatches.push({
            term: legalTerm.term,
            translation: translation.term,
            confidence: translation.confidence,
            definition: translation.definition,
            equivalentConcept: true,
            requiresAdaptation: false,
          });
        } else if (translation.confidence >= 0.7) {
          // Medium confidence - use with warning
          termMap.set(legalTerm.term, translation.term);
          legalTermMatches.push({
            term: legalTerm.term,
            translation: translation.term,
            confidence: translation.confidence,
            definition: translation.definition,
            equivalentConcept: true,
            requiresAdaptation: true,
          });

          warnings.push({
            type: 'legal_concept_mismatch',
            message: `"${legalTerm.term}" may not have direct equivalent in ${context.targetLanguage}`,
            originalTerm: legalTerm.term,
            position: text.indexOf(legalTerm.term),
            severity: 'medium',
            suggestion: translation.alternatives?.[0],
          });
        } else {
          // Low confidence - preserve original with explanation
          preservedTerms.push(legalTerm.term);
          warnings.push({
            type: 'untranslatable_term',
            message: `"${legalTerm.term}" preserved in original language - no accurate translation available`,
            originalTerm: legalTerm.term,
            position: text.indexOf(legalTerm.term),
            severity: 'high',
            suggestion: translation.definition ? `Add explanatory note: ${translation.definition}` : undefined,
          });
        }
      } else {
        // No translation available - preserve original
        preservedTerms.push(legalTerm.term);
        warnings.push({
          type: 'untranslatable_term',
          message: `"${legalTerm.term}" has no translation in legal context`,
          originalTerm: legalTerm.term,
          position: text.indexOf(legalTerm.term),
          severity: 'high',
        });
      }
    }

    const apiResult = await this.aiTranslateWithPreservation(
      text,
      context,
      termMap,
      preservedTerms,
    );

    translatedText = apiResult.text;
    if (apiResult.warnings.length > 0) {
      warnings.push(...apiResult.warnings);
    }

    const translationMethod = this.resolveTranslationMethod(
      termMap.size,
      apiResult.source,
    );

    return {
      text: translatedText,
      warnings,
      legalTermMatches,
      preservedTerms,
      translationMethod,
      reviewRequired: apiResult.reviewRequired,
    };
  }
  /**
   * AI translation with legal term preservation
   */
  private async aiTranslateWithPreservation(
    text: string,
    context: TranslationContext,
    termMap: Map<string, string>,
    preservedTerms: string[],
  ): Promise<{
    text: string;
    warnings: TranslationWarning[];
    source: 'ai' | 'fallback';
    reviewRequired: boolean;
  }> {
    try {
      const response = await fetch('/api/ai/legal-translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          sourceLanguage: context.sourceLanguage,
          targetLanguage: context.targetLanguage,
          jurisdiction: context.jurisdiction,
          documentType: context.documentType,
          legalTermMap: Object.fromEntries(termMap),
          preservedTerms,
          legalSystem: context.legalSystem,
        }),
      });

      const payload = (await response.json()) as {
        translatedText?: string;
        metadata?: {
          source?: string;
          warnings?: string[];
        };
      };

      const source:
        | 'ai'
        | 'fallback' = payload.metadata?.source === 'fallback' ? 'fallback' : 'ai';

      const mappedWarnings = Array.isArray(payload.metadata?.warnings)
        ? payload.metadata!.warnings.map((message) => ({
            type: 'system_warning' as const,
            message,
            originalTerm: '',
            position: -1,
            severity: source === 'fallback' ? 'high' : 'medium',
          }))
        : [];

      return {
        text: payload.translatedText ?? text,
        warnings: mappedWarnings,
        source,
        reviewRequired: source === 'fallback' || mappedWarnings.length > 0,
      };
    } catch (error) {
      console.error('AI translation failed:', error);
      const fallbackText = await this.fallbackTranslation(text, context);
      return {
        text: fallbackText,
        warnings: [
          {
            type: 'system_warning',
            message: 'AI translation unavailable; original text shown.',
            originalTerm: '',
            position: -1,
            severity: 'high',
          },
        ],
        source: 'fallback',
        reviewRequired: true,
      };
    }
  }
  /**
   * Refine translation for legal accuracy
   */
  private async refineLegalAccuracy(
    translation: {
      text: string;
      warnings: TranslationWarning[];
      legalTermMatches: LegalTermMatch[];
      preservedTerms: string[];
    },
    context: TranslationContext,
    _originalTerms: LegalTerm[],
  ): Promise<typeof translation> {
    // Check for legal consistency
    const consistencyWarnings = this.checkLegalConsistency(
      translation.text,
      context,
    );

    // Validate jurisdiction-specific requirements
    const jurisdictionWarnings = this.validateJurisdictionRequirements(
      translation.text,
      context,
    );

    // Refine based on document type
    const refinedText = await this.refineByDocumentType(
      translation.text,
      context,
    );

    return {
      ...translation,
      text: refinedText,
      warnings: [
        ...translation.warnings,
        ...consistencyWarnings,
        ...jurisdictionWarnings,
      ],
    };
  }

  /**
   * Check jurisdiction compatibility
   */
  private checkJurisdictionCompatibility(
    context: TranslationContext,
  ): TranslationWarning[] {
    const warnings: TranslationWarning[] = [];

    const sourceSystem = this.getLegalSystem(context.jurisdiction);
    const targetSystem = this.getTargetLegalSystem(context.targetLanguage);

    if (sourceSystem !== targetSystem) {
      warnings.push({
        type: 'jurisdiction_conflict',
        message: `Document based on ${sourceSystem} law being translated for ${targetSystem} system`,
        originalTerm: context.jurisdiction,
        position: 0,
        severity: 'high',
        suggestion: 'Legal review recommended for jurisdiction compatibility',
      });
    }

    return warnings;
  }

  /**
   * Generate translation suggestions
   */
  private async generateTranslationSuggestions(
    result: { text: string; legalTermMatches: LegalTermMatch[] },
    context: TranslationContext,
  ): Promise<TranslationSuggestion[]> {
    const suggestions: TranslationSuggestion[] = [];

    // Suggest improvements for low-confidence terms
    for (const match of result.legalTermMatches) {
      if (match.confidence < 0.8 && match.requiresAdaptation) {
        const alternatives = await this.getAlternativeTranslations(
          match.term,
          context,
        );

        for (const alt of alternatives) {
          suggestions.push({
            original: match.translation,
            suggested: alt.term,
            reason: alt.reason,
            confidence: alt.confidence,
            legalBasis: alt.legalBasis,
          });
        }
      }
    }

    return suggestions;
  }

  /**
   * Calculate overall translation confidence
   */
  private calculateTranslationConfidence(
    result: { legalTermMatches: LegalTermMatch[]; preservedTerms: string[] },
    originalTerms: LegalTerm[],
  ): number {
    if (originalTerms.length === 0) return 0.95; // Non-legal text

    const totalTerms = originalTerms.length;
    const highConfidenceTerms = result.legalTermMatches.filter(
      (m) => m.confidence >= 0.9,
    ).length;
    const mediumConfidenceTerms = result.legalTermMatches.filter(
      (m) => m.confidence >= 0.7 && m.confidence < 0.9,
    ).length;
    const preservedTermsCount = result.preservedTerms.length;

    // Weight: High confidence = 1.0, Medium = 0.8, Preserved = 0.6, Missing = 0.0
    const score =
      (highConfidenceTerms * 1.0 +
        mediumConfidenceTerms * 0.8 +
        preservedTermsCount * 0.6) /
      totalTerms;

    return Math.max(0.1, Math.min(1.0, score));
  }

  /**
   * Initialize legal dictionary with multi-language terms
   */
  private initializeLegalDictionary(): void {
    // Sample legal terms - in production, this would be loaded from a comprehensive database
    const terms: LegalTerm[] = [
      {
        term: 'consideration',
        definition: 'Something of value exchanged between parties in a contract',
        jurisdiction: ['US-ALL', 'CA-ALL', 'UK'],
        translations: {
          es: {
            term: 'contraprestacion',
            definition: 'Algo de valor que las partes intercambian para formar un contrato',
            confidence: 0.97,
            source: 'legal_dictionary',
            alternatives: ['consideracion contractual'],
          },
          fr: {
            term: 'contrepartie',
            definition: 'Element de valeur echange par les parties pour former un contrat',
            confidence: 0.95,
            source: 'legal_dictionary',
          },
          de: {
            term: 'Gegenleistung',
            definition: 'Wert, den Vertragsparteien austauschen, um einen Vertrag zu schliessen',
            confidence: 0.94,
            source: 'legal_dictionary',
          },
          pt: {
            term: 'contraprestacao',
            definition: 'Algo de valor trocado entre as partes para formar um contrato',
            confidence: 0.95,
            source: 'legal_dictionary',
          },
        },
      },
      {
        term: 'force majeure',
        definition: 'Unforeseeable circumstances that prevent a party from fulfilling a contract',
        jurisdiction: ['US-ALL', 'CA-ALL', 'UK', 'FR'],
        translations: {
          es: {
            term: 'fuerza mayor',
            definition: 'Circunstancias imprevistas que impiden a una parte cumplir un contrato',
            confidence: 0.98,
            source: 'legal_dictionary',
          },
          fr: {
            term: 'force majeure',
            definition: 'Evenements imprevisibles empechant une partie d executer le contrat',
            confidence: 0.98,
            source: 'legal_dictionary',
          },
          de: {
            term: 'hoehere Gewalt',
            definition: 'Unvorhersehbare Ereignisse, die die Vertragserfuellung unmoeglich machen',
            confidence: 0.96,
            source: 'legal_dictionary',
          },
          pt: {
            term: 'forca maior',
            definition: 'Eventos imprevisiveis que impedem uma parte de cumprir o contrato',
            confidence: 0.96,
            source: 'legal_dictionary',
          },
        },
      },
      {
        term: 'governing law',
        definition: 'Clause that identifies the jurisdiction whose laws interpret the agreement',
        jurisdiction: ['US-ALL', 'CA-ALL', 'MX-ALL', 'EU-ALL'],
        translations: {
          es: {
            term: 'ley aplicable',
            definition: 'Clausula que identifica la jurisdiccion cuyas leyes interpretan el acuerdo',
            confidence: 0.96,
            source: 'legal_dictionary',
          },
          fr: {
            term: 'droit applicable',
            definition: 'Clause indiquant la juridiction dont les lois regissent l accord',
            confidence: 0.94,
            source: 'legal_dictionary',
          },
          de: {
            term: 'anwendbares Recht',
            definition: 'Klausel, die bestimmt, welche Gerichtsbarkeit den Vertrag auslegt',
            confidence: 0.93,
            source: 'legal_dictionary',
          },
          pt: {
            term: 'lei aplicavel',
            definition: 'Clausula que define a jurisdicao cujas leis regem o acordo',
            confidence: 0.94,
            source: 'legal_dictionary',
          },
        },
      },
      {
        term: 'notary acknowledgment',
        definition: 'Formal declaration before a notary that a signature is voluntary and authentic',
        jurisdiction: ['US-ALL'],
        translations: {
          es: {
            term: 'reconocimiento notarial',
            definition: 'Declaracion formal ante un notario de que la firma es voluntaria y autentica',
            confidence: 0.95,
            source: 'legal_dictionary',
          },
          fr: {
            term: 'reconnaissance notariale',
            definition: 'Declaration formelle devant un notaire confirmant qu une signature est volontaire et authentique',
            confidence: 0.92,
            source: 'legal_dictionary',
          },
          de: {
            term: 'notarielle Beglaubigung',
            definition: 'Formelle Erklaerung vor einem Notar, dass eine Unterschrift freiwillig und echt ist',
            confidence: 0.92,
            source: 'legal_dictionary',
          },
          pt: {
            term: 'reconhecimento notarial',
            definition: 'Declaracao formal perante um tabeliao de que a assinatura e voluntaria e autentica',
            confidence: 0.93,
            source: 'legal_dictionary',
          },
        },
      },
      {
        term: 'severability clause',
        definition: 'Provision ensuring the remainder of a contract survives if one part is invalid',
        jurisdiction: ['US-ALL', 'CA-ALL', 'EU-ALL'],
        translations: {
          es: {
            term: 'clausula de separabilidad',
            definition: 'Disposicion que garantiza que el resto del contrato sigue vigente si una parte es invalida',
            confidence: 0.95,
            source: 'legal_dictionary',
          },
          fr: {
            term: 'clause de divisibilite',
            definition: 'Disposition garantissant que le reste du contrat demeure valable si une partie est invalide',
            confidence: 0.93,
            source: 'legal_dictionary',
          },
          de: {
            term: 'Salvatorische Klausel',
            definition: 'Bestimmung, die sicherstellt, dass der Vertrag trotz einzelner ungueltiger Klauseln fortbesteht',
            confidence: 0.93,
            source: 'legal_dictionary',
          },
          pt: {
            term: 'clausula de separabilidade',
            definition: 'Disposicao que mantem o restante do contrato valido se uma parte for invalida',
            confidence: 0.94,
            source: 'legal_dictionary',
          },
        },
      },
    ];


    terms.forEach((term) => {
      this.legalDictionary.set(term.term.toLowerCase(), term);
    });
  }

  /**
   * Setup jurisdiction to legal system mappings
   */
  private setupJurisdictionMappings(): void {
    this.jurisdictionMappings.set('common_law', [
      'US-ALL',
      'CA-ALL',
      'UK',
      'AU',
      'IN',
    ]);
    this.jurisdictionMappings.set('civil_law', [
      'FR',
      'DE',
      'ES',
      'IT',
      'BR',
      'MX',
    ]);
    this.jurisdictionMappings.set('mixed', ['ZA', 'QC', 'LA', 'PH']);
  }

  /**
   * Helper methods
   */
  private isTermApplicable(
    term: LegalTerm,
    context: TranslationContext,
  ): boolean {
    return (
      term.jurisdiction.includes(context.jurisdiction) ||
      term.jurisdiction.includes('UNIVERSAL')
    );
  }

  private deduplicateTerms(terms: LegalTerm[]): LegalTerm[] {
    const seen = new Set<string>();
    return terms.filter((term) => {
      if (seen.has(term.term)) return false;
      seen.add(term.term);
      return true;
    });
  }

  private getLegalSystem(jurisdiction: string): string {
    for (const [system, jurisdictions] of this.jurisdictionMappings) {
      if (jurisdictions.includes(jurisdiction)) return system;
    }
    return 'unknown';
  }

  private getTargetLegalSystem(language: string): string {
    const languageToSystem: Record<string, string> = {
      en: 'common_law',
      es: 'civil_law',
      fr: 'civil_law',
      de: 'civil_law',
      pt: 'civil_law',
    };
    return languageToSystem[language] || 'unknown';
  }

  private determineTranslationMethod(
    legalTermsCount: number,
    _context: TranslationContext,
  ): 'ai_enhanced' | 'dictionary_lookup' | 'hybrid' {
    if (legalTermsCount === 0) return 'ai_enhanced';
    if (legalTermsCount > 10) return 'hybrid';
    return 'dictionary_lookup';
  }

  private resolveTranslationMethod(
    termMapSize: number,
    source: 'ai' | 'fallback',
  ): 'ai_enhanced' | 'dictionary_lookup' | 'hybrid' {
    if (source === 'fallback') {
      return 'dictionary_lookup';
    }
    if (termMapSize > 0) {
      return 'hybrid';
    }
    return 'ai_enhanced';
  }
  private async fallbackTranslation(
    text: string,
    _context: TranslationContext,
  ): Promise<string> {
    // Implement fallback to basic translation service
    // This could be Google Translate, Azure Translator, etc.
    return text; // Placeholder
  }

  private checkLegalConsistency(
    _text: string,
    _context: TranslationContext,
  ): TranslationWarning[] {
    // Implement legal consistency checks
    return [];
  }

  private validateJurisdictionRequirements(
    _text: string,
    _context: TranslationContext,
  ): TranslationWarning[] {
    // Implement jurisdiction-specific validation
    return [];
  }

  private async refineByDocumentType(
    text: string,
    _context: TranslationContext,
  ): Promise<string> {
    // Implement document type-specific refinements
    return text;
  }

  private async getAlternativeTranslations(
    _term: string,
    _context: TranslationContext,
  ): Promise<
    Array<{
      term: string;
      reason: string;
      confidence: number;
      legalBasis?: string;
    }>
  > {
    // Implement alternative translation lookup
    return [];
  }
}

// Singleton instance
export const legalTranslationEngine = new LegalTranslationEngine();

// Convenience functions
export const translateLegalText = (text: string, context: TranslationContext) =>
  legalTranslationEngine.translateLegalText(text, context);

export default legalTranslationEngine;

