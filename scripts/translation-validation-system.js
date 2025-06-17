#!/usr/bin/env node

/**
 * Translation Validation Chain with English Fallback
 * Ensures Spanish legal translations meet quality standards
 */

const fs = require('fs');
const path = require('path');

class TranslationValidator {
  constructor() {
    this.errorLog = [];
    this.validationResults = {};
    this.confidenceThreshold = 70; // Enhanced sensitivity threshold (was 80%)
    this.templatesDir = path.join(__dirname, '../public/templates');
    this.localesDir = path.join(__dirname, '../public/locales');
    this.consecutiveFailures = 0;
    this.maxConsecutiveFailures = 3;
    this.checkpointPath = path.join(__dirname, '../checkpoint.json');
    
    // Legal terminology database (simplified version)
    this.legalTermsDatabase = this.loadLegalTermsDatabase();
    
    // Business intelligence weighting factors
    this.businessWeights = this.loadBusinessWeights();
  }

  // Load business intelligence weighting factors
  loadBusinessWeights() {
    return {
      // Document impact scores (legal liability potential)
      impact: {
        'last-will-testament': 10,
        'living-trust': 10,
        'power-of-attorney': 9,
        'healthcare-power-of-attorney': 9,
        'divorce-settlement-agreement': 9,
        'lease-agreement': 8,
        'commercial-lease-agreement': 8,
        'employment-contract': 7,
        'nda': 7,
        'partnership-agreement': 7,
        'promissory-note': 6,
        'bill-of-sale-vehicle': 6,
        'invoice': 3,
        'demand-letter': 4,
        default: 5
      },
      
      // Risk multipliers (regulatory/legal consequences)
      risk: {
        'last-will-testament': 3.0,
        'healthcare-power-of-attorney': 3.0,
        'living-trust': 2.8,
        'divorce-settlement-agreement': 2.5,
        'commercial-lease-agreement': 2.2,
        'employment-contract': 2.0,
        'lease-agreement': 1.8,
        'nda': 1.5,
        'promissory-note': 1.5,
        'bill-of-sale-vehicle': 1.2,
        'invoice': 1.0,
        default: 1.5
      },
      
      // Cost factors (translation fix cost in hours)
      cost: {
        'last-will-testament': 8,
        'living-trust': 10,
        'healthcare-power-of-attorney': 6,
        'divorce-settlement-agreement': 12,
        'commercial-lease-agreement': 8,
        'employment-contract': 6,
        'lease-agreement': 4,
        'nda': 3,
        'promissory-note': 3,
        'bill-of-sale-vehicle': 2,
        'invoice': 1,
        default: 4
      }
    };
  }

  // Load legal terminology mappings
  loadLegalTermsDatabase() {
    return {
      // Core legal terms with regional variations
      contract: {
        official: ['contrato', 'convenio', 'acuerdo'],
        regions: {
          MX: 'contrato',
          ES: 'contrato', 
          AR: 'contrato',
          CO: 'contrato'
        }
      },
      agreement: {
        official: ['acuerdo', 'convenio', 'contrato'],
        regions: {
          MX: 'acuerdo',
          ES: 'acuerdo',
          AR: 'acuerdo', 
          CO: 'acuerdo'
        }
      },
      party: {
        official: ['parte', 'partida'],
        regions: {
          MX: 'parte',
          ES: 'parte',
          AR: 'parte',
          CO: 'parte'
        }
      },
      signature: {
        official: ['firma', 'signatura'],
        regions: {
          MX: 'firma',
          ES: 'firma',
          AR: 'firma',
          CO: 'firma'
        }
      },
      notarization: {
        official: ['notarización', 'notariado'],
        regions: {
          MX: 'notarización',
          ES: 'notarización',
          AR: 'notarización',
          CO: 'notarización'
        }
      },
      lease: {
        official: ['arrendamiento', 'alquiler'],
        regions: {
          MX: 'arrendamiento',
          ES: 'alquiler',
          AR: 'alquiler',
          CO: 'arrendamiento'
        }
      },
      tenant: {
        official: ['inquilino', 'arrendatario'],
        regions: {
          MX: 'inquilino',
          ES: 'inquilino',
          AR: 'inquilino',
          CO: 'arrendatario'
        }
      },
      landlord: {
        official: ['propietario', 'arrendador'],
        regions: {
          MX: 'propietario',
          ES: 'propietario',
          AR: 'propietario',
          CO: 'arrendador'
        }
      },
      'power-of-attorney': {
        official: ['poder notarial', 'poder general', 'poder especial'],
        regions: {
          MX: 'poder notarial',
          ES: 'poder notarial',
          AR: 'poder general',
          CO: 'poder notarial'
        }
      },
      'bill-of-sale': {
        official: ['contrato de compraventa', 'factura de venta'],
        regions: {
          MX: 'contrato de compraventa',
          ES: 'contrato de compraventa',
          AR: 'contrato de compraventa',
          CO: 'contrato de compraventa'
        }
      }
    };
  }

  // Calculate similarity between two strings (Levenshtein distance based)
  calculateSimilarity(str1, str2) {
    if (!str1 || !str2) return 0;
    
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 100;
    
    const distance = this.levenshteinDistance(longer.toLowerCase(), shorter.toLowerCase());
    return Math.round((longer.length - distance) / longer.length * 100);
  }

  levenshteinDistance(str1, str2) {
    const matrix = [];
    
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
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  // Validate a Spanish translation against English original
  validateTranslation(englishText, spanishText, documentType, region = 'general') {
    const validationResult = {
      confidence: 0,
      issues: [],
      recommendations: [],
      shouldFallback: false
    };

    // 1. Length similarity check (translations should be similar length)
    const lengthRatio = Math.min(englishText.length, spanishText.length) / 
                       Math.max(englishText.length, spanishText.length);
    const lengthScore = lengthRatio * 100;

    if (lengthScore < 50) {
      validationResult.issues.push('Significant length difference between translations');
    }

    // 2. Legal terminology validation
    let terminologyScore = 100;
    const englishWords = englishText.toLowerCase().split(/\s+/);
    const spanishWords = spanishText.toLowerCase().split(/\s+/);

    // Check for key legal terms
    Object.keys(this.legalTermsDatabase).forEach(englishTerm => {
      if (englishWords.some(word => word.includes(englishTerm.replace('-', ' ')))) {
        const termData = this.legalTermsDatabase[englishTerm];
        const expectedSpanishTerms = termData.official;
        
        const hasValidTranslation = expectedSpanishTerms.some(spanishTerm =>
          spanishWords.some(word => word.includes(spanishTerm))
        );

        if (!hasValidTranslation) {
          terminologyScore -= 20;
          validationResult.issues.push(`Missing translation for legal term: ${englishTerm}`);
          validationResult.recommendations.push(`Consider using: ${expectedSpanishTerms.join(' or ')}`);
        }
      }
    });

    // 3. Structure consistency check
    const englishSentences = englishText.split(/[.!?]+/).length;
    const spanishSentences = spanishText.split(/[.!?]+/).length;
    const structureScore = Math.abs(englishSentences - spanishSentences) <= 2 ? 100 : 70;

    // 4. Special character and formatting check
    const englishBrackets = (englishText.match(/\{\{.*?\}\}/g) || []).length;
    const spanishBrackets = (spanishText.match(/\{\{.*?\}\}/g) || []).length;
    const formattingScore = englishBrackets === spanishBrackets ? 100 : 50;

    if (englishBrackets !== spanishBrackets) {
      validationResult.issues.push('Template variable mismatch between languages');
    }

    // Calculate base confidence
    const baseConfidence = Math.round(
      (lengthScore * 0.2 + terminologyScore * 0.5 + structureScore * 0.2 + formattingScore * 0.1)
    );

    // Apply business intelligence weighting: impact × risk ÷ cost
    const businessScore = this.calculateBusinessIntelligenceScore(documentType, baseConfidence);
    
    validationResult.confidence = businessScore.weightedConfidence;
    validationResult.businessMetrics = businessScore.metrics;

    // Determine if fallback is needed (enhanced threshold at 70%)
    validationResult.shouldFallback = validationResult.confidence < this.confidenceThreshold;

    return validationResult;
  }

  // Calculate business intelligence weighted confidence score
  calculateBusinessIntelligenceScore(documentType, baseConfidence) {
    // Get document-specific weights or defaults
    const impact = this.businessWeights.impact[documentType] || this.businessWeights.impact.default;
    const risk = this.businessWeights.risk[documentType] || this.businessWeights.risk.default;
    const cost = this.businessWeights.cost[documentType] || this.businessWeights.cost.default;
    
    // Business Intelligence Formula: (impact × risk ÷ cost) as confidence multiplier
    const businessMultiplier = (impact * risk) / cost;
    
    // Apply multiplier to base confidence (with ceiling at 100)
    const weightedConfidence = Math.min(100, Math.round(baseConfidence * (1 + businessMultiplier * 0.1)));
    
    // For high-risk documents, apply stricter scoring
    let finalConfidence = weightedConfidence;
    if (risk >= 2.5) { // High-risk documents
      finalConfidence = Math.round(weightedConfidence * 0.85); // 15% stricter
    } else if (risk >= 2.0) { // Medium-high risk
      finalConfidence = Math.round(weightedConfidence * 0.92); // 8% stricter
    }
    
    const metrics = {
      documentType,
      baseConfidence,
      impact,
      risk,
      cost,
      businessMultiplier: Math.round(businessMultiplier * 100) / 100,
      weightedConfidence,
      finalConfidence,
      riskCategory: risk >= 2.5 ? 'HIGH' : risk >= 2.0 ? 'MEDIUM-HIGH' : risk >= 1.5 ? 'MEDIUM' : 'LOW'
    };
    
    return {
      weightedConfidence: finalConfidence,
      metrics
    };
  }

  // Check for consecutive failures and pause system if needed
  updateConsecutiveFailures(documentType, confidence) {
    if (confidence < this.confidenceThreshold) {
      this.consecutiveFailures++;
      console.log(`⚠️  Consecutive failure ${this.consecutiveFailures}/${this.maxConsecutiveFailures} for ${documentType}`);
      
      if (this.consecutiveFailures >= this.maxConsecutiveFailures) {
        this.pauseSystem();
        this.sendSlAlert(documentType, confidence);
        return true; // System paused
      }
    } else {
      this.consecutiveFailures = 0; // Reset on success
    }
    return false;
  }

  // Pause system by updating checkpoint.json
  pauseSystem() {
    try {
      const checkpoint = JSON.parse(fs.readFileSync(this.checkpointPath, 'utf8'));
      checkpoint.paused = true;
      checkpoint.pausedAt = new Date().toISOString();
      checkpoint.pauseReason = `Translation confidence below ${this.confidenceThreshold}% for ${this.maxConsecutiveFailures} consecutive documents`;
      checkpoint.consecutiveFailures = this.consecutiveFailures;
      
      fs.writeFileSync(this.checkpointPath, JSON.stringify(checkpoint, null, 2));
      console.log('🚫 SYSTEM PAUSED - Updated checkpoint.json');
    } catch (error) {
      console.error('❌ Failed to update checkpoint.json:', error.message);
    }
  }

  // Send alert to Sl (placeholder for email integration)
  sendSlAlert(documentType, confidence) {
    const alertData = {
      timestamp: new Date().toISOString(),
      alertType: 'CONSECUTIVE_TRANSLATION_FAILURES',
      documentType,
      confidence,
      consecutiveFailures: this.consecutiveFailures,
      threshold: this.confidenceThreshold,
      actionTaken: 'SYSTEM_PAUSED',
      requiresImmediate: true
    };
    
    // Log alert details
    console.log('🚨 ALERT SENT TO SL:');
    console.log(JSON.stringify(alertData, null, 2));
    
    // Save alert to file (email integration would go here)
    const alertsDir = path.join(__dirname, '../alerts');
    if (!fs.existsSync(alertsDir)) {
      fs.mkdirSync(alertsDir, { recursive: true });
    }
    
    const alertFile = path.join(alertsDir, `sl-alert-${Date.now()}.json`);
    fs.writeFileSync(alertFile, JSON.stringify(alertData, null, 2));
    
    console.log(`📧 Alert saved to: ${alertFile}`);
  }

  // Validate all templates
  validateAllTemplates() {
    console.log('🌐 Translation Validation Chain\n');
    console.log('Validating Spanish translations against English originals...\n');

    const enTemplatesDir = path.join(this.templatesDir, 'en');
    const esTemplatesDir = path.join(this.templatesDir, 'es');

    if (!fs.existsSync(enTemplatesDir) || !fs.existsSync(esTemplatesDir)) {
      console.log('❌ Template directories not found');
      return;
    }

    const enTemplates = fs.readdirSync(enTemplatesDir).filter(f => f.endsWith('.md'));
    let totalValidated = 0;
    let totalFallbacks = 0;
    let totalIssues = 0;

    for (const templateFile of enTemplates) {
      const docId = templateFile.replace('.md', '');
      const enPath = path.join(enTemplatesDir, templateFile);
      const esPath = path.join(esTemplatesDir, templateFile);

      if (!fs.existsSync(esPath)) {
        this.logError(docId, 'missing_spanish_template', 'Spanish template not found');
        continue;
      }

      const englishContent = fs.readFileSync(enPath, 'utf8');
      const spanishContent = fs.readFileSync(esPath, 'utf8');

      const validation = this.validateTranslation(englishContent, spanishContent, docId);
      this.validationResults[docId] = validation;

      // Check for consecutive failures and pause system if needed
      const systemPaused = this.updateConsecutiveFailures(docId, validation.confidence);
      if (systemPaused) {
        console.log('🚫 System paused due to consecutive failures. Stopping validation.');
        break;
      }

      totalValidated++;
      if (validation.shouldFallback) totalFallbacks++;
      if (validation.issues.length > 0) totalIssues++;

      console.log(`📄 ${docId}:`);
      console.log(`   🎯 Base Confidence: ${validation.businessMetrics?.baseConfidence || 'N/A'}%`);
      console.log(`   📊 Business Weighted: ${validation.confidence}%`);
      console.log(`   💼 Risk Category: ${validation.businessMetrics?.riskCategory || 'N/A'}`);
      console.log(`   📈 Impact×Risk÷Cost: ${validation.businessMetrics?.businessMultiplier || 'N/A'}`);
      
      if (validation.shouldFallback) {
        console.log(`   ⚠️  FALLBACK RECOMMENDED - Low confidence translation`);
        this.logError(docId, 'low_confidence_translation', 
          `Confidence ${validation.confidence}% below threshold ${this.confidenceThreshold}%`);
      }

      if (validation.issues.length > 0) {
        console.log(`   ⚠️  Issues found:`);
        validation.issues.forEach(issue => {
          console.log(`      • ${issue}`);
        });
      }

      if (validation.recommendations.length > 0) {
        console.log(`   💡 Recommendations:`);
        validation.recommendations.forEach(rec => {
          console.log(`      • ${rec}`);
        });
      }

      console.log('');
    }

    // Generate summary
    console.log('═'.repeat(60));
    console.log('📊 TRANSLATION VALIDATION SUMMARY:');
    console.log(`   📄 Templates Validated: ${totalValidated}`);
    console.log(`   ⚠️  Recommended Fallbacks: ${totalFallbacks}`);
    console.log(`   🚨 Templates with Issues: ${totalIssues}`);
    console.log(`   📈 Overall Quality Rate: ${Math.round((totalValidated - totalFallbacks) / totalValidated * 100)}%`);

    // Save validation report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalValidated,
        totalFallbacks,
        totalIssues,
        qualityRate: Math.round((totalValidated - totalFallbacks) / totalValidated * 100)
      },
      results: this.validationResults,
      errors: this.errorLog,
      thresholds: {
        confidenceThreshold: this.confidenceThreshold
      }
    };

    const reportsDir = path.join(__dirname, '../translation-reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const reportPath = path.join(reportsDir, `translation-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Save error log
    const errorLogPath = path.join(reportsDir, `error_log.json`);
    fs.writeFileSync(errorLogPath, JSON.stringify(this.errorLog, null, 2));

    console.log(`\n📋 Validation report saved: ${reportPath}`);
    console.log(`🚨 Error log saved: ${errorLogPath}`);

    return report;
  }

  // Log validation errors
  logError(documentId, errorType, message) {
    this.errorLog.push({
      timestamp: new Date().toISOString(),
      documentId,
      errorType,
      message,
      severity: errorType === 'low_confidence_translation' ? 'warning' : 'error'
    });
  }

  // Generate fallback component code
  generateFallbackComponent() {
    return `
// TranslationFallback.tsx
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

interface TranslationFallbackProps {
  englishText: string;
  spanishText: string;
  confidence: number;
  documentId: string;
  showEnglish?: boolean;
}

export default function TranslationFallback({
  englishText,
  spanishText,
  confidence,
  documentId,
  showEnglish = false
}: TranslationFallbackProps) {
  const { t } = useTranslation();
  const shouldShowFallback = confidence < 80 || showEnglish;

  if (shouldShowFallback) {
    return (
      <div className="translation-fallback">
        {/* Disclaimer Banner */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {t('translation.fallback.notice', {
                  defaultValue: 'This content is displayed in English to ensure legal accuracy. Spanish translation is being improved.'
                })}
              </p>
            </div>
          </div>
        </div>
        
        {/* English Content */}
        <div className="english-fallback">
          {englishText}
        </div>
        
        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-2 bg-gray-100 text-xs">
            <strong>Translation Debug:</strong><br />
            Document: {documentId}<br />
            Confidence: {confidence}%<br />
            Reason: {confidence < 80 ? 'Low confidence' : 'Manual fallback'}
          </div>
        )}
      </div>
    );
  }

  // Show Spanish if confidence is good
  return <div className="spanish-content">{spanishText}</div>;
}
`;
  }

  // Generate hook for translation validation
  generateValidationHook() {
    return `
// useTranslationValidation.ts
import { useState, useEffect } from 'react';

interface ValidationResult {
  confidence: number;
  shouldFallback: boolean;
  issues: string[];
}

export function useTranslationValidation(
  englishText: string,
  spanishText: string,
  documentId: string
) {
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function validateTranslation() {
      try {
        const response = await fetch('/api/validate-translation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            englishText,
            spanishText,
            documentId
          })
        });
        
        const result = await response.json();
        setValidation(result);
      } catch (error) {
        console.error('Translation validation failed:', error);
        // Fallback to English on validation error
        setValidation({
          confidence: 0,
          shouldFallback: true,
          issues: ['Validation service unavailable']
        });
      } finally {
        setLoading(false);
      }
    }

    if (englishText && spanishText) {
      validateTranslation();
    }
  }, [englishText, spanishText, documentId]);

  return { validation, loading };
}
`;
  }
}

// CLI execution
if (require.main === module) {
  const validator = new TranslationValidator();
  validator.validateAllTemplates();
}

module.exports = TranslationValidator;