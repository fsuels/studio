# Ragas Configuration Templates

`config.template.yaml` documents the expected structure for running Ragas evaluations against LiteLLM. Replace `${...}` placeholders via CLI overrides or environment variables before executing the wrapper.

## Usage Steps
1. Copy `config.template.yaml` to `config_<locale>.yaml` and adjust:
   - `id` to match the evaluation run (e.g., `rag_intake_en_prod`).
   - `dataset.path` to reference the approved JSONL dataset.
   - `model.params.model` if routing to alternate backends (e.g., llama-3.1).
2. Ensure all datasets referenced include `consent_reference` metadata for audit traceability.
3. Add the new config path to `ops/ai/evals/config.json` (not versioned) or use the `--output-dir` flag when invoking the CLI.
4. Archive metrics output under `ops/artifacts/<cycle>/evals/` with a checksum.

## Metrics
Default metrics: `faithfulness`, `answer_relevance`, `context_relevance`, `context_precision`, `answer_similarity`. Adjust per task while preserving Compliance-approved thresholds.