#!/usr/bin/env node

// Complete Test Suite Runner
// Executes all testing infrastructure components in sequence

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class CompleteTestSuite {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      session: `test-suite-${Date.now()}`,
      phases: {},
      summary: {
        totalTests: 0,
        passed: 0,
        failed: 0,
        duration: 0,
      },
    };
    this.startTime = Date.now();
  }

  async runPhase(phaseName, command, description) {
    console.log(`\n🔄 ${phaseName}: ${description}`);
    console.log('='.repeat(50));

    const phaseStart = Date.now();
    let success = false;
    let output = '';
    let error = '';

    try {
      output = execSync(command, {
        encoding: 'utf8',
        timeout: 300000, // 5 minute timeout
        cwd: process.cwd(),
      });
      success = true;
      console.log(`✅ ${phaseName} completed successfully`);
    } catch (err) {
      error = err.message;
      console.log(`❌ ${phaseName} failed: ${err.message}`);
    }

    const duration = Date.now() - phaseStart;

    this.results.phases[phaseName] = {
      description,
      command,
      success,
      duration,
      output: output.slice(0, 1000), // Truncate long output
      error: error.slice(0, 500),
    };

    return success;
  }

  async runTestSuite() {
    console.log('🚀 Starting Complete Test Suite Execution');
    console.log('==========================================\n');

    // Phase 1: Performance Benchmarking
    await this.runPhase(
      'Performance Benchmarks',
      'node scripts/performance-benchmark.js',
      'Analyzing performance metrics and Core Web Vitals',
    );

    // Phase 2: Accessibility Testing
    await this.runPhase(
      'Accessibility Tests',
      'npx playwright test e2e/accessibility-tests.spec.ts',
      'Testing WCAG 2.1 AA compliance and keyboard navigation',
    );

    // Phase 3: Visual Regression Testing
    await this.runPhase(
      'Visual Regression Tests',
      'npx playwright test e2e/visual-regression.spec.ts',
      'Checking visual consistency across components and viewports',
    );

    // Phase 4: End-to-End User Journey Testing
    await this.runPhase(
      'E2E User Journeys',
      'npx playwright test e2e/user-journeys.spec.ts',
      'Testing critical user paths and workflows',
    );

    // Phase 5: Component Unit Tests
    const hasJest = fs.existsSync(
      path.join(process.cwd(), 'node_modules/.bin/jest'),
    );
    if (hasJest) {
      await this.runPhase(
        'Unit Tests',
        'npm test',
        'Running component unit tests and integration tests',
      );
    } else {
      console.log('⏭️  Skipping unit tests - Jest not configured');
      this.results.phases['Unit Tests'] = {
        description: 'Component unit tests',
        skipped: true,
        reason: 'Jest not configured',
      };
    }

    // Phase 6: Document Library Validation
    await this.runPhase(
      'Document Library Validation',
      'node scripts/validate-document-library.js',
      'Validating all 38 document types and schemas',
    );

    // Phase 7: SEO Infrastructure Validation
    await this.runPhase(
      'SEO Validation',
      'node scripts/validate-seo-infrastructure.js',
      'Checking SEO metadata, sitemaps, and structured data',
    );

    this.generateSummary();
    this.saveResults();
  }

  generateSummary() {
    const endTime = Date.now();
    this.results.summary.duration = endTime - this.startTime;

    let totalTests = 0;
    let passed = 0;
    let failed = 0;

    Object.values(this.results.phases).forEach((phase) => {
      if (!phase.skipped) {
        totalTests++;
        if (phase.success) {
          passed++;
        } else {
          failed++;
        }
      }
    });

    this.results.summary = {
      ...this.results.summary,
      totalTests,
      passed,
      failed,
      successRate:
        totalTests > 0 ? ((passed / totalTests) * 100).toFixed(1) : 0,
      overallStatus: failed === 0 ? 'PASSED' : 'FAILED',
    };

    console.log('\n📊 Test Suite Summary');
    console.log('====================');
    console.log(`Total Phases: ${totalTests}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Success Rate: ${this.results.summary.successRate}%`);
    console.log(
      `Duration: ${(this.results.summary.duration / 1000).toFixed(1)}s`,
    );
    console.log(`Overall Status: ${this.results.summary.overallStatus}`);

    if (failed > 0) {
      console.log('\n❌ Failed Phases:');
      Object.entries(this.results.phases).forEach(([name, phase]) => {
        if (!phase.success && !phase.skipped) {
          console.log(
            `  - ${name}: ${phase.error?.split('\n')[0] || 'Unknown error'}`,
          );
        }
      });
    }
  }

  saveResults() {
    const resultsPath = `test-suite-results-${Date.now()}.json`;
    fs.writeFileSync(resultsPath, JSON.stringify(this.results, null, 2));

    console.log(`\n💾 Results saved to: ${resultsPath}`);

    // Also create a simple status file for CI/CD
    const statusFile = {
      status: this.results.summary.overallStatus,
      timestamp: this.results.timestamp,
      successRate: this.results.summary.successRate,
      duration: this.results.summary.duration,
    };

    fs.writeFileSync('test-status.json', JSON.stringify(statusFile, null, 2));
  }
}

// Create validation scripts that the test suite depends on
async function createSupportingScripts() {
  // Document Library Validator
  const docValidatorPath = 'scripts/validate-document-library.js';
  if (!fs.existsSync(docValidatorPath)) {
    const docValidator = `#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('📚 Validating document library...');

const docsDir = 'src/lib/documents/us';
let validated = 0;
let errors = 0;

if (fs.existsSync(docsDir)) {
  const docs = fs.readdirSync(docsDir);
  
  docs.forEach(doc => {
    const docPath = path.join(docsDir, doc);
    if (fs.statSync(docPath).isDirectory()) {
      const requiredFiles = ['index.ts', 'schema.ts', 'questions.ts', 'metadata.ts'];
      
      requiredFiles.forEach(file => {
        const filePath = path.join(docPath, file);
        if (fs.existsSync(filePath)) {
          validated++;
        } else {
          console.log(\`❌ Missing \${file} in \${doc}\`);
          errors++;
        }
      });
    }
  });
}

console.log(\`✅ Document validation complete: \${validated} files validated, \${errors} errors\`);
process.exit(errors > 0 ? 1 : 0);
`;
    fs.writeFileSync(docValidatorPath, docValidator);
    fs.chmodSync(docValidatorPath, '755');
  }

  // SEO Infrastructure Validator
  const seoValidatorPath = 'scripts/validate-seo-infrastructure.js';
  if (!fs.existsSync(seoValidatorPath)) {
    const seoValidator = `#!/usr/bin/env node
const fs = require('fs');

console.log('🔍 Validating SEO infrastructure...');

const seoComponents = [
  'src/components/seo/SchemaMarkup.tsx',
  'src/components/seo/MetaTags.tsx',
  'src/components/seo/Breadcrumbs.tsx'
];

let validated = 0;
let errors = 0;

seoComponents.forEach(component => {
  if (fs.existsSync(component)) {
    console.log(\`✅ \${component} exists\`);
    validated++;
  } else {
    console.log(\`❌ Missing \${component}\`);
    errors++;
  }
});

// Check for sitemap and robots
if (fs.existsSync('src/app/sitemap.ts')) {
  console.log('✅ Sitemap generator exists');
  validated++;
} else {
  console.log('❌ Missing sitemap generator');
  errors++;
}

if (fs.existsSync('src/app/robots.ts')) {
  console.log('✅ Robots.txt generator exists');
  validated++;
} else {
  console.log('❌ Missing robots.txt generator');  
  errors++;
}

console.log(\`✅ SEO validation complete: \${validated} components validated, \${errors} errors\`);
process.exit(errors > 0 ? 1 : 0);
`;
    fs.writeFileSync(seoValidatorPath, seoValidator);
    fs.chmodSync(seoValidatorPath, '755');
  }
}

// Main execution
async function main() {
  try {
    await createSupportingScripts();

    const testSuite = new CompleteTestSuite();
    await testSuite.runTestSuite();

    const exitCode =
      testSuite.results.summary.overallStatus === 'PASSED' ? 0 : 1;
    process.exit(exitCode);
  } catch (error) {
    console.error('❌ Test suite execution failed:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);
