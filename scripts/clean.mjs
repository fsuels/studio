#!/usr/bin/env node
import { rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const targets = ['.next', '.swc', '.turbo'];
for (const t of targets) {
  const p = join(process.cwd(), t);
  try {
    if (existsSync(p)) {
      rmSync(p, { recursive: true, force: true });
      console.log(`[clean] removed ${t}`);
    }
  } catch (e) {
    console.warn(`[clean] failed to remove ${t}:`, e?.message || e);
  }
}

