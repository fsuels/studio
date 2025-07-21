// scripts/splitTranslations.js
/* eslint-env node */

const fs = require('fs');
const path = require('path');

// adjust these if you add/remove languages
const LANGS = ['en', 'es'];

// where your i18n JSON lives
const BASE = path.join(__dirname, '..', 'public', 'locales');

// keys that belong in header.json
const HEADER_KEYS = [
  'headline',
  'subhead',
  'ctaPrimary',
  'ctaSecondary',
  'trustText',
  'pricingTeaser',
  'pricingLinkText',
  'languageName',
  'Just 3 Easy Steps',
  'featureTeaser',
  'stepPrefix',
  'stepOne',
  'nav',
  'SearchBar',
  'TopDocsChips',
  'logoAlt',
];

// the one top‐level block that goes in footer.json
const FOOTER_KEY = 'footer';

for (const lng of LANGS) {
  const inFile = path.join(BASE, lng, 'translation.json');
  if (!fs.existsSync(inFile)) {
    console.warn(` → no translation.json for ${lng}, skipping`);
    continue;
  }

  const all = JSON.parse(fs.readFileSync(inFile, 'utf8'));
  const header = {};
  const footer = all[FOOTER_KEY] || {};
  const common = {};

  for (const [k, v] of Object.entries(all)) {
    if (HEADER_KEYS.includes(k)) {
      header[k] = v;
    } else if (k === FOOTER_KEY) {
      // skip it here, we already grabbed it
    } else {
      common[k] = v;
    }
  }

  const outDir = path.join(BASE, lng);
  fs.writeFileSync(
    path.join(outDir, 'header.json'),
    JSON.stringify(header, null, 2) + '\n',
  );
  fs.writeFileSync(
    path.join(outDir, 'footer.json'),
    JSON.stringify(footer, null, 2) + '\n',
  );
  fs.writeFileSync(
    path.join(outDir, 'common.json'),
    JSON.stringify(common, null, 2) + '\n',
  );

  console.log(`✅  [${lng}] → header.json, footer.json, common.json`);
}
