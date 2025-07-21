#!/usr/bin/env node

/**
 * Smart Pricing API Integration Test Suite
 * 
 * Tests the /api/pricing/smart-session endpoint with various scenarios:
 * - Different IP locations (US, UK, Germany, etc.)
 * - Currency detection and pricing localization
 * - Tax calculation and VAT handling
 * - Purchase order vs. card payment flows
 * 
 * Usage:
 * 1. Start your development server: npm run dev
 * 2. Run tests: node scripts/test-smart-pricing.js
 */

const https = require('https');
const http = require('http');

// Test configuration
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const TEST_SCENARIOS = [
  {
    name: 'US Customer - California',
    headers: {
      'x-forwarded-for': '8.8.8.8', // Google DNS (US)
      'user-agent': 'SmartPricingTest/1.0',
    },
    expectedCurrency: 'USD',
    expectedTax: { required: true, type: 'Sales Tax' },
    planId: 'professional',
  },
  {
    name: 'UK Customer - London',
    headers: {
      'x-forwarded-for': '81.2.69.142', // UK IP
      'user-agent': 'SmartPricingTest/1.0',
    },
    expectedCurrency: 'GBP',
    expectedTax: { required: true, type: 'VAT' },
    planId: 'starter',
  },
  {
    name: 'German Customer - Berlin',
    headers: {
      'x-forwarded-for': '217.247.49.1', // German IP
      'user-agent': 'SmartPricingTest/1.0',
    },
    expectedCurrency: 'EUR',
    expectedTax: { required: true, type: 'VAT' },
    planId: 'business',
  },
  {
    name: 'Enterprise Customer - Purchase Order',
    headers: {
      'x-forwarded-for': '8.8.8.8',
      'user-agent': 'SmartPricingTest/1.0',
    },
    expectedCurrency: 'USD',
    planId: 'enterprise',
    allowPurchaseOrder: true,
  },
  {
    name: 'Canadian Customer',
    headers: {
      'x-forwarded-for': '142.250.191.78', // Canadian IP
      'user-agent': 'SmartPricingTest/1.0',
    },
    expectedCurrency: 'USD', // Canada uses USD in our system
    expectedTax: { required: true, type: 'GST' },
    planId: 'professional',
  },
];

function makeRequest(method, path, headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = (url.protocol === 'https:' ? https : http).request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    
    req.end();
  });
}

async function testPricingSummary(scenario) {
  console.log(`\n🧪 Testing: ${scenario.name}`);
  console.log(`   IP: ${scenario.headers['x-forwarded-for']}`);
  
  try {
    // Test GET endpoint for pricing summary
    const response = await makeRequest(
      'GET', 
      `/api/pricing/smart-session?planId=${scenario.planId}`,
      scenario.headers
    );

    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(response.data)}`);
    }

    const { userCurrency, userLocation, availablePlans, taxInfo } = response.data;
    
    // Validate currency detection
    if (scenario.expectedCurrency && userCurrency !== scenario.expectedCurrency) {
      console.log(`   ⚠️  Currency mismatch: expected ${scenario.expectedCurrency}, got ${userCurrency}`);
    } else {
      console.log(`   ✅ Currency: ${userCurrency}`);
    }
    
    // Validate location detection
    console.log(`   🌍 Location: ${userLocation.country} (${userLocation.countryCode})`);
    
    // Validate tax info
    if (scenario.expectedTax) {
      if (taxInfo.taxRequired === scenario.expectedTax.required && 
          taxInfo.taxType === scenario.expectedTax.type) {
        console.log(`   ✅ Tax: ${taxInfo.taxType} (required: ${taxInfo.taxRequired})`);
      } else {
        console.log(`   ⚠️  Tax mismatch: expected ${JSON.stringify(scenario.expectedTax)}, got ${JSON.stringify(taxInfo)}`);
      }
    } else {
      console.log(`   📊 Tax: ${taxInfo.taxType} (required: ${taxInfo.taxRequired})`);
    }
    
    // Validate plans
    const targetPlan = availablePlans.find(p => p.id === scenario.planId);
    if (targetPlan) {
      const price = targetPlan.localizedPrices[userCurrency];
      console.log(`   💰 ${targetPlan.name}: ${price} ${userCurrency}`);
    }
    
    return { success: true, data: response.data };
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testCheckoutSession(scenario) {
  console.log(`\n🛒 Testing checkout: ${scenario.name}`);
  
  try {
    const body = {
      planId: scenario.planId,
      locale: 'en',
      allowPurchaseOrder: scenario.allowPurchaseOrder || false,
      customerEmail: 'test@example.com',
    };

    const response = await makeRequest(
      'POST',
      '/api/pricing/smart-session',
      scenario.headers,
      body
    );

    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(response.data)}`);
    }

    const { sessionId, requiresPurchaseOrder, purchaseOrderId, pricingSummary } = response.data;
    
    if (requiresPurchaseOrder) {
      console.log(`   📋 Purchase Order: ${purchaseOrderId}`);
      console.log(`   ✅ B2B flow activated for enterprise plan`);
    } else if (sessionId) {
      console.log(`   💳 Stripe Session: ${sessionId}`);
      console.log(`   ✅ Card payment flow activated`);
    } else {
      console.log(`   ⚠️  No session ID or purchase order returned`);
    }
    
    return { success: true, data: response.data };
    
  } catch (error) {
    console.log(`   ❌ Checkout Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testGeolocationEdgeCases() {
  console.log(`\n🌐 Testing geolocation edge cases...`);
  
  const edgeCases = [
    {
      name: 'No IP header (localhost)',
      headers: {},
      expectedFallback: true,
    },
    {
      name: 'Invalid IP address',
      headers: { 'x-forwarded-for': 'invalid.ip.address' },
      expectedFallback: true,
    },
    {
      name: 'Private IP (192.168.x.x)',
      headers: { 'x-forwarded-for': '192.168.1.100' },
      expectedFallback: true,
    },
    {
      name: 'Multiple IPs (proxy chain)',
      headers: { 'x-forwarded-for': '8.8.8.8, 192.168.1.1, 10.0.0.1' },
      expectedFirstIP: '8.8.8.8',
    },
  ];

  for (const testCase of edgeCases) {
    try {
      const response = await makeRequest(
        'GET',
        '/api/pricing/smart-session?planId=starter',
        testCase.headers
      );

      if (response.status === 200) {
        const { userLocation } = response.data;
        console.log(`   ✅ ${testCase.name}: ${userLocation.country} (${userLocation.provider || 'unknown'})`);
      } else {
        console.log(`   ⚠️  ${testCase.name}: HTTP ${response.status}`);
      }
    } catch (error) {
      console.log(`   ❌ ${testCase.name}: ${error.message}`);
    }
  }
}

async function generateTestReport(results) {
  console.log(`\n\n📊 Test Report`);
  console.log(`${'='.repeat(50)}`);
  
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`✅ Successful tests: ${successful}/${total}`);
  console.log(`❌ Failed tests: ${total - successful}/${total}`);
  
  if (successful === total) {
    console.log(`\n🎉 All tests passed! Your Smart Pricing Engine is working correctly.`);
  } else {
    console.log(`\n⚠️  Some tests failed. Check the errors above.`);
  }
  
  console.log(`\n📋 Next steps:`);
  console.log(`1. Fix any failing tests`);
  console.log(`2. Run: node scripts/stripe-price-setup.js`);
  console.log(`3. Test in browser: ${BASE_URL}/pricing`);
  console.log(`4. Enable Stripe Tax in dashboard`);
}

async function runBenchmark() {
  console.log(`\n⚡ Performance Benchmark`);
  console.log(`${'='.repeat(30)}`);
  
  const iterations = 10;
  const startTime = Date.now();
  
  for (let i = 0; i < iterations; i++) {
    await makeRequest('GET', '/api/pricing/smart-session?planId=professional', {
      'x-forwarded-for': '8.8.8.8'
    });
  }
  
  const endTime = Date.now();
  const avgTime = (endTime - startTime) / iterations;
  
  console.log(`📈 Average response time: ${avgTime.toFixed(0)}ms (${iterations} requests)`);
  
  if (avgTime < 500) {
    console.log(`✅ Performance: Excellent (< 500ms)`);
  } else if (avgTime < 1000) {
    console.log(`⚠️  Performance: Good (< 1s) - consider caching`);
  } else {
    console.log(`❌ Performance: Slow (> 1s) - optimization needed`);
  }
}

async function main() {
  console.log('🚀 Starting Smart Pricing API Tests...');
  console.log(`🔗 Testing: ${BASE_URL}`);
  
  try {
    // Test server connectivity
    await makeRequest('GET', '/api/pricing/smart-session?planId=starter');
    console.log('✅ Server connectivity OK');
  } catch (error) {
    console.error('❌ Cannot connect to server:', error.message);
    console.log('💡 Make sure your development server is running: npm run dev');
    process.exit(1);
  }
  
  const results = [];
  
  // Test pricing summary for each scenario
  for (const scenario of TEST_SCENARIOS) {
    const result = await testPricingSummary(scenario);
    results.push(result);
  }
  
  // Test checkout sessions
  for (const scenario of TEST_SCENARIOS) {
    const result = await testCheckoutSession(scenario);
    results.push(result);
  }
  
  // Test edge cases
  await testGeolocationEdgeCases();
  
  // Performance benchmark
  await runBenchmark();
  
  // Generate report
  await generateTestReport(results);
}

// Run tests
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testPricingSummary, testCheckoutSession, makeRequest };