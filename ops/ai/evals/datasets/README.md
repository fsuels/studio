# Evaluation Datasets

These files are placeholders for approved gold datasets. Do **not** run evaluations against them until they are replaced with sanitized, consented data cleared by Compliance.

## Naming Convention
- `intake_classification_<locale>.jsonl` for lm-evaluation-harness classification tasks.
- `rag_<flow>_<locale>.jsonl` for RAG answer quality tasks.
- `.template.jsonl` suffix indicates a sample file that must be copied and filled with real data.

## Schema Guidelines
Each JSONL line should follow this structure (add/remove fields as tasks require):

```json
{
  "id": "sample-0001",
  "language": "en",
  "jurisdiction": "us-ca",
  "prompt": "<rendered user prompt>",
  "context": ["<optional retrieved chunk>", "<optional retrieved chunk>"] ,
  "expected_label": "service_agreement",
  "expected_rationale": "Explain why the label applies",
  "metadata": {
    "source": "synthetic",
    "consent_reference": "doc-approval-2025-09-12"
  }
}
```

### Required Practices
1. **Sanitize**: strip PII, apply hashing if ingestion IDs are required.
2. **Traceability**: include a `consent_reference` or dataset ticket ID linking to compliance approval.
3. **Locale**: set `language` and `jurisdiction` codes so bilingual evaluations stay aligned with policy checkpoints.
4. **Imbalance Checks**: ensure class balance (>=20 samples per priority label) before submission.
5. **Storage**: commit only synthetic or fully approved records. Sensitive datasets stay in secure storage and are mounted at runtime via secrets.

## Submission Workflow
1. Duplicate the relevant `.template.jsonl` file, remove the `.template` suffix, and populate it with approved records.
2. Update `ops/ai/evals/config.json` (not versioned) or override paths via CLI flags when running evaluations.
3. Record provenance in the cycle artifact and tag Compliance for review.
4. Store a checksum of the final dataset in `ops/artifacts/<cycle>/evals/` to support audit trails.