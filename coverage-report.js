#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Generate a simple coverage report from Jest coverage data
 */
function generateCoverageReport() {
  const coveragePath = path.join(process.cwd(), 'coverage');
  const summaryPath = path.join(coveragePath, 'coverage-summary.json');
  
  if (!fs.existsSync(summaryPath)) {
    console.log('❌ No coverage data found. Run `npm run test:coverage` first.');
    process.exit(1);
  }

  const coverageData = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
  const { total } = coverageData;

  console.log('\n📊 Test Coverage Report\n');
  console.log('========================\n');
  
  console.log(`Lines:      ${total.lines.pct}% (${total.lines.covered}/${total.lines.total})`);
  console.log(`Functions:  ${total.functions.pct}% (${total.functions.covered}/${total.functions.total})`);
  console.log(`Branches:   ${total.branches.pct}% (${total.branches.covered}/${total.branches.total})`);
  console.log(`Statements: ${total.statements.pct}% (${total.statements.covered}/${total.statements.total})`);
  
  console.log('\n========================\n');
  
  // Check if coverage meets thresholds
  const thresholds = {
    lines: 70,
    functions: 70,
    branches: 70,
    statements: 70
  };
  
  let failed = false;
  Object.keys(thresholds).forEach(key => {
    if (total[key].pct < thresholds[key]) {
      console.log(`⚠️  ${key} coverage (${total[key].pct}%) is below threshold (${thresholds[key]}%)`);
      failed = true;
    }
  });
  
  if (failed) {
    console.log('\n❌ Coverage thresholds not met');
    process.exit(1);
  } else {
    console.log('✅ All coverage thresholds met!');
  }
}

if (require.main === module) {
  generateCoverageReport();
}

module.exports = { generateCoverageReport };