#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

function walk(dir, out = []) {
  let entries = [];
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (p.endsWith('.ts') || p.endsWith('.tsx')) out.push(p);
  }
  return out;
}

const files = walk('src/app');
let changed = 0;
for (const f of files) {
  let s = readFileSync(f, 'utf8');
  let t = s;
  // Type signature fixes
  t = t.replace(/params:\s*Promise<\s*\{([\s\S]*?)\}>/g, 'params: {$1}')
       .replace(/searchParams:\s*Promise<\s*\{([\s\S]*?)\}>/g, 'searchParams: {$1}')
       .replace(/context:\s*\{\s*params:\s*Promise<\s*\{([\s\S]*?)\}>\s*\}/g, 'context: { params: {$1} }');
  // Await removal
  t = t.replace(/const\s+\{([\s\S]*?)\}\s*=\s*await\s*params\s*;/g, 'const {$1} = params;')
       .replace(/const\s+params\s*=\s*await\s*context\.params\s*;/g, 'const params = context.params;')
       .replace(/const\s+\{([\s\S]*?)\}\s*=\s*await\s*context\.params\s*;/g, 'const {$1} = context.params;');
  if (t !== s) {
    writeFileSync(f, t, 'utf8');
    changed++;
    console.log(`[fix-app-params] ${f}`);
  }
}
console.log(`[fix-app-params] files changed: ${changed}`);

