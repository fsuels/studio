# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Production Builds

For optimal performance and minified JavaScript output, build the project in
production mode:

```bash
npm run build
npm start
```

Running Lighthouse against the production build will show minified JavaScript
files.

## Troubleshooting Lighthouse reports

If Lighthouse shows large execution times and lists files such as
`react-dev-overlay` or `scheduler.development.js`, ensure you're testing a
production build. Development mode includes additional code for debugging which
increases bundle size and CPU usage. Build and serve the app in production mode
before running Lighthouse:

```bash
NODE_ENV=production npm run build
NODE_ENV=production npm start
```

## Reducing Main-Thread Work

- Use dynamic imports (`next/dynamic`) for heavy components to split JavaScript bundles.
- Avoid including large libraries in the initial bundle; load them only on pages that need them.
- Run Lighthouse against a production build to measure real-world performance.
- Keep development-only dependencies out of client-side code.
- Consider profiling with Next.js `ANALYZE=true` to inspect bundle sizes.

