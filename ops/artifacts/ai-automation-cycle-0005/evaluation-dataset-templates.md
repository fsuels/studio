# AI & Automation Cycle 0005 - Evaluation Dataset Templates

## Highlights
- Added dataset guidelines and templates (`ops/ai/evals/datasets/README.md`, `.template.jsonl`) to ensure compliant gold set creation for lm-eval tasks.
- Introduced Ragas config template and README so intake RAG evaluations can adopt LiteLLM placeholders without leaking secrets.
- Updated top-level evaluation README to reference the new scaffolding and clarified CLI usage with the `-- --` npm convention.

## Verification
- Manual review confirmed template files are ASCII-only, carry explicit compliance warnings, and reference placeholders rather than production data.
- Executed `npm run ai:evaluate -- -- --config ops/ai/evals/config.example.json --gateway-url https://example.internal --gateway-key placeholder --dry-run` to validate placeholder resolution and secret masking.

## Follow-Ups
- Replace template JSONL files with approved bilingual datasets and store checksums in `ops/artifacts/<cycle>/evals/`.
- Add CI job invoking `ai:evaluate` on staging datasets once Compliance signs off.
- Document metric thresholds and pass/fail gates in pod runbook after first full evaluation run.

## Referenced Assets
- `ops/ai/evals/datasets/README.md`
- `ops/ai/evals/datasets/intake_classification.template.jsonl`
- `ops/ai/evals/datasets/rag_intake_en.template.jsonl`
- `ops/ai/evals/ragas/config.template.yaml`
- `ops/ai/evals/ragas/README.md`
- `ops/ai/evals/README.md`