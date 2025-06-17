#!/usr/bin/env node

/**
 * Robust Decision Logic & Exception Escalation Engine
 * Intelligently routes issues based on severity and type
 */

const fs = require('fs');
const path = require('path');

// Severity levels
const SEVERITY = {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH', 
  MEDIUM: 'MEDIUM',
  LOW: 'LOW'
};

// Issue types
const ISSUE_TYPES = {
  LEGAL_VIOLATION: 'legal_violation',
  TRANSLATION_RISK: 'translation_risk',
  QUALITY_DEGRADATION: 'quality_degradation',
  SECURITY_ISSUE: 'security_issue',
  TEMPLATE_ERROR: 'template_error',
  TECHNICAL_DEBT: 'technical_debt',
  SEO_ISSUE: 'seo_issue',
  MARKET_READINESS: 'market_readiness'
};

// Escalation channels
const ESCALATION_CHANNELS = {
  BLOCK_DEPLOYMENT: 'block_deployment',
  LEGAL_TEAM: 'legal_team',
  CONTENT_TEAM: 'content_team',
  DEV_TEAM: 'dev_team',
  CTO_ALERT: 'cto_alert',
  AUTO_FIX: 'auto_fix',
  LOG_ONLY: 'log_only'
};

class DecisionEngine {
  constructor() {
    this.decisionRules = this.loadDecisionRules();
    this.escalationQueue = [];
    this.actionResults = [];
    this.reportsDir = path.join(__dirname, '../decision-reports');
    
    // Ensure reports directory exists
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
  }

  // Load decision rules configuration
  loadDecisionRules() {
    return {
      // Legal compliance violations
      [ISSUE_TYPES.LEGAL_VIOLATION]: {
        'missing_required_clause': {
          severity: SEVERITY.CRITICAL,
          actions: [ESCALATION_CHANNELS.BLOCK_DEPLOYMENT, ESCALATION_CHANNELS.LEGAL_TEAM, ESCALATION_CHANNELS.CTO_ALERT],
          autoFix: false,
          description: 'Missing legally required clause',
          urgency: 'immediate'
        },
        'regulatory_violation': {
          severity: SEVERITY.CRITICAL,
          actions: [ESCALATION_CHANNELS.BLOCK_DEPLOYMENT, ESCALATION_CHANNELS.LEGAL_TEAM],
          autoFix: false,
          description: 'Violates state/federal regulations',
          urgency: 'immediate'
        },
        'state_compliance_gap': {
          severity: SEVERITY.HIGH,
          actions: [ESCALATION_CHANNELS.LEGAL_TEAM, ESCALATION_CHANNELS.DEV_TEAM],
          autoFix: false,
          description: 'Missing state-specific requirements',
          urgency: 'within_24h'
        }
      },

      // Translation safety issues
      [ISSUE_TYPES.TRANSLATION_RISK]: {
        'low_confidence_legal_term': {
          severity: SEVERITY.HIGH,
          actions: [ESCALATION_CHANNELS.CONTENT_TEAM, ESCALATION_CHANNELS.AUTO_FIX],
          autoFix: true,
          autoFixAction: 'fallback_to_english',
          description: 'Spanish legal translation below confidence threshold',
          urgency: 'within_24h'
        },
        'missing_translation': {
          severity: SEVERITY.MEDIUM,
          actions: [ESCALATION_CHANNELS.CONTENT_TEAM, ESCALATION_CHANNELS.AUTO_FIX],
          autoFix: true,
          autoFixAction: 'use_english_version',
          description: 'Spanish translation not available',
          urgency: 'within_week'
        },
        'terminology_mismatch': {
          severity: SEVERITY.MEDIUM,
          actions: [ESCALATION_CHANNELS.CONTENT_TEAM],
          autoFix: false,
          description: 'Legal terminology inconsistency',
          urgency: 'within_week'
        }
      },

      // Quality issues
      [ISSUE_TYPES.QUALITY_DEGRADATION]: {
        'quality_score_drop': {
          severity: SEVERITY.MEDIUM,
          actions: [ESCALATION_CHANNELS.DEV_TEAM, ESCALATION_CHANNELS.AUTO_FIX],
          autoFix: true,
          autoFixAction: 'run_quality_fixes',
          description: 'Quality score below threshold',
          urgency: 'within_week'
        },
        'metadata_incomplete': {
          severity: SEVERITY.LOW,
          actions: [ESCALATION_CHANNELS.AUTO_FIX, ESCALATION_CHANNELS.LOG_ONLY],
          autoFix: true,
          autoFixAction: 'generate_metadata',
          description: 'Missing or incomplete metadata',
          urgency: 'next_sprint'
        }
      },

      // Template errors
      [ISSUE_TYPES.TEMPLATE_ERROR]: {
        'template_syntax_error': {
          severity: SEVERITY.HIGH,
          actions: [ESCALATION_CHANNELS.BLOCK_DEPLOYMENT, ESCALATION_CHANNELS.DEV_TEAM],
          autoFix: false,
          description: 'Template compilation failure',
          urgency: 'immediate'
        },
        'template_variable_mismatch': {
          severity: SEVERITY.MEDIUM,
          actions: [ESCALATION_CHANNELS.DEV_TEAM, ESCALATION_CHANNELS.AUTO_FIX],
          autoFix: true,
          autoFixAction: 'sync_template_variables',
          description: 'Template variables out of sync',
          urgency: 'within_24h'
        }
      },

      // Security issues  
      [ISSUE_TYPES.SECURITY_ISSUE]: {
        'exposed_sensitive_data': {
          severity: SEVERITY.CRITICAL,
          actions: [ESCALATION_CHANNELS.BLOCK_DEPLOYMENT, ESCALATION_CHANNELS.CTO_ALERT, ESCALATION_CHANNELS.DEV_TEAM],
          autoFix: false,
          description: 'Potential sensitive data exposure',
          urgency: 'immediate'
        }
      },

      // Technical debt
      [ISSUE_TYPES.TECHNICAL_DEBT]: {
        'code_quality_warning': {
          severity: SEVERITY.LOW,
          actions: [ESCALATION_CHANNELS.LOG_ONLY],
          autoFix: false,
          description: 'Code quality warning',
          urgency: 'next_sprint'
        }
      },

      // SEO Content Issues
      [ISSUE_TYPES.SEO_ISSUE]: {
        'duplicate_content': {
          severity: SEVERITY.HIGH,
          actions: [ESCALATION_CHANNELS.CONTENT_TEAM, ESCALATION_CHANNELS.AUTO_FIX],
          autoFix: true,
          autoFixAction: 'rewrite_duplicate_content',
          description: 'Content overlap >20% detected - Google penalty risk',
          urgency: 'within_24h'
        },
        'thin_content': {
          severity: SEVERITY.HIGH,
          actions: [ESCALATION_CHANNELS.CONTENT_TEAM, ESCALATION_CHANNELS.AUTO_FIX],
          autoFix: true,
          autoFixAction: 'expand_thin_content',
          description: 'Page content below minimum word count',
          urgency: 'within_24h'
        },
        'keyword_over_optimization': {
          severity: SEVERITY.MEDIUM,
          actions: [ESCALATION_CHANNELS.CONTENT_TEAM, ESCALATION_CHANNELS.AUTO_FIX],
          autoFix: true,
          autoFixAction: 'adjust_keyword_density',
          description: 'Keyword density too high - penalty risk',
          urgency: 'within_week'
        },
        'keyword_under_optimization': {
          severity: SEVERITY.LOW,
          actions: [ESCALATION_CHANNELS.CONTENT_TEAM, ESCALATION_CHANNELS.AUTO_FIX],
          autoFix: true,
          autoFixAction: 'increase_keyword_usage',
          description: 'Keywords under-optimized for target terms',
          urgency: 'next_sprint'
        },
        'seo_health_critical': {
          severity: SEVERITY.CRITICAL,
          actions: [ESCALATION_CHANNELS.BLOCK_DEPLOYMENT, ESCALATION_CHANNELS.CONTENT_TEAM, ESCALATION_CHANNELS.CTO_ALERT],
          autoFix: false,
          description: 'SEO health score <70% - immediate action required',
          urgency: 'immediate'
        }
      },

      // Market Readiness Issues
      [ISSUE_TYPES.MARKET_READINESS]: {
        'compliance_below_threshold': {
          severity: SEVERITY.CRITICAL,
          actions: [ESCALATION_CHANNELS.BLOCK_DEPLOYMENT, ESCALATION_CHANNELS.LEGAL_TEAM, ESCALATION_CHANNELS.CTO_ALERT],
          autoFix: false,
          description: 'Market compliance score below 0.85 threshold - launch blocked',
          urgency: 'immediate'
        },
        'critical_legal_blocker': {
          severity: SEVERITY.CRITICAL,
          actions: [ESCALATION_CHANNELS.BLOCK_DEPLOYMENT, ESCALATION_CHANNELS.LEGAL_TEAM],
          autoFix: false,
          description: 'Critical legal requirement not met for market launch',
          urgency: 'immediate'
        },
        'regulatory_compliance_gap': {
          severity: SEVERITY.HIGH,
          actions: [ESCALATION_CHANNELS.LEGAL_TEAM, ESCALATION_CHANNELS.DEV_TEAM],
          autoFix: false,
          description: 'Regulatory compliance requirements not satisfied',
          urgency: 'within_24h'
        },
        'technical_readiness_low': {
          severity: SEVERITY.HIGH,
          actions: [ESCALATION_CHANNELS.DEV_TEAM, ESCALATION_CHANNELS.AUTO_FIX],
          autoFix: true,
          autoFixAction: 'improve_technical_readiness',
          description: 'Technical infrastructure not ready for market launch',
          urgency: 'within_week'
        },
        'market_preparation_incomplete': {
          severity: SEVERITY.MEDIUM,
          actions: [ESCALATION_CHANNELS.CONTENT_TEAM, ESCALATION_CHANNELS.DEV_TEAM],
          autoFix: false,
          description: 'Market preparation activities incomplete',
          urgency: 'within_week'
        },
        'operational_readiness_gap': {
          severity: SEVERITY.MEDIUM,
          actions: [ESCALATION_CHANNELS.DEV_TEAM, ESCALATION_CHANNELS.AUTO_FIX],
          autoFix: true,
          autoFixAction: 'improve_operational_readiness',
          description: 'Operational processes not ready for market',
          urgency: 'within_week'
        }
      }
    };
  }

  // Process an issue through the decision engine
  processIssue(issue) {
    const { type, subtype, context, metadata } = issue;
    
    console.log(`🎯 Processing ${type}:${subtype}...`);
    
    // Get decision rule
    const rule = this.getDecisionRule(type, subtype);
    if (!rule) {
      console.log(`⚠️  No decision rule found for ${type}:${subtype}, using default`);
      return this.handleUnknownIssue(issue);
    }

    // Create decision record
    const decision = {
      timestamp: new Date().toISOString(),
      issue,
      rule,
      severity: rule.severity,
      actions: rule.actions,
      autoFixAttempted: false,
      autoFixSuccessful: false,
      escalated: false,
      escalationTargets: []
    };

    // Execute decision logic
    this.executeDecision(decision);
    
    return decision;
  }

  // Get decision rule for issue type/subtype
  getDecisionRule(type, subtype) {
    return this.decisionRules[type]?.[subtype];
  }

  // Execute the decision logic
  executeDecision(decision) {
    const { rule, issue } = decision;

    console.log(`🚨 Severity: ${rule.severity}`);
    console.log(`📋 Description: ${rule.description}`);

    // 1. Attempt auto-fix if possible
    if (rule.autoFix) {
      console.log(`🔧 Attempting auto-fix: ${rule.autoFixAction}`);
      decision.autoFixAttempted = true;
      decision.autoFixSuccessful = this.attemptAutoFix(rule.autoFixAction, issue);
      
      if (decision.autoFixSuccessful) {
        console.log(`✅ Auto-fix successful`);
        // If auto-fix successful, reduce severity
        if (rule.severity === SEVERITY.HIGH) {
          decision.severity = SEVERITY.MEDIUM;
        } else if (rule.severity === SEVERITY.MEDIUM) {
          decision.severity = SEVERITY.LOW;
        }
      } else {
        console.log(`❌ Auto-fix failed, proceeding with escalation`);
      }
    }

    // 2. Execute escalation actions
    rule.actions.forEach(action => {
      switch (action) {
        case ESCALATION_CHANNELS.BLOCK_DEPLOYMENT:
          this.blockDeployment(decision);
          break;
        case ESCALATION_CHANNELS.LEGAL_TEAM:
          this.escalateToLegalTeam(decision);
          break;
        case ESCALATION_CHANNELS.CONTENT_TEAM:
          this.escalateToContentTeam(decision);
          break;
        case ESCALATION_CHANNELS.DEV_TEAM:
          this.escalateToDevTeam(decision);
          break;
        case ESCALATION_CHANNELS.CTO_ALERT:
          this.alertCTO(decision);
          break;
        case ESCALATION_CHANNELS.LOG_ONLY:
          this.logIssue(decision);
          break;
      }
    });

    this.actionResults.push(decision);
  }

  // Auto-fix implementations
  attemptAutoFix(action, issue) {
    switch (action) {
      case 'fallback_to_english':
        return this.applyTranslationFallback(issue);
      case 'use_english_version':
        return this.useEnglishVersion(issue);
      case 'sync_template_variables':
        return this.syncTemplateVariables(issue);
      case 'generate_metadata':
        return this.generateMetadata(issue);
      case 'run_quality_fixes':
        return this.runQualityFixes(issue);
      case 'rewrite_duplicate_content':
        return this.rewriteDuplicateContent(issue);
      case 'expand_thin_content':
        return this.expandThinContent(issue);
      case 'adjust_keyword_density':
        return this.adjustKeywordDensity(issue);
      case 'increase_keyword_usage':
        return this.increaseKeywordUsage(issue);
      case 'improve_technical_readiness':
        return this.improveTechnicalReadiness(issue);
      case 'improve_operational_readiness':
        return this.improveOperationalReadiness(issue);
      default:
        console.log(`❓ Unknown auto-fix action: ${action}`);
        return false;
    }
  }

  // Auto-fix implementations
  applyTranslationFallback(issue) {
    console.log(`🌐 Applying translation fallback for ${issue.context?.documentId}`);
    // In real implementation, this would update the component to show English
    return true;
  }

  useEnglishVersion(issue) {
    console.log(`🇺🇸 Using English version for ${issue.context?.documentId}`);
    return true;
  }

  syncTemplateVariables(issue) {
    console.log(`🔄 Syncing template variables for ${issue.context?.documentId}`);
    // In real implementation, this would fix template variable mismatches
    return Math.random() > 0.3; // Simulate 70% success rate
  }

  generateMetadata(issue) {
    console.log(`📝 Generating metadata for ${issue.context?.documentId}`);
    return true;
  }

  runQualityFixes(issue) {
    console.log(`🔧 Running automated quality fixes`);
    return Math.random() > 0.2; // Simulate 80% success rate
  }

  // SEO Auto-fix implementations
  rewriteDuplicateContent(issue) {
    console.log(`📝 Rewriting duplicate content for ${issue.context?.file1} and ${issue.context?.file2}`);
    // In real implementation, this would use AI to rewrite content to be unique
    return Math.random() > 0.3; // Simulate 70% success rate
  }

  expandThinContent(issue) {
    console.log(`📄 Expanding thin content for ${issue.context?.file} (${issue.context?.wordCount} words)`);
    // In real implementation, this would add relevant content to reach minimum word count
    return Math.random() > 0.2; // Simulate 80% success rate
  }

  adjustKeywordDensity(issue) {
    console.log(`🎯 Adjusting keyword density for "${issue.context?.keyword}" in ${issue.context?.file}`);
    // In real implementation, this would optimize keyword usage to ideal 1-3%
    return Math.random() > 0.1; // Simulate 90% success rate
  }

  increaseKeywordUsage(issue) {
    console.log(`📈 Increasing keyword usage for "${issue.context?.keyword}" in ${issue.context?.file}`);
    // In real implementation, this would naturally integrate more keywords
    return Math.random() > 0.15; // Simulate 85% success rate
  }

  // Market Readiness Auto-fix implementations
  improveTechnicalReadiness(issue) {
    console.log(`⚙️ Improving technical readiness for ${issue.context?.country}`);
    // In real implementation, this would update infrastructure, localization, payments
    return Math.random() > 0.4; // Simulate 60% success rate
  }

  improveOperationalReadiness(issue) {
    console.log(`🔧 Improving operational readiness for ${issue.context?.country}`);
    // In real implementation, this would update processes, documentation, training
    return Math.random() > 0.3; // Simulate 70% success rate
  }

  // Escalation implementations
  blockDeployment(decision) {
    console.log(`🚫 BLOCKING DEPLOYMENT due to ${decision.rule.severity} issue`);
    decision.escalated = true;
    decision.escalationTargets.push('deployment_pipeline');
    
    // In real implementation, this would set deployment gates
    process.env.BLOCK_DEPLOYMENT = 'true';
  }

  escalateToLegalTeam(decision) {
    console.log(`⚖️  Escalating to Legal Team`);
    decision.escalated = true;
    decision.escalationTargets.push('legal_team');
    
    this.escalationQueue.push({
      team: 'legal',
      urgency: decision.rule.urgency,
      issue: decision.issue,
      description: decision.rule.description,
      timestamp: new Date().toISOString()
    });
  }

  escalateToContentTeam(decision) {
    console.log(`📝 Escalating to Content Team`);
    decision.escalated = true;
    decision.escalationTargets.push('content_team');
    
    this.escalationQueue.push({
      team: 'content',
      urgency: decision.rule.urgency,
      issue: decision.issue,
      description: decision.rule.description,
      timestamp: new Date().toISOString()
    });
  }

  escalateToDevTeam(decision) {
    console.log(`👨‍💻 Escalating to Dev Team`);
    decision.escalated = true;
    decision.escalationTargets.push('dev_team');
    
    this.escalationQueue.push({
      team: 'dev',
      urgency: decision.rule.urgency,
      issue: decision.issue,
      description: decision.rule.description,
      timestamp: new Date().toISOString()
    });
  }

  alertCTO(decision) {
    console.log(`🚨 ALERTING CTO - Critical Issue Detected`);
    decision.escalated = true;
    decision.escalationTargets.push('cto');
    
    this.escalationQueue.push({
      team: 'cto',
      urgency: 'immediate',
      issue: decision.issue,
      description: decision.rule.description,
      timestamp: new Date().toISOString(),
      priority: 'P0'
    });
  }

  logIssue(decision) {
    console.log(`📋 Logging issue for periodic review`);
    // Issues are logged in actionResults for batch processing
  }

  // Handle unknown issue types
  handleUnknownIssue(issue) {
    console.log(`❓ Unknown issue type, applying default handling`);
    
    const decision = {
      timestamp: new Date().toISOString(),
      issue,
      severity: SEVERITY.MEDIUM,
      actions: [ESCALATION_CHANNELS.DEV_TEAM, ESCALATION_CHANNELS.LOG_ONLY],
      autoFixAttempted: false,
      autoFixSuccessful: false,
      escalated: true,
      escalationTargets: ['dev_team']
    };

    this.escalateToDevTeam(decision);
    return decision;
  }

  // Process quality verification results
  processQualityResults(qualityReport) {
    console.log('\n🎯 Processing Quality Verification Results...');
    
    const issues = [];

    // Check quality score
    if (qualityReport.score < 95) {
      issues.push({
        type: ISSUE_TYPES.QUALITY_DEGRADATION,
        subtype: 'quality_score_drop',
        context: { currentScore: qualityReport.score, threshold: 95 },
        metadata: { report: qualityReport }
      });
    }

    // Check for errors
    if (qualityReport.summary?.failedChecks > 0) {
      qualityReport.errors?.forEach(error => {
        if (error.check === 'Metadata') {
          issues.push({
            type: ISSUE_TYPES.QUALITY_DEGRADATION,
            subtype: 'metadata_incomplete',
            context: { documentId: error.file, error: error.message },
            metadata: error
          });
        }
      });
    }

    return issues.map(issue => this.processIssue(issue));
  }

  // Process legal compliance results
  processLegalResults(legalReport) {
    console.log('\n⚖️  Processing Legal Compliance Results...');
    
    const issues = [];

    // Check for compliance violations
    legalReport.errors?.forEach(error => {
      if (error.type === 'missing-clauses') {
        issues.push({
          type: ISSUE_TYPES.LEGAL_VIOLATION,
          subtype: 'missing_required_clause',
          context: { 
            documentId: error.documentId, 
            missingClauses: error.message 
          },
          metadata: error
        });
      }
    });

    return issues.map(issue => this.processIssue(issue));
  }

  // Process translation results
  processTranslationResults(translationReport) {
    console.log('\n🌐 Processing Translation Validation Results...');
    
    const issues = [];

    // Check for low confidence translations
    Object.entries(translationReport.results || {}).forEach(([docId, result]) => {
      if (result.shouldFallback) {
        issues.push({
          type: ISSUE_TYPES.TRANSLATION_RISK,
          subtype: 'low_confidence_legal_term',
          context: { 
            documentId: docId, 
            confidence: result.confidence,
            issues: result.issues 
          },
          metadata: result
        });
      }
    });

    return issues.map(issue => this.processIssue(issue));
  }

  // Process SEO content uniqueness results
  processSEOResults(seoReport) {
    console.log('\n🔍 Processing SEO Content Uniqueness Results...');
    
    const issues = [];

    // Check for critical SEO health issues
    if (seoReport.summary?.overallHealthScore < 70) {
      issues.push({
        type: ISSUE_TYPES.SEO_ISSUE,
        subtype: 'seo_health_critical',
        context: { 
          healthScore: seoReport.summary.overallHealthScore,
          criticalIssues: seoReport.summary.duplicateIssues + seoReport.summary.thinContentIssues
        },
        metadata: seoReport.summary
      });
    }

    // Check for duplicate content issues
    seoReport.issues?.duplicates?.forEach(duplicate => {
      issues.push({
        type: ISSUE_TYPES.SEO_ISSUE,
        subtype: 'duplicate_content',
        context: { 
          file1: duplicate.file1,
          file2: duplicate.file2,
          similarity: duplicate.similarity,
          severity: duplicate.severity
        },
        metadata: duplicate
      });
    });

    // Check for thin content issues
    seoReport.issues?.thinContent?.forEach(thinContent => {
      issues.push({
        type: ISSUE_TYPES.SEO_ISSUE,
        subtype: 'thin_content',
        context: { 
          file: thinContent.file,
          wordCount: thinContent.wordCount,
          minRequired: 300
        },
        metadata: thinContent
      });
    });

    // Check for keyword optimization issues
    seoReport.issues?.keywords?.forEach(keywordIssue => {
      const subtype = keywordIssue.issue === 'Keyword over-optimization' ? 
        'keyword_over_optimization' : 'keyword_under_optimization';
      
      issues.push({
        type: ISSUE_TYPES.SEO_ISSUE,
        subtype: subtype,
        context: { 
          file: keywordIssue.file,
          keyword: keywordIssue.keyword,
          density: keywordIssue.density
        },
        metadata: keywordIssue
      });
    });

    return issues.map(issue => this.processIssue(issue));
  }

  // Process market readiness validation results
  processMarketReadinessResults(validationReport) {
    console.log('\n🌍 Processing Market Readiness Validation Results...');
    
    const issues = [];

    // Single market validation
    if (validationReport.country) {
      const validation = validationReport;
      
      if (!validation.launchApproved) {
        // Critical compliance issue
        issues.push({
          type: ISSUE_TYPES.MARKET_READINESS,
          subtype: 'compliance_below_threshold',
          context: { 
            country: validation.country,
            complianceScore: validation.complianceScore,
            adjustedScore: validation.adjustedScore,
            threshold: validation.threshold
          },
          metadata: validation
        });

        // Process specific blockers
        validation.blockers?.forEach(blocker => {
          if (blocker.severity === 'critical') {
            let subtype = 'critical_legal_blocker';
            if (blocker.category === 'regulatoryCompliance') {
              subtype = 'regulatory_compliance_gap';
            } else if (blocker.category === 'technicalReadiness') {
              subtype = 'technical_readiness_low';
            } else if (blocker.category === 'marketPreparation') {
              subtype = 'market_preparation_incomplete';
            } else if (blocker.category === 'operationalReadiness') {
              subtype = 'operational_readiness_gap';
            }

            issues.push({
              type: ISSUE_TYPES.MARKET_READINESS,
              subtype: subtype,
              context: { 
                country: validation.country,
                category: blocker.category,
                requirement: blocker.requirement,
                score: blocker.score,
                issue: blocker.issue
              },
              metadata: blocker
            });
          }
        });
      }
    }

    // Staged rollout validation
    if (validationReport.countries) {
      const results = validationReport;
      
      // Process blocked markets
      results.blockedMarkets?.forEach(blockedMarket => {
        issues.push({
          type: ISSUE_TYPES.MARKET_READINESS,
          subtype: 'compliance_below_threshold',
          context: { 
            country: blockedMarket.country,
            complianceScore: blockedMarket.score,
            criticalBlockers: blockedMarket.blockers,
            estimatedReadyDate: blockedMarket.estimatedReadyDate
          },
          metadata: blockedMarket
        });
      });

      // Check if overall rollout readiness is low
      if (results.summary.blocked > results.summary.approved) {
        issues.push({
          type: ISSUE_TYPES.MARKET_READINESS,
          subtype: 'compliance_below_threshold',
          context: { 
            rolloutType: 'staged',
            totalMarkets: results.summary.total,
            blockedMarkets: results.summary.blocked,
            approvedMarkets: results.summary.approved,
            averageScore: results.summary.averageScore
          },
          metadata: results.summary
        });
      }
    }

    return issues.map(issue => this.processIssue(issue));
  }

  // Generate decision report
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalIssues: this.actionResults.length,
        criticalIssues: this.actionResults.filter(r => r.severity === SEVERITY.CRITICAL).length,
        highIssues: this.actionResults.filter(r => r.severity === SEVERITY.HIGH).length,
        mediumIssues: this.actionResults.filter(r => r.severity === SEVERITY.MEDIUM).length,
        lowIssues: this.actionResults.filter(r => r.severity === SEVERITY.LOW).length,
        autoFixAttempts: this.actionResults.filter(r => r.autoFixAttempted).length,
        autoFixSuccesses: this.actionResults.filter(r => r.autoFixSuccessful).length,
        escalatedIssues: this.actionResults.filter(r => r.escalated).length,
        blockedDeployment: process.env.BLOCK_DEPLOYMENT === 'true'
      },
      decisions: this.actionResults,
      escalationQueue: this.escalationQueue,
      recommendations: this.generateRecommendations()
    };

    const reportPath = path.join(this.reportsDir, `decision-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    return { report, reportPath };
  }

  generateRecommendations() {
    const recommendations = [];

    const criticalCount = this.actionResults.filter(r => r.severity === SEVERITY.CRITICAL).length;
    if (criticalCount > 0) {
      recommendations.push({
        priority: 'P0',
        message: `${criticalCount} critical issues require immediate attention`,
        action: 'Review escalation queue and address critical issues first'
      });
    }

    const failedAutoFixes = this.actionResults.filter(r => r.autoFixAttempted && !r.autoFixSuccessful).length;
    if (failedAutoFixes > 2) {
      recommendations.push({
        priority: 'P1',
        message: `${failedAutoFixes} auto-fix attempts failed`,
        action: 'Review auto-fix implementations and improve success rate'
      });
    }

    return recommendations;
  }

  // Display results
  displayResults() {
    console.log('\n' + '═'.repeat(60));
    console.log('🎯 DECISION ENGINE RESULTS');
    console.log('═'.repeat(60));

    const summary = {
      totalIssues: this.actionResults.length,
      critical: this.actionResults.filter(r => r.severity === SEVERITY.CRITICAL).length,
      high: this.actionResults.filter(r => r.severity === SEVERITY.HIGH).length,
      medium: this.actionResults.filter(r => r.severity === SEVERITY.MEDIUM).length,
      low: this.actionResults.filter(r => r.severity === SEVERITY.LOW).length,
      autoFixed: this.actionResults.filter(r => r.autoFixSuccessful).length,
      escalated: this.actionResults.filter(r => r.escalated).length
    };

    console.log(`📊 Issues Processed: ${summary.totalIssues}`);
    console.log(`🚨 Critical: ${summary.critical} | High: ${summary.high} | Medium: ${summary.medium} | Low: ${summary.low}`);
    console.log(`🔧 Auto-Fixed: ${summary.autoFixed}`);
    console.log(`📤 Escalated: ${summary.escalated}`);

    if (process.env.BLOCK_DEPLOYMENT === 'true') {
      console.log(`🚫 DEPLOYMENT BLOCKED due to critical issues`);
    }

    if (this.escalationQueue.length > 0) {
      console.log(`\n📋 Escalation Queue (${this.escalationQueue.length} items):`);
      this.escalationQueue.forEach(item => {
        console.log(`   ${item.urgency.toUpperCase()}: ${item.team} - ${item.description}`);
      });
    }

    return summary;
  }
}

module.exports = DecisionEngine;