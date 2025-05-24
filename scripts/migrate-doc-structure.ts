import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Project } from 'ts-morph';

const ROOT = process.cwd();
const DOC_ROOT = path.join(ROOT, 'src', 'lib', 'documents');
const TEMPLATE_ROOT = path.join(ROOT, 'public', 'templates');
const NEW_TEMPLATE_ROOT = path.join(ROOT, 'templates');
const REDIRECTS_PATH = path.join(ROOT, 'config', 'redirects.json');

const isApply = process.argv.includes('--apply');

interface Move { src: string; dest: string; }
interface RedirectEntry { from: string; to: string; }

const moves: Move[] = [];
const redirects: RedirectEntry[] = [];

function sha256(file: string): string {
  const buf = fs.readFileSync(file);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function walk(dir: string, fn: (p: string) => void) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, fn); else fn(p);
  }
}

function scanTemplates() {
  if (!fs.existsSync(TEMPLATE_ROOT)) return;
  const langs = fs.readdirSync(TEMPLATE_ROOT);
  for (const lang of langs) {
    const langDir = path.join(TEMPLATE_ROOT, lang);
    if (!fs.statSync(langDir).isDirectory()) continue;
    walk(langDir, file => {
      if (!file.endsWith('.md')) return;
      const rel = path.relative(TEMPLATE_ROOT, file);
      const parts = rel.split(path.sep);
      const l = parts[0];
      let country = 'us';
      let docFile = '';
      if (parts.length === 3) {
        country = parts[1];
        docFile = parts[2];
      } else if (parts.length === 2) {
        docFile = parts[1];
      } else {
        return;
      }
      const docId = path.basename(docFile, '.md');
      const dest = path.join(NEW_TEMPLATE_ROOT, l, country, `${docId}.md`);
      moves.push({ src: file, dest });
      redirects.push({
        from: path.join('public', 'templates', rel).replace(/\\/g, '/'),
        to: path.join('templates', l, country, `${docId}.md`).replace(/\\/g, '/')
      });
    });
  }
}

function scanDocuments() {
  if (!fs.existsSync(DOC_ROOT)) return;
  walk(DOC_ROOT, file => {
    if (!file.endsWith('.ts')) return;
    const rel = path.relative(DOC_ROOT, file);
    const parts = rel.split(path.sep);
    if (parts.length === 1) {
      const docId = path.basename(file, '.ts');
      const dest = path.join(DOC_ROOT, 'us', docId, 'metadata.ts');
      moves.push({ src: file, dest });
    } else if (parts.length === 2 && parts[1].endsWith('.ts')) {
      const country = parts[0];
      const docId = path.basename(parts[1], '.ts');
      const dest = path.join(DOC_ROOT, country, docId, 'metadata.ts');
      moves.push({ src: file, dest });
    }
  });
}

function performMoves() {
  for (const m of moves) {
    if (!fs.existsSync(m.src)) continue;
    const srcHash = sha256(m.src);
    console.log(`${isApply ? 'Moving' : 'Would move'} ${m.src} -> ${m.dest}`);
    if (isApply) {
      ensureDir(path.dirname(m.dest));
      fs.renameSync(m.src, m.dest);
      const destHash = sha256(m.dest);
      if (srcHash !== destHash) {
        console.error(`Hash mismatch for ${m.src}`);
        process.exit(1);
      }
    }
  }
}

function updateImports() {
  const map = new Map<string, string>();
  for (const m of moves) {
    if (m.src.endsWith('.ts')) {
      const oldRel = path.relative(ROOT, m.src).replace(/\.ts$/, '').replace(/\\/g, '/');
      const newRel = path.relative(ROOT, m.dest).replace(/\.ts$/, '').replace(/\\/g, '/');
      map.set(oldRel, newRel);
    }
  }
  if (!isApply || map.size === 0) return;
  const project = new Project({ tsConfigFilePath: path.join(ROOT, 'tsconfig.json') });
  for (const sf of project.getSourceFiles()) {
    let changed = false;
    for (const imp of sf.getImportDeclarations()) {
      const spec = imp.getModuleSpecifierValue();
      for (const [oldP, newP] of map.entries()) {
        if (spec === oldP || spec.endsWith(oldP)) {
          imp.setModuleSpecifier(spec.replace(oldP, newP));
          changed = true;
        } else if (spec.startsWith('@/') && spec.slice(2).includes(oldP.replace(/^src\//, ''))) {
          const replaced = spec.slice(2).replace(oldP.replace(/^src\//, ''), newP.replace(/^src\//, ''));
          imp.setModuleSpecifier('@/' + replaced);
          changed = true;
        }
      }
    }
    if (changed) sf.saveSync();
  }
}

function writeRedirects() {
  if (!isApply || redirects.length === 0) return;
  ensureDir(path.dirname(REDIRECTS_PATH));
  let data: RedirectEntry[] = [];
  if (fs.existsSync(REDIRECTS_PATH)) {
    data = JSON.parse(fs.readFileSync(REDIRECTS_PATH, 'utf8'));
  }
  data.push(...redirects);
  fs.writeFileSync(REDIRECTS_PATH, JSON.stringify(data, null, 2));
}

async function main() {
  scanDocuments();
  scanTemplates();
  performMoves();
  updateImports();
  writeRedirects();
  if (!isApply) console.log('Dry run complete. Use --apply to make changes.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
