#!/usr/bin/env tsx

/**
 * Simple smoke runner for the /api/generate-pdf endpoint.
 *
 * Requires:
 * - DOCUMENTGEN_BASE_URL (e.g. http://localhost:3000)
 * - DOCUMENTGEN_COOKIE or DOCUMENTGEN_BEARER (auth).
 * - Optionally DOCUMENTGEN_DOC_IDS comma-separated list.
 */

const DEFAULT_DOC_IDS = [
  'vehicle-bill-of-sale',
  'basic-nda',
  'independent-contractor-agreement',
  'llc-operating-agreement',
  'residential-lease-agreement',
];

const baseUrl = process.env.DOCUMENTGEN_BASE_URL ?? 'http://localhost:3000';
const cookie = process.env.DOCUMENTGEN_COOKIE;
const bearer = process.env.DOCUMENTGEN_BEARER;
const docIds = (process.env.DOCUMENTGEN_DOC_IDS?.split(',') ?? DEFAULT_DOC_IDS).map(
  (id) => id.trim(),
);

if (!cookie && !bearer) {
  console.error(
    'Missing authentication. Set DOCUMENTGEN_COOKIE or DOCUMENTGEN_BEARER in the environment.',
  );
  process.exit(1);
}

const headers: Record<string, string> = {
  'Content-Type': 'application/json',
};

if (cookie) headers['Cookie'] = cookie;
if (bearer) headers['Authorization'] = `Bearer ${bearer}`;

async function run() {
  console.log('[Smoke] Starting document generation smoke run');
  console.log('[Smoke] Target:', baseUrl);
  console.log('[Smoke] Documents:', docIds.join(', '));

  const results: Array<{ id: string; status: number; ok: boolean; durationMs: number }> = [];

  for (const docId of docIds) {
    const body = {
      documentType: docId,
      answers: {},
    };

    const start = performance.now();
    try {
      const res = await fetch(`${baseUrl}/api/generate-pdf`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      const end = performance.now();
      const durationMs = end - start;

      results.push({
        id: docId,
        status: res.status,
        ok: res.ok,
        durationMs,
      });

      console.log(
        `[Smoke] ${docId} -> status ${res.status} (${res.ok ? 'OK' : 'FAIL'}) in ${durationMs.toFixed(
          1,
        )}ms`,
      );

      if (!res.ok) {
        const text = await res.text();
        console.warn(`[Smoke] Response body: ${text}`);
      }
    } catch (error) {
      const end = performance.now();
      const durationMs = end - start;
      results.push({ id: docId, status: 0, ok: false, durationMs });
      console.error(`[Smoke] ${docId} -> network error after ${durationMs.toFixed(1)}ms`, error);
    }
  }

  const total = results.length;
  const success = results.filter((r) => r.ok).length;
  const successRate = total === 0 ? 0 : (success / total) * 100;

  console.log('\n[Smoke] Summary');
  console.log('-----------------------------');
  results.forEach((r) => {
    console.log(
      `${r.id.padEnd(40)} | status: ${r.status.toString().padStart(3)} | ok: ${r.ok} | duration: ${r.durationMs.toFixed(1)}ms`,
    );
  });
  console.log('-----------------------------');
  console.log(`[Smoke] Success rate: ${successRate.toFixed(2)}% (${success}/${total})`);

  if (successRate < 99.5) {
    process.exitCode = 1;
  }
}

run().catch((error) => {
  console.error('[Smoke] Fatal error running smoke tests:', error);
  process.exit(1);
});
