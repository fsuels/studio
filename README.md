# 123LegalDoc

[![Test Coverage](https://github.com/yourusername/123legaldoc/actions/workflows/test-coverage.yml/badge.svg)](https://github.com/yourusername/123legaldoc/actions/workflows/test-coverage.yml)
[![codecov](https://codecov.io/gh/yourusername/123legaldoc/branch/master/graph/badge.svg)](https://codecov.io/gh/yourusername/123legaldoc)
[![Coverage Status](https://coveralls.io/repos/github/yourusername/123legaldoc/badge.svg?branch=master)](https://coveralls.io/github/yourusername/123legaldoc?branch=master)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](package.json)

A comprehensive legal document generation platform that creates state-specific compliant legal forms with 100% legal compliance and an excellent user experience.
For contributor workflow details, read [Repository Guidelines](./AGENTS.md).


## Features

- **State-Specific Compliance** - Automatic compliance checking for all 50 US states
- **Smart PDF Generation** - Intelligent form filling with official state forms
- **Multi-language Support** - English and Spanish translations
- **Live Preview** - Real-time document preview as users type with smart overlay
- **Visual Compliance Indicators** - Clear guidance on legal requirements
- **Secure Document Handling** - Enterprise-grade security for sensitive legal data

## Document Creation Flow

### Official State Forms (e.g., Florida Vehicle Bill of Sale)

All states with mandatory official forms use the **traditional wizard + live overlay** approach:

1. **Wizard Questions** - User fills out step-by-step form fields
2. **Live PDF Preview** - Official state form (e.g., Florida HSMV-82050) displays in real-time
3. **Smart Overlay** - Form data automatically overlays onto PDF using intelligent field detection
4. **Compliance Badges** - Visual indicators show requirements (Notary Required, etc.)

### Automatic Question Generation

The platform automatically generates wizard questions from overlay.json configurations:

- **Dynamic Questions** - Wizard questions are generated from PDF field mappings, ensuring perfect alignment between the wizard and the PDF form
- **Smart Type Detection** - Field types (date, number, select) are automatically detected from field names
- **Label Generation** - Field names like `seller_name` or `vehicleVesselIdentificationNumber` are converted to human-readable labels
- **State-Specific Adjustments** - Questions adapt based on state requirements (e.g., county becomes required for notarization states)

```typescript
import { generateQuestions } from '@/lib/question-generator';
const questions = generateQuestions(overlayConfig);
```

### Feature Flags

- `USE_DIRECT_PDF_FILLING=false` - All states use traditional wizard flow (recommended)
- `USE_DIRECT_PDF_FILLING=true` - Enables experimental direct PDF form filling (deprecated)

##  Code Coverage

This project maintains high code coverage standards:

- **Lines**: 80%+ target
- **Functions**: 80%+ target  
- **Branches**: 75%+ target
- **Statements**: 80%+ target

Coverage reports are automatically generated on every PR and push to main branches.

### Running Tests and Coverage

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Generate detailed coverage report
npm run coverage:report:detailed

# Open coverage report in browser
npm run coverage:open

# Generate JSON coverage data
npm run coverage:report:json
```

##  Getting Started

### Prerequisites

- Node.js 18.x or 20.x
- npm or yarn
- Firebase account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/123legaldoc.git
cd 123legaldoc
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Run the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## - Development

### Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run format` - Format code with Prettier

### Testing

- `npm test` - Run Jest unit tests
- `npm run e2e` - Run Playwright E2E tests
- `npm run accessibility:test` - Run accessibility tests

### How to finish a stubborn overlay

When auto-generated overlays have low coverage, use the interactive manual mapping tool:

1. Generate initial overlay: `npx tsx scripts/build-overlay.ts <pdf-path> --state <STATE>`
2. Launch mapping tool: `npx tsx scripts/manual-map.ts <pdf-path> --overlay <overlay-json-path>`
3. Click on PDF where each field should appear
4. Save and exit (ESC key)
5. Coverage goes from ~20% to 100% 

## Firebase configuration

1. In the Firebase console open **Settings \u2192 Service accounts** and click
   **Generate new private key**.
2. Save the downloaded file as `serviceAccountKey.json`.
3. Export it as a single line:

```bash
export FIREBASE_SERVICE_ACCOUNT_KEY_JSON="$(cat serviceAccountKey.json | jq -c .)"
```

The string must include properly escaped `\n` newlines in the `private_key`
field.

## Production Builds

For optimal performance and minified JavaScript output, build the project in
production mode:

```bash
npm run build
npm start   # automatically sets NODE_ENV=production
```

Running Lighthouse against the production build will show minified JavaScript
files.

## Using HTTP/2

The `npm start` script now launches a small Node.js server that serves the built
Next.js app over **HTTP/2** with an automatic fallback to HTTP/1.1. This requires
TLS certificates which are not committed to the repository.

Create a `cert` directory with `server.crt` and `server.key` files for local
development. You can generate selfsigned certificates using OpenSSL:

```bash
mkdir cert
openssl req -newkey rsa:2048 -nodes -keyout cert/server.key \
  -x509 -days 365 -out cert/server.crt
```

After generating the certificates, build and start the app:

```bash
npm run build
npm start
```

## Serving over HTTPS

Lighthouse may report insecure requests if the site is served via plain HTTP.
Run the production server with TLS so all assets load over HTTPS:

1. Set the `NEXT_PUBLIC_SITE_URL` environment variable to your HTTPS domain,
   e.g. `https://example.com`.
2. Generate certificates as shown above or supply valid ones in the `cert`
   directory.
3. Build and start the app using `npm start` which launches `server.mjs` on
   HTTPS.

```bash
NEXT_PUBLIC_SITE_URL=https://example.com npm run build
npm start
```

The site will now be available on `https://localhost:<port>` (or your configured
domain) and Lighthouse should no longer flag insecure requests.

## Firestore Connectivity

The Firestore client now autodetects whether your network supports gRPC. If
gRPC is blocked, it automatically falls back to HTTP long polling.
You can still force polling by setting
`NEXT_PUBLIC_FIRESTORE_FORCE_POLLING=true`, but polling is slower and should be
enabled only when required.

## Troubleshooting Lighthouse reports

If Lighthouse shows large execution times and lists files such as
`react-dev-overlay` or `scheduler.development.js`, ensure you're testing a
production build. Development mode includes additional code for debugging which
increases bundle size and CPU usage. Build and serve the app in production mode
before running Lighthouse:

```bash
npm run build
npm start
```

## Avoiding Long Main-Thread Tasks

If Lighthouse flags **long mainthread tasks** while testing your pages, ensure
the app is running a production build. Development mode bundles additional
debugging helpers such as React's scheduler development build which can create
long tasks and skew performance metrics. Use `npm run build` followed by
`npm start` to serve the optimized version before profiling. If heavy components
still cause long tasks, consider loading them with `next/dynamic` or breaking up
expensive computations with `setTimeout` or `requestIdleCallback` so the UI
remains responsive.

## Reducing Main-Thread Work

- Use dynamic imports (`next/dynamic`) for heavy components to split JavaScript bundles.
- Avoid including large libraries in the initial bundle; load them only on pages that need them.
- Run Lighthouse against a production build to measure real-world performance.
- Keep development-only dependencies out of client-side code.
- Consider profiling with Next.js `ANALYZE=true` to inspect bundle sizes.

## Reducing Unused JavaScript

- Run `ANALYZE=true npm run build` to view the size of each client bundle and identify heavy modules.
- Convert infrequently used components such as `Header`, `StickyFilterBar` and landing page sections to `next/dynamic` imports so they load only when rendered.
- Move rarely needed imports out of `app/layout.tsx` and page-level layouts to avoid pulling them into every page's bundle.
- Import components directly inside the pages that need them instead of in `_app` or root layouts when possible.
- After making these changes, rebuild the project in production mode and re-run Lighthouse to verify reductions in unused JavaScript.

## Intercom Chat Widget

Set `NEXT_PUBLIC_INTERCOM_APP_ID` in your environment to enable the Intercom chat widget. The script loads only when the user clicks the chat button in the footer, minimizing third-party impact. Leave this variable unset to disable the widget entirely.

## Seeding Template Reviews

Use the provided script to add example Trustpilot-style reviews to Firestore. Supply the template ID and review details:

```bash
node scripts/seedReviews.js --templateId=vehicle-bill-of-sale \
  --name="Sarah L." --rating=5 \
  --quote="Saved me hours at the DMVprinted, signed and transferred the title the same day!"
```

Each run creates a new document in the `reviews` collection so that `TestimonialsCarousel` can display templatespecific feedback.

