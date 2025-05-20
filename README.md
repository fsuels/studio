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
NODE_ENV=production npm run build
NODE_ENV=production npm start
```

## Reducing Main-Thread Work

- Use dynamic imports (`next/dynamic`) for heavy components to split JavaScript bundles.
- Avoid including large libraries in the initial bundle; load them only on pages that need them.
- Run Lighthouse against a production build to measure real-world performance.
- Keep development-only dependencies out of client-side code.
- Consider profiling with Next.js `ANALYZE=true` to inspect bundle sizes.

