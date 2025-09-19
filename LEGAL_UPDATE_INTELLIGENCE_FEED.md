# Legal Update Intelligence Feed

A compliance-first pipeline that collects government legal updates, summarizes the impact in plain language, and delivers notifications across the product surface.

## Business Impact
- **Reduce churn** by delivering ongoing compliance value after the initial document purchase.
- **Unlock premium plans** with differentiated monitoring and notifications.
- **Increase authority/SEO** via fresh, jurisdiction-aware content.
- **Lower support load** by answering common compliance questions proactively.

## Architecture Overview
```
Government RSS Feeds --> RSS Parser --> Firestore (raw updates)
                                         |
                                         v
                               LiteLLM Gateway (summaries)
                                         |
                                         v
                        Firestore (processed updates) --> UI / Email / API
```
Supporting services: Cloud Scheduler (cron), SendGrid (email), Admin dashboard, Analytics capture.

## Key Files
```
src/
  lib/legal-updates/
    schema.ts                # Data models & Zod validation
    rss-parser.ts            # Fetch & dedupe RSS sources
    ai-summarizer.ts         # LiteLLM summarization service with guardrails
    email-service.ts         # SendGrid delivery helpers
  components/legal-updates/
    LegalUpdatesWidget.tsx   # Dashboard surface
    admin/LegalUpdateSourcesManager.tsx
app/api/legal-updates/
  process/route.ts           # RSS ingestion web hook
  feed/route.ts              # Widget data API
  action/route.ts            # User interactions
  email/route.ts             # Digest sender
cloud-scheduler-config.yaml  # Example scheduler jobs
```

## Environment Variables
Add to `.env.local` and production secret manager:
```
# LiteLLM / AI Gateway
AI_GATEWAY_URL=https://ai-gateway.internal
AI_GATEWAY_API_KEY=replace-with-liteLLM-key
AI_LEGAL_UPDATES_MODEL=gpt-oss-20b

# Email + scheduling
SENDGRID_API_KEY=replace-with-sendgrid
CLOUD_SCHEDULER_TOKEN=secure-random-token
NEXT_PUBLIC_APP_URL=https://123legaldoc.com

# Optional tuning
RSS_PARSER_TIMEOUT=30000
EMAIL_BATCH_SIZE=100
MAX_UPDATES_PER_BATCH=20
```
All AI calls must go through the LiteLLM gateway; OpenAI/Anthropic keys are no longer supported.

## Dependencies
```
npm install rss-parser @sendgrid/mail
```
LiteLLM client utilities already ship inside `src/ai`.

## Cloud Scheduler Jobs
```
# RSS processing (every 6 hours)
gcloud scheduler jobs create http legal-updates-rss-processing \
  --schedule="0 */6 * * *" \
  --uri="https://123legaldoc.com/api/legal-updates/process" \
  --http-method=POST \
  --headers="x-scheduler-token=${CLOUD_SCHEDULER_TOKEN}"

# Weekday digest (7 AM)
gcloud scheduler jobs create http legal-updates-daily-email \
  --schedule="0 7 * * 1-5" \
  --uri="https://123legaldoc.com/api/legal-updates/email?frequency=daily" \
  --http-method=POST \
  --headers="x-scheduler-token=${CLOUD_SCHEDULER_TOKEN}"
```

## Data Flow
1. Scheduler calls `/api/legal-updates/process`.
2. Parser fetches RSS, dedupes by GUID, and stores records in `raw_legal_updates`.
3. `legalUpdateAISummarizer` pulls pending records, runs guardrail-checked LiteLLM summarization, writes to `processed_legal_updates`, and marks status.
4. Widget/feed APIs and email digests surface the processed content.

## Guardrails & Safety
- Summaries flow through `aiInstance.generateText` with Prompt Guard + heuristics.
- Guardrail refusals return human-review fallbacks and log to Firestore.
- No raw PII is stored in prompts; redact user data before enqueueing.
- Secrets live exclusively in the secret manager; never commit them to git.

## Analytics & Monitoring
Track via Prometheus/Grafana + Firestore counters:
- Processing success/failure counts.
- Email delivery and open rates.
- Widget engagement (reads, bookmarks).
- Source health (error rate, last fetch).

## Administration
- Use `LegalUpdateSourcesManager.tsx` to add/edit RSS feeds, priorities, and polling cadence.
- Manual reprocessing is available through `legalUpdateAISummarizer.reprocessUpdate` (CLI or admin action).
- Archive stale sources quarterly; verify government feeds are still active.

## Security & Compliance
- Enforce TLS on gateway and Firestore access.
- Authenticate scheduler calls with `x-scheduler-token`.
- Store only derived insights; raw documents remain in government systems.
- Incident response: capture Langfuse trace, notify Compliance, revert to manual digest if guardrails misfire.

## KPIs
- Processing success rate >= 95%.
- Email delivery rate >= 98%; open rate >= 25%.
- Average summarization latency <= 3s.
- Churn reduction among subscribers >= 10% vs. control cohort.

## Roadmap
- Phase 2: document impact analysis, regulatory calendar, custom alert rules.
- Phase 3: Spanish coverage, legal Q&A assistant, enterprise workflows, deeper analytics.

## Troubleshooting
1. **No updates showing** - confirm scheduler logs and RSS source health.
2. **Emails failing** - verify SendGrid key and quota.
3. **Summaries blocked** - inspect guardrail decision logs; escalate to Compliance if needed.
4. **Performance issues** - review Firestore usage and batch sizes.

---
2025-09-19: Platform Engineering introduced `FEATURE_SECURITY_HEADERS` (see `ops/runbooks/security-header-feature-flag.md`). The default `true` keeps CSP report-only with optional HSTS; disable only per incident runbook.
