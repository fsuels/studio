#!/usr/bin/env node
// scripts/gen-doc-registry.mjs
import 'ts-node/esm';

import fg from 'fast-glob';
import { writeFile } from 'fs/promises';
import path from 'path';
import { pathToFileURL } from 'url';

// pattern to discover all document metadata files
const DOC_GLOB = 'src/lib/documents/*/*/metadata.ts';

// find all metadata.ts files
const files = await fg(DOC_GLOB, { dot: false });
console.log('🔍 matched files:', files.length);

// build registry containing only the metadata for each document
const registry = [];
for (const file of files) {
  const [, , , country, id] = file.split(path.sep);
  const mod = await import(pathToFileURL(path.resolve(file)).href);
  const camel = id.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  const meta =
    mod.default ??
    mod.metadata ??
    mod[`${camel}Meta`] ??
    {};
  registry.push({ id, country, ...meta });
}

// write static JSON
await writeFile(
  'src/lib/document-library/registry.json',
  JSON.stringify(registry, null, 2)
);
