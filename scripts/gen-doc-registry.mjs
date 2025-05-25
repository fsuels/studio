#!/usr/bin/env node
// scripts/gen-doc-registry.mjs
import 'ts-node/esm';

import fg from 'fast-glob'; import { writeFile } from 'fs/promises';
import path from 'path';
import { pathToFileURL } from 'url';
console.log('🔍 glob pattern:', DOC_GLOB);

// find all metadata.ts files
const files = await fg(DOC_GLOB, { dot: false });
console.log('🔍 matched files:', files.length);

// build registry
const registry = [];
for (const f of files) {
  const [, , , country, id] = f.split(path.sep);
  const fileUrl = pathToFileURL(path.resolve(f)).href;
  const mod = await import(fileUrl);
  const meta = mod.default ?? mod.metadata ?? {};
  registry.push({ id, country, ...meta });
}

// write static JSON
await writeFile(
  'src/lib/document-library/registry.json',
  JSON.stringify(registry, null, 2)
);
