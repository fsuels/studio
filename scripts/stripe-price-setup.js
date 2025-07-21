#!/usr/bin/env node

/**
 * Stripe Multi-Currency Price Setup Script
 * 
 * This script creates all the multi-currency price IDs referenced in your Smart Pricing Engine.
 * Run this once to set up your Stripe dashboard with the correct pricing structure.
 * 
 * Usage:
 * 1. Set your Stripe secret key: export STRIPE_SECRET_KEY=sk_test_...
 * 2. Run: node scripts/stripe-price-setup.js
 * 3. Update your environment variables with the generated price IDs
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ Error: STRIPE_SECRET_KEY environment variable is required');
  console.log('Set it with: export STRIPE_SECRET_KEY=sk_test_...');
  process.exit(1);
}

// Pricing configuration matching your Smart Pricing Engine
const PRICING_PLANS = {
  subscription_plans: {
    starter: {
      name: 'Starter Plan',
      description: '5 documents per month, basic templates, PDF download, email support',
      prices: { USD: 29.00, EUR: 26.00, GBP: 23.00 },
      interval: 'month',
    },
    professional: {
      name: 'Professional Plan',
      description: '25 documents per month, all templates, PDF + Word download, e-signatures, AI analysis, priority support',
      prices: { USD: 79.00, EUR: 72.00, GBP: 63.00 },
      interval: 'month',
    },
    business: {
      name: 'Business Plan',
      description: 'Unlimited documents, team collaboration, API access, custom templates, advanced AI, phone support',
      prices: { USD: 199.00, EUR: 183.00, GBP: 159.00 },
      interval: 'month',
    },
    enterprise: {
      name: 'Enterprise Plan',
      description: 'Everything in Business, white-label solution, dedicated support, custom integrations, SLA, on-premise',
      prices: { USD: 499.00, EUR: 459.00, GBP: 399.00 },
      interval: 'month',
    },
  },
  one_time_documents: {
    'bill-of-sale': {
      name: 'Vehicle Bill of Sale',
      description: 'Legal vehicle bill of sale document template',
      prices: { USD: 9.99, EUR: 8.99, GBP: 7.99 },
    },
    'residential-lease': {
      name: 'Residential Lease Agreement',
      description: 'Comprehensive residential lease agreement template',
      prices: { USD: 14.99, EUR: 13.99, GBP: 11.99 },
    },
    'employment-contract': {
      name: 'Employment Contract',
      description: 'Professional employment contract template',
      prices: { USD: 19.99, EUR: 17.99, GBP: 15.99 },
    },
    'nda': {
      name: 'Non-Disclosure Agreement',
      description: 'Standard NDA template for business use',
      prices: { USD: 12.99, EUR: 11.99, GBP: 9.99 },
    },
  },
};

async function createProduct(name, description, type = 'service') {
  try {
    const product = await stripe.products.create({
      name,
      description,
      type,
      metadata: {
        created_by: 'smart-pricing-setup',
        created_at: new Date().toISOString(),
      },
    });
    
    console.log(`✅ Created product: ${name} (${product.id})`);
    return product;
  } catch (error) {
    if (error.code === 'resource_already_exists') {
      console.log(`⚠️  Product "${name}" already exists, skipping...`);
      return null;
    }
    throw error;
  }
}

async function createPrice(product, amount, currency, interval = null) {
  try {
    const priceData = {
      product: product.id,
      unit_amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        created_by: 'smart-pricing-setup',
        created_at: new Date().toISOString(),
      },
    };

    if (interval) {
      priceData.recurring = { interval };
    }

    const price = await stripe.prices.create(priceData);
    
    console.log(`  💰 Created ${currency} price: ${currency}${amount} (${price.id})`);
    return price;
  } catch (error) {
    console.error(`  ❌ Failed to create ${currency} price:`, error.message);
    return null;
  }
}

async function setupSubscriptionPlans() {
  console.log('\n🔄 Setting up subscription plans...\n');
  
  const results = {};
  
  for (const [planId, config] of Object.entries(PRICING_PLANS.subscription_plans)) {
    console.log(`\n📋 Setting up ${config.name}...`);
    
    const product = await createProduct(config.name, config.description);
    if (!product) continue;
    
    results[planId] = {};
    
    for (const [currency, amount] of Object.entries(config.prices)) {
      const price = await createPrice(product, amount, currency, config.interval);
      if (price) {
        results[planId][currency] = price.id;
      }
    }
  }
  
  return results;
}

async function setupOneTimeDocuments() {
  console.log('\n🔄 Setting up one-time document purchases...\n');
  
  const results = {};
  
  for (const [docId, config] of Object.entries(PRICING_PLANS.one_time_documents)) {
    console.log(`\n📄 Setting up ${config.name}...`);
    
    const product = await createProduct(config.name, config.description);
    if (!product) continue;
    
    results[docId] = {};
    
    for (const [currency, amount] of Object.entries(config.prices)) {
      const price = await createPrice(product, amount, currency);
      if (price) {
        results[docId][currency] = price.id;
      }
    }
  }
  
  return results;
}

async function generateEnvironmentVariables(subscriptions, documents) {
  console.log('\n🔧 Generated Environment Variables:\n');
  console.log('# Add these to your .env.local file:');
  console.log('# Subscription Plan Price IDs');
  
  for (const [planId, currencies] of Object.entries(subscriptions)) {
    for (const [currency, priceId] of Object.entries(currencies)) {
      const envVar = `STRIPE_PRICE_${planId.toUpperCase()}_${currency}=${priceId}`;
      console.log(envVar);
    }
  }
  
  console.log('\n# Document Price IDs');
  for (const [docId, currencies] of Object.entries(documents)) {
    for (const [currency, priceId] of Object.entries(currencies)) {
      const envVar = `STRIPE_PRICE_${docId.toUpperCase().replace('-', '_')}_${currency}=${priceId}`;
      console.log(envVar);
    }
  }
  
  console.log('\n📝 Copy these environment variables to your .env.local file');
  console.log('📝 Then update your stripe-smart-prices.ts with the actual price IDs');
}

async function generatePriceUpdateCode(subscriptions, documents) {
  console.log('\n\n🔄 Generated Code Updates:\n');
  console.log('// Update your src/lib/stripe-smart-prices.ts SMART_PRICE_LOOKUP:');
  console.log('export const SMART_PRICE_LOOKUP: Record<string, Record<string, string>> = {');
  
  // Subscription plans
  for (const [planId, currencies] of Object.entries(subscriptions)) {
    console.log(`  '${planId}': {`);
    for (const [currency, priceId] of Object.entries(currencies)) {
      console.log(`    ${currency}: '${priceId}',`);
    }
    console.log('  },');
  }
  
  // Document plans
  for (const [docId, currencies] of Object.entries(documents)) {
    console.log(`  '${docId}': {`);
    for (const [currency, priceId] of Object.entries(currencies)) {
      console.log(`    ${currency}: '${priceId}',`);
    }
    console.log('  },');
  }
  
  console.log('};');
}

async function main() {
  console.log('🚀 Starting Stripe Multi-Currency Price Setup...');
  console.log('🔗 Stripe Account:', process.env.STRIPE_SECRET_KEY.includes('test') ? 'TEST MODE' : 'LIVE MODE');
  
  try {
    // Test Stripe connection
    await stripe.accounts.retrieve();
    console.log('✅ Stripe connection successful');
    
    // Setup pricing
    const subscriptions = await setupSubscriptionPlans();
    const documents = await setupOneTimeDocuments();
    
    // Generate configuration
    await generateEnvironmentVariables(subscriptions, documents);
    await generatePriceUpdateCode(subscriptions, documents);
    
    console.log('\n🎉 Setup complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Copy the environment variables to your .env.local file');
    console.log('2. Update your stripe-smart-prices.ts with the generated price IDs');
    console.log('3. Test the /api/pricing/smart-session endpoint');
    console.log('4. Enable Stripe Tax in your Stripe dashboard');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\n🔍 Common issues:');
    console.log('- Check your STRIPE_SECRET_KEY is correct');
    console.log('- Ensure you have the stripe npm package installed');
    console.log('- Verify your Stripe account has the necessary permissions');
    process.exit(1);
  }
}

// Run the setup
if (require.main === module) {
  main();
}

module.exports = { createProduct, createPrice, PRICING_PLANS };