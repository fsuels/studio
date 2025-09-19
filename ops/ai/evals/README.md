# AI Evaluation Harness

This directory stores evaluation configuration, datasets, and Ragas settings for the LiteLLM/vLLM gateway.

## Structure
- `config.example.json` — Sample job configuration consumed by `scripts/ai/run-evaluations.ts`.
- `datasets/` — Gold datasets (JSONL) for lm-evaluation-harness and Ragas runs. See `datasets/README.md` and `.template.jsonl` files.
- `ragas/` — Ragas configuration files and templates.

Copy `config.example.json` to `config.json` and update the placeholders:

1. Set `artifactsDir` to the desired output directory (defaults to `ops/artifacts/ai-evals/latest`).
2. Replace `${GATEWAY_URL}`/`${GATEWAY_KEY}` placeholders with the LiteLLM gateway host or rely on CLI overrides.
3. Adjust task names, batch sizes, and dataset paths per environment.

## Running Evaluations
Use the CLI wrapper introduced in `scripts/ai/run-evaluations.ts`:

```bash
npm run ai:evaluate -- -- --config ops/ai/evals/config.json --gateway-url https://litellm.dev.internal --dry-run
```

Key CLI flags:
- `--job <name>`: run a specific job defined in the config.
- `--dry-run`: print resolved commands without executing.
- `--gateway-url` / `--gateway-key`: override placeholders without editing the config.
- `--output-dir <path>`: emit artifacts to a new location (created automatically).

Artifacts produced by each job should be archived under `ops/artifacts/<cycle>/evals/` for traceability and linked in cycle summaries.
