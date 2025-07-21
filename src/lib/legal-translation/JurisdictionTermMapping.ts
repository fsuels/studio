// src/lib/legal-translation/JurisdictionTermMapping.ts

interface JurisdictionMapping {
  sourceJurisdiction: string;
  targetJurisdiction: string;
  legalSystem: 'common_law' | 'civil_law' | 'mixed' | 'religious' | 'socialist';
  compatibility: 'high' | 'medium' | 'low' | 'incompatible';
  termMappings: TermMapping[];
  conflictAreas: ConflictArea[];
  adaptationRules: AdaptationRule[];
}

interface TermMapping {
  sourceTerm: string;
  targetTerm: string;
  confidence: number;
  category:
    | 'direct_equivalent'
    | 'functional_equivalent'
    | 'approximate'
    | 'no_equivalent';
  contextRequired: boolean;
  explanationNeeded: boolean;
  alternativeTerms: string[];
  usage: TermUsage;
  verification: TermVerification;
}

interface TermUsage {
  frequency: 'common' | 'occasional' | 'rare' | 'archaic';
  formality: 'formal' | 'semi_formal' | 'informal';
  contexts: string[];
  restrictions: string[];
}

interface TermVerification {
  sources: string[];
  lastVerified: Date;
  verifiedBy: string;
  reliability: 'verified' | 'probable' | 'uncertain' | 'deprecated';
}

interface ConflictArea {
  conceptName: string;
  description: string;
  sourceDefinition: string;
  targetDefinition: string;
  conflictType: 'conceptual' | 'procedural' | 'institutional' | 'cultural';
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  resolutionStrategy: string;
  examples: string[];
}

interface AdaptationRule {
  id: string;
  name: string;
  description: string;
  applicableTerms: string[];
  rule: string;
  examples: AdaptationExample[];
  priority: number;
}

interface AdaptationExample {
  originalContext: string;
  adaptedContext: string;
  explanation: string;
}

interface JurisdictionProfile {
  jurisdiction: string;
  legalSystem: string;
  primaryLanguage: string;
  secondaryLanguages: string[];
  documentTypes: string[];
  institutionalStructure: InstitutionalStructure;
  legalConcepts: ConceptualFramework;
  procedureTypes: ProcedureType[];
}

interface InstitutionalStructure {
  courts: CourtSystem[];
  legislativeBody: string;
  executiveBranch: string;
  legalProfessions: string[];
}

interface CourtSystem {
  name: string;
  level: string;
  jurisdiction: string;
  specializations: string[];
}

interface ConceptualFramework {
  propertyRights: string[];
  contractLaw: string[];
  criminalLaw: string[];
  familyLaw: string[];
  commercialLaw: string[];
}

interface ProcedureType {
  name: string;
  description: string;
  stages: string[];
  participants: string[];
  timeframe: string;
}

class JurisdictionTermMappingEngine {
  private mappingDatabase: Map<string, JurisdictionMapping> = new Map();
  private jurisdictionProfiles: Map<string, JurisdictionProfile> = new Map();
  private termDatabase: Map<string, any> = new Map();
  private adaptationRules: Map<string, AdaptationRule[]> = new Map();

  constructor() {
    this.initializeJurisdictionData();
    this.loadTermMappings();
    this.setupAdaptationRules();
  }

  /**
   * Get term mappings between jurisdictions
   */
  async getJurisdictionMapping(
    sourceJurisdiction: string,
    targetJurisdiction: string,
    documentType?: string,
  ): Promise<JurisdictionMapping | null> {
    const mappingKey = `${sourceJurisdiction}->${targetJurisdiction}`;

    // Check if mapping exists in cache
    if (this.mappingDatabase.has(mappingKey)) {
      return this.mappingDatabase.get(mappingKey)!;
    }

    // Generate new mapping
    const mapping = await this.generateJurisdictionMapping(
      sourceJurisdiction,
      targetJurisdiction,
      documentType,
    );

    // Cache the mapping
    if (mapping) {
      this.mappingDatabase.set(mappingKey, mapping);
    }

    return mapping;
  }

  /**
   * Map a specific legal term from source to target jurisdiction
   */
  async mapLegalTerm(
    term: string,
    sourceJurisdiction: string,
    targetJurisdiction: string,
    context?: string,
  ): Promise<TermMapping | null> {
    const jurisdictionMapping = await this.getJurisdictionMapping(
      sourceJurisdiction,
      targetJurisdiction,
    );

    if (!jurisdictionMapping) {
      return null;
    }

    // Find exact term mapping
    let termMapping = jurisdictionMapping.termMappings.find(
      (mapping) => mapping.sourceTerm.toLowerCase() === term.toLowerCase(),
    );

    if (!termMapping) {
      // Try to find partial matches or generate new mapping
      termMapping = await this.generateTermMapping(
        term,
        sourceJurisdiction,
        targetJurisdiction,
        context,
      );
    }

    return termMapping || null;
  }

  /**
   * Get all conflict areas between jurisdictions
   */
  async getJurisdictionConflicts(
    sourceJurisdiction: string,
    targetJurisdiction: string,
  ): Promise<ConflictArea[]> {
    const mapping = await this.getJurisdictionMapping(
      sourceJurisdiction,
      targetJurisdiction,
    );
    return mapping?.conflictAreas || [];
  }

  /**
   * Apply adaptation rules to a translated text
   */
  async applyAdaptationRules(
    text: string,
    sourceJurisdiction: string,
    targetJurisdiction: string,
    documentType: string,
  ): Promise<{
    adaptedText: string;
    appliedRules: AdaptationRule[];
    warnings: string[];
  }> {
    const rulesKey = `${sourceJurisdiction}->${targetJurisdiction}`;
    const applicableRules = this.adaptationRules.get(rulesKey) || [];

    let adaptedText = text;
    const appliedRules: AdaptationRule[] = [];
    const warnings: string[] = [];

    // Apply rules in priority order
    const sortedRules = applicableRules.sort((a, b) => b.priority - a.priority);

    for (const rule of sortedRules) {
      const result = await this.applyAdaptationRule(
        adaptedText,
        rule,
        documentType,
      );

      if (result.applied) {
        adaptedText = result.adaptedText;
        appliedRules.push(rule);

        if (result.warnings) {
          warnings.push(...result.warnings);
        }
      }
    }

    return {
      adaptedText,
      appliedRules,
      warnings,
    };
  }

  /**
   * Validate jurisdiction compatibility
   */
  async validateJurisdictionCompatibility(
    sourceJurisdiction: string,
    targetJurisdiction: string,
  ): Promise<{
    compatible: boolean;
    compatibility: string;
    issues: string[];
    recommendations: string[];
  }> {
    const sourceProfile = this.jurisdictionProfiles.get(sourceJurisdiction);
    const targetProfile = this.jurisdictionProfiles.get(targetJurisdiction);

    if (!sourceProfile || !targetProfile) {
      return {
        compatible: false,
        compatibility: 'incompatible',
        issues: ['Unknown jurisdiction(s)'],
        recommendations: ['Verify jurisdiction codes and availability'],
      };
    }

    const issues: string[] = [];
    const recommendations: string[] = [];

    // Legal system compatibility
    if (sourceProfile.legalSystem !== targetProfile.legalSystem) {
      issues.push(
        `Different legal systems: ${sourceProfile.legalSystem} vs ${targetProfile.legalSystem}`,
      );
      recommendations.push(
        'Legal expert review required for cross-system translation',
      );
    }

    // Language compatibility
    const languageCompatible =
      sourceProfile.primaryLanguage === targetProfile.primaryLanguage ||
      targetProfile.secondaryLanguages.includes(sourceProfile.primaryLanguage);

    if (!languageCompatible) {
      issues.push('No common language between jurisdictions');
      recommendations.push(
        'Professional translation and cultural adaptation required',
      );
    }

    // Determine overall compatibility
    let compatibility: string;
    let compatible: boolean;

    if (issues.length === 0) {
      compatibility = 'high';
      compatible = true;
    } else if (issues.length <= 2) {
      compatibility = 'medium';
      compatible = true;
      recommendations.push('Careful review and adaptation recommended');
    } else if (issues.length <= 4) {
      compatibility = 'low';
      compatible = false;
      recommendations.push('Extensive legal and cultural adaptation required');
    } else {
      compatibility = 'incompatible';
      compatible = false;
      recommendations.push(
        'Translation not recommended without significant legal restructuring',
      );
    }

    return {
      compatible,
      compatibility,
      issues,
      recommendations,
    };
  }

  /**
   * Get jurisdiction-specific term suggestions
   */
  async getJurisdictionTermSuggestions(
    term: string,
    targetJurisdiction: string,
    category?: string,
  ): Promise<
    Array<{
      term: string;
      definition: string;
      confidence: number;
      usage: string;
      source: string;
    }>
  > {
    const suggestions: Array<{
      term: string;
      definition: string;
      confidence: number;
      usage: string;
      source: string;
    }> = [];

    // Get jurisdiction-specific terms
    const profile = this.jurisdictionProfiles.get(targetJurisdiction);
    if (!profile) return suggestions;

    // Search for similar terms in jurisdiction's legal framework
    const conceptualFramework = profile.legalConcepts;

    for (const [categoryName, terms] of Object.entries(conceptualFramework)) {
      if (category && categoryName !== category) continue;

      for (const jurisdictionTerm of terms) {
        if (this.isTermSimilar(term, jurisdictionTerm)) {
          suggestions.push({
            term: jurisdictionTerm,
            definition: await this.getTermDefinition(
              jurisdictionTerm,
              targetJurisdiction,
            ),
            confidence: this.calculateTermSimilarity(term, jurisdictionTerm),
            usage: categoryName,
            source: targetJurisdiction,
          });
        }
      }
    }

    // Sort by confidence
    return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 10);
  }

  private async generateJurisdictionMapping(
    sourceJurisdiction: string,
    targetJurisdiction: string,
    documentType?: string,
  ): Promise<JurisdictionMapping | null> {
    const sourceProfile = this.jurisdictionProfiles.get(sourceJurisdiction);
    const targetProfile = this.jurisdictionProfiles.get(targetJurisdiction);

    if (!sourceProfile || !targetProfile) {
      return null;
    }

    // Determine legal system compatibility
    const compatibility = this.determineLegalSystemCompatibility(
      sourceProfile.legalSystem,
      targetProfile.legalSystem,
    );

    // Generate term mappings
    const termMappings = await this.generateTermMappings(
      sourceProfile,
      targetProfile,
      documentType,
    );

    // Identify conflict areas
    const conflictAreas = this.identifyConflictAreas(
      sourceProfile,
      targetProfile,
    );

    // Generate adaptation rules
    const adaptationRules = this.generateAdaptationRules(
      sourceProfile,
      targetProfile,
    );

    return {
      sourceJurisdiction,
      targetJurisdiction,
      legalSystem: targetProfile.legalSystem as any,
      compatibility,
      termMappings,
      conflictAreas,
      adaptationRules,
    };
  }

  private async generateTermMapping(
    term: string,
    sourceJurisdiction: string,
    targetJurisdiction: string,
    context?: string,
  ): Promise<TermMapping | null> {
    // Attempt to find equivalent term in target jurisdiction
    const suggestions = await this.getJurisdictionTermSuggestions(
      term,
      targetJurisdiction,
    );

    if (suggestions.length === 0) {
      return {
        sourceTerm: term,
        targetTerm: term, // Preserve original term
        confidence: 0.3,
        category: 'no_equivalent',
        contextRequired: true,
        explanationNeeded: true,
        alternativeTerms: [],
        usage: {
          frequency: 'rare',
          formality: 'formal',
          contexts: [context || 'legal'],
          restrictions: ['Requires explanation in target jurisdiction'],
        },
        verification: {
          sources: ['AI_generated'],
          lastVerified: new Date(),
          verifiedBy: 'system',
          reliability: 'uncertain',
        },
      };
    }

    const bestMatch = suggestions[0];

    return {
      sourceTerm: term,
      targetTerm: bestMatch.term,
      confidence: bestMatch.confidence,
      category:
        bestMatch.confidence > 0.8
          ? 'direct_equivalent'
          : bestMatch.confidence > 0.6
            ? 'functional_equivalent'
            : 'approximate',
      contextRequired: bestMatch.confidence < 0.8,
      explanationNeeded: bestMatch.confidence < 0.6,
      alternativeTerms: suggestions.slice(1, 4).map((s) => s.term),
      usage: {
        frequency: 'common',
        formality: 'formal',
        contexts: [bestMatch.usage],
        restrictions: [],
      },
      verification: {
        sources: [bestMatch.source],
        lastVerified: new Date(),
        verifiedBy: 'system',
        reliability: 'probable',
      },
    };
  }

  private async applyAdaptationRule(
    text: string,
    rule: AdaptationRule,
    documentType: string,
  ): Promise<{
    applied: boolean;
    adaptedText: string;
    warnings?: string[];
  }> {
    // Check if rule applies to any terms in the text
    const applicableTerms = rule.applicableTerms.filter((term) =>
      text.toLowerCase().includes(term.toLowerCase()),
    );

    if (applicableTerms.length === 0) {
      return { applied: false, adaptedText: text };
    }

    let adaptedText = text;
    const warnings: string[] = [];

    // Apply the adaptation rule
    for (const term of applicableTerms) {
      // Simple implementation - in real system, would use more sophisticated NLP
      const regex = new RegExp(`\\b${term}\\b`, 'gi');

      if (regex.test(adaptedText)) {
        // Find appropriate adaptation from examples
        const example = rule.examples.find((ex) =>
          ex.originalContext.toLowerCase().includes(documentType.toLowerCase()),
        );

        if (example) {
          adaptedText = adaptedText.replace(regex, example.adaptedContext);
          warnings.push(
            `Applied adaptation rule: ${rule.name} for term "${term}"`,
          );
        }
      }
    }

    return {
      applied: adaptedText !== text,
      adaptedText,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  private determineLegalSystemCompatibility(
    sourceSystem: string,
    targetSystem: string,
  ): 'high' | 'medium' | 'low' | 'incompatible' {
    if (sourceSystem === targetSystem) return 'high';

    const compatibilityMatrix: Record<string, Record<string, string>> = {
      common_law: {
        mixed: 'medium',
        civil_law: 'low',
        religious: 'low',
        socialist: 'incompatible',
      },
      civil_law: {
        mixed: 'medium',
        common_law: 'low',
        religious: 'low',
        socialist: 'medium',
      },
      mixed: {
        common_law: 'medium',
        civil_law: 'medium',
        religious: 'low',
        socialist: 'low',
      },
    };

    return (
      (compatibilityMatrix[sourceSystem]?.[targetSystem] as any) ||
      'incompatible'
    );
  }

  private async generateTermMappings(
    sourceProfile: JurisdictionProfile,
    targetProfile: JurisdictionProfile,
    documentType?: string,
  ): Promise<TermMapping[]> {
    const mappings: TermMapping[] = [];

    // Compare conceptual frameworks
    for (const [category, sourceTerms] of Object.entries(
      sourceProfile.legalConcepts,
    )) {
      const targetTerms = (targetProfile.legalConcepts as any)[category] || [];

      for (const sourceTerm of sourceTerms) {
        // Find best match in target terms
        const bestMatch = this.findBestTermMatch(sourceTerm, targetTerms);

        if (bestMatch) {
          mappings.push({
            sourceTerm,
            targetTerm: bestMatch.term,
            confidence: bestMatch.confidence,
            category:
              bestMatch.confidence > 0.8
                ? 'direct_equivalent'
                : 'functional_equivalent',
            contextRequired: bestMatch.confidence < 0.8,
            explanationNeeded: bestMatch.confidence < 0.6,
            alternativeTerms: [],
            usage: {
              frequency: 'common',
              formality: 'formal',
              contexts: [category],
              restrictions: [],
            },
            verification: {
              sources: [targetProfile.jurisdiction],
              lastVerified: new Date(),
              verifiedBy: 'system',
              reliability: 'probable',
            },
          });
        }
      }
    }

    return mappings;
  }

  private identifyConflictAreas(
    sourceProfile: JurisdictionProfile,
    targetProfile: JurisdictionProfile,
  ): ConflictArea[] {
    const conflicts: ConflictArea[] = [];

    // Different legal systems always create conceptual conflicts
    if (sourceProfile.legalSystem !== targetProfile.legalSystem) {
      conflicts.push({
        conceptName: 'Legal System Paradigm',
        description: `Fundamental difference between ${sourceProfile.legalSystem} and ${targetProfile.legalSystem} systems`,
        sourceDefinition: `Based on ${sourceProfile.legalSystem} principles`,
        targetDefinition: `Based on ${targetProfile.legalSystem} principles`,
        conflictType: 'conceptual',
        severity: 'major',
        resolutionStrategy: 'Extensive adaptation and explanation required',
        examples: [
          'Precedent vs. Code',
          'Judge vs. Magistrate roles',
          'Jury vs. Professional judges',
        ],
      });
    }

    // Compare institutional structures
    if (
      sourceProfile.institutionalStructure.courts.length !==
      targetProfile.institutionalStructure.courts.length
    ) {
      conflicts.push({
        conceptName: 'Court System Structure',
        description: 'Different court hierarchies and specializations',
        sourceDefinition: `${sourceProfile.institutionalStructure.courts.length} court levels`,
        targetDefinition: `${targetProfile.institutionalStructure.courts.length} court levels`,
        conflictType: 'institutional',
        severity: 'moderate',
        resolutionStrategy:
          'Map equivalent court levels and explain differences',
        examples: [
          'District vs. Regional courts',
          'Supreme vs. Constitutional courts',
        ],
      });
    }

    return conflicts;
  }

  private generateAdaptationRules(
    sourceProfile: JurisdictionProfile,
    targetProfile: JurisdictionProfile,
  ): AdaptationRule[] {
    const rules: AdaptationRule[] = [];

    // Currency adaptation rule
    if (sourceProfile.jurisdiction !== targetProfile.jurisdiction) {
      rules.push({
        id: 'currency_adaptation',
        name: 'Currency Adaptation',
        description: 'Adapt currency references to target jurisdiction',
        applicableTerms: ['dollar', 'USD', 'currency', 'payment'],
        rule: 'Replace currency references with target jurisdiction equivalent',
        examples: [
          {
            originalContext: 'Payment of $1000 USD',
            adaptedContext: 'Payment of [TARGET_CURRENCY] equivalent',
            explanation: 'Currency adapted for target jurisdiction',
          },
        ],
        priority: 8,
      });
    }

    // Court system adaptation
    if (sourceProfile.legalSystem !== targetProfile.legalSystem) {
      rules.push({
        id: 'court_system_adaptation',
        name: 'Court System Adaptation',
        description: 'Adapt court references to target jurisdiction structure',
        applicableTerms: ['court', 'judge', 'tribunal', 'magistrate'],
        rule: 'Replace court system references with target jurisdiction equivalents',
        examples: [
          {
            originalContext: 'District Court jurisdiction',
            adaptedContext: '[TARGET_COURT_EQUIVALENT] jurisdiction',
            explanation: 'Court system adapted for target legal framework',
          },
        ],
        priority: 9,
      });
    }

    return rules;
  }

  private findBestTermMatch(
    sourceTerm: string,
    targetTerms: string[],
  ): { term: string; confidence: number } | null {
    if (targetTerms.length === 0) return null;

    let bestMatch = targetTerms[0];
    let bestConfidence = this.calculateTermSimilarity(sourceTerm, bestMatch);

    for (const targetTerm of targetTerms.slice(1)) {
      const confidence = this.calculateTermSimilarity(sourceTerm, targetTerm);
      if (confidence > bestConfidence) {
        bestMatch = targetTerm;
        bestConfidence = confidence;
      }
    }

    return bestConfidence > 0.3
      ? { term: bestMatch, confidence: bestConfidence }
      : null;
  }

  private isTermSimilar(term1: string, term2: string): boolean {
    return this.calculateTermSimilarity(term1, term2) > 0.3;
  }

  private calculateTermSimilarity(term1: string, term2: string): number {
    // Simple similarity calculation - in real implementation, use more sophisticated NLP
    const lower1 = term1.toLowerCase();
    const lower2 = term2.toLowerCase();

    if (lower1 === lower2) return 1.0;
    if (lower1.includes(lower2) || lower2.includes(lower1)) return 0.8;

    // Calculate edit distance-based similarity
    const maxLength = Math.max(term1.length, term2.length);
    const editDistance = this.levenshteinDistance(lower1, lower2);

    return Math.max(0, 1 - editDistance / maxLength);
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1,
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  private async getTermDefinition(
    term: string,
    jurisdiction: string,
  ): Promise<string> {
    // In real implementation, fetch from legal dictionary
    return `Legal definition of "${term}" in ${jurisdiction} jurisdiction`;
  }

  private initializeJurisdictionData(): void {
    // Initialize with sample jurisdiction profiles
    const usProfile: JurisdictionProfile = {
      jurisdiction: 'US-ALL',
      legalSystem: 'common_law',
      primaryLanguage: 'en',
      secondaryLanguages: ['es'],
      documentTypes: ['contract', 'agreement', 'litigation', 'regulatory'],
      institutionalStructure: {
        courts: [
          {
            name: 'Supreme Court',
            level: 'federal',
            jurisdiction: 'national',
            specializations: ['constitutional'],
          },
          {
            name: 'Circuit Courts',
            level: 'federal',
            jurisdiction: 'regional',
            specializations: ['appeals'],
          },
          {
            name: 'District Courts',
            level: 'federal',
            jurisdiction: 'local',
            specializations: ['trial'],
          },
        ],
        legislativeBody: 'Congress',
        executiveBranch: 'Executive',
        legalProfessions: ['attorney', 'lawyer', 'counsel'],
      },
      legalConcepts: {
        propertyRights: ['fee simple', 'easement', 'mortgage', 'lien'],
        contractLaw: ['consideration', 'offer', 'acceptance', 'breach'],
        criminalLaw: [
          'felony',
          'misdemeanor',
          'plea bargain',
          'miranda rights',
        ],
        familyLaw: ['custody', 'alimony', 'prenuptial', 'adoption'],
        commercialLaw: ['partnership', 'corporation', 'LLC', 'securities'],
      },
      procedureTypes: [
        {
          name: 'Civil Litigation',
          description: 'Dispute resolution between private parties',
          stages: ['filing', 'discovery', 'trial', 'judgment'],
          participants: ['plaintiff', 'defendant', 'attorney', 'judge'],
          timeframe: '6-24 months',
        },
      ],
    };

    const esProfile: JurisdictionProfile = {
      jurisdiction: 'ES',
      legalSystem: 'civil_law',
      primaryLanguage: 'es',
      secondaryLanguages: ['en'],
      documentTypes: ['contrato', 'acuerdo', 'litigio', 'regulatorio'],
      institutionalStructure: {
        courts: [
          {
            name: 'Tribunal Supremo',
            level: 'nacional',
            jurisdiction: 'nacional',
            specializations: ['casación'],
          },
          {
            name: 'Audiencias Provinciales',
            level: 'provincial',
            jurisdiction: 'provincial',
            specializations: ['apelación'],
          },
          {
            name: 'Juzgados de Primera Instancia',
            level: 'local',
            jurisdiction: 'local',
            specializations: ['primera instancia'],
          },
        ],
        legislativeBody: 'Cortes Generales',
        executiveBranch: 'Gobierno',
        legalProfessions: ['abogado', 'procurador', 'notario'],
      },
      legalConcepts: {
        propertyRights: ['propiedad', 'servidumbre', 'hipoteca', 'embargo'],
        contractLaw: [
          'contraprestación',
          'oferta',
          'aceptación',
          'incumplimiento',
        ],
        criminalLaw: [
          'delito',
          'falta',
          'conformidad',
          'derechos fundamentales',
        ],
        familyLaw: [
          'custodia',
          'pensión alimenticia',
          'capitulaciones',
          'adopción',
        ],
        commercialLaw: ['sociedad', 'corporación', 'SL', 'valores'],
      },
      procedureTypes: [
        {
          name: 'Proceso Civil',
          description: 'Resolución de disputas entre partes privadas',
          stages: ['demanda', 'instrucción', 'juicio', 'sentencia'],
          participants: ['demandante', 'demandado', 'abogado', 'juez'],
          timeframe: '8-18 meses',
        },
      ],
    };

    this.jurisdictionProfiles.set('US-ALL', usProfile);
    this.jurisdictionProfiles.set('ES', esProfile);
  }

  private loadTermMappings(): void {
    // Load pre-defined term mappings
    // In real implementation, this would load from a database
  }

  private setupAdaptationRules(): void {
    // Setup adaptation rules for different jurisdiction pairs
    // In real implementation, this would be more comprehensive
  }
}

// Singleton instance
export const jurisdictionMapper = new JurisdictionTermMappingEngine();

// Convenience functions
export const getJurisdictionMapping = (
  source: string,
  target: string,
  docType?: string,
) => jurisdictionMapper.getJurisdictionMapping(source, target, docType);

export const mapLegalTerm = (
  term: string,
  source: string,
  target: string,
  context?: string,
) => jurisdictionMapper.mapLegalTerm(term, source, target, context);

export const validateJurisdictions = (source: string, target: string) =>
  jurisdictionMapper.validateJurisdictionCompatibility(source, target);

export default JurisdictionTermMappingEngine;
