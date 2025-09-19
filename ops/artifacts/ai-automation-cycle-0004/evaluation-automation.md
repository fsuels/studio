# AI & Automation Cycle 0004 - Evaluation Automation

## Highlights
- Implemented `scripts/ai/run-evaluations.ts`, a CLI wrapper for lm-evaluation-harness and Ragas jobs with placeholder substitution, dry-run support, and artifact output routing.
- Added evaluation config scaffold under `ops/ai/evals/` including `config.example.json`, dataset directory stubs, and usage README.
- Exposed new npm script `ai:evaluate` for consistent CI integration using the evaluation wrapper.

## Verification
- Manual TypeScript review for CLI option parsing, placeholder resolution, and secret masking.
- Executed `npm run ai:evaluate -- -- --config ops/ai/evals/config.example.json --gateway-url https://example.internal --gateway-key placeholder --dry-run` to confirm dry-run output and environment masking.
- Validated config example aligns with LiteLLM gateway placeholders and artifact paths.

## Follow-Ups
- Populate `ops/ai/evals/datasets` and `ops/ai/evals/ragas` with gold datasets and YAML configs approved by Compliance.
- Integrate wrapper into scheduled job (GitHub Actions or cron) emitting artifacts to `ops/artifacts/<cycle>/evals/`.
- Wire Langfuse tagging inside evaluation harness jobs once telemetry pipeline is provisioned.

## Referenced Assets
- `scripts/ai/run-evaluations.ts`
- `ops/ai/evals/config.example.json`
- `ops/ai/evals/README.md`
- `package.json`
