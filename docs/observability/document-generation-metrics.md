# Document Generation Logging & Metrics

_Last updated: 2025-09-19_

## Logging Contract
- All document-generation logic logs through the shared helper `src/lib/logging/document-generation-logger.ts`.
- Log lines follow the pattern: `[DocumentGen] <LEVEL> <operation> {"jsonPayload":...}` with JSON payloads containing `timestamp`, `durationMs`, `documentId`, and request metadata.
- Levels:
  - `START` – initiation of an operation.
  - `SUCCESS` – operation completed; includes `durationMs`.
  - `ERROR` – operation failed; includes `error` object and `durationMs` when available.

## Key Operations
- `api.generatePdf` – Next.js API route entry point.
- `service.generatePdfDocument` – shared generator invoked by API/other services.
- `pdf.*` – low-level pdf-lib interactions (create, load, fill, merge, extract, overlay, optimize).
- `manifest.loadDocument` / `legacy.loadDocumentDefinition` – manifest and fallback loaders used by UI flows.

## Local Log Analysis
Use the helper script to inspect server logs or dev output:

```bash
npm install
npx tsx scripts/analyze-documentgen-logs.ts --input path/to/logfile.log
```

The script emits totals, success rates, and p50/p95 latencies per operation. Pipe log streams directly via STDIN for ad-hoc checks:

```bash
node server.mjs 2>&1 | npx tsx scripts/analyze-documentgen-logs.ts
```

## Baseline Capture Checklist
1. **Aggregate Logs**
   - Configure the observability platform (e.g., Google Cloud Logging, Datadog) with a query filter `textPayload: "[DocumentGen]"`.
   - Extract fields `operation`, `level`, `durationMs`, `documentId`, `requestId`, `error.name` from the JSON payload.
2. **Smoke Runs**
   - Generate PDFs for the top 5 revenue documents via UI and direct API.
   - Confirm corresponding `api.generatePdf` and `service.generatePdfDocument` `SUCCESS` entries with non-zero `durationMs`.
   - Verify `pdf.*` operations log plausible durations and page counts.
   - Example local command sequence:
     ```bash
     # Start dev server (in new terminal)
     npm run dev

     # Trigger document generation via API (requires auth/session cookie)
     curl -X POST http://localhost:3000/api/generate-pdf \
       -H 'Content-Type: application/json' \
       -b cookie.txt \
       -d '{"documentType":"vehicle-bill-of-sale","answers":{}}'

     # Analyze logs emitted during the call
     cat dev.log | npx tsx scripts/analyze-documentgen-logs.ts
     ```
   - Alternatively, set `DOCUMENTGEN_BASE_URL` and `DOCUMENTGEN_COOKIE` (or `DOCUMENTGEN_BEARER`) and run:
     ```bash
     DOCUMENTGEN_BASE_URL=http://localhost:3000 \
     DOCUMENTGEN_COOKIE="__Secure-next-auth.session-token=..." \
       npx tsx scripts/run-documentgen-smoke.ts
     ```
3. **Dashboards & Alerts**
   - Chart success/error counts per operation, success rate vs. 99.5 % target, and latency percentiles (p50/p95) vs. ≤3 s target.
   - Create daily alert when success rate < 99.5 % or p95 latency > 3000 ms.
4. **Ongoing Monitoring**
   - Schedule a job (Cloud Scheduler/Chron) to export daily metrics snapshot for compliance records.
   - Re-run entry-point audit whenever new Firebase Functions or scripts touch document generation to ensure they adopt the logger.
