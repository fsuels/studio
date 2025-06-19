// AI-Powered Document Analysis System
// Analyzes uploaded legal documents and provides intelligent insights

interface DocumentAnalysis {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  analysisResults: {
    documentType: string;
    confidence: number;
    keyTerms: Array<{
      term: string;
      frequency: number;
      importance: 'high' | 'medium' | 'low';
      definition?: string;
    }>;
    legalIssues: Array<{
      issue: string;
      severity: 'critical' | 'warning' | 'info';
      description: string;
      recommendation: string;
      affectedClauses: string[];
    }>;
    complianceCheck: {
      jurisdiction: string;
      complianceScore: number;
      missingElements: string[];
      recommendedImprovements: string[];
    };
    riskAssessment: {
      overallRisk: 'low' | 'medium' | 'high' | 'critical';
      riskFactors: Array<{
        factor: string;
        impact: number;
        mitigation: string;
      }>;
    };
    suggestions: Array<{
      type: 'improvement' | 'addition' | 'revision';
      priority: 'high' | 'medium' | 'low';
      suggestion: string;
      reasoning: string;
    }>;
  };
  processingTime: number;
}

interface LegalClause {
  id: string;
  name: string;
  category: string;
  text: string;
  isRequired: boolean;
  jurisdictions: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export class AIDocumentAnalyzer {
  private static instance: AIDocumentAnalyzer;
  private analysisCache: Map<string, DocumentAnalysis> = new Map();
  private legalClauses: LegalClause[] = [];

  constructor() {
    this.initializeLegalClauses();
  }

  static getInstance(): AIDocumentAnalyzer {
    if (!AIDocumentAnalyzer.instance) {
      AIDocumentAnalyzer.instance = new AIDocumentAnalyzer();
    }
    return AIDocumentAnalyzer.instance;
  }

  // Initialize legal clauses database
  private initializeLegalClauses() {
    this.legalClauses = [
      {
        id: 'termination_clause',
        name: 'Termination Clause',
        category: 'Employment',
        text: 'Either party may terminate this agreement with [X] days written notice',
        isRequired: true,
        jurisdictions: ['all'],
        riskLevel: 'high'
      },
      {
        id: 'intellectual_property',
        name: 'Intellectual Property Rights',
        category: 'Business',
        text: 'All intellectual property created during employment belongs to the company',
        isRequired: true,
        jurisdictions: ['all'],
        riskLevel: 'high'
      },
      {
        id: 'confidentiality_clause',
        name: 'Confidentiality Agreement',
        category: 'Business',
        text: 'Employee agrees to maintain confidentiality of proprietary information',
        isRequired: true,
        jurisdictions: ['all'],
        riskLevel: 'medium'
      },
      {
        id: 'governing_law',
        name: 'Governing Law Clause',
        category: 'General',
        text: 'This agreement shall be governed by the laws of [State]',
        isRequired: true,
        jurisdictions: ['all'],
        riskLevel: 'medium'
      },
      {
        id: 'dispute_resolution',
        name: 'Dispute Resolution',
        category: 'General',
        text: 'Disputes shall be resolved through binding arbitration',
        isRequired: false,
        jurisdictions: ['all'],
        riskLevel: 'low'
      },
      {
        id: 'force_majeure',
        name: 'Force Majeure Clause',
        category: 'General',
        text: 'Neither party liable for delays due to circumstances beyond their control',
        isRequired: false,
        jurisdictions: ['all'],
        riskLevel: 'low'
      }
    ];
  }

  // Analyze uploaded document
  async analyzeDocument(
    file: File | Buffer,
    fileName: string,
    jurisdiction: string = 'US'
  ): Promise<DocumentAnalysis> {
    console.log(`🔍 Analyzing document: ${fileName}`);
    
    const startTime = performance.now();
    const fileId = this.generateFileId(fileName);

    // Check cache first
    if (this.analysisCache.has(fileId)) {
      console.log('📋 Returning cached analysis');
      return this.analysisCache.get(fileId)!;
    }

    // Simulate document processing
    const documentText = await this.extractTextFromDocument(file, fileName);
    const documentType = this.identifyDocumentType(documentText);
    const keyTerms = this.extractKeyTerms(documentText);
    const legalIssues = this.identifyLegalIssues(documentText, documentType);
    const complianceCheck = this.performComplianceCheck(documentText, jurisdiction);
    const riskAssessment = this.assessRisks(documentText, documentType);
    const suggestions = this.generateSuggestions(documentText, documentType, legalIssues);

    const endTime = performance.now();
    const processingTime = endTime - startTime;

    const analysis: DocumentAnalysis = {
      id: fileId,
      fileName,
      fileType: this.getFileType(fileName),
      fileSize: this.getFileSize(file),
      uploadedAt: new Date().toISOString(),
      analysisResults: {
        documentType: documentType.type,
        confidence: documentType.confidence,
        keyTerms,
        legalIssues,
        complianceCheck,
        riskAssessment,
        suggestions
      },
      processingTime
    };

    // Cache the analysis
    this.analysisCache.set(fileId, analysis);

    console.log(`✅ Analysis complete in ${processingTime.toFixed(0)}ms`);
    return analysis;
  }

  // Extract text from various document formats
  private async extractTextFromDocument(file: File | Buffer, fileName: string): Promise<string> {
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    
    // Simulate text extraction for different formats
    switch (fileExtension) {
      case 'pdf':
        return this.simulatePDFTextExtraction();
      case 'docx':
      case 'doc':
        return this.simulateWordTextExtraction();
      case 'txt':
        return this.simulateTextFileExtraction();
      default:
        return this.simulateGenericTextExtraction();
    }
  }

  private simulatePDFTextExtraction(): string {
    return `
    EMPLOYMENT AGREEMENT
    
    This Employment Agreement is entered into between ABC Company and John Smith.
    
    1. POSITION AND DUTIES
    Employee shall serve as Software Engineer and perform duties assigned by the company.
    
    2. COMPENSATION
    Employee shall receive a salary of $75,000 per year, payable bi-weekly.
    
    3. TERMINATION
    This agreement may be terminated by either party with 30 days written notice.
    
    4. CONFIDENTIALITY
    Employee agrees to maintain confidentiality of all proprietary information.
    
    5. INTELLECTUAL PROPERTY
    All work product created during employment belongs to the company.
    `;
  }

  private simulateWordTextExtraction(): string {
    return `
    NON-DISCLOSURE AGREEMENT
    
    This Non-Disclosure Agreement is between XYZ Corp and Jane Doe.
    
    1. CONFIDENTIAL INFORMATION
    Confidential Information includes technical data, trade secrets, and business information.
    
    2. OBLIGATIONS
    Recipient agrees not to disclose or use confidential information.
    
    3. TERM
    This agreement shall remain in effect for 5 years from the date of signing.
    
    4. REMEDIES
    Breach of this agreement may result in irreparable harm and injunctive relief.
    `;
  }

  private simulateTextFileExtraction(): string {
    return 'Basic text document content for analysis...';
  }

  private simulateGenericTextExtraction(): string {
    return 'Generic document content extracted for analysis...';
  }

  // Identify document type using AI analysis
  private identifyDocumentType(text: string): { type: string; confidence: number } {
    const textLower = text.toLowerCase();
    
    // Employment contracts
    if (textLower.includes('employment') && textLower.includes('agreement')) {
      return { type: 'employment-contract', confidence: 0.95 };
    }
    
    // NDAs
    if (textLower.includes('non-disclosure') || textLower.includes('confidentiality')) {
      return { type: 'non-disclosure-agreement', confidence: 0.92 };
    }
    
    // Service agreements
    if (textLower.includes('service') && textLower.includes('agreement')) {
      return { type: 'service-agreement', confidence: 0.88 };
    }
    
    // Lease agreements
    if (textLower.includes('lease') || textLower.includes('rental')) {
      return { type: 'lease-agreement', confidence: 0.90 };
    }
    
    // LLC operating agreements
    if (textLower.includes('llc') || textLower.includes('operating agreement')) {
      return { type: 'llc-operating-agreement', confidence: 0.93 };
    }
    
    return { type: 'unknown', confidence: 0.60 };
  }

  // Extract key legal terms
  private extractKeyTerms(text: string): Array<{
    term: string;
    frequency: number;
    importance: 'high' | 'medium' | 'low';
    definition?: string;
  }> {
    const legalTerms = [
      { term: 'confidential information', importance: 'high' as const, definition: 'Information not generally known that provides competitive advantage' },
      { term: 'termination', importance: 'high' as const, definition: 'The ending of a contract or employment relationship' },
      { term: 'intellectual property', importance: 'high' as const, definition: 'Creations of the mind protected by law' },
      { term: 'governing law', importance: 'medium' as const, definition: 'The jurisdiction whose laws apply to the contract' },
      { term: 'force majeure', importance: 'medium' as const, definition: 'Unforeseeable circumstances preventing contract fulfillment' },
      { term: 'arbitration', importance: 'medium' as const, definition: 'Alternative dispute resolution outside of court' },
      { term: 'indemnification', importance: 'high' as const, definition: 'Protection from liability for certain losses' },
      { term: 'liability', importance: 'high' as const, definition: 'Legal responsibility for damages or losses' }
    ];

    const textLower = text.toLowerCase();
    const foundTerms = [];

    for (const term of legalTerms) {
      const frequency = (textLower.match(new RegExp(term.term, 'g')) || []).length;
      if (frequency > 0) {
        foundTerms.push({
          term: term.term,
          frequency,
          importance: term.importance,
          definition: term.definition
        });
      }
    }

    return foundTerms.sort((a, b) => b.frequency - a.frequency);
  }

  // Identify potential legal issues
  private identifyLegalIssues(text: string, documentType: string): Array<{
    issue: string;
    severity: 'critical' | 'warning' | 'info';
    description: string;
    recommendation: string;
    affectedClauses: string[];
  }> {
    const issues = [];
    const textLower = text.toLowerCase();

    // Check for missing critical clauses
    if (documentType === 'employment-contract') {
      if (!textLower.includes('termination')) {
        issues.push({
          issue: 'Missing Termination Clause',
          severity: 'critical' as const,
          description: 'Employment contracts should specify termination conditions',
          recommendation: 'Add a clear termination clause with notice requirements',
          affectedClauses: ['employment terms']
        });
      }

      if (!textLower.includes('intellectual property')) {
        issues.push({
          issue: 'Missing Intellectual Property Clause',
          severity: 'warning' as const,
          description: 'Important to clarify ownership of work product',
          recommendation: 'Include intellectual property assignment clause',
          affectedClauses: ['intellectual property']
        });
      }
    }

    if (documentType === 'non-disclosure-agreement') {
      if (!textLower.includes('term') && !textLower.includes('duration')) {
        issues.push({
          issue: 'Undefined Agreement Term',
          severity: 'warning' as const,
          description: 'NDA should specify how long confidentiality obligations last',
          recommendation: 'Add specific term duration (e.g., 5 years)',
          affectedClauses: ['term and duration']
        });
      }
    }

    // Check for vague language
    if (textLower.includes('reasonable') && !textLower.includes('reasonably')) {
      issues.push({
        issue: 'Vague Language Detected',
        severity: 'info' as const,
        description: 'Terms like "reasonable" can be ambiguous',
        recommendation: 'Consider defining what constitutes "reasonable"',
        affectedClauses: ['general terms']
      });
    }

    // Check for governing law
    if (!textLower.includes('governing law') && !textLower.includes('governed by')) {
      issues.push({
        issue: 'Missing Governing Law Clause',
        severity: 'warning' as const,
        description: 'Contract should specify which state/jurisdiction laws apply',
        recommendation: 'Add governing law clause specifying applicable jurisdiction',
        affectedClauses: ['legal framework']
      });
    }

    return issues;
  }

  // Perform compliance check
  private performComplianceCheck(text: string, jurisdiction: string): {
    jurisdiction: string;
    complianceScore: number;
    missingElements: string[];
    recommendedImprovements: string[];
  } {
    const textLower = text.toLowerCase();
    let score = 100;
    const missingElements = [];
    const improvements = [];

    // Check required elements
    const requiredClauses = this.legalClauses.filter(clause => 
      clause.isRequired && 
      (clause.jurisdictions.includes(jurisdiction) || clause.jurisdictions.includes('all'))
    );

    for (const clause of requiredClauses) {
      const clauseKeywords = clause.name.toLowerCase().split(' ');
      const found = clauseKeywords.some(keyword => textLower.includes(keyword));
      
      if (!found) {
        score -= 15;
        missingElements.push(clause.name);
        improvements.push(`Add ${clause.name} to ensure compliance`);
      }
    }

    // Jurisdiction-specific checks
    if (jurisdiction === 'CA') {
      if (!textLower.includes('meal break') && textLower.includes('employment')) {
        score -= 10;
        missingElements.push('California meal break provisions');
        improvements.push('Include California-specific meal break requirements');
      }
    }

    return {
      jurisdiction,
      complianceScore: Math.max(score, 0),
      missingElements,
      recommendedImprovements: improvements
    };
  }

  // Assess legal risks
  private assessRisks(text: string, documentType: string): {
    overallRisk: 'low' | 'medium' | 'high' | 'critical';
    riskFactors: Array<{
      factor: string;
      impact: number;
      mitigation: string;
    }>;
  } {
    const textLower = text.toLowerCase();
    const riskFactors = [];
    let totalRisk = 0;

    // Check for high-risk terms
    if (textLower.includes('unlimited liability') || textLower.includes('unlimited damages')) {
      riskFactors.push({
        factor: 'Unlimited Liability Exposure',
        impact: 80,
        mitigation: 'Add liability cap or limitation clause'
      });
      totalRisk += 80;
    }

    // Check for missing limitation of liability
    if (!textLower.includes('limitation of liability') && !textLower.includes('liability cap')) {
      riskFactors.push({
        factor: 'No Liability Protection',
        impact: 60,
        mitigation: 'Include limitation of liability clause'
      });
      totalRisk += 60;
    }

    // Check for automatic renewal
    if (textLower.includes('automatic renewal') || textLower.includes('auto-renew')) {
      riskFactors.push({
        factor: 'Automatic Renewal Risk',
        impact: 40,
        mitigation: 'Add clear termination procedures and notice requirements'
      });
      totalRisk += 40;
    }

    // Check for broad indemnification
    if (textLower.includes('indemnify') && textLower.includes('all claims')) {
      riskFactors.push({
        factor: 'Broad Indemnification Clause',
        impact: 50,
        mitigation: 'Limit indemnification to specific scenarios'
      });
      totalRisk += 50;
    }

    // Determine overall risk level
    let overallRisk: 'low' | 'medium' | 'high' | 'critical';
    if (totalRisk >= 100) overallRisk = 'critical';
    else if (totalRisk >= 70) overallRisk = 'high';
    else if (totalRisk >= 40) overallRisk = 'medium';
    else overallRisk = 'low';

    return {
      overallRisk,
      riskFactors
    };
  }

  // Generate improvement suggestions
  private generateSuggestions(
    text: string, 
    documentType: string, 
    legalIssues: any[]
  ): Array<{
    type: 'improvement' | 'addition' | 'revision';
    priority: 'high' | 'medium' | 'low';
    suggestion: string;
    reasoning: string;
  }> {
    const suggestions = [];

    // High priority suggestions based on issues
    for (const issue of legalIssues) {
      if (issue.severity === 'critical') {
        suggestions.push({
          type: 'addition' as const,
          priority: 'high' as const,
          suggestion: issue.recommendation,
          reasoning: issue.description
        });
      }
    }

    // Document-specific suggestions
    if (documentType === 'employment-contract') {
      suggestions.push({
        type: 'improvement' as const,
        priority: 'medium' as const,
        suggestion: 'Consider adding remote work policy clause',
        reasoning: 'Modern employment agreements should address remote work arrangements'
      });
    }

    if (documentType === 'non-disclosure-agreement') {
      suggestions.push({
        type: 'improvement' as const,
        priority: 'medium' as const,
        suggestion: 'Include specific examples of confidential information',
        reasoning: 'Clear examples help prevent disputes about what information is protected'
      });
    }

    // General improvements
    suggestions.push({
      type: 'addition' as const,
      priority: 'low' as const,
      suggestion: 'Add electronic signature clause',
      reasoning: 'Allow for digital execution to streamline the signing process'
    });

    return suggestions;
  }

  // Utility functions
  private generateFileId(fileName: string): string {
    return `doc_${Date.now()}_${fileName.replace(/[^a-zA-Z0-9]/g, '_')}`;
  }

  private getFileType(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || 'unknown';
  }

  private getFileSize(file: File | Buffer): number {
    if (file instanceof File) {
      return file.size;
    }
    return Buffer.isBuffer(file) ? file.length : 0;
  }

  // Get analysis by ID
  getAnalysis(id: string): DocumentAnalysis | undefined {
    return this.analysisCache.get(id);
  }

  // Get all analyses
  getAllAnalyses(): DocumentAnalysis[] {
    return Array.from(this.analysisCache.values());
  }

  // Generate analysis report
  generateAnalysisReport(analysis: DocumentAnalysis): string {
    const { analysisResults } = analysis;
    
    return `
# Document Analysis Report

## Document Overview
- **File**: ${analysis.fileName}
- **Type**: ${analysisResults.documentType} (${(analysisResults.confidence * 100).toFixed(1)}% confidence)
- **Analysis Date**: ${new Date(analysis.uploadedAt).toLocaleDateString()}
- **Processing Time**: ${analysis.processingTime.toFixed(0)}ms

## Risk Assessment
- **Overall Risk Level**: ${analysisResults.riskAssessment.overallRisk.toUpperCase()}
- **Compliance Score**: ${analysisResults.complianceCheck.complianceScore}/100

## Key Findings

### Legal Issues Identified
${analysisResults.legalIssues.map(issue => `
- **${issue.issue}** (${issue.severity.toUpperCase()})
  - ${issue.description}
  - Recommendation: ${issue.recommendation}
`).join('')}

### Risk Factors
${analysisResults.riskAssessment.riskFactors.map(risk => `
- **${risk.factor}** (Impact: ${risk.impact}/100)
  - Mitigation: ${risk.mitigation}
`).join('')}

### Recommendations
${analysisResults.suggestions.map(suggestion => `
- **${suggestion.type.toUpperCase()}** (${suggestion.priority} priority): ${suggestion.suggestion}
  - Reasoning: ${suggestion.reasoning}
`).join('')}

### Key Terms Found
${analysisResults.keyTerms.map(term => `
- **${term.term}** (${term.frequency} occurrences, ${term.importance} importance)
  ${term.definition ? `- Definition: ${term.definition}` : ''}
`).join('')}

## Compliance Status
- **Jurisdiction**: ${analysisResults.complianceCheck.jurisdiction}
- **Missing Elements**: ${analysisResults.complianceCheck.missingElements.join(', ') || 'None'}
- **Recommended Improvements**: ${analysisResults.complianceCheck.recommendedImprovements.join('; ') || 'None'}

---

*This analysis is provided for informational purposes only and does not constitute legal advice. Consult with a qualified attorney for specific legal guidance.*
    `;
  }

  // Performance metrics
  getPerformanceMetrics(): {
    totalAnalyses: number;
    averageProcessingTime: number;
    cacheHitRate: number;
    documentTypesAnalyzed: Record<string, number>;
  } {
    const analyses = this.getAllAnalyses();
    const avgProcessingTime = analyses.reduce((sum, a) => sum + a.processingTime, 0) / analyses.length;
    
    const docTypes: Record<string, number> = {};
    analyses.forEach(a => {
      docTypes[a.analysisResults.documentType] = (docTypes[a.analysisResults.documentType] || 0) + 1;
    });

    return {
      totalAnalyses: analyses.length,
      averageProcessingTime: avgProcessingTime || 0,
      cacheHitRate: 0.85, // Simulated cache hit rate
      documentTypesAnalyzed: docTypes
    };
  }
}

// Export singleton instance
export const aiDocumentAnalyzer = AIDocumentAnalyzer.getInstance();