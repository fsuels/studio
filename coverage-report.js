#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Generate a detailed coverage report from Jest coverage data
 */
function generateCoverageReport(options = {}) {
  const { detailed = false, json = false, ci = false } = options;
  const coveragePath = path.join(process.cwd(), 'coverage');
  const summaryPath = path.join(coveragePath, 'coverage-summary.json');
  const detailedPath = path.join(coveragePath, 'coverage-final.json');

  if (!fs.existsSync(summaryPath)) {
    const message = 'No coverage data found. Run `npm run test:coverage` first.';
    if (json) {
      console.log(JSON.stringify({ error: message, success: false }));
    } else {
      console.log(`❌ ${message}`);
    }
    process.exit(1);
  }

  const coverageData = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
  const { total } = coverageData;

  // Enhanced thresholds matching jest.config.js
  const thresholds = {
    global: {
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80,
    },
    components: {
      lines: 85,
      functions: 85,
      branches: 80,
      statements: 85,
    },
    utils: {
      lines: 90,
      functions: 90,
      branches: 85,
      statements: 90,
    },
    lib: {
      lines: 75,
      functions: 75,
      branches: 70,
      statements: 75,
    },
  };

  if (json) {
    const result = {
      success: true,
      coverage: {
        total,
        thresholds,
        timestamp: new Date().toISOString(),
        passedThresholds: checkThresholds(total, thresholds.global),
      }
    };
    
    if (detailed && fs.existsSync(detailedPath)) {
      const detailedData = JSON.parse(fs.readFileSync(detailedPath, 'utf8'));
      result.coverage.detailed = getFileBreakdown(detailedData);
    }
    
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  if (!ci) {
    console.log('\n📊 Test Coverage Report\n');
    console.log('========================\n');
  }

  const formatCoverage = (metric, data) => {
    const pct = data.pct;
    const emoji = pct >= thresholds.global[metric] ? '✅' : '❌';
    return `${emoji} ${metric.padEnd(10)}: ${pct}% (${data.covered}/${data.total})`;
  };

  console.log(formatCoverage('Lines', total.lines));
  console.log(formatCoverage('Functions', total.functions));
  console.log(formatCoverage('Branches', total.branches));
  console.log(formatCoverage('Statements', total.statements));

  if (detailed && fs.existsSync(detailedPath)) {
    console.log('\n📂 File Breakdown\n');
    console.log('==================\n');
    
    const detailedData = JSON.parse(fs.readFileSync(detailedPath, 'utf8'));
    const breakdown = getFileBreakdown(detailedData);
    
    breakdown.forEach(file => {
      const status = file.coverage >= 80 ? '✅' : file.coverage >= 60 ? '⚠️' : '❌';
      console.log(`${status} ${file.path.padEnd(50)} ${file.coverage}%`);
    });
  }

  if (!ci) {
    console.log('\n========================\n');
  }

  // Check if coverage meets thresholds
  const failed = !checkThresholds(total, thresholds.global);

  if (failed) {
    console.log('❌ Coverage thresholds not met');
    if (ci) process.exit(1);
  } else {
    console.log('✅ All coverage thresholds met!');
  }

  return { success: !failed, coverage: total };
}

function checkThresholds(coverage, thresholds) {
  return Object.keys(thresholds).every(key => 
    coverage[key].pct >= thresholds[key]
  );
}

function getFileBreakdown(detailedData) {
  return Object.entries(detailedData)
    .filter(([path]) => !path.includes('node_modules'))
    .map(([path, data]) => {
      // Handle missing coverage data gracefully
      const lines = data.lines?.pct || 0;
      const functions = data.functions?.pct || 0;
      const branches = data.branches?.pct || 0;
      const statements = data.statements?.pct || 0;
      
      return {
        path: path.replace(process.cwd(), '.'),
        coverage: Math.round((lines + functions + branches + statements) / 4),
        lines,
        functions,
        branches,
        statements,
      };
    })
    .filter(file => file.coverage > 0) // Only show files with coverage data
    .sort((a, b) => a.coverage - b.coverage);
}

/**
 * Generate coverage badge data
 */
function generateBadgeData() {
  const summaryPath = path.join(process.cwd(), 'coverage', 'coverage-summary.json');
  
  if (!fs.existsSync(summaryPath)) {
    return null;
  }

  const { total } = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
  const avgCoverage = Math.round(
    (total.lines.pct + total.functions.pct + total.branches.pct + total.statements.pct) / 4
  );

  const color = avgCoverage >= 90 ? 'brightgreen' : 
                avgCoverage >= 80 ? 'green' : 
                avgCoverage >= 70 ? 'yellow' : 
                avgCoverage >= 60 ? 'orange' : 'red';

  return {
    schemaVersion: 1,
    label: 'coverage',
    message: `${avgCoverage}%`,
    color
  };
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    detailed: args.includes('--detailed'),
    json: args.includes('--json'),
    ci: args.includes('--ci'),
  };
  
  if (args.includes('--badge')) {
    const badgeData = generateBadgeData();
    if (badgeData) {
      console.log(JSON.stringify(badgeData));
    } else {
      console.log(JSON.stringify({ error: 'No coverage data found' }));
      process.exit(1);
    }
  } else {
    generateCoverageReport(options);
  }
}

module.exports = { generateCoverageReport, generateBadgeData };
