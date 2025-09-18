# Remember.md
## Decisions
- 2025-09-18 — Initialized Codex memory
- 2025-09-18 — Cataloged template inventory and added canonical/hreflang for category + blog routes
## Baselines
- CWV: { lcp_ms: null, inp_ms: null, cls: null }
- A11y: null; SEO: null; Bundle: null; Reliability: null
## Backlog (prioritized)
- [ ] Enable SSR/SSG for marketing pages (impact 5, complexity 2)
- [ ] robots.txt + sitemap.xml + canonical + hreflang (homepage, category, blog canonical complete; expand to remaining routes)
- [x] Organization/WebSite JSON-LD (homepage coverage in place)
- [ ] A11y landmarks + skip link + labels (axe clean)
- [ ] Security headers: HSTS, CSP, Referrer-Policy, Permissions-Policy (HSTS, permissions, and cross-domain policies applied; CSP still disabled for PDF compatibility)
- [ ] Contract inventory + clause/placeholder/translation checks (verify new Spanish source templates for clause parity)
- [x] Provide Spanish variants for basic-nda and power-of-attorney markdown templates
- [ ] Extend canonical and hreflang coverage to other marketing routes
## Inventory
### Pages
- [ ] /en (homepage canonical + JSON-LD ready)
- [ ] /[locale]/category/[category]
- [ ] /[locale]/pricing (needs structured data verification in production)
- [ ] /[locale]/blog/how-to-draft-lease-agreement
### Contracts/Templates
- [ ] src/data/templates — en: 4, es: 4 (parity; newly added es basic-nda, power-of-attorney)
- [ ] public/templates markdown — en: 350, es: 350 (parity)
## Resume Cursor
pending_tasks:
  - Extend canonical and hreflang coverage to other marketing routes
