import next from 'next';
import { createSecureServer } from 'node:http2';
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { parse } from 'node:url';

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const options = {
  key: readFileSync('./cert/server.key'),
  cert: readFileSync('./cert/server.crt'),
  allowHTTP1: true,
};

const httpPort = process.env.HTTP_PORT || 80;

app.prepare().then(() => {
  // In production, ensure the Next build exists to avoid missing-manifest errors
  if (!dev) {
    const manifestPath = path.join(process.cwd(), '.next', 'server', 'middleware-manifest.json');
    if (!existsSync(manifestPath)) {
      console.error('[startup] Missing .next build output. Run "npm run build" before starting.');
      process.exit(1);
    }
  }

  const server = createSecureServer(options, (req, res) => {
    const url = req.url || '';
    if (
      url.startsWith('/_next/static/') ||
      /\.(?:js|css|png|jpg|jpeg|gif|svg|webp|avif|ico|woff2?)$/.test(url)
    ) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    const parsedUrl = parse(req.url || '', true);
    const pathname = parsedUrl.pathname || '';

    // Guard internal Next.js pages that App Router doesn't expose
    if (pathname === '/_document' || pathname === '/_app') {
      res.statusCode = 404;
      res.end('Not Found');
      return;
    }
    handle(req, res, parsedUrl);
  });

  // HTTP server that redirects all traffic to HTTPS
  const httpServer = createServer((req, res) => {
    const host = req.headers['host'];
    const redirectUrl = `https://${host}${req.url}`;
    res.statusCode = 301;
    res.setHeader('Location', redirectUrl);
    res.end();
  });

  server.listen(port, () => {
    console.log(`> Ready on https://localhost:${port}`);
  });

  httpServer.listen(httpPort, () => {
    console.log(`> Redirecting http://localhost:${httpPort} to https`);
  });
});
