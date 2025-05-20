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

**Note:** Running Lighthouse on the development server can surface warnings
about the back/forward cache (bfcache) because the dev server uses WebSockets
and sets `Cache-Control: no-store` headers. Build and start the app in
production mode before auditing to avoid these false positives.
