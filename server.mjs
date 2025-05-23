import next from 'next';
import { createSecureServer } from 'node:http2';
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
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
  const server = createSecureServer(options, (req, res) => {
    const url = req.url || '';
    if (
      url.startsWith('/_next/static/') ||
      /\.(?:js|css|png|jpg|jpeg|gif|svg|webp|avif|ico|woff2?)$/.test(url)
    ) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    const parsedUrl = parse(req.url, true);
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
