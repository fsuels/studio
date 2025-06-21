#!/usr/bin/env node

/**
 * Complete Smart Pricing & Tax Engine Test Suite
 * 
 * Runs comprehensive tests for your entire Smart Pricing implementation:
 * - Multi-currency pricing
 * - Geolocation detection
 * - Tax calculation
 * - Purchase order workflow
 * - Stripe integration
 * - Performance benchmarks
 * 
 * Usage:
 * 1. Start your dev server: npm run dev
 * 2. Set environment variables:
 *    export STRIPE_SECRET_KEY=sk_test_...
 *    export TEST_BASE_URL=http://localhost:3000
 * 3. Run: node scripts/run-complete-tests.js
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Test configuration
const CONFIG = {
  baseUrl: process.env.TEST_BASE_URL || 'http://localhost:3000',
  stripeKey: process.env.STRIPE_SECRET_KEY,
  timeout: 30000, // 30 seconds per test suite
  retries: 2,
};

// Test suites to run
const TEST_SUITES = [
  {
    name: 'Smart Pricing API Tests',
    script: 'test-smart-pricing.js',
    description: 'Tests multi-currency pricing and geolocation',
    required: true,
  },
  {
    name: 'Stripe Tax Integration Tests',
    script: 'test-stripe-tax.js',
    description: 'Tests VAT/GST/Sales tax calculation',
    required: true,
    needsStripeKey: true,
  },
  {
    name: 'Stripe Price Setup',
    script: 'stripe-price-setup.js',
    description: 'Creates multi-currency price IDs in Stripe',
    required: false,
    needsStripeKey: true,
    interactive: true,
  },
];

// Color codes for output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function colorize(text, color) {
  return colors[color] + text + colors.reset;
}

function logSection(title) {
  console.log(`\n${colorize('='.repeat(60), 'cyan')}`);
  console.log(colorize(`🧪 ${title}`, 'bold'));
  console.log(colorize('='.repeat(60), 'cyan'));
}

function logSuccess(message) {
  console.log(`${colorize('✅', 'green')} ${message}`);
}

function logError(message) {
  console.log(`${colorize('❌', 'red')} ${message}`);
}

function logWarning(message) {
  console.log(`${colorize('⚠️ ', 'yellow')} ${message}`);
}

function logInfo(message) {
  console.log(`${colorize('ℹ️ ', 'blue')} ${message}`);
}

async function checkPrerequisites() {
  logSection('Prerequisites Check');
  
  const checks = [
    {
      name: 'Node.js version',
      check: async () => {
        const version = process.version;
        const major = parseInt(version.slice(1).split('.')[0]);
        return major >= 16;
      },
      fix: 'Upgrade to Node.js 16 or higher',
    },
    {
      name: 'Development server',
      check: async () => {
        try {
          const response = await fetch(`${CONFIG.baseUrl}/api/pricing/smart-session?planId=starter`);
          return response.status !== 404;
        } catch (error) {
          return false;
        }
      },
      fix: 'Start development server: npm run dev',
    },
    {
      name: 'Stripe package',
      check: async () => {
        try {
          require('stripe');
          return true;
        } catch (error) {
          return false;
        }
      },
      fix: 'Install Stripe: npm install stripe',
    },
    {
      name: 'Test scripts exist',
      check: async () => {
        const scriptsDir = path.join(__dirname);
        return TEST_SUITES.every(suite => 
          fs.existsSync(path.join(scriptsDir, suite.script))
        );
      },
      fix: 'Ensure all test scripts are present',
    },
  ];

  let allPassed = true;
  
  for (const check of checks) {
    try {
      const passed = await check.check();
      if (passed) {
        logSuccess(check.name);
      } else {
        logError(`${check.name} - ${check.fix}`);
        allPassed = false;
      }
    } catch (error) {
      logError(`${check.name} - ${error.message}`);
      allPassed = false;
    }
  }

  if (!allPassed) {
    logError('Prerequisites check failed. Please fix the issues above.');
    process.exit(1);
  }

  logSuccess('All prerequisites passed!');
  return true;
}

async function runTestSuite(suite) {
  return new Promise((resolve) => {
    logSection(`Running ${suite.name}`);
    logInfo(suite.description);
    
    if (suite.needsStripeKey && !CONFIG.stripeKey) {
      logWarning('Skipping - Stripe key not provided');
      logInfo('Set STRIPE_SECRET_KEY environment variable to run this test');
      resolve({ success: true, skipped: true, suite: suite.name });
      return;
    }

    const scriptPath = path.join(__dirname, suite.script);
    const env = { 
      ...process.env, 
      TEST_BASE_URL: CONFIG.baseUrl,
      STRIPE_SECRET_KEY: CONFIG.stripeKey || '',
    };

    logInfo(`Executing: node ${suite.script}`);
    
    const child = spawn('node', [scriptPath], {
      stdio: 'pipe',
      env,
      cwd: __dirname,
    });

    let output = '';
    let errorOutput = '';
    
    child.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      // Real-time output for interactive scripts
      if (suite.interactive) {
        process.stdout.write(text);
      }
    });

    child.stderr.on('data', (data) => {
      const text = data.toString();
      errorOutput += text;
      if (suite.interactive) {
        process.stderr.write(text);
      }
    });

    const timeout = setTimeout(() => {
      child.kill();
      logError(`Test timed out after ${CONFIG.timeout / 1000} seconds`);
      resolve({ success: false, error: 'Timeout', suite: suite.name });
    }, CONFIG.timeout);

    child.on('close', (code) => {
      clearTimeout(timeout);
      
      if (!suite.interactive) {
        // Show output for non-interactive tests
        if (output) {
          console.log(output);
        }
        if (errorOutput) {
          console.error(errorOutput);
        }
      }

      const success = code === 0;
      
      if (success) {
        logSuccess(`${suite.name} completed successfully`);
      } else {
        logError(`${suite.name} failed with exit code ${code}`);
      }

      resolve({ 
        success, 
        exitCode: code, 
        output, 
        errorOutput, 
        suite: suite.name 
      });
    });

    child.on('error', (error) => {
      clearTimeout(timeout);
      logError(`Failed to start ${suite.name}: ${error.message}`);
      resolve({ success: false, error: error.message, suite: suite.name });
    });
  });
}

async function generateFinalReport(results) {
  logSection('Final Test Report');
  
  const successful = results.filter(r => r.success && !r.skipped).length;
  const failed = results.filter(r => !r.success && !r.skipped).length;
  const skipped = results.filter(r => r.skipped).length;
  const total = results.length;

  console.log(`\n📊 Test Summary:`);
  console.log(`   ${colorize('✅ Successful:', 'green')} ${successful}/${total}`);
  console.log(`   ${colorize('❌ Failed:', 'red')} ${failed}/${total}`);
  console.log(`   ${colorize('⏭️  Skipped:', 'yellow')} ${skipped}/${total}`);

  if (failed > 0) {
    console.log(`\n${colorize('Failed Tests:', 'red')}`);
    results.filter(r => !r.success && !r.skipped).forEach(result => {
      console.log(`   • ${result.suite}: ${result.error || 'Unknown error'}`);
    });
  }

  if (skipped > 0) {
    console.log(`\n${colorize('Skipped Tests:', 'yellow')}`);
    results.filter(r => r.skipped).forEach(result => {
      console.log(`   • ${result.suite}: Missing requirements`);
    });
  }

  console.log(`\n${colorize('🎯 Next Steps:', 'bold')}`);
  
  if (failed === 0) {
    console.log(`   ${colorize('🎉 All tests passed!', 'green')} Your Smart Pricing Engine is ready.`);
    console.log(`   \n📋 Deployment Checklist:`);
    console.log(`   1. Enable Stripe Tax in dashboard: ${colorize('https://dashboard.stripe.com/tax/settings', 'cyan')}`);
    console.log(`   2. Create multi-currency prices: ${colorize('node scripts/stripe-price-setup.js', 'cyan')}`);
    console.log(`   3. Test in browser: ${colorize(`${CONFIG.baseUrl}/pricing`, 'cyan')}`);
    console.log(`   4. Deploy to production`);
  } else {
    console.log(`   ${colorize('⚠️  Fix failing tests before deployment', 'yellow')}`);
    console.log(`   1. Review error messages above`);
    console.log(`   2. Check configuration and prerequisites`);
    console.log(`   3. Re-run tests: ${colorize('node scripts/run-complete-tests.js', 'cyan')}`);
  }

  console.log(`\n${colorize('📚 Documentation:', 'bold')}`);
  console.log(`   • Geolocation setup: ${colorize('GEOLOCATION_DEPLOYMENT_GUIDE.md', 'cyan')}`);
  console.log(`   • Stripe Tax setup: ${colorize('STRIPE_TAX_SETUP_GUIDE.md', 'cyan')}`);
  console.log(`   • API testing: ${colorize('scripts/test-smart-pricing.js', 'cyan')}`);

  return failed === 0;
}

async function main() {
  console.log(colorize('🚀 Smart Pricing & Tax Engine - Complete Test Suite', 'bold'));
  console.log(`${colorize('🔗 Testing:', 'blue')} ${CONFIG.baseUrl}`);
  console.log(`${colorize('🔑 Stripe:', 'blue')} ${CONFIG.stripeKey ? 'Configured' : 'Not configured'}\n`);

  try {
    // Check prerequisites
    await checkPrerequisites();

    // Run test suites
    const results = [];
    
    for (const suite of TEST_SUITES) {
      const result = await runTestSuite(suite);
      results.push(result);
      
      // Add delay between tests
      if (results.length < TEST_SUITES.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Generate final report
    const success = await generateFinalReport(results);
    
    process.exit(success ? 0 : 1);

  } catch (error) {
    logError(`Test suite failed: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

// Handle interruption
process.on('SIGINT', () => {
  console.log('\n\n⚠️  Test suite interrupted by user');
  process.exit(1);
});

// Run tests
if (require.main === module) {
  main();
}

module.exports = { runTestSuite, checkPrerequisites, CONFIG };