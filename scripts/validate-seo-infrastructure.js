#!/usr/bin/env node
const fs = require('fs');

console.log('🔍 Validating SEO infrastructure...');

const seoComponents = [
  'src/components/seo/SchemaMarkup.tsx',
  'src/components/seo/MetaTags.tsx',
  'src/components/seo/Breadcrumbs.tsx',
];

let validated = 0;
let errors = 0;

seoComponents.forEach((component) => {
  if (fs.existsSync(component)) {
    console.log(`✅ ${component} exists`);
    validated++;
  } else {
    console.log(`❌ Missing ${component}`);
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

console.log(
  `✅ SEO validation complete: ${validated} components validated, ${errors} errors`,
);
process.exit(errors > 0 ? 1 : 0);
