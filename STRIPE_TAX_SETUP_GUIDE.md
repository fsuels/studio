# 🏛️ Stripe Tax Configuration: Complete Setup Guide

Your Smart Pricing Engine includes automatic tax handling via Stripe Tax. This guide walks you through the complete setup process to ensure VAT, GST, and sales tax compliance worldwide.

## 📋 Pre-Setup Checklist

### ✅ Requirements
- ✅ Stripe account with tax features enabled
- ✅ Business registration documents
- ✅ Tax registration numbers (where applicable)
- ✅ Understanding of your nexus obligations

### ⚠️ Important Note
Stripe Tax handles calculation and collection, but **you're still responsible for**:
- Filing tax returns in each jurisdiction
- Remitting collected taxes to authorities
- Maintaining proper records

## 🚀 Step-by-Step Setup

### **Step 1: Enable Stripe Tax**

1. **Go to Stripe Dashboard**
   ```
   https://dashboard.stripe.com/tax/settings
   ```

2. **Click "Enable automatic tax calculation"**

3. **Complete Business Information**
   - Legal business name
   - Business address
   - Tax ID/EIN number
   - Business type (LLC, Corporation, etc.)

4. **Accept Terms**
   - Read and accept Stripe Tax terms
   - Understand compliance responsibilities

### **Step 2: Configure Tax Registrations**

Navigate to: `https://dashboard.stripe.com/tax/registrations`

#### **United States (Sales Tax)**
```
📍 Required if you have nexus in these states:
✅ California - Register at: cdtfa.ca.gov
✅ New York - Register at: tax.ny.gov  
✅ Texas - Register at: comptroller.texas.gov
✅ Florida - Register at: floridarevenue.com
✅ Washington - Register at: dor.wa.gov

📋 Add to Stripe:
- Registration number
- Effective date
- Rate type (origin/destination)
```

#### **European Union (VAT)**
```
📍 Required if EU revenue > €10,000/year:
✅ Germany - Register at: bzst.de
✅ France - Register at: impots.gouv.fr
✅ Netherlands - Register at: belastingdienst.nl
✅ Spain - Register at: aeat.es
✅ Italy - Register at: agenziaentrate.gov.it

📋 Add to Stripe:
- VAT number (starts with country code)
- Registration date
- Rate: Standard VAT rate
```

#### **United Kingdom (VAT)**
```
📍 Required if UK revenue > £85,000/year:
✅ Register at: gov.uk/vat-registration
✅ Current rate: 20%
✅ Digital services: Always taxable

📋 Add to Stripe:
- VAT number (GB format)
- Registration date  
- Rate: 20%
```

#### **Canada (GST/HST)**
```
📍 Required if revenue > CAD $30,000/year:
✅ Register at: canada.ca/en/revenue-agency
✅ GST: 5% federal
✅ HST: Combined federal+provincial

📋 Add to Stripe:
- GST/HST number
- Registration date
- Applicable rates by province
```

### **Step 3: Test Tax Calculation**

Run the included test script:

```bash
# Set your Stripe secret key
export STRIPE_SECRET_KEY=sk_test_...

# Run tax tests
node scripts/test-stripe-tax.js
```

Expected output:
```
🚀 Starting Stripe Tax Integration Tests...
🔗 Stripe Mode: TEST

🏛️ Testing Stripe Tax Calculation...
✅ Stripe Tax is enabled and working

🧪 Testing: US Customer - California (Sales Tax)
   👤 Created customer: cus_test123
   💳 Created session: cs_test456
   💰 Amount: $79.00
   🏛️  Tax: Will be calculated at checkout
   ✅ Expected: Sales Tax (~8.5%)

🧪 Testing: German Customer - B2C (VAT)
   👤 Created customer: cus_test789
   💳 Created session: cs_test012
   💰 Amount: $79.00
   🏛️  Tax: Will be calculated at checkout
   ✅ Expected: German VAT (19%)

📊 Tax Test Report
==================================================
✅ Successful tests: 5/5
🎉 All tax tests passed! Your Stripe Tax integration is working.
```

### **Step 4: Configure Tax Behavior**

In your Stripe Dashboard → Tax → Settings:

#### **Tax Calculation Settings**
```
✅ Automatic tax calculation: Enabled
✅ Tax-inclusive pricing: Disabled (recommended)
✅ Tax ID collection: Enabled for B2B
✅ Reverse charge: Enabled for EU B2B
```

#### **Product Tax Categories**
```
✅ Digital Products/Services:
   - Software subscriptions: txcd_10000000 (Digital goods)
   - Document templates: txcd_10000000 (Digital goods)
   
✅ Professional Services:
   - Legal consultations: txcd_20030000 (Professional services)
   - Document review: txcd_20030000 (Professional services)
```

### **Step 5: Update Your Smart Pricing Engine**

Your Smart Pricing Engine is already configured for Stripe Tax. Verify these settings in your code:

```typescript
// In src/app/api/pricing/smart-session/route.ts
const stripeSession = await stripe.checkout.sessions.create({
  // ... other settings
  automatic_tax: {
    enabled: true, // ✅ Automatic tax calculation
  },
  customer_details: {
    ip_address: pricingSummary.userLocation.ip, // ✅ IP for tax jurisdiction
    country: pricingSummary.userLocation.countryCode, // ✅ Country detection
  },
  tax_id_collection: {
    enabled: pricingSummary.taxInfo.taxRequired, // ✅ B2B tax ID collection
  },
});
```

## 🧪 Testing Your Setup

### **Test Scenarios**

1. **US Customer (California)**
   ```bash
   curl -X POST http://localhost:3000/api/pricing/smart-session \
     -H "Content-Type: application/json" \
     -H "x-forwarded-for: 8.8.8.8" \
     -d '{"planId": "professional", "locale": "en"}'
   ```

2. **German Customer (B2C)**
   ```bash
   curl -X POST http://localhost:3000/api/pricing/smart-session \
     -H "Content-Type: application/json" \
     -H "x-forwarded-for: 217.247.49.1" \
     -d '{"planId": "professional", "locale": "en"}'
   ```

3. **UK Business Customer (B2B)**
   ```bash
   curl -X POST http://localhost:3000/api/pricing/smart-session \
     -H "Content-Type: application/json" \
     -H "x-forwarded-for: 81.2.69.142" \
     -d '{"planId": "business", "locale": "en", "allowPurchaseOrder": true}'
   ```

### **Browser Testing**

1. Use a VPN to test different locations
2. Complete checkout flow for each jurisdiction
3. Verify tax calculation appears correctly
4. Test B2B tax ID collection

## 📊 Monitoring and Compliance

### **Dashboard Monitoring**
```
📈 Key Metrics to Track:
✅ Tax collection rate: Should be >95%
✅ Failed tax calculations: <1%
✅ B2B reverse charge rate: Monitor EU B2B transactions
✅ Exemption rate: Track tax-exempt transactions

📍 Monitor at:
- https://dashboard.stripe.com/tax/overview
- https://dashboard.stripe.com/tax/transactions
- https://dashboard.stripe.com/tax/reports
```

### **Automated Tax Reports**
```typescript
// Add to your monitoring system
export async function generateTaxReport(startDate: Date, endDate: Date) {
  const transactions = await stripe.tax.transactions.list({
    created: {
      gte: Math.floor(startDate.getTime() / 1000),
      lte: Math.floor(endDate.getTime() / 1000),
    },
  });

  return {
    totalTransactions: transactions.data.length,
    totalTaxCollected: transactions.data.reduce((sum, t) => sum + t.tax_amount, 0),
    byJurisdiction: groupBy(transactions.data, 'jurisdiction'),
    exemptTransactions: transactions.data.filter(t => t.tax_amount === 0),
  };
}
```

## ⚠️ Common Issues and Solutions

### **Issue: Tax not calculating**
```
🔍 Debug Steps:
1. Check Stripe Tax is enabled: dashboard.stripe.com/tax/settings
2. Verify customer country detection: Test with known IPs
3. Check tax registrations: Ensure jurisdiction is registered
4. Review automatic_tax: true in session creation

💡 Solution: Usually missing registration or incorrect customer location
```

### **Issue: Wrong tax rate**
```
🔍 Debug Steps:
1. Verify product tax category in Stripe
2. Check customer address accuracy
3. Review B2B vs B2C detection
4. Confirm registration rates match actual rates

💡 Solution: Update product categories or customer classification
```

### **Issue: B2B reverse charge not working**
```
🔍 Debug Steps:
1. Check tax_id_collection: enabled
2. Verify EU VAT number format (e.g., DE123456789)
3. Test with valid EU business addresses
4. Review reverse charge rules in Stripe

💡 Solution: Enable automatic reverse charge in tax settings
```

## 📋 Go-Live Checklist

### **Before Production**
- [ ] All required tax registrations completed
- [ ] Stripe Tax enabled and configured
- [ ] Product tax categories assigned
- [ ] Test transactions completed for each jurisdiction
- [ ] Tax ID collection tested for B2B customers
- [ ] Reverse charge working for EU B2B
- [ ] Monitoring and alerts configured

### **After Going Live**
- [ ] Monitor tax collection rates
- [ ] Review first week of transactions
- [ ] Set up monthly tax report downloads
- [ ] Schedule quarterly compliance reviews
- [ ] Plan for tax return filing dates

## 🎯 Next Steps

1. **Complete Setup**: Follow the steps above
2. **Test Integration**: Run `node scripts/test-stripe-tax.js`
3. **Browser Test**: Test checkout flow in browser
4. **Monitor**: Set up tax monitoring dashboard
5. **Compliance**: Schedule tax return preparation

Your Smart Pricing Engine with automatic tax handling is now ready for global customers! 🌍💰