# 123LegalDoc – Lighthouse Remediation Sprint (48 h)

## Governance & Audit
- Follow the 48-hour sprint timeline T₀ → T₂.
- Log every file touched, LOC delta, and outcome to `/logs/lighthouse-remediation.md` in the format:
  `[timestamp] – <action> – <file> – <metric change>`
- $500 max infra budget; no paid libraries.

## Project Context
Framework: **Next.js 15** (static export) + **Firebase Hosting/Functions**

Frontend conventions:
- Replace all `<img>` with the existing `<AutoImage />` wrapper.
- Use React Server Components where possible.
- No server actions, no unstable libs.
- ESLint already blocks `<img>`; keep this rule.
- Tailwind + shadcn/ui for UI.
- i18n via react-i18next (translations live under `public/locales/*`).

## Lighthouse Targets (desktop)
| Metric | Current | Target |
|-------|--------|--------|
| Performance score | **41** | ≥ 90 |
| FCP | 1.3 s | ≤ 1.0 s |
| LCP | 3.3 s | ≤ 2.5 s |
| TBT | 1 140 ms | ≤ 200 ms |
| CLS | 0.064 | ≤ 0.10 |

## Key Failures to Fix
1. **JavaScript weight & execution**
   - Main bundle 3.9 MB, >2.8 s main-thread time (pages 2, 6).
   - 9 long tasks >50 ms (page 7).
2. **Render-blocking & unused assets**
   - `app/layout.css` blocking FCP (80 ms) (page 3).
   - 669 KiB unused JS, 17 KiB unused CSS (page 4).
3. **Back/forward cache disabled** – WebSocket + `Cache-Control: no-store` (pages 4–5).
4. **Large network payloads** – 6 JS chunks >200 KiB each (page 6).
5. **Layout Shift hot-spots** – hero section heading (page 8).
6. **Accessibility** – low-contrast text in footer & promo bar, `maximum-scale=1` blocks zoom (pages 13–17).
7. **Best-Practice** – 404s for `*/en/common` translation files; missing source maps (pages 24–26).
8. **Security** – No CSP (`script-src`) & no HSTS (page 26).

## Implementation Tasks
### A. Code-split & Tree-shake
1. Turn on `modularizeImports` & `experimental.optimizePackageImports` in `next.config.js`.
2. Lazy-load shadcn heavy components (`StickyFilterBar`, `TrustAndTestimonials`) with dynamic import.
3. Replace polyfilled legacy helpers with native ES2022; add `"browserslist": "last 2 Chrome versions"` to `package.json`.

### B. Reduce Render Blocking
1. Inline critical Tailwind above-the-fold CSS via `@layer utilities` extraction.
2. Move remaining global CSS to `serverComponents` `head()` tag with `precedence="low"`.

### C. Optimize Fonts & Images
1. Add `font-display: swap` in `/styles/fonts.css`; preload `Inter` woff2.
2. Preload LCP hero image in `<head>` and ensure `<AutoImage priority />`.

### D. Back/Forward Cache
1. Remove unused WebSocket dev helper; gate with `process.env.NODE_ENV === "development"`.
2. Serve all HTML with `Cache-Control: public, max-age=31536000, immutable`.

### E. Accessibility & UX
1. Raise text-foreground contrast to ≥ 4.5 in Tailwind theme (`colors.muted-foreground`).
2. Drop `maximum-scale=1` from viewport meta; keep `user-scalable=yes`.
3. Add `role="alert"` ARIA-live region to promo timer.

### F. Security Headers (firebase.json rewrites)
```json
"headers": [
  {
    "source": "**",
    "headers": [
      {
        "key": "Content-Security-Policy",
        "value": "default-src 'self'; script-src 'self'; object-src 'none'; connect-src 'self' https://firestore.googleapis.com"
      },
      {
        "key": "Strict-Transport-Security",
        "value": "max-age=31536000; includeSubDomains; preload"
      }
    ]
  }
]
```
