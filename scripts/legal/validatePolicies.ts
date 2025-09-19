#!/usr/bin/env tsx

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

interface PolicyCheckResult {
  file: string;
  errors: string[];
  warnings: string[];
}

function isValidDateString(input: string): boolean {
  const date = new Date(input.trim());
  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const normalizedInput = input.trim().toLowerCase();
  const isoCandidate = date.toISOString().split('T')[0].toLowerCase();
  if (normalizedInput === isoCandidate) {
    return true;
  }

  const formatted = date
    .toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    .toLowerCase();

  if (normalizedInput === formatted || normalizedInput === formatted.replace(',', '')) {
    return true;
  }

  return false;
}

async function validatePolicy(filePath: string): Promise<PolicyCheckResult> {
  const content = await readFile(filePath, 'utf8');
  const relative = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
  const normalized = content.replace(/\r\n/g, '\n');
  const lines = normalized.split('\n');
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!lines[0] || !lines[0].startsWith('# ')) {
    errors.push('Missing H1 title on first line (expected "# <Title>").');
  }

  const lastUpdatedIndex = lines.findIndex((line) => /^_Last updated:/i.test(line));
  if (lastUpdatedIndex === -1) {
    errors.push('Missing "_Last updated:" metadata line.');
  } else {
    const match = lines[lastUpdatedIndex].match(/^_Last updated:\s*(.+)_$/i);
    if (!match) {
      errors.push('Last updated line must follow pattern `_Last updated: <date>_`.');
    } else if (!isValidDateString(match[1])) {
      errors.push(`Unable to parse "Last updated" date value: "${match[1].trim()}".`);
    }
    if (lastUpdatedIndex === 0) {
      errors.push('Last updated line should follow the title line.');
    }
  }

  if (!/\*\*Spanish Summary/i.test(content)) {
    warnings.push('Spanish summary section not found (looking for "**Spanish Summary").');
  }

  if (!content.includes('```') && /<table/i.test(content)) {
    warnings.push('Contains HTML table without fenced code; verify accessibility.');
  }

  return { file: relative, errors, warnings };
}

async function main() {
  const legalDir = path.join(process.cwd(), 'docs', 'legal');
  const entries = await readdir(legalDir, { withFileTypes: true });
  const markdownFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => path.join(legalDir, entry.name))
    .sort();

  if (markdownFiles.length === 0) {
    console.error('No markdown files found under docs/legal.');
    process.exit(1);
  }

  const results = await Promise.all(markdownFiles.map(validatePolicy));
  const failed = results.filter((res) => res.errors.length > 0);
  const warned = results.filter((res) => res.errors.length === 0 && res.warnings.length > 0);

  results.forEach((result) => {
    if (result.errors.length === 0 && result.warnings.length === 0) {
      console.log(`[OK] ${result.file}`);
      return;
    }
    console.log(`\n[CHECK] ${result.file}`);
    result.errors.forEach((err) => console.log(`  - ERROR: ${err}`));
    result.warnings.forEach((warn) => console.log(`  - WARN: ${warn}`));
  });

  console.log('\nSummary:');
  console.log(`  Total policies checked: ${results.length}`);
  console.log(`  Files with errors: ${failed.length}`);
  console.log(`  Files with warnings: ${warned.length}`);

  if (failed.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Unexpected failure while validating policies:', err);
  process.exit(1);
});

