#!/usr/bin/env tsx

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

interface Finding {
  file: string;
  line: number;
  column: number;
  snippet: string;
}

const TARGET_DIRECTORIES = [
  path.join('public', 'locales', 'es'),
  path.join('docs', 'legal'),
  path.join('src', 'lib', 'legal-translation'),
];

const ALLOWED_EXTENSIONS = new Set(['.json', '.md', '.ts', '.tsx']);

// Escape '?' twice so the tsx/ESM transpilation preserves the literal character rather than treating it as a quantifier.
const patternSource = '[A-Za-z\u00C1\u00C9\u00CD\u00D3\u00DA\u00D1\u00DC\u00E1\u00E9\u00ED\u00F3\u00FA\u00F1\u00FC]\\?[A-Za-z\u00C1\u00C9\u00CD\u00D3\u00DA\u00D1\u00DC\u00E1\u00E9\u00ED\u00F3\u00FA\u00F1\u00FC]';
const PATTERN = new RegExp(patternSource, 'u');
const REPLACEMENT_CHAR = '\uFFFD';

async function gatherFiles(root: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const results: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await gatherFiles(fullPath)));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (ALLOWED_EXTENSIONS.has(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

async function scanFile(filePath: string): Promise<Finding[]> {
  const content = await readFile(filePath, 'utf8');
  const findings: Finding[] = [];
  const lines = content.split(/\r?\n/);

  lines.forEach((line, idx) => {
    const match = line.match(PATTERN);
    if (match && match.index !== undefined) {
      findings.push({
        file: filePath,
        line: idx + 1,
        column: match.index + 1,
        snippet: line.trim(),
      });
    }

    const badCharIndex = line.indexOf(REPLACEMENT_CHAR);
    if (badCharIndex !== -1) {
      findings.push({
        file: filePath,
        line: idx + 1,
        column: badCharIndex + 1,
        snippet: line.trim(),
      });
    }
  });

  return findings;
}

async function main() {
  const allFiles = new Set<string>();
  for (const dir of TARGET_DIRECTORIES) {
    const fullDir = path.join(process.cwd(), dir);
    const files = await gatherFiles(fullDir);
    files.forEach((file) => allFiles.add(file));
  }

  const findings: Finding[] = [];
  for (const file of Array.from(allFiles).sort()) {
    findings.push(...(await scanFile(file)));
  }

  if (findings.length === 0) {
    console.log('No mojibake patterns detected across monitored localization sources.');
    return;
  }

  console.log('Detected potential mojibake issues:');
  findings.forEach((finding) => {
    const relPath = path.relative(process.cwd(), finding.file).replace(/\\/g, '/');
    console.log(`- ${relPath}:${finding.line}:${finding.column} -> ${finding.snippet}`);
  });

  process.exitCode = 1;
}

main().catch((err) => {
  console.error('Failed to scan locales for mojibake:', err);
  process.exit(1);
});
