# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

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
development. You can generate self‑signed certificates using OpenSSL:

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

If Lighthouse flags **long main‑thread tasks** while testing your pages, ensure
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

