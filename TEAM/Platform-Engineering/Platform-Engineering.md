# Platform Engineering Playbook

## Mission Contribution
Enable a resilient, performant Next.js + Firebase platform that delivers bilingual, jurisdiction-aware legal workflows at scale. This pod guarantees the experience stays fast, secure, and trustworthy so every other team can ship features without breaking compliance or uptime.

## Charter
- Maintain the core application stack (Next.js 15, Turbopack dev, Node 18/20 runtime) and shared component library.
- Operate Firebase (Auth, Firestore, Storage) plus complementary services (Redis cache, PDF rendering workers) with clear SLAs.
- Implement and enforce security headers, CSP (report-only to start), access controls, logging, and observability.
- Own CI/CD, automated testing gates, infrastructure-as-code, and rollback procedures.
- Provide engineering standards: coding guidelines, performance budgets, accessibility baselines, and RSC/edge patterns.

## 90-Day Objectives
1. Achieve weekly release train with automated regression, Lighthouse, axe, and compliance gates before deploy.
2. Hit 99.9% uptime across production endpoints with documented incident response playbooks.
3. Close backlog items for SSR/SSG, canonical/hreflang coverage, and security headers (CSP report-only by default).
4. Deliver production-grade telemetry: tracing, structured logs, error correlation, and PII scrubbing for AI+PDF flows.

## KPIs & Targets
- Availability: >=99.9% monthly uptime.
- Performance: p75 LCP <= 2.5s mobile, INP <= 200ms, CLS <= 0.1.
- Defect containment: <1% regressions escaping to production per release train.
- Incident MTTA <=5 minutes, MTTR <=60 minutes for Sev0/Sev1.
- Accessibility: 0 serious/critical axe violations on monitored routes.

## Operating Cadence
- Daily: standup with prod/ops review; triage alerts; review overnight telemetry.
- Weekly: release train readiness review; merge freeze lifts only after gate pass; retro on incidents.
- Biweekly: architecture council with AI, Document Intelligence, Payments to plan shared changes.
- Monthly: platform hardening audit (security headers, dependency updates, penetration checklist).

## System Ownership
- Next.js app `src/` (layouts, routing, i18n scaffolding, caching layer).
- Firebase projects (Auth, Firestore rules, Cloud Functions deployment pipeline).
- PDF generation services (`src/services/pdf-generator.ts`, workers, queue configs).
- Observability stack (OpenTelemetry, Prometheus metrics via `prom-client`, alert rules in Grafana/PagerDuty).
- Edge/CDN configuration, custom server (`server.mjs`), and TLS setup.

## Tooling & Integrations
- CI: GitHub Actions, Playwright, Jest, Lighthouse CI, axe.
- Infra scripts: `scripts/`, Terraform (if introduced), Firebase CLI, Stripe webhooks sandbox for E2E.
- Monitoring: Sentry, Log aggregation (e.g., BigQuery/Elastic), uptime checks.
- Collaboration: Linear/Jira for workload, Notion/Confluence or `ops/` docs for runbooks.

## Collaboration Map
- Document Intelligence: ensure template manifests ship with zero downtime migrations.
- AI & Automation: vet Genkit endpoints, provide rate limits, and secure service accounts.
- Compliance & Legal Ops: implement mandated notices, cookie controls, data residency requirements.
- Growth & Customer Learning: instrument funnel analytics, support SEO technical requirements.
- Payments & Monetization: harden Stripe webhooks, manage secrets, monitor payment infrastructure.

## Risk & Escalation
- Security incidents: escalate to CEO + Compliance immediately; rotate credentials; follow incident runbook.
- Performance regressions: trigger release freeze, roll back, root cause before redeploy.
- Data loss or corruption: activate backup restore plan; notify affected teams; coordinate with Compliance for disclosures.

## Immediate Next Actions
1. Productionize security header middleware (HSTS, Referrer-Policy, Permissions-Policy, CSP report-only) behind feature flag and document rollout.
2. Finish SSR/SSG conversion for marketing routes to improve CWV and SEO parity.
3. Wire automated artifact uploads (axe, Lighthouse, template verification) into `ops/artifacts` per release.
4. Draft incident communication template and rehearsal schedule with Compliance + CEO.
