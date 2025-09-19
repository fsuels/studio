# Compliance & Legal Operations Playbook

## Mission Contribution
Safeguard the company against unauthorized practice of law, deceptive marketing, privacy breaches, and regulatory missteps while enabling rapid expansion into new jurisdictions.

## Charter
- Maintain the legal knowledge base: statutes, filing rules, notices, disclaimers, and required consumer protections per jurisdiction.
- Own customer-facing legal copy (disclaimers, terms of service, privacy notice, refund policy) and ensure it remains current.
- Run release train compliance gates: UPL checklist, marketing review, privacy impact assessment, payment policy alignment.
- Coordinate with external counsel and partner attorneys; manage referral network agreements.
- Lead incident response for legal/compliance escalations and regulatory inquiries.

## 90-Day Objectives
1. Publish approved disclaimers, ToS, privacy, and refund policies before public launch; integrate into product flows.
2. Implement compliance checklist gating weekly releases, including documentation stored in `ops/artifacts/<cycle>/`.
3. Build jurisdiction knowledge base with update cadences for all 50 U.S. states and territories.
4. Define international expansion playbook covering legal research steps, localization requirements, and risk sign-off.

## KPIs & Targets
- Compliance defect rate: <1% of documents delivered leading to legal support tickets.
- Policy freshness: 100% required documents reviewed within scheduled cadence (monthly for high-change states, quarterly otherwise).
- Incident response SLA: acknowledge regulatory inquiries within 1 business day, resolve or provide plan within 5 business days.
- Training completion: 100% staff complete annual UPL, privacy, and marketing compliance training.

## Operating Cadence
- Daily: monitor legal change alerts, customer escalations, and marketing copy updates.
- Weekly: review release train checklist, join go/no-go meetings, brief CEO on open legal risks.
- Biweekly: sync with Document Intelligence on statutes affecting template content; partner with AI pod on guardrail reviews.
- Monthly: conduct policy audits, update risk register, and review incident drills.

## System Ownership
- Compliance knowledge base (could live under `ops/Remember.md`, `docs/legal/`, or dedicated knowledge repo).
- Regulatory trackers, risk register, and decision logs.
- Referral network documentation and vendor agreements.
- Incident response runbooks (UPL alarm, privacy breach, deceptive marketing claim).

## Tooling & Integrations
- Legal research platforms (Fastcase, LexisNexis, gov feeds); subscribe to state bulletins.
- Document management for policies (Notion/Confluence + Git-sourced markdown for source of truth).
- Ticketing integration (Zendesk/Intercom + Jira) for compliance escalations.
- Automated diff monitors on marketing copy to flag risky language changes.

## Collaboration Map
- CEO: provide weekly risk summaries and immediate updates on critical incidents.
- Platform Engineering: ensure disclaimers, cookie banners, and consent flows are correctly implemented; advise on data retention policies.
- Document Intelligence: validate template changes, mandatory clauses, expiration of forms.
- AI & Automation: approve prompts, guardrails, and data usage to avoid legal advice.
- Growth & Customer Learning: review marketing claims, pricing pages, testimonials for compliance.
- Payments & Monetization: verify refund handling, tax language, and payment disclosures meet statutory requirements.

## Risk & Escalation
- Potential UPL issue: freeze impacted experience, consult counsel, document remediation, notify regulators if needed.
- Privacy breach: activate incident response, coordinate with Platform for technical containment, manage notification obligations.
- Non-compliant marketing claim: pull asset immediately, issue corrections, retrain team, update reviewer checklist.

## Immediate Next Actions
1. Finalize and publish public-facing policies (disclaimer, ToS, privacy, refund) with version control in repo and website.
2. Create compliance gate template for release trains and store signed-off artifacts in `ops/artifacts`.
3. Compile jurisdictional notice matrix (mandatory disclosures, filing instructions) and share with Document Intelligence & Growth teams.
4. Set up legal change monitoring feed and escalation workflow in Slack/Teams with daily digest to stakeholders.
