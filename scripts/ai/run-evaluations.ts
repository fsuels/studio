import { spawnSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import path from 'path';
import process from 'process';
import { Command } from 'commander';

type JobConfig = {
  name: string;
  type?: 'lm_eval' | 'ragas' | 'custom';
  description?: string;
  command: string[];
  env?: Record<string, string>;
  cwd?: string;
  required?: boolean;
  artifacts?: string[];
};

type EvalConfig = {
  defaultEnv?: Record<string, string>;
  artifactsDir?: string;
  jobs: JobConfig[];
};

type CliOptions = {
  config: string;
  job?: string[];
  dryRun: boolean;
  gatewayUrl?: string;
  gatewayKey?: string;
  outputDir?: string;
  failFast: boolean;
};

const SECRET_KEYS = new Set([
  'AI_GATEWAY_API_KEY',
  'AI_GATEWAY_KEY',
  'GATEWAY_KEY',
  'API_KEY',
  'OPENAI_API_KEY',
]);

function maskSecret(key: string, value: string): string {
  if (!value) return value;
  if (!SECRET_KEYS.has(key)) return value;
  if (value.length <= 4) return '****';
  return `${value.slice(0, 2)}****${value.slice(-2)}`;
}

function resolvePlaceholders(value: string, env: Record<string, string>): string {
  return value.replace(/\$\{([^}]+)}/g, (_, key: string) => {
    if (env[key] !== undefined) {
      return env[key] ?? '';
    }
    if (process.env[key] !== undefined) {
      return process.env[key] ?? '';
    }
    return '';
  });
}

function loadConfig(configPath: string): EvalConfig {
  if (!existsSync(configPath)) {
    throw new Error(
      `Evaluation config not found at ${configPath}. Copy ops/ai/evals/config.example.json to ${configPath} and customize.`,
    );
  }
  const raw = readFileSync(configPath, 'utf8');
  try {
    return JSON.parse(raw) as EvalConfig;
  } catch (error) {
    throw new Error(`Failed to parse evaluation config ${configPath}: ${String(error)}`);
  }
}

function ensureArtifactsDir(baseDir?: string): string | undefined {
  if (!baseDir) return undefined;
  const normalized = path.resolve(baseDir);
  if (!existsSync(normalized)) {
    mkdirSync(normalized, { recursive: true });
  }
  return normalized;
}

function shouldRunJob(job: JobConfig, selectedJobs?: string[]): boolean {
  if (!selectedJobs || selectedJobs.length === 0) return true;
  return selectedJobs.includes(job.name);
}

function runJob(job: JobConfig, env: Record<string, string>, options: CliOptions): boolean {
  const command = job.command.map((part) => resolvePlaceholders(part, env));
  const cwd = job.cwd ? resolvePlaceholders(job.cwd, env) : undefined;

  if (options.dryRun) {
    console.log(`\n[DRY RUN] Job: ${job.name}`);
    if (job.description) console.log(`  ${job.description}`);
    console.log('  Command:', command.join(' '));
    const effectiveEnv = Object.entries(env)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `    ${key}=${maskSecret(key, value)}`)
      .join('\n');
    if (effectiveEnv) {
      console.log('  Env:\n' + effectiveEnv);
    }
    if (cwd) console.log('  CWD:', cwd);
    if (job.artifacts?.length) {
      console.log('  Artifacts:');
      job.artifacts.forEach((artifact) => console.log(`    ${artifact}`));
    }
    return true;
  }

  console.log(`\n[RUN] ${job.name}`);
  if (job.description) {
    console.log(`  ${job.description}`);
  }
  console.log('  Command:', command.join(' '));
  if (cwd) console.log('  CWD:', cwd);

  const spawnResult = spawnSync(command[0], command.slice(1), {
    stdio: 'inherit',
    cwd,
    env: {
      ...process.env,
      ...env,
    },
  });

  if (spawnResult.error) {
    console.error(`Job ${job.name} failed to start:`, spawnResult.error);
    return false;
  }

  if (spawnResult.status !== 0) {
    console.error(`Job ${job.name} exited with code ${spawnResult.status}`);
    return false;
  }

  if (job.artifacts?.length) {
    console.log('  Artifacts:');
    job.artifacts.forEach((artifact) => console.log(`    ${artifact}`));
  }

  return true;
}

function main(): void {
  const program = new Command();
  program
    .option('-c, --config <path>', 'Path to evaluation config JSON', 'ops/ai/evals/config.json')
    .option('-j, --job <name...>', 'Specific job(s) to run by name')
    .option('--dry-run', 'Print commands without executing', false)
    .option('--gateway-url <url>', 'Override GATEWAY_URL value for placeholders')
    .option('--gateway-key <key>', 'Override GATEWAY_KEY/AI_GATEWAY_API_KEY placeholder')
    .option('--output-dir <path>', 'Override OUTPUT_DIR placeholder')
    .option('--no-fail-fast', 'Continue running remaining jobs after a failure')
    .allowExcessArguments(false)
    .parse(process.argv);

  const options = program.opts<CliOptions>();
  const config = loadConfig(options.config);

  const artifactsDir = ensureArtifactsDir(options.outputDir ?? config.artifactsDir);

  const selectedJobs = options.job;
  const { defaultEnv = {}, jobs } = config;

  if (!jobs || jobs.length === 0) {
    console.log('No evaluation jobs found in config.');
    return;
  }

  const envOverrides: Record<string, string> = { ...defaultEnv };
  if (artifactsDir) {
    envOverrides.OUTPUT_DIR = artifactsDir;
  }
  if (options.gatewayUrl) {
    envOverrides.GATEWAY_URL = options.gatewayUrl;
  }
  const gatewayKey = options.gatewayKey ?? process.env.AI_GATEWAY_API_KEY;
  if (gatewayKey) {
    envOverrides.GATEWAY_KEY = gatewayKey;
    envOverrides.AI_GATEWAY_API_KEY = gatewayKey;
  }

  const failures: string[] = [];
  for (const job of jobs) {
    if (!shouldRunJob(job, selectedJobs)) continue;

    const jobEnv: Record<string, string> = {
      ...envOverrides,
      ...(job.env ?? {}),
    };

    const envForResolution: Record<string, string> = {
      ...process.env,
      ...envOverrides,
      ...(job.env ?? {}),
    } as Record<string, string>;
    const resolvedEnv: Record<string, string> = {};
    for (const [key, value] of Object.entries(jobEnv)) {
      resolvedEnv[key] = resolvePlaceholders(value ?? '', envForResolution);
    }

    const success = runJob(job, resolvedEnv, options);
    if (!success) {
      failures.push(job.name);
      if (options.failFast) break;
    }
  }

  if (failures.length > 0) {
    console.error(`\nEvaluation run completed with failures in job(s): ${failures.join(', ')}`);
    process.exitCode = 1;
  } else {
    console.log('\nAll evaluation jobs completed successfully.');
  }
}

main();
