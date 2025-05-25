import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { bundleMDX } from 'mdx-bundler';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { JSDOM } from 'jsdom';

function collect(dir: string, list: string[] = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collect(full, list);
    else if (entry.isFile() && full.endsWith('.md')) list.push(full);
  }
  return list;
}

const templatesDir = path.join(__dirname, '..', '..', 'templates');
const files = collect(templatesDir);

const dummy = { sellers: [{ name: 'A', address: 'B', phone: 'C' }], buyers: [{ name: 'D', address: 'E', phone: 'F' }], state: 'CA', county: 'Alameda', sale_date: '2020-01-01', price: '1000', make: 'Toyota', model: 'Camry', year: '2020', color: 'Blue', vin: '1HGCM82633A004352', odometer: '1000', payment_method: 'cash', warranty_text: 'None', existing_liens: 'None', requireNotary: true, witnessCount: 0 } as any;

async function renderMarkdown(md: string) {
  const { code } = await bundleMDX({ source: md });
  // eslint-disable-next-line no-new-func
  const Component = new Function('React', `${code}; return MDXContent;`)(React);
  return ReactDOMServer.renderToStaticMarkup(React.createElement(Component));
}

test('all markdown templates render without unresolved tags', async () => {
  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    const compiled = Handlebars.compile(raw);
    const md = compiled(dummy);
    const html = await renderMarkdown(md);
    const dom = new JSDOM(html);
    assert.ok(!dom.serialize().includes('{{'), `Unresolved tag in ${path.basename(file)}`);
  }
});
