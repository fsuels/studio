#!/usr/bin/env node
import process from "node:process";

const usage = `Usage: node scripts/check-csp-metrics.mjs <baseUrl> [bearerToken]\nExamples:\n  node scripts/check-csp-metrics.mjs https://app.123legaldoc.com\n  node scripts/check-csp-metrics.mjs https://staging.123legaldoc.com my-secret-token`;

async function main() {
  const [, , baseUrl, bearerToken] = process.argv;
  if (!baseUrl) {
    console.error(usage);
    process.exit(1);
  }

  const headers = bearerToken
    ? { Authorization: `Bearer ${bearerToken}` }
    : {};

  const jsonUrl = new URL('/api/security/csp-metrics', baseUrl).toString();
  const promUrl = new URL('/api/security/csp-metrics/prom', baseUrl).toString();

  console.log(`Checking ${jsonUrl}`);
  const jsonRes = await fetch(jsonUrl, { headers });
  console.log(`  Status: ${jsonRes.status}`);
  if (!jsonRes.ok) {
    console.error('  Failed to fetch JSON metrics endpoint.');
    process.exit(1);
  }
  const jsonBody = await jsonRes.json();
  console.log('  Counters:', jsonBody.counters);
  if (jsonBody.lastEvent) {
    console.log('  Last event:', jsonBody.lastEvent);
  } else {
    console.log('  No last event recorded.');
  }

  console.log(`\nChecking ${promUrl}`);
  const promRes = await fetch(promUrl, { headers });
  console.log(`  Status: ${promRes.status}`);
  if (!promRes.ok) {
    console.error('  Prometheus endpoint unavailable.');
    process.exit(1);
  }
  const text = await promRes.text();
  const sampleLine = text.split('\n').find((line) => line.startsWith('csp_alerts_total'));
  if (sampleLine) {
    console.log('  Sample metric:', sampleLine);
  } else {
    console.log('  No csp_alerts_total metric found in response.');
  }

  console.log('\nCSP metrics endpoints verified successfully.');
}

main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
