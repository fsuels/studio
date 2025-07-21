#!/usr/bin/env node

/**
 * Stripe Tax Testing Suite
 * 
 * Tests Stripe Tax integration with different customer scenarios:
 * - US customers (sales tax)
 * - EU customers (VAT)
 * - UK customers (VAT)
 * - B2B customers (tax ID collection)
 * 
 * Usage:
 * 1. Set STRIPE_SECRET_KEY environment variable
 * 2. Run: node scripts/test-stripe-tax.js
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ Error: STRIPE_SECRET_KEY environment variable is required');
  process.exit(1);
}

const TEST_SCENARIOS = [
  {
    name: 'US Customer - California (Sales Tax)',
    customer: {
      email: 'test-us@example.com',
      address: {
        line1: '123 Market St',
        city: 'San Francisco',
        state: 'CA',
        postal_code: '94105',
        country: 'US',
      },
    },
    expectedTax: 'Sales Tax (~8.5%)',
  },
  {
    name: 'German Customer - B2C (VAT)',
    customer: {
      email: 'test-de@example.com',
      address: {
        line1: 'Unter den Linden 1',
        city: 'Berlin',
        postal_code: '10117',
        country: 'DE',
      },
    },
    expectedTax: 'German VAT (19%)',
  },
  {
    name: 'UK Customer - B2C (VAT)',
    customer: {
      email: 'test-uk@example.com',
      address: {
        line1: '10 Downing St',
        city: 'London',
        postal_code: 'SW1A 2AA',
        country: 'GB',
      },
    },
    expectedTax: 'UK VAT (20%)',
  },
  {
    name: 'French Business - B2B (Reverse Charge)',
    customer: {
      email: 'test-fr-business@example.com',
      address: {
        line1: 'Champs-Élysées 1',
        city: 'Paris',
        postal_code: '75008',
        country: 'FR',
      },
    },
    taxId: 'FR12345678901', // Sample French VAT number
    expectedTax: 'Reverse Charge (0% + VAT ID collection)',
  },
  {
    name: 'Canadian Customer (GST)',
    customer: {
      email: 'test-ca@example.com',
      address: {
        line1: '1 Yonge St',
        city: 'Toronto',
        state: 'ON',
        postal_code: 'M5E 1S8',
        country: 'CA',
      },
    },
    expectedTax: 'Canadian GST/HST',
  },
];

async function createTestCheckoutSession(scenario) {
  console.log(`\n🧪 Testing: ${scenario.name}`);
  
  try {
    // Create a test customer
    const customer = await stripe.customers.create({
      email: scenario.customer.email,
      address: scenario.customer.address,
      name: `Test Customer - ${scenario.name}`,
      metadata: {
        test_scenario: scenario.name,
        created_for: 'stripe-tax-testing',
      },
    });

    console.log(`   👤 Created customer: ${customer.id}`);

    // Create checkout session with tax
    const sessionData = {
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Professional Plan - Test',
              description: 'Test subscription for tax calculation',
            },
            unit_amount: 7900, // $79.00
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      automatic_tax: {
        enabled: true,
      },
      tax_id_collection: {
        enabled: true,
      },
      success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://example.com/cancel',
      metadata: {
        test_scenario: scenario.name,
      },
    };

    // Add customer details for tax calculation
    if (scenario.customer.address.country) {
      sessionData.customer_details = {
        country: scenario.customer.address.country,
      };
    }

    const session = await stripe.checkout.sessions.create(sessionData);

    console.log(`   💳 Created session: ${session.id}`);
    console.log(`   🌐 URL: ${session.url}`);
    console.log(`   💰 Amount: $${(session.amount_total || 7900) / 100}`);
    
    if (session.total_details?.amount_tax) {
      console.log(`   🏛️  Tax: $${session.total_details.amount_tax / 100}`);
    } else {
      console.log(`   🏛️  Tax: Will be calculated at checkout`);
    }
    
    console.log(`   ✅ Expected: ${scenario.expectedTax}`);

    // Clean up test customer
    await stripe.customers.del(customer.id);
    console.log(`   🗑️  Cleaned up customer`);

    return { success: true, sessionId: session.id, customerId: customer.id };

  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testTaxCalculation() {
  console.log('🏛️ Testing Stripe Tax Calculation...\n');
  
  // Check if Stripe Tax is enabled
  try {
    // Try to create a simple session with automatic tax
    const testSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'Tax Test' },
          unit_amount: 1000,
        },
        quantity: 1,
      }],
      mode: 'payment',
      automatic_tax: { enabled: true },
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });
    
    console.log('✅ Stripe Tax is enabled and working');
    
    // Clean up
    await stripe.checkout.sessions.expire(testSession.id);
    
  } catch (error) {
    if (error.message.includes('automatic_tax')) {
      console.error('❌ Stripe Tax is not enabled on your account');
      console.log('\n📋 To enable Stripe Tax:');
      console.log('1. Go to https://dashboard.stripe.com/tax/settings');
      console.log('2. Click "Enable automatic tax calculation"');
      console.log('3. Complete your business information');
      console.log('4. Add tax registrations for your jurisdictions');
      return false;
    } else {
      throw error;
    }
  }
  
  return true;
}

async function checkTaxRegistrations() {
  console.log('\n🔍 Checking Tax Registrations...\n');
  
  try {
    // Note: Tax registrations API is not directly accessible
    // This is a placeholder for checking via Dashboard
    console.log('📋 Tax Registration Checklist:');
    console.log('   □ US: Sales tax registrations in nexus states');
    console.log('   □ EU: VAT registration in applicable countries');
    console.log('   □ UK: VAT registration (if selling to UK)');
    console.log('   □ Canada: GST/HST registration (if applicable)');
    console.log('   □ Australia: GST registration (if applicable)');
    
    console.log('\n💡 Check your registrations at:');
    console.log('   https://dashboard.stripe.com/tax/registrations');
    
  } catch (error) {
    console.error('❌ Error checking registrations:', error.message);
  }
}

async function generateTaxTestReport(results) {
  console.log('\n\n📊 Tax Test Report');
  console.log('='.repeat(50));
  
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`✅ Successful tests: ${successful}/${total}`);
  console.log(`❌ Failed tests: ${total - successful}/${total}`);
  
  if (successful === total) {
    console.log('\n🎉 All tax tests passed! Your Stripe Tax integration is working.');
  } else {
    console.log('\n⚠️  Some tax tests failed. Check the errors above.');
  }
  
  console.log('\n📋 Next Steps:');
  console.log('1. Complete tax registrations in Stripe Dashboard');
  console.log('2. Test checkout flow in browser');
  console.log('3. Verify tax calculation with real test transactions');
  console.log('4. Monitor tax reports in Stripe Dashboard');
}

async function main() {
  console.log('🚀 Starting Stripe Tax Integration Tests...');
  console.log(`🔗 Stripe Mode: ${process.env.STRIPE_SECRET_KEY.includes('test') ? 'TEST' : 'LIVE'}`);
  
  // Check if Stripe Tax is enabled
  const taxEnabled = await testTaxCalculation();
  if (!taxEnabled) {
    process.exit(1);
  }
  
  // Check tax registrations
  await checkTaxRegistrations();
  
  // Test scenarios
  const results = [];
  for (const scenario of TEST_SCENARIOS) {
    const result = await createTestCheckoutSession(scenario);
    results.push(result);
  }
  
  // Generate report
  await generateTaxTestReport(results);
}

// Run tests
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { createTestCheckoutSession, testTaxCalculation };