import next from 'next';
import { createSecureServer } from 'node:http2';
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

app.prepare().then(() => {
  const server = createSecureServer(options, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  server.listen(port, () => {
    console.log(`> Ready on https://localhost:${port}`);
  });
});
