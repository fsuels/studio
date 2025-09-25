#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

async function copyPolicies() {
  const sourceDir = path.join(process.cwd(), 'docs', 'legal');
  const targetDir = path.join(process.cwd(), '.next', 'server', 'docs', 'legal');

  try {
    await fs.access(sourceDir);
  } catch (error) {
    console.warn(`[copy-policies] Source directory missing: ${sourceDir}`);
    return;
  }

  try {
    await fs.rm(targetDir, { recursive: true, force: true });
    await fs.mkdir(targetDir, { recursive: true });
    await fs.cp(sourceDir, targetDir, { recursive: true });
    console.log(`[copy-policies] Copied policy markdown from ${sourceDir} to ${targetDir}`);
  } catch (error) {
    console.error('[copy-policies] Failed to copy policy markdown', error);
    process.exitCode = 1;
  }
}

copyPolicies();