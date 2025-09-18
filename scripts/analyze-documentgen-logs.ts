#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import readline from 'readline';

type LogLevel = 'START' | 'SUCCESS' | 'ERROR';

type OperationStats = {
  successCount: number;
  errorCount: number;
  durations: number[];
};

type ParsedLog = {
  level: LogLevel;
  operation: string;
  context: Record<string, any>;
};

const LOG_PREFIX = '[DocumentGen]';

function parseLine(line: string): ParsedLog | null {
  if (!line.includes(LOG_PREFIX)) return null;

  const pattern = /^\[DocumentGen\]\s+(START|SUCCESS|ERROR)\s+([^\s]+)\s+(.*)$/;
  const match = line.match(pattern);
  if (!match) return null;

  const [, level, operation, jsonPayload] = match;
  const trimmedPayload = jsonPayload.trim();

  try {
    const context = JSON.parse(trimmedPayload);
    return {
      level: level as LogLevel,
      operation,
      context,
    };
  } catch (error) {
    console.warn('Skipping line due to JSON parse error:', trimmedPayload);
    return null;
  }
}

async function processStream(stream: NodeJS.ReadableStream) {
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  const stats = new Map<string, OperationStats>();

  for await (const line of rl) {
    const parsed = parseLine(line);
    if (!parsed) continue;

    const opStats = stats.get(parsed.operation) ?? {
      successCount: 0,
      errorCount: 0,
      durations: [],
    };

    if (parsed.level === 'SUCCESS') {
      opStats.successCount += 1;
      const duration = Number(parsed.context?.durationMs);
      if (!Number.isNaN(duration)) {
        opStats.durations.push(duration);
      }
    } else if (parsed.level === 'ERROR') {
      opStats.errorCount += 1;
      const duration = Number(parsed.context?.durationMs);
      if (!Number.isNaN(duration)) {
        opStats.durations.push(duration);
      }
    }

    stats.set(parsed.operation, opStats);
  }

  return stats;
}

function percentile(values: number[], percentileRank: number): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((percentileRank / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

function renderReport(stats: Map<string, OperationStats>) {
  const rows: Array<{
    operation: string;
    total: number;
    successRate: number;
    p50: number | null;
    p95: number | null;
  }> = [];

  for (const [operation, data] of stats) {
    const total = data.successCount + data.errorCount;
    const successRate = total === 0 ? 0 : (data.successCount / total) * 100;
    rows.push({
      operation,
      total,
      successRate,
      p50: percentile(data.durations, 50),
      p95: percentile(data.durations, 95),
    });
  }

  rows.sort((a, b) => b.total - a.total);

  console.log('\nDocument Generation Metrics');
  console.log('-------------------------------------------');
  rows.forEach((row) => {
    const p50Label = row.p50 !== null ? `${row.p50.toFixed(1)}ms` : 'n/a';
    const p95Label = row.p95 !== null ? `${row.p95.toFixed(1)}ms` : 'n/a';
    console.log(
      `${row.operation.padEnd(32)} | total: ${row.total
        .toString()
        .padStart(4)} | success: ${row.successRate.toFixed(2)}% | p50: ${p50Label} | p95: ${p95Label}`,
    );
  });
}

async function main() {
  const inputFlagIndex = process.argv.findIndex((arg) => arg === '--input' || arg === '-i');
  const inputPath = inputFlagIndex !== -1 ? process.argv[inputFlagIndex + 1] : undefined;

  if (inputPath) {
    const resolved = path.resolve(process.cwd(), inputPath);
    if (!fs.existsSync(resolved)) {
      console.error(`Input file not found: ${resolved}`);
      process.exit(1);
    }
    const stream = fs.createReadStream(resolved, { encoding: 'utf-8' });
    const stats = await processStream(stream);
    renderReport(stats);
  } else {
    if (process.stdin.isTTY) {
      console.error('No input provided. Pass a log file with --input <file> or pipe logs via STDIN.');
      process.exit(1);
    }
    const stats = await processStream(process.stdin);
    renderReport(stats);
  }
}

main().catch((error) => {
  console.error('Failed to analyze document generation logs:', error);
  process.exit(1);
});
