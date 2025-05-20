import next from 'next';
import { createSecureServer } from 'node:http2';
import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { parse } from 'node:url';
import { execSync } from 'node:child_process';

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Ensure TLS certificates exist so HTTP/2 can be used locally.
const certDir = './cert';
const keyPath = `${certDir}/server.key`;
const certPath = `${certDir}/server.crt`;
if (!existsSync(keyPath) || !existsSync(certPath)) {
  mkdirSync(certDir, { recursive: true });
  console.log('Generating self-signed TLS certificate for HTTP/2...');
  try {
    execSync(
      `openssl req -newkey rsa:2048 -nodes -keyout ${keyPath} -x509 -days 365 -out ${certPath} -subj "/CN=localhost"`
    );
  } catch (e) {
    console.error('Failed to generate TLS certificate', e);
    process.exit(1);
  }
}

const options = {
  key: readFileSync(keyPath),
  cert: readFileSync(certPath),
  allowHTTP1: true,
};

const httpPort = process.env.HTTP_PORT || 80;

app.prepare().then(() => {
  const server = createSecureServer(options, (req, res) => {
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
