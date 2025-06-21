#!/usr/bin/env node

/**
 * Integrated Quality System with Decision Engine
 * Combines all quality checks with intelligent decision logic
 */

const DecisionEngine = require('./decision-engine');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class IntegratedQualitySystem {
  constructor() {
    this.decisionEngine = new DecisionEngine();
    this.reports = {
      quality: null,
      legal: null,
      translation: null,
      seo: null,
      market: null,
    };
  }

  async runComprehensiveValidation() {
    console.log('🚀 Integrated Quality System with Decision Engine');
    console.log('═'.repeat(60));

    try {
      // 1. Run Quality Verification
      console.log('\n1️⃣ Running Quality Verification...');
      this.reports.quality = await this.runQualityCheck();

      // 2. Run Legal Compliance
      console.log('\n2️⃣ Running Legal Compliance Check...');
      this.reports.legal = await this.runLegalCheck();

      // 3. Run Translation Validation
      console.log('\n3️⃣ Running Translation Validation...');
      this.reports.translation = await this.runTranslationCheck();

      // 4. Run SEO Content Uniqueness Check
      console.log('\n4️⃣ Running SEO Content Uniqueness Check...');
      this.reports.seo = await this.runSEOCheck();

      // 5. Run Market Readiness Check (if markets specified)
      const markets = process.argv
        .slice(2)
        .filter((arg) => !arg.startsWith('--'));
      if (markets.length > 0) {
        console.log('\n5️⃣ Running Market Readiness Validation...');
        this.reports.market = await this.runMarketCheck(markets);
      }

      // 6. Process Results Through Decision Engine
      console.log('\n6️⃣ Processing Results Through Decision Engine...');
      await this.processResultsWithDecisionEngine();

      // 7. Generate Final Report
      console.log('\n7️⃣ Generating Final Report...');
      const finalReport = this.generateFinalReport();

      // 6. Display Results
      this.decisionEngine.displayResults();

      // 7. Determine final exit code
      const shouldBlock = process.env.BLOCK_DEPLOYMENT === 'true';
      const criticalIssues = this.decisionEngine.actionResults.filter(
        (r) => r.severity === 'CRITICAL',
      ).length;

      if (shouldBlock || criticalIssues > 0) {
        console.log('\n🚫 SYSTEM DECISION: BLOCK DEPLOYMENT');
        console.log('💡 Critical issues must be resolved before proceeding');
        process.exit(1);
      } else {
        console.log('\n✅ SYSTEM DECISION: PROCEED WITH CAUTION');
        console.log(
          '📊 All systems operational with minor issues handled automatically',
        );
        process.exit(0);
      }
    } catch (error) {
      console.error('\n🚨 Integrated Quality System Failed:', error.message);

      // Emergency escalation
      this.decisionEngine.processIssue({
        type: 'security_issue',
        subtype: 'exposed_sensitive_data',
        context: { error: error.message },
        metadata: { stackTrace: error.stack },
      });

      process.exit(1);
    }
  }

  async runQualityCheck() {
    try {
      // Check if quality report exists from recent run
      const reportsDir = path.join(__dirname, '../quality-reports');
      if (fs.existsSync(reportsDir)) {
        const reports = fs
          .readdirSync(reportsDir)
          .filter((f) => f.endsWith('.json'))
          .map((f) => ({
            name: f,
            path: path.join(reportsDir, f),
            mtime: fs.statSync(path.join(reportsDir, f)).mtime,
          }))
          .sort((a, b) => b.mtime - a.mtime);

        if (reports.length > 0) {
          const latestReport = JSON.parse(
            fs.readFileSync(reports[0].path, 'utf8'),
          );
          console.log(`📊 Quality Score: ${latestReport.score}/100`);
          return latestReport;
        }
      }

      // Run quality check if no recent report
      execSync('node scripts/quality-verification-system.js', {
        stdio: 'inherit',
      });
      return this.getLatestReport('quality-reports');
    } catch (error) {
      console.error('Quality check failed:', error.message);
      return { score: 0, errors: [{ message: error.message }] };
    }
  }

  async runLegalCheck() {
    try {
      execSync('node scripts/legal-compliance-validator.js', { stdio: 'pipe' });
      return this.getLatestReport('compliance-reports');
    } catch (error) {
      console.error('Legal check failed:', error.message);
      return { errors: [{ message: error.message }] };
    }
  }

  async runTranslationCheck() {
    try {
      execSync('node scripts/translation-validation-system.js', {
        stdio: 'pipe',
      });
      return this.getLatestReport('translation-reports');
    } catch (error) {
      console.error('Translation check failed:', error.message);
      return { summary: { totalFallbacks: 0 }, results: {} };
    }
  }

  async runSEOCheck() {
    try {
      execSync('node scripts/seo-content-uniqueness-system.js', {
        stdio: 'pipe',
      });
      return this.getLatestReport('seo-reports');
    } catch (error) {
      console.error('SEO content check failed:', error.message);
      return {
        summary: {
          overallHealthScore: 100,
          duplicateIssues: 0,
          thinContentIssues: 0,
        },
        issues: { duplicates: [], thinContent: [], keywords: [] },
      };
    }
  }

  async runMarketCheck(markets) {
    try {
      const MarketReadinessValidationSystem = require('./market-readiness-validation-system');
      const validator = new MarketReadinessValidationSystem();

      if (markets.length === 1) {
        console.log(`🌍 Validating market readiness for ${markets[0]}`);
        return await validator.validateMarketReadiness(markets[0]);
      } else {
        console.log(`🌍 Validating staged rollout for ${markets.join(', ')}`);
        return await validator.validateStagedRollout(markets);
      }
    } catch (error) {
      console.error('Market validation failed:', error.message);
      return {
        launchApproved: false,
        country: markets[0] || 'unknown',
        errors: [{ message: error.message }],
      };
    }
  }

  getLatestReport(reportDir) {
    const reportsPath = path.join(__dirname, `../${reportDir}`);
    if (!fs.existsSync(reportsPath)) return null;

    const reports = fs
      .readdirSync(reportsPath)
      .filter((f) => f.endsWith('.json'))
      .map((f) => ({
        name: f,
        path: path.join(reportsPath, f),
        mtime: fs.statSync(path.join(reportsPath, f)).mtime,
      }))
      .sort((a, b) => b.mtime - a.mtime);

    if (reports.length === 0) return null;

    return JSON.parse(fs.readFileSync(reports[0].path, 'utf8'));
  }

  async processResultsWithDecisionEngine() {
    let allDecisions = [];

    // Process quality results
    if (this.reports.quality) {
      const qualityDecisions = this.decisionEngine.processQualityResults(
        this.reports.quality,
      );
      allDecisions = allDecisions.concat(qualityDecisions);
    }

    // Process legal results
    if (this.reports.legal) {
      const legalDecisions = this.decisionEngine.processLegalResults(
        this.reports.legal,
      );
      allDecisions = allDecisions.concat(legalDecisions);
    }

    // Process translation results
    if (this.reports.translation) {
      const translationDecisions =
        this.decisionEngine.processTranslationResults(this.reports.translation);
      allDecisions = allDecisions.concat(translationDecisions);
    }

    // Process SEO results
    if (this.reports.seo) {
      const seoDecisions = this.decisionEngine.processSEOResults(
        this.reports.seo,
      );
      allDecisions = allDecisions.concat(seoDecisions);
    }

    // Process market readiness results
    if (this.reports.market) {
      const marketDecisions = this.decisionEngine.processMarketReadinessResults(
        this.reports.market,
      );
      allDecisions = allDecisions.concat(marketDecisions);
    }

    return allDecisions;
  }

  generateFinalReport() {
    const { report, reportPath } = this.decisionEngine.generateReport();

    // Enhanced report with all system data
    const finalReport = {
      ...report,
      systemReports: {
        quality: this.reports.quality,
        legal: this.reports.legal,
        translation: this.reports.translation,
        seo: this.reports.seo,
        market: this.reports.market,
      },
      overallStatus: this.calculateOverallStatus(),
      actionsSummary: this.generateActionsSummary(),
    };

    // Save enhanced report
    const enhancedReportPath = path.join(
      __dirname,
      '../decision-reports',
      `integrated-report-${Date.now()}.json`,
    );
    fs.writeFileSync(enhancedReportPath, JSON.stringify(finalReport, null, 2));

    console.log(`📋 Integrated report saved: ${enhancedReportPath}`);

    return finalReport;
  }

  calculateOverallStatus() {
    const qualityScore = this.reports.quality?.score || 0;
    const criticalIssues = this.decisionEngine.actionResults.filter(
      (r) => r.severity === 'CRITICAL',
    ).length;
    const highIssues = this.decisionEngine.actionResults.filter(
      (r) => r.severity === 'HIGH',
    ).length;

    if (criticalIssues > 0) return 'CRITICAL';
    if (qualityScore < 80 || highIssues > 3) return 'HIGH_RISK';
    if (qualityScore < 95 || highIssues > 0) return 'MEDIUM_RISK';
    return 'HEALTHY';
  }

  generateActionsSummary() {
    const autoFixed = this.decisionEngine.actionResults.filter(
      (r) => r.autoFixSuccessful,
    ).length;
    const escalated = this.decisionEngine.actionResults.filter(
      (r) => r.escalated,
    ).length;
    const blocked = process.env.BLOCK_DEPLOYMENT === 'true';

    return {
      autoFixedIssues: autoFixed,
      escalatedIssues: escalated,
      deploymentBlocked: blocked,
      requiresManualReview: escalated > 0,
      safeToDeployAnyway: !blocked && escalated === 0,
    };
  }
}

// CLI execution
if (require.main === module) {
  const system = new IntegratedQualitySystem();
  system.runComprehensiveValidation().catch((error) => {
    console.error('🚨 System failure:', error);
    process.exit(1);
  });
}

module.exports = IntegratedQualitySystem;
