#!/usr/bin/env ts-node

/**
 * One-time, idempotent migration that:
 * 1. Scans legacy locations (e.g. /src/lib/documents-old, /templates/en)
 * 2. Moves each doc into /src/lib/documents/{country}/{docId}/...
 * 3. Adds barrel index.ts
 * 4. Moves templates into /templates/{lang}/{country}/{docId}.md
 * 5. Logs every action to ./migration-log.json
 */

import { promises as fs } from 'fs';
import path from 'path';
import { globby } from 'globby';
import prettier from 'prettier';

const LEGACY_DOC_GLOBS = [
  'src/lib/documents/**/schema.ts',
  'src/schemas/**/*.ts'
];

const TARGET_ROOT = 'src/lib/documents';
const TEMPLATE_TARGET_ROOT = 'templates';

interface LogEntry {
  action: string;
  src?: string;
  dest?: string;
}

async function exists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function move(src: string, dest: string, log: LogEntry[]) {
  if (!(await exists(src))) return;
  if (await exists(dest)) {
    log.push({ action: 'skip', src, dest });
    return;
  }
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.rename(src, dest);
  log.push({ action: 'move', src, dest });
}

async function moveSibling(file: string, targetDir: string, log: LogEntry[]) {
  const filename = path.basename(file);
  await move(file, path.join(targetDir, filename), log);
}

function inferCountry(parts: string[]): string | undefined {
  for (const p of parts) {
    if (/^[a-z]{2}$/.test(p)) return p;
  }
  return undefined;
}

async function migrate() {
  const files = await globby(LEGACY_DOC_GLOBS);
  const log: LogEntry[] = [];

  for (const schemaPath of files) {
    const parts = schemaPath.split(path.sep);
    const docId = parts.at(-2);
    const country = inferCountry(parts) ?? 'us';
    const targetDir = path.join(TARGET_ROOT, country, docId!);

    await fs.mkdir(targetDir, { recursive: true });

    await moveSibling(schemaPath, targetDir, log);
    await moveSibling(schemaPath.replace('schema.ts', 'questions.ts'), targetDir, log);
    await moveSibling(schemaPath.replace('schema.ts', 'metadata.ts'), targetDir, log);

    // ── create / update index.ts barrel ──
    const barrel = `export * from './schema';\nexport * from './questions';\nexport * from './metadata';`;
    const formattedBarrel = await prettier.format(barrel, { parser: 'typescript' });
    await fs.writeFile(path.join(targetDir, 'index.ts'), formattedBarrel);

    for (const lang of ['en', 'es']) {
      const legacyTmpl = path.join('templates', lang, `${docId}.md`);
      if (await exists(legacyTmpl)) {
        const targetTmplDir = path.join(TEMPLATE_TARGET_ROOT, lang, country);
        await fs.mkdir(targetTmplDir, { recursive: true });
        await move(legacyTmpl, path.join(targetTmplDir, `${docId}.md`), log);
      }
    }
  }

  await fs.writeFile('migration-log.json', JSON.stringify(log, null, 2));
  console.info(`✅ Migrated ${log.length} assets. Log written to migration-log.json`);
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});

