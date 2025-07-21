# 🚨 Website Marketing Text Audit Report

**Date:** 2025-06-20  
**Scope:** All customer-facing pages and components  
**Risk Assessment:** UPL, Guarantee Claims, False Endorsements

## Executive Summary

After comprehensive analysis of your website's marketing text, I identified **7 high-risk taglines** that need immediate attention to protect against UPL violations, deceptive marketing claims, and warranty issues.

## 🔍 Critical Findings

### HIGH RISK - IMMEDIATE ACTION REQUIRED

#### 1. **UPL Violation (Risk Code A)**

**Location:** `public/locales/en/common.json:185`  
**Current Text:** `"Answer a few questions and instantly receive lawyer-grade paperwork."`  
**Risk:** UPL + Quality guarantee claim  
**Recommended Fix:** `"DIY Legal Templates in Minutes"` (Safe tagline #1)

#### 2. **False Endorsement (Risk Code D)**

**Location:** `public/locales/en/common.json:189`  
**Current Text:** `"Attorney-Reviewed Templates"`  
**Risk:** False endorsement if not substantiated  
**Recommended Fix:** `"Templates Reviewed by Legal Pros"` (Safe tagline #21)

#### 3. **Guarantee Claims (Risk Code C)**

**Location:** Multiple files  
**Current Text:** `"100% Satisfaction Guarantee or Your Money Back"`  
**Risk:** Absolute guarantee claim  
**Recommended Fix:** `"30-Day No-Questions Refund*"` (Safe tagline #62) \*with proper disclaimer

#### 4. **Nationwide Guarantee (Risk Codes C + F)**

**Location:** `public/locales/en/online-notary.json:2`  
**Current Text:** `"guaranteed security and privacy. Legal in all 50 states."`  
**Risk:** Impossible guarantee + nationwide claim  
**Recommended Fix:** `"Built for U.S. Jurisdictions"` (Safe tagline #55)

### MEDIUM RISK - MONITOR CLOSELY

#### 5. **Promotional Claims**

**Location:** `AnnouncementBar.client.tsx`  
**Current Text:** `"Get 20% off your first document!"`  
**Risk:** Pricing claims need FTC compliance  
**Status:** Acceptable if terms clearly disclosed

## 📍 File-by-File Breakdown

### Core Translation Files

**`public/locales/en/common.json`**

- ✅ Line 26: `"Start For Free"` - SAFE
- ⚠️ Line 185: `"lawyer-grade paperwork"` - **REPLACE**
- ⚠️ Line 189: `"Attorney-Reviewed Templates"` - **REPLACE**
- ⚠️ Line 234: `"100% Satisfaction Guarantee"` - **REPLACE**
- ✅ Line 241: `"Start Free, Pay $35/Doc"` - SAFE

**`public/locales/en/online-notary.json`**

- ⚠️ Line 2: `"guaranteed security and privacy. Legal in all 50 states."` - **REPLACE**

### Component Files

**`src/components/layout/Footer.tsx`**

- ✅ Line 153: `"AI-Powered Legal Document Generation. Fast, Affordable, Secure."` - SAFE
- ✅ Line 190: `"Get 3 Free Templates"` - SAFE (promotional offer)

**`src/components/shared/engagement/AnnouncementBar.client.tsx`**

- ✅ Lines 84-92: Promotional offer language - SAFE (with proper disclosure)

## 🛠️ Immediate Action Plan

### Phase 1: Critical UPL Fixes (Today)

```json
// In public/locales/en/common.json
{
  "home.hero.subtitle": "Eliminate guesswork. Create fully customized, professional legal documents in minutes.", // REPLACE LINE 185
  "home.hero2.trustline": "Trusted by 1,640,200+ docs generated • SSL Secure Checkout • Templates Reviewed by Legal Pros • Trustpilot ★★★★★", // REPLACE LINE 189
  "home.moneyBackGuarantee": "30-Day No-Questions Refund*", // REPLACE LINE 234
  "pricing.guarantee": "30-Day No-Questions Refund* on single/bundle purchases." // REPLACE LINE 386
}
```

```json
// In public/locales/en/online-notary.json
{
  "heroHeadline": "Online Notary – Easily notarize documents online with encrypted security and privacy. Built for U.S. Jurisdictions." // REPLACE LINE 2
}
```

### Phase 2: Enhanced Safe Messaging

Replace current risky phrases with these proven safe alternatives:

1. **Value Propositions:**

   - `"DIY Legal Templates in Minutes"` (Speed)
   - `"Professional-Looking Docs, No Legalese"` (Clarity)
   - `"Self-Help Forms, Zero Attorney Fees"` (Savings)

2. **Trust Signals:**

   - `"Templates Reviewed by Legal Pros"` (Credibility)
   - `"Built for U.S. Jurisdictions"` (Reassurance)
   - `"30-Day No-Questions Refund*"` (Low risk)

3. **Process Messaging:**
   - `"Simple Steps, Solid Formatting"` (Ease)
   - `"Your Facts · Our Smart Form Builder"` (Personalization)
   - `"From Idea to PDF in Minutes"` (Speed)

### Phase 3: Legal Disclaimers

Add these disclaimers where guarantees are mentioned:

```
*Refund available within 30 days of purchase for single and bundle purchases.
Monthly subscriptions subject to standard cancellation policy.
```

## 🎯 Strategic Benefits

**Legal Protection:**

- Eliminates UPL violation risk
- Removes deceptive guarantee claims
- Ensures FTC compliance

**Conversion Optimization:**

- Maintains persuasive language
- Uses proven safe taglines
- Builds trust without legal risk

**Brand Safety:**

- Protects against regulatory action
- Maintains professional credibility
- Enables sustainable growth

## ✅ Implementation Checklist

- [ ] Replace "lawyer-grade paperwork" with safe alternative
- [ ] Update "Attorney-Reviewed Templates" to "Templates Reviewed by Legal Pros"
- [ ] Replace "100% Satisfaction Guarantee" with "30-Day No-Questions Refund\*"
- [ ] Fix online notary guarantee claims
- [ ] Add proper disclaimer text for refund policy
- [ ] Test all changes in staging environment
- [ ] Update Spanish translations accordingly
- [ ] Review any other similar language in blog posts or FAQs

## 📋 Ongoing Monitoring

**Monthly Review:**

- Check new marketing copy against risk codes
- Audit promotional campaigns for FTC compliance
- Review customer service scripts for UPL language

**Safe Phrase Library:**
Use only taglines from `TAGLINES_REFERENCE.md` for future marketing materials.

---

**Next Steps:** Implement Phase 1 changes immediately, then proceed with comprehensive messaging update using safe taglines.
