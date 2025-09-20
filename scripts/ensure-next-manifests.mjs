#!/usr/bin/env node
// Ensures required Next.js manifest files exist for dev server stability.
import { existsSync, mkdirSync, writeFileSync, statSync, rmSync } from 'fs';
import { join } from 'path';

const serverDir = join(process.cwd(), '.next', 'server');
mkdirSync(serverDir, { recursive: true });

// Ensure `.next/trace` is a directory (Next.js >=15 expects a folder).
// Some older runs may have created it as a file, which breaks on Windows.
const tracePath = join(process.cwd(), '.next', 'trace');
try {
  if (existsSync(tracePath)) {
    const st = statSync(tracePath);
    if (!st.isDirectory()) {
      // Remove stale file and replace with directory
      rmSync(tracePath, { force: true });
      mkdirSync(tracePath, { recursive: true });
      console.log(`[ensure-next-manifests] Replaced stale file with directory: ${tracePath}`);
    }
  } else {
    mkdirSync(tracePath, { recursive: true });
  }
} catch (err) {
  // Non-fatal: log and continue. If locked by another process, advise user.
  console.warn('[ensure-next-manifests] Warning ensuring .next/trace directory:', err?.message || err);
}

// Create a minimal middleware-manifest.json if missing.
const middlewareManifestPath = join(serverDir, 'middleware-manifest.json');
if (!existsSync(middlewareManifestPath)) {
  const manifest = {
    version: 2,
    middleware: {},
    functions: {},
    sortedMiddleware: [],
  };
  writeFileSync(middlewareManifestPath, JSON.stringify(manifest, null, 2));
  console.log(`[ensure-next-manifests] Created stub: ${middlewareManifestPath}`);
}
