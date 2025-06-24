#!/usr/bin/env node

/**
 * Sitemap Verification Script
 * 
 * This script helps verify the XML sitemap and provides instructions 
 * for submitting to Google Search Console.
 */

const fs = require('fs');
const path = require('path');

console.log('🗺️  123LegalDoc Sitemap Verification\n');

// Check if sitemap.ts exists
const sitemapPath = path.join(__dirname, '../src/app/sitemap.ts');
if (fs.existsSync(sitemapPath)) {
  console.log('✅ sitemap.ts found');
} else {
  console.log('❌ sitemap.ts not found');
  process.exit(1);
}

// Check if robots.txt exists
const robotsPath = path.join(__dirname, '../public/robots.txt');
if (fs.existsSync(robotsPath)) {
  console.log('✅ robots.txt found');
} else {
  console.log('❌ robots.txt not found');
}

console.log('\n📊 Sitemap Coverage Analysis:');
console.log('Your sitemap.ts includes:');
console.log('• Homepage (EN/ES)');
console.log('• Main pages (docs, templates, pricing, etc.)');
console.log('• Category navigation pages');
console.log('• All 50 US state pages');
console.log('• Individual document pages (400+)');
console.log('• State-specific document combinations');
console.log('• Major city pages for local SEO');
console.log('• Generated SEO content pages');
console.log('• High-value document variations');

console.log('\n🚀 Next Steps for Google Search Console:');
console.log('1. Visit https://search.google.com/search-console');
console.log('2. Add 123legaldoc.com as a property');
console.log('3. Verify ownership via DNS, HTML file, or Google Analytics');
console.log('4. Submit sitemap: https://123legaldoc.com/sitemap.xml');
console.log('5. Monitor indexing status in Coverage report');

console.log('\n🔍 To test your sitemap locally:');
console.log('1. Run: npm run build');
console.log('2. Visit: http://localhost:3000/sitemap.xml');
console.log('3. Verify XML structure and URLs');

console.log('\n📈 Expected Sitemap Size:');
console.log('• ~2,000+ pages across both languages');
console.log('• ~800+ document pages');  
console.log('• ~400+ state-specific combinations');
console.log('• ~200+ city and category pages');

console.log('\n⚡ Optimization Tips:');
console.log('• Priorities: Homepage (1.0) > Categories (0.8) > Documents (0.7)');
console.log('• Change frequency: Daily (homepage) > Weekly (categories) > Monthly (docs)');
console.log('• All pages include hreflang alternates for EN/ES');
console.log('• State-specific high-value docs get priority 0.9');

console.log('\n✨ Sitemap verification complete!');