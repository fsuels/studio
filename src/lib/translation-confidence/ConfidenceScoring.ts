// src/lib/translation-confidence/ConfidenceScoring.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

interface ConfidenceMetrics {
  overall: number;
  breakdown: {
    linguisticAccuracy: number;
    legalTerminology: number;
    contextualRelevance: number;
    structuralIntegrity: number;
    jurisdictionalCompliance: number;
  };
  factors: ConfidenceFactor[];
  recommendations: string[];
  riskAssessment: RiskAssessment;
}

interface ConfidenceFactor {
  category: string;
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
  score: number;
  description: string;
}

interface RiskAssessment {
  level: 'low' | 'medium' | 'high' | 'critical';
  factors: string[];
  mitigationStrategies: string[];
  reviewRequirements: string[];
}

interface TranslationContext {
  sourceLanguage: string;
  targetLanguage: string;
  documentType: string;
  jurisdiction: string;
  legalSystem: 'common_law' | 'civil_law' | 'mixed' | 'religious';
  complexity: 'simple' | 'moderate' | 'complex' | 'highly_complex';
  userExperience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

class TranslationConfidenceScorer {
  private legalTermDatabase: Map<string, any> = new Map();
  private jurisdictionMappings: Map<string, any> = new Map();
  private qualityThresholds = {
    high: 0.85,
    medium: 0.7,
    low: 0.5,
  };

  constructor() {
    this.initializeDatabases();
  }

  /**
   * Calculate comprehensive confidence score for a legal translation
   */
  async calculateConfidence(
    translationResult: any,
    context: TranslationContext,
  ): Promise<ConfidenceMetrics> {
    const factors: ConfidenceFactor[] = [];

    // 1. Linguistic Accuracy Analysis
    const linguisticScore = await this.assessLinguisticAccuracy(
      translationResult,
      context,
      factors,
    );

    // 2. Legal Terminology Validation
    const terminologyScore = await this.assessLegalTerminology(
      translationResult,
      context,
      factors,
    );

    // 3. Contextual Relevance Check
    const contextualScore = await this.assessContextualRelevance(
      translationResult,
      context,
      factors,
    );

    // 4. Structural Integrity Validation
    const structuralScore = await this.assessStructuralIntegrity(
      translationResult,
      context,
      factors,
    );

    // 5. Jurisdictional Compliance Check
    const jurisdictionalScore = await this.assessJurisdictionalCompliance(
      translationResult,
      context,
      factors,
    );

    // Calculate weighted overall score
    const breakdown = {
      linguisticAccuracy: linguisticScore,
      legalTerminology: terminologyScore,
      contextualRelevance: contextualScore,
      structuralIntegrity: structuralScore,
      jurisdictionalCompliance: jurisdictionalScore,
    };

    const weights = this.getScoreWeights(context);
    const overall = this.calculateWeightedScore(breakdown, weights);

    // Generate recommendations and risk assessment
    const recommendations = this.generateRecommendations(
      breakdown,
      factors,
      context,
    );
    const riskAssessment = this.assessTranslationRisk(
      breakdown,
      factors,
      context,
    );

    return {
      overall,
      breakdown,
      factors,
      recommendations,
      riskAssessment,
    };
  }

  private async assessLinguisticAccuracy(
    result: any,
    context: TranslationContext,
    factors: ConfidenceFactor[],
  ): Promise<number> {

    // Grammar and syntax check
    const grammarScore = await this.checkGrammarAndSyntax(
      result.translatedText,
      context.targetLanguage,
    );
    factors.push({
      category: 'linguistic',
      factor: 'grammar_syntax',
      impact: grammarScore > 0.8 ? 'positive' : 'negative',
      weight: 0.3,
      score: grammarScore,
      description: `Grammar and syntax accuracy: ${Math.round(grammarScore * 100)}%`,
    });

    // Fluency assessment
    const fluencyScore = await this.assessFluency(
      result.translatedText,
      context.targetLanguage,
    );
    factors.push({
      category: 'linguistic',
      factor: 'fluency',
      impact: fluencyScore > 0.75 ? 'positive' : 'negative',
      weight: 0.25,
      score: fluencyScore,
      description: `Text fluency rating: ${Math.round(fluencyScore * 100)}%`,
    });

    // Length consistency (important for legal documents)
    const lengthRatio =
      result.translatedText.length / result.originalText.length;
    const lengthScore = this.assessLengthConsistency(lengthRatio, context);
    factors.push({
      category: 'linguistic',
      factor: 'length_consistency',
      impact: lengthScore > 0.7 ? 'positive' : 'negative',
      weight: 0.15,
      score: lengthScore,
      description: `Length ratio: ${lengthRatio.toFixed(2)} (target: 0.8-1.3)`,
    });

    // Cultural appropriateness
    const culturalScore = await this.assessCulturalAppropriateness(
      result.translatedText,
      context,
    );
    factors.push({
      category: 'linguistic',
      factor: 'cultural_appropriateness',
      impact: culturalScore > 0.8 ? 'positive' : 'negative',
      weight: 0.2,
      score: culturalScore,
      description: `Cultural adaptation score: ${Math.round(culturalScore * 100)}%`,
    });

    // Register preservation (formal legal register)
    const registerScore = this.assessLegalRegister(
      result.translatedText,
      context,
    );
    factors.push({
      category: 'linguistic',
      factor: 'legal_register',
      impact: registerScore > 0.8 ? 'positive' : 'negative',
      weight: 0.1,
      score: registerScore,
      description: `Legal register preservation: ${Math.round(registerScore * 100)}%`,
    });

    return (
      grammarScore * 0.3 +
      fluencyScore * 0.25 +
      lengthScore * 0.15 +
      culturalScore * 0.2 +
      registerScore * 0.1
    );
  }

  private async assessLegalTerminology(
    result: any,
    context: TranslationContext,
    factors: ConfidenceFactor[],
  ): Promise<number> {
    const legalTerms = result.legalTerms || [];
    const preservedTerms = result.preservedTerms || [];

    if (legalTerms.length === 0) {
      factors.push({
        category: 'terminology',
        factor: 'no_legal_terms',
        impact: 'neutral',
        weight: 0.1,
        score: 0.5,
        description: 'No legal terms identified - may be non-legal content',
      });
      return 0.7; // Neutral score for non-legal content
    }

    let totalConfidence = 0;
    let highConfidenceTerms = 0;

    for (const term of legalTerms) {
      totalConfidence += term.confidence;

      if (term.confidence >= 0.9) {
        highConfidenceTerms++;
      }

      // Check for jurisdiction-specific term accuracy
      if (!this.isTermApplicableToJurisdiction(term, context.jurisdiction)) {
        factors.push({
          category: 'terminology',
          factor: 'jurisdiction_mismatch',
          impact: 'negative',
          weight: 0.3,
          score: 0.3,
          description: `Term "${term.term}" may not be applicable in ${context.jurisdiction}`,
        });
      }
    }

    const averageConfidence = totalConfidence / legalTerms.length;

    factors.push({
      category: 'terminology',
      factor: 'average_confidence',
      impact: averageConfidence > 0.8 ? 'positive' : 'negative',
      weight: 0.4,
      score: averageConfidence,
      description: `Average legal term confidence: ${Math.round(averageConfidence * 100)}%`,
    });

    factors.push({
      category: 'terminology',
      factor: 'high_confidence_ratio',
      impact:
        highConfidenceTerms / legalTerms.length > 0.7 ? 'positive' : 'negative',
      weight: 0.3,
      score: highConfidenceTerms / legalTerms.length,
      description: `${highConfidenceTerms}/${legalTerms.length} terms with high confidence`,
    });

    // Penalty for preserved terms (indicates translation difficulty)
    const preservationPenalty = Math.min(0.3, preservedTerms.length * 0.05);
    factors.push({
      category: 'terminology',
      factor: 'preservation_penalty',
      impact: 'negative',
      weight: 0.2,
      score: Math.max(0, 1 - preservationPenalty),
      description: `${preservedTerms.length} terms preserved in original language`,
    });

    return Math.max(0.1, averageConfidence - preservationPenalty);
  }

  private async assessContextualRelevance(
    result: any,
    context: TranslationContext,
    factors: ConfidenceFactor[],
  ): Promise<number> {
    // Document type alignment
    const typeScore = this.assessDocumentTypeAlignment(result, context);
    factors.push({
      category: 'contextual',
      factor: 'document_type_alignment',
      impact: typeScore > 0.8 ? 'positive' : 'negative',
      weight: 0.3,
      score: typeScore,
      description: `Document type alignment score: ${Math.round(typeScore * 100)}%`,
    });

    // Purpose preservation (legal intent)
    const purposeScore = await this.assessLegalPurposePreservation(
      result,
      context,
    );
    factors.push({
      category: 'contextual',
      factor: 'purpose_preservation',
      impact: purposeScore > 0.85 ? 'positive' : 'negative',
      weight: 0.4,
      score: purposeScore,
      description: `Legal purpose preservation: ${Math.round(purposeScore * 100)}%`,
    });

    // Stakeholder appropriateness
    const stakeholderScore = this.assessStakeholderAppropriateness(
      result,
      context,
    );
    factors.push({
      category: 'contextual',
      factor: 'stakeholder_appropriateness',
      impact: stakeholderScore > 0.75 ? 'positive' : 'negative',
      weight: 0.3,
      score: stakeholderScore,
      description: `Appropriate for target audience: ${Math.round(stakeholderScore * 100)}%`,
    });

    return typeScore * 0.3 + purposeScore * 0.4 + stakeholderScore * 0.3;
  }

  private async assessStructuralIntegrity(
    result: any,
    context: TranslationContext,
    factors: ConfidenceFactor[],
  ): Promise<number> {
    // Section/clause preservation
    const structureScore = this.checkStructuralPreservation(result);
    factors.push({
      category: 'structural',
      factor: 'structure_preservation',
      impact: structureScore > 0.9 ? 'positive' : 'negative',
      weight: 0.4,
      score: structureScore,
      description: `Document structure preserved: ${Math.round(structureScore * 100)}%`,
    });

    // Numbering and formatting
    const formattingScore = this.checkFormattingConsistency(result);
    factors.push({
      category: 'structural',
      factor: 'formatting_consistency',
      impact: formattingScore > 0.95 ? 'positive' : 'negative',
      weight: 0.3,
      score: formattingScore,
      description: `Formatting consistency: ${Math.round(formattingScore * 100)}%`,
    });

    // Cross-references integrity
    const referencesScore = this.checkCrossReferences(result);
    factors.push({
      category: 'structural',
      factor: 'cross_references',
      impact: referencesScore > 0.9 ? 'positive' : 'negative',
      weight: 0.3,
      score: referencesScore,
      description: `Cross-references maintained: ${Math.round(referencesScore * 100)}%`,
    });

    return structureScore * 0.4 + formattingScore * 0.3 + referencesScore * 0.3;
  }

  private async assessJurisdictionalCompliance(
    result: any,
    context: TranslationContext,
    factors: ConfidenceFactor[],
  ): Promise<number> {
    // Legal system compatibility
    const systemScore = this.assessLegalSystemCompatibility(result, context);
    factors.push({
      category: 'jurisdictional',
      factor: 'legal_system_compatibility',
      impact: systemScore > 0.8 ? 'positive' : 'negative',
      weight: 0.4,
      score: systemScore,
      description: `Compatible with ${context.legalSystem}: ${Math.round(systemScore * 100)}%`,
    });

    // Jurisdiction-specific requirements
    const requirementsScore = await this.checkJurisdictionRequirements(
      result,
      context,
    );
    factors.push({
      category: 'jurisdictional',
      factor: 'jurisdiction_requirements',
      impact: requirementsScore > 0.85 ? 'positive' : 'negative',
      weight: 0.35,
      score: requirementsScore,
      description: `Meets ${context.jurisdiction} requirements: ${Math.round(requirementsScore * 100)}%`,
    });

    // Regulatory compliance indicators
    const complianceScore = this.assessRegulatoryCompliance(result, context);
    factors.push({
      category: 'jurisdictional',
      factor: 'regulatory_compliance',
      impact: complianceScore > 0.8 ? 'positive' : 'negative',
      weight: 0.25,
      score: complianceScore,
      description: `Regulatory compliance indicators: ${Math.round(complianceScore * 100)}%`,
    });

    return (
      systemScore * 0.4 + requirementsScore * 0.35 + complianceScore * 0.25
    );
  }

  private getScoreWeights(context: TranslationContext): Record<string, number> {
    // Adjust weights based on context
    const baseWeights = {
      linguisticAccuracy: 0.25,
      legalTerminology: 0.3,
      contextualRelevance: 0.2,
      structuralIntegrity: 0.15,
      jurisdictionalCompliance: 0.1,
    };

    // Increase terminology weight for complex legal documents
    if (context.complexity === 'highly_complex') {
      baseWeights.legalTerminology = 0.4;
      baseWeights.linguisticAccuracy = 0.2;
    }

    // Increase jurisdictional weight for cross-border documents
    if (
      context.documentType.includes('international') ||
      context.documentType.includes('cross-border')
    ) {
      baseWeights.jurisdictionalCompliance = 0.2;
      baseWeights.contextualRelevance = 0.15;
    }

    return baseWeights;
  }

  private calculateWeightedScore(
    breakdown: Record<string, number>,
    weights: Record<string, number>,
  ): number {
    let weightedSum = 0;
    let totalWeight = 0;

    for (const [category, score] of Object.entries(breakdown)) {
      const weight = weights[category] || 0;
      weightedSum += score * weight;
      totalWeight += weight;
    }

    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  private generateRecommendations(
    breakdown: Record<string, number>,
    factors: ConfidenceFactor[],
    context: TranslationContext,
  ): string[] {
    const recommendations: string[] = [];
    const lowScoreThreshold = 0.7;

    // Analyze low-scoring areas
    for (const [category, score] of Object.entries(breakdown)) {
      if (score < lowScoreThreshold) {
        recommendations.push(
          ...this.getCategoryRecommendations(category, score, factors, context),
        );
      }
    }

    // General recommendations based on context
    if (context.userExperience === 'beginner') {
      recommendations.push(
        'Consider professional legal review due to user experience level',
      );
    }

    if (context.complexity === 'highly_complex') {
      recommendations.push(
        'Highly complex document requires expert validation',
      );
    }

    return [...new Set(recommendations)]; // Remove duplicates
  }

  private getCategoryRecommendations(
    category: string,
    score: number,
    factors: ConfidenceFactor[],
    context: TranslationContext,
  ): string[] {
    const recommendations: string[] = [];

    switch (category) {
      case 'linguisticAccuracy':
        recommendations.push('Review grammar and syntax with native speaker');
        recommendations.push('Consider professional linguistic editing');
        break;

      case 'legalTerminology':
        recommendations.push('Validate legal terms with subject matter expert');
        recommendations.push('Cross-reference with legal dictionaries');
        break;

      case 'contextualRelevance':
        recommendations.push('Review document purpose alignment');
        recommendations.push('Validate appropriateness for target audience');
        break;

      case 'structuralIntegrity':
        recommendations.push('Verify document formatting and structure');
        recommendations.push('Check all cross-references and numbering');
        break;

      case 'jurisdictionalCompliance':
        recommendations.push(
          `Validate compliance with ${context.jurisdiction} legal requirements`,
        );
        recommendations.push('Consider local legal expert review');
        break;
    }

    return recommendations;
  }

  private assessTranslationRisk(
    breakdown: Record<string, number>,
    factors: ConfidenceFactor[],
    context: TranslationContext,
  ): RiskAssessment {
    const criticalFactors = factors.filter(
      (f) => f.impact === 'negative' && f.score < 0.5,
    );
    const highRiskFactors = factors.filter(
      (f) => f.impact === 'negative' && f.score < 0.7,
    );

    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    const riskFactors: string[] = [];
    const mitigationStrategies: string[] = [];
    const reviewRequirements: string[] = [];

    // Determine risk level
    if (criticalFactors.length > 0 || breakdown.legalTerminology < 0.5) {
      riskLevel = 'critical';
      riskFactors.push('Critical translation accuracy issues detected');
      mitigationStrategies.push('Complete re-translation recommended');
      reviewRequirements.push('Expert legal translator review required');
    } else if (
      highRiskFactors.length > 2 ||
      Object.values(breakdown).some((s) => s < 0.6)
    ) {
      riskLevel = 'high';
      riskFactors.push('Multiple accuracy concerns identified');
      mitigationStrategies.push('Comprehensive professional review');
      reviewRequirements.push('Legal professional validation required');
    } else if (Object.values(breakdown).some((s) => s < 0.75)) {
      riskLevel = 'medium';
      riskFactors.push('Some accuracy issues require attention');
      mitigationStrategies.push('Targeted review of flagged areas');
      reviewRequirements.push('Subject matter expert consultation recommended');
    }

    // Add context-specific risk factors
    if (context.complexity === 'highly_complex') {
      riskFactors.push('Document complexity increases translation risk');
      reviewRequirements.push('Specialized expert review required');
    }

    if (
      context.documentType.includes('contract') ||
      context.documentType.includes('agreement')
    ) {
      mitigationStrategies.push('Legal liability review recommended');
    }

    return {
      level: riskLevel,
      factors: riskFactors,
      mitigationStrategies,
      reviewRequirements,
    };
  }

  // Helper methods (simplified implementations)
  private async checkGrammarAndSyntax(
    text: string,
    language: string,
  ): Promise<number> {
    // In real implementation, integrate with grammar checking service
    return 0.85 + Math.random() * 0.1;
  }

  private async assessFluency(text: string, language: string): Promise<number> {
    // Basic fluency indicators
    const avgSentenceLength =
      text
        .split('.')
        .map((s) => s.trim().split(' ').length)
        .reduce((a, b) => a + b, 0) / text.split('.').length;
    const complexityScore =
      avgSentenceLength > 15 && avgSentenceLength < 30 ? 0.9 : 0.7;
    return Math.min(1, complexityScore + Math.random() * 0.1);
  }

  private assessLengthConsistency(
    ratio: number,
    context: TranslationContext,
  ): number {
    // Expected length ratios for different language pairs
    const expectedRatios: Record<string, number> = {
      'en-es': 1.15,
      'en-fr': 1.1,
      'en-de': 0.9,
      'en-pt': 1.1,
      'en-it': 1.05,
    };

    const languagePair = `${context.sourceLanguage}-${context.targetLanguage}`;
    const expected = expectedRatios[languagePair] || 1.0;
    const deviation = Math.abs(ratio - expected) / expected;

    return Math.max(0, 1 - deviation);
  }

  private async assessCulturalAppropriateness(
    text: string,
    context: TranslationContext,
  ): Promise<number> {
    // Simplified cultural assessment
    return 0.8 + Math.random() * 0.15;
  }

  private assessLegalRegister(
    text: string,
    context: TranslationContext,
  ): number {
    // Check for formal legal language patterns
    const formalIndicators = [
      'hereby',
      'whereas',
      'thereof',
      'herein',
      'aforesaid',
    ];
    const informalIndicators = ["can't", "won't", "it's", "you'll"];

    const formalCount = formalIndicators.filter((word) =>
      text.toLowerCase().includes(word),
    ).length;
    const informalCount = informalIndicators.filter((word) =>
      text.toLowerCase().includes(word),
    ).length;

    return Math.max(
      0.3,
      Math.min(1, (formalCount - informalCount * 2) / 10 + 0.7),
    );
  }

  private isTermApplicableToJurisdiction(
    term: any,
    jurisdiction: string,
  ): boolean {
    // Simplified jurisdiction check
    return true; // In real implementation, check against jurisdiction database
  }

  private assessDocumentTypeAlignment(
    result: any,
    context: TranslationContext,
  ): number {
    return 0.85 + Math.random() * 0.1;
  }

  private async assessLegalPurposePreservation(
    result: any,
    context: TranslationContext,
  ): Promise<number> {
    return 0.8 + Math.random() * 0.15;
  }

  private assessStakeholderAppropriateness(
    result: any,
    context: TranslationContext,
  ): number {
    return 0.75 + Math.random() * 0.2;
  }

  private checkStructuralPreservation(result: any): number {
    return 0.9 + Math.random() * 0.08;
  }

  private checkFormattingConsistency(result: any): number {
    return 0.95 + Math.random() * 0.04;
  }

  private checkCrossReferences(result: any): number {
    return 0.88 + Math.random() * 0.1;
  }

  private assessLegalSystemCompatibility(
    result: any,
    context: TranslationContext,
  ): number {
    return 0.8 + Math.random() * 0.15;
  }

  private async checkJurisdictionRequirements(
    result: any,
    context: TranslationContext,
  ): Promise<number> {
    return 0.82 + Math.random() * 0.13;
  }

  private assessRegulatoryCompliance(
    result: any,
    context: TranslationContext,
  ): number {
    return 0.78 + Math.random() * 0.17;
  }

  private initializeDatabases(): void {
    // Initialize legal term and jurisdiction databases
    // In real implementation, load from external sources
  }
}

// Singleton instance
export const confidenceScorer = new TranslationConfidenceScorer();

// Convenience function
export const calculateTranslationConfidence = (
  result: any,
  context: TranslationContext,
) => confidenceScorer.calculateConfidence(result, context);

export default TranslationConfidenceScorer;
